import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import { Modal, Input, message } from 'antd';
import { mockProductsAll } from './mockData';
import './Products.css';

const USE_MOCK_ON_ERROR = true;

const { TextArea } = Input;

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filter, search]);

  // 임시 데이터를 상태 필터로만 걸러서 반환 (SellerApplications 스택 필터와 동일)
  const getMockFilteredByStatus = (status) => {
    if (!status || status === 'all') return mockProductsAll;
    return mockProductsAll.filter((p) => (p.status || 'pending') === status);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filter === 'all' ? '' : filter,
        search: search || undefined
      };
      const response = await api.superAdmin.products.getPending(params);
      const list = response.data.products || [];
      const total = response.data.totalCount ?? list.length;
      // 목록이 비었을 때 임시 데이터를 상태 필터로 걸러서 표시 (데모용)
      if (list.length === 0 && USE_MOCK_ON_ERROR) {
        const filtered = getMockFilteredByStatus(filter);
        setProducts(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, totalPages: 1 }));
      } else {
        setProducts(list);
        setPagination(prev => ({
          ...prev,
          total,
          totalPages: response.data.totalPages || Math.ceil(total / pagination.limit) || 1
        }));
      }
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        const filtered = getMockFilteredByStatus(filter);
        setProducts(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, totalPages: 1 }));
      } else {
        message.error(t('profile.superAdmin.products.messages.loadFail'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await api.superAdmin.products.approve(productId);
      message.success(t('profile.superAdmin.products.messages.approveSuccess'));
      loadProducts();
    } catch (error) {
      console.error('상품 승인 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.products.messages.approveFail'));
    }
  };

  const handleReject = async () => {
    if (!selectedProduct || !rejectReason.trim()) {
      message.warning(t('profile.superAdmin.products.messages.rejectWarning'));
      return;
    }

    try {
      await api.superAdmin.products.reject(selectedProduct.id, rejectReason);
      message.success(t('profile.superAdmin.products.messages.rejectSuccess'));
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('상품 거부 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.products.messages.rejectFail'));
    }
  };

  const openRejectModal = (product) => {
    setSelectedProduct(product);
    setRejectModalVisible(true);
  };

  return (
    <SuperAdminLayout>
      <div className="products-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('profile.superAdmin.products.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.products.subtitle')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.products.stats.pending')}</div>
            <div className="stat-value">{pagination.total}</div>
          </div>
        </div>

        {/* 스택 필터 (SellerApplications와 동일) */}
        <div className="filter-bar">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('profile.superAdmin.products.filters.all')}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            {t('profile.superAdmin.products.filters.pending')}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            {t('profile.superAdmin.products.filters.approved')}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            {t('profile.superAdmin.products.filters.rejected')}
          </button>
        </div>
        <div className="filters">
          <div className="filter-item">
            <label>{t('profile.superAdmin.products.filters.search')}</label>
            <input
              type="text"
              placeholder={t('profile.superAdmin.products.filters.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="section">
          <div className="product-grid">
            {loading ? (
              <div className="loading">{t('profile.superAdmin.products.loading')}</div>
            ) : products.length > 0 ? (
              products.map((product) => {
                const productName = product.nameKey ? t(product.nameKey) : product.name;
                const productStatus = product.status || 'pending';
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-card-image-wrap">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl.startsWith('http') ? product.imageUrl : `${API_URL}/${product.imageUrl}`}
                          alt={productName}
                          className="product-card-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling?.classList.add('fallback');
                          }}
                        />
                      ) : null}
                      <div className={`product-card-image-fallback ${product.imageUrl ? '' : 'fallback'}`}>
                        <span className="product-card-image-initial">{(productName || 'P').charAt(0)}</span>
                      </div>
                      <span className={`product-card-badge ${productStatus}`}>
                        {productStatus === 'pending' && t('profile.superAdmin.products.filters.pending')}
                        {productStatus === 'approved' && t('profile.superAdmin.products.filters.approved')}
                        {productStatus === 'rejected' && t('profile.superAdmin.products.filters.rejected')}
                      </span>
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-title">{productName}</h3>
                      <p className="product-card-price">¥{(product.price ?? 0).toLocaleString()}</p>
                      <div className="product-card-meta">
                        <span>{product.categoryKey ? t(product.categoryKey) : product.category?.name || '-'}</span>
                        <span>·</span>
                        <span>{t('profile.superAdmin.products.card.applicant')}: {product.creator?.username || '-'}</span>
                      </div>
                      <p className="product-card-date">
                        {new Date(product.approval_requested_at || product.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="product-card-description">
                        {product.descriptionKey ? t(product.descriptionKey) : product.description || t('profile.superAdmin.products.card.noDescription')}
                      </p>
                      <div className="product-card-actions">
                        <button
                          type="button"
                          className="product-card-btn product-card-btn-approve"
                          onClick={() => handleApprove(product.id)}
                        >
                          {t('profile.superAdmin.products.actions.approve')}
                        </button>
                        <button
                          type="button"
                          className="product-card-btn product-card-btn-reject"
                          onClick={() => openRejectModal(product)}
                        >
                          {t('profile.superAdmin.products.actions.reject')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">{t('profile.superAdmin.products.empty')}</div>
            )}
          </div>
        </div>

        {/* 거부 모달 */}
        <Modal
          title={t('profile.superAdmin.products.rejectModal.title')}
          open={rejectModalVisible}
          onOk={handleReject}
          onCancel={() => {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedProduct(null);
          }}
          okText={t('profile.superAdmin.products.rejectModal.ok')}
          cancelText={t('profile.superAdmin.products.rejectModal.cancel')}
        >
          <p>{t('profile.superAdmin.products.rejectModal.content')}</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t('profile.superAdmin.products.rejectModal.placeholder')}
          />
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}

