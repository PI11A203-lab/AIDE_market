import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, message } from 'antd';
import './Products.css';

const { TextArea } = Input;

export default function Products() {
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
      message.error('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await api.superAdmin.products.approve(productId);
      message.success('상품이 승인되었습니다.');
      loadProducts();
    } catch (error) {
      console.error('상품 승인 실패:', error);
      message.error(error.response?.data?.error || '상품 승인에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!selectedProduct || !rejectReason.trim()) {
      message.warning('거부 사유를 입력해주세요.');
      return;
    }

    try {
      await api.superAdmin.products.reject(selectedProduct.id, rejectReason);
      message.success('상품이 거부되었습니다.');
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('상품 거부 실패:', error);
      message.error(error.response?.data?.error || '상품 거부에 실패했습니다.');
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
            <h1 className="page-title">商品承認管理</h1>
            <p className="page-subtitle">管理者が申請した商品の承認・却下</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">承認待ち</div>
            <div className="stat-value">{pagination.total}</div>
          </div>
        </div>

        <div className="filters">
          <div className="filter-item">
            <label>ステータス</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">すべて</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
              <option value="rejected">却下</option>
            </select>
          </div>
          <div className="filter-item">
            <label>検索</label>
            <input
              type="text"
              placeholder="商品名で検索..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="section">
          <div className="product-grid">
            {loading ? (
              <div className="loading">読み込み中...</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <div className="product-avatar">
                      {product.name?.charAt(0) || 'P'}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>申請者: {product.creator?.username || '-'}</p>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">価格:</span>
                      <span className="detail-value">¥{product.price?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">カテゴリ:</span>
                      <span className="detail-value">{product.category?.name || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">申請日:</span>
                      <span className="detail-value">
                        {new Date(product.approval_requested_at || product.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">ステータス:</span>
                      <span className="badge pending">承認待ち</span>
                    </div>
                  </div>
                  <div className="product-description">
                    {product.description || '説明なし'}
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(product.id)}
                    >
                      ✓ 承認
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => openRejectModal(product)}
                    >
                      × 却下
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">承認待ちの商品はありません</div>
            )}
          </div>
        </div>

        {/* 거부 모달 */}
        <Modal
          title="商品却下"
          open={rejectModalVisible}
          onOk={handleReject}
          onCancel={() => {
            setRejectModalVisible(false);
            setRejectReason('');
            setSelectedProduct(null);
          }}
          okText="却下"
          cancelText="キャンセル"
        >
          <p>商品を却下する理由を入力してください。</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="却下理由..."
          />
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}

