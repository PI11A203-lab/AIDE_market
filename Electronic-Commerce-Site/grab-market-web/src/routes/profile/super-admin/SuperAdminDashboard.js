import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import './SuperAdminDashboard.css';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    pendingProducts: 0,
    pendingStudents: 0,
    todayAccess: 0,
    securityEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 통계 데이터 로드
      const [productsRes, studentsRes] = await Promise.all([
        api.superAdmin.products.getPending({ limit: 1 }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.studentVerifications.getPending({ limit: 1 }).catch(() => ({ data: { totalCount: 0 } }))
      ]);

      // 최근 상품 목록
      const recentProductsData = productsRes.data?.products || [];
      
      // 최근 활동 (간단한 목록)
      const activities = [
        ...recentProductsData.slice(0, 3).map(p => ({
          time: '최근',
          type: '상품 신청',
          detail: p.name,
          status: '대기 중'
        }))
      ];

      setStats({
        pendingProducts: productsRes.data?.totalCount || 0,
        pendingStudents: studentsRes.data?.totalCount || 0,
        todayAccess: 0, // TODO: 실제 IP 통계에서 가져오기
        securityEvents: 0 // TODO: 실제 보안 이벤트에서 가져오기
      });
      setRecentProducts(recentProductsData.slice(0, 3));
      setRecentActivities(activities);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="loading-container">読み込み中...</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">サイト管理者ダッシュボード</h1>
            <p className="page-subtitle">システム全体の管理と監視</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">承認待ち商品</div>
            <div className="stat-value">{stats.pendingProducts}</div>
            <div className="stat-change">+0 今日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">学生認証申請</div>
            <div className="stat-value">{stats.pendingStudents}</div>
            <div className="stat-change">+0 今日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">今日のアクセス</div>
            <div className="stat-value">{stats.todayAccess.toLocaleString()}</div>
            <div className="stat-change">+0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">セキュリティイベント</div>
            <div className="stat-value">{stats.securityEvents}</div>
            <div className="stat-change negative">要注意</div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">承認待ち商品</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>価格</th>
                <th>申請者</th>
                <th>申請日</th>
                <th>ステータス</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category?.name || '-'}</td>
                    <td>¥{product.price?.toLocaleString() || '0'}</td>
                    <td>{product.creator?.username || '-'}</td>
                    <td>{new Date(product.approval_requested_at || product.createdAt).toLocaleDateString('ja-JP')}</td>
                    <td><span className="badge pending">承認待ち</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    承認待ちの商品はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">最近のアクティビティ</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>時刻</th>
                <th>イベント</th>
                <th>詳細</th>
                <th>ステータス</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.time}</td>
                    <td>{activity.type}</td>
                    <td>{activity.detail}</td>
                    <td><span className="badge pending">{activity.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    最近のアクティビティはありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

