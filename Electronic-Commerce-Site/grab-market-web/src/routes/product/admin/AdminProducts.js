import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { message } from 'antd';
import { AdminLayout } from '../../../routes/profile/admin/components';
import { api } from '../../../config/api';
import {
  FilterBar,
  SummaryBar,
  ProductsTable,
  Pagination,
  EmptyState
} from './components';
import './AdminProducts.css';
import { useTranslation } from 'react-i18next';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    avgRating: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const { t, i18n } = useTranslation();
  
  // 언어 설정 로드
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터 상태
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'recent'
  });

  // 카테고리 목록 로드
  const loadCategories = useCallback(async () => {
    try {
      const response = await api.categories.getList();
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, []);

  // 통계 로드
  const loadStats = useCallback(async () => {
    try {
      const response = await api.admin.getStats();
      const statsData = response.data;
      setStats({
        totalProducts: statsData.total_products || 0,
        totalSales: statsData.total_sales || 0,
        totalRevenue: statsData.total_revenue || 0,
        avgRating: parseFloat(statsData.avg_rating || 0).toFixed(1)
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  // 상품 목록 로드
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.sort && { sort: filters.sort === 'recent' ? 'download' : filters.sort })
      };

      // Admin 상품 목록 API 호출
      const response = await api.admin.getProducts(params);
      const productsData = response.data?.products || [];
      const paginationData = response.data?.pagination || {
        total: 0,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: 0
      };

      setProducts(productsData);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0
      }));
    } catch (error) {
      console.error('Failed to load products:', error);
      message.error(t('productAdmin.list.messages.loadFail'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.page, t]);

  useEffect(() => {
    loadCategories();
    loadStats();
  }, [loadCategories, loadStats]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);


  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // 필터 변경 시 첫 페이지로
  };

  // 필터 리셋
  const handleReset = () => {
    setFilters({
      search: '',
      category: '',
      sort: 'recent'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 상품 삭제
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(t('productAdmin.list.messages.deleteConfirm', { name: productName }))) {
      return;
    }

    try {
      await api.admin.deleteProduct(productId);
      message.success(t('productAdmin.list.messages.deleteSuccess'));
      loadProducts(); // 목록 새로고침
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error(t('productAdmin.list.messages.deleteFail'));
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="admin-products-container">
        <main className="admin-products-main">
        {/* 페이지 헤더 */}
        <div className="page-header">
          <h1 className="page-title">{t('productAdmin.list.title')}</h1>
          <Link to="/profile/products/new" className="btn btn-primary">
            <Plus size={20} />
            {t('productAdmin.list.new')}
          </Link>
        </div>

        {/* 필터 바 */}
        <FilterBar
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* 통계 요약 */}
        <SummaryBar stats={stats} />

        {/* 테이블 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('productAdmin.list.loading')}</div>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            hasFilters={!!(filters.search || filters.category)}
          />
        ) : (
          <>
            <ProductsTable
              products={products}
              onDelete={handleDelete}
            />
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
        </main>
      </div>
    </AdminLayout>
  );
}

