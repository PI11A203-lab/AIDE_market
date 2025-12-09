import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../components';
import { api } from '../../../../config/api';
import {
  FilterBar,
  SummaryBar,
  OrdersTable,
  Pagination,
  EmptyState,
} from './components';
import { mockOrders, mockOrderStats, mockProductOptions } from './mock.data';
import './AdminOrders.css';
import { useTranslation } from 'react-i18next';

const PAGE_LIMIT = 20;
const DEFAULT_FILTERS = {
  dateRange: 'month',
  product: '',
  status: '',
  sort: 'recent',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0,
    avgOrderValue: 0,
  });
  const [productOptions, setProductOptions] = useState(mockProductOptions);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { t } = useTranslation();

  const mergeProductOptions = useCallback((list) => {
    const names = list
      .map((order) => order.productName)
      .filter(Boolean);
    if (names.length) {
      const unique = Array.from(new Set([...names, ...mockProductOptions]));
      setProductOptions(unique);
    }
  }, []);

  const normalizeOrder = useCallback((order) => {
    const primaryItem =
      order.items?.[0] ||
      order.order_items?.[0] ||
      (order.products?.length ? order.products[0] : null);

    const productName =
      primaryItem?.product_name ||
      primaryItem?.name ||
      order.product_name ||
      order.productName;

    const buyerName =
      order.buyer_name ||
      order.customer_name ||
      order.user?.username ||
      order.user?.nickname ||
      order.user?.name ||
      'Unknown';

    const buyerEmail =
      order.buyer_email ||
      order.customer_email ||
      order.user?.email ||
      '';

    const amount =
      order.total_amount ??
      order.amount ??
      order.total ??
      order.grand_total ??
      0;

    const status = (order.status || 'pending').toLowerCase();

    return {
      id: order.id || order.order_id || order.orderId,
      orderId: order.order_number || order.orderNumber || `#${order.id || order.order_id || ''}`,
      productName: productName || 'N/A',
      productIcon: primaryItem?.icon || order.product_icon || '🛒',
      buyerName,
      buyerEmail,
      amount,
      status,
      date: order.created_at || order.order_date || order.date || order.createdAt,
    };
  }, []);

  const applyMockWithFilters = useCallback((list) => {
    let result = [...list];

    if (filters.product) {
      result = result.filter(
        (item) => item.productName.toLowerCase() === filters.product.toLowerCase()
      );
    }

    if (filters.status) {
      result = result.filter(
        (item) => item.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter((item) => {
        const date = new Date(item.date);
        if (Number.isNaN(date.getTime())) return true;

        switch (filters.dateRange) {
          case 'today': {
            return date.toDateString() === now.toDateString();
          }
          case 'week': {
            const diff = (now - date) / (1000 * 60 * 60 * 24);
            return diff <= 7;
          }
          case 'month': {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }
          case 'quarter': {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const dateQuarter = Math.floor(date.getMonth() / 3);
            return dateQuarter === currentQuarter && date.getFullYear() === now.getFullYear();
          }
          case 'year': {
            return date.getFullYear() === now.getFullYear();
          }
          default:
            return true;
        }
      });
    }

    // sort
    switch (filters.sort) {
      case 'oldest':
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case 'amount-high':
        result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case 'amount-low':
        result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    const total = result.length;
    const totalPages = Math.ceil(total / PAGE_LIMIT) || 1;
    const start = (pagination.page - 1) * PAGE_LIMIT;
    const paginated = result.slice(start, start + PAGE_LIMIT);

    setOrders(paginated);
    setPagination((prev) => ({
      ...prev,
      total,
      totalPages,
    }));
    mergeProductOptions(result);
  }, [filters.dateRange, filters.product, filters.sort, filters.status, mergeProductOptions, pagination.page]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.admin.getOrderStats();
      const data = res.data || {};
      setStats({
        totalOrders: data.total_orders ?? data.totalOrders ?? 0,
        thisMonth: data.this_month ?? data.thisMonth ?? 0,
        completed: data.completed ?? data.completed_orders ?? 0,
        pending: data.pending ?? data.pending_orders ?? 0,
        avgOrderValue: data.avg_order_value ?? data.avgOrderValue ?? 0,
      });
    } catch (error) {
      console.error('Failed to load order stats, using mock.', error);
      setStats(mockOrderStats);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        dateRange: filters.dateRange,
        product: filters.product,
        status: filters.status,
        sort: filters.sort,
      };

      const res = await api.admin.getOrders(params);
      const list = res.data?.orders || res.data?.data || [];
      const normalized = list.map(normalizeOrder);

      const paginationData =
        res.data?.pagination || {
          total: res.data?.total || list.length,
          totalPages:
            res.data?.totalPages ||
            res.data?.pagination?.totalPages ||
            Math.ceil((res.data?.total || list.length) / PAGE_LIMIT) ||
            0,
          page: params.page,
          limit: params.limit,
        };

      setOrders(normalized);
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total || normalized.length,
        totalPages: paginationData.totalPages || Math.ceil(normalized.length / PAGE_LIMIT) || 1,
      }));

      mergeProductOptions(normalized);
    } catch (error) {
      console.error('Failed to load orders, using mock.', error);
      applyMockWithFilters(mockOrders.map(normalizeOrder));
    } finally {
      setLoading(false);
    }
  }, [applyMockWithFilters, filters.dateRange, filters.product, filters.sort, filters.status, mergeProductOptions, normalizeOrder, pagination.limit, pagination.page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOrder = (order) => {
    // TODO: 상세 페이지 연결 시 여기서 라우팅 처리
    alert(`주문 상세: ${order.orderId}`);
  };

  const hasFilters = useMemo(
    () => Boolean(filters.product || filters.status || filters.sort !== 'recent' || filters.dateRange !== 'month'),
    [filters.dateRange, filters.product, filters.sort, filters.status]
  );

  return (
    <AdminLayout>
      <div className="admin-orders-container">
        <main className="admin-orders-main">
        <div className="page-header">
          <h1 className="page-title">{t('profile.admin.orders.title')}</h1>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => alert('Export to CSV')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t('profile.admin.orders.export')}
          </button>
        </div>

        <FilterBar
          filters={filters}
          products={productOptions}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <SummaryBar stats={stats} />

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('common.loading')}</div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <OrdersTable orders={orders} onView={handleViewOrder} />
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
        </main>
      </div>
    </AdminLayout>
  );
}


