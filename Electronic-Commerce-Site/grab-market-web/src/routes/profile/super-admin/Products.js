import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, message } from 'antd';
import './Products.css';

const { TextArea } = Input;

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [filters, setFilters] = useState({ status: 'pending', category: '', search: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await api.superAdmin.products.getPending(params);
      setProducts(response.data.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      message.error(t('profile.superAdmin.products.messages.loadFail'));
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

        <div className="filters">
          <div className="filter-item">
            <label>{t('profile.superAdmin.products.filters.status')}</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">{t('profile.superAdmin.products.filters.all')}</option>
              <option value="pending">{t('profile.superAdmin.products.filters.pending')}</option>
              <option value="approved">{t('profile.superAdmin.products.filters.approved')}</option>
              <option value="rejected">{t('profile.superAdmin.products.filters.rejected')}</option>
            </select>
          </div>
          <div className="filter-item">
            <label>{t('profile.superAdmin.products.filters.search')}</label>
            <input
              type="text"
              placeholder={t('profile.superAdmin.products.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="section">
          <div className="product-grid">
            {loading ? (
              <div className="loading">{t('profile.superAdmin.products.loading')}</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <div className="product-avatar">
                      {product.name?.charAt(0) || 'P'}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{t('profile.superAdmin.products.card.applicant')}: {product.creator?.username || '-'}</p>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.products.card.price')}:</span>
                      <span className="detail-value">¥{product.price?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.products.card.category')}:</span>
                      <span className="detail-value">{product.category?.name || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.products.card.requestDate')}:</span>
                      <span className="detail-value">
                        {new Date(product.approval_requested_at || product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('profile.superAdmin.products.card.status')}:</span>
                      <span className="badge pending">{t('profile.superAdmin.products.filters.pending')}</span>
                    </div>
                  </div>
                  <div className="product-description">
                    {product.description || t('profile.superAdmin.products.card.noDescription')}
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(product.id)}
                    >
                      {t('profile.superAdmin.products.actions.approve')}
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => openRejectModal(product)}
                    >
                      {t('profile.superAdmin.products.actions.reject')}
                    </button>
                  </div>
                </div>
              ))
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

