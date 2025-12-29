import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { message } from 'antd';
import './IPManagement.css';
import './Products.css'; // 공통 스타일 사용

export default function IPManagement() {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [ipManagement, setIpManagement] = useState([]);
  const [stats, setStats] = useState({
    todayAccess: 0,
    uniqueIPs: 0,
    blocked: 0,
    countries: 0
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [filters, setFilters] = useState({ ip: '', country: '', dateFrom: '', dateTo: '', blocked: '' });

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs();
    } else if (activeTab === 'management') {
      loadIPManagement();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab, pagination.page, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await api.superAdmin.ip.getLogs(params);
      setLogs(response.data.logs || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('IP 로그 로드 실패:', error);
      message.error('IP 로그를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadIPManagement = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      const response = await api.superAdmin.ip.getManagement(params);
      setIpManagement(response.data.ipManagement || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('IP 관리 목록 로드 실패:', error);
      message.error('IP 관리 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      // TODO: 실제 통계 API 호출
      setStats({
        todayAccess: 2543,
        uniqueIPs: 1234,
        blocked: 15,
        countries: 45
      });
    } catch (error) {
      console.error('통계 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ipAddress, reason = '') => {
    try {
      await api.superAdmin.ip.block({ ip_address: ipAddress, reason, memo: '' });
      message.success('IP가 차단되었습니다.');
      loadIPManagement();
    } catch (error) {
      console.error('IP 차단 실패:', error);
      message.error(error.response?.data?.error || 'IP 차단에 실패했습니다.');
    }
  };

  const handleUnblockIP = async (ipAddress) => {
    try {
      await api.superAdmin.ip.unblock({ ip_address: ipAddress });
      message.success('IP 차단이 해제되었습니다.');
      loadIPManagement();
    } catch (error) {
      console.error('IP 차단 해제 실패:', error);
      message.error(error.response?.data?.error || 'IP 차단 해제에 실패했습니다.');
    }
  };

  return (
    <SuperAdminLayout>
      <div className="ip-management-page">
        <div className="header">
          <h1>IP管理</h1>
          <p>アクセスログ、統計、IPブロック管理</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">今日のアクセス</div>
            <div className="stat-value">{stats.todayAccess.toLocaleString()}</div>
            <div className="stat-change">+12.5%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ユニークIP</div>
            <div className="stat-value">{stats.uniqueIPs.toLocaleString()}</div>
            <div className="stat-change">+8.3%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ブロック中</div>
            <div className="stat-value">{stats.blocked}</div>
            <div className="stat-change">+2 今日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">国/地域</div>
            <div className="stat-value">{stats.countries}</div>
            <div className="stat-change">+3 新規</div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            アクセスログ
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            統計
          </button>
          <button
            className={`tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            IP管理
          </button>
        </div>

        {activeTab === 'logs' && (
          <div className="section">
            <div className="filters">
              <div className="filter-item">
                <label>IPアドレス</label>
                <input
                  type="text"
                  placeholder="IP検索..."
                  value={filters.ip}
                  onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
                />
              </div>
              <div className="filter-item">
                <label>国</label>
                <input
                  type="text"
                  placeholder="国検索..."
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>IP アドレス</th>
                  <th>ユーザー</th>
                  <th>ページ</th>
                  <th>国/地域</th>
                  <th>時刻</th>
                  <th>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      読み込み中...
                    </td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td><span className="ip-address">{log.ip_address}</span></td>
                      <td>{log.user?.username || '-'}</td>
                      <td>{log.request_path}</td>
                      <td>{log.country || '-'}</td>
                      <td>{new Date(log.created_at).toLocaleString('ja-JP')}</td>
                      <td>
                        <span className={`badge ${log.is_blocked ? 'blocked' : 'active'}`}>
                          {log.is_blocked ? 'ブロック済み' : '正常'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      ログがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="section">
            <div className="chart-container">
              <h3 style={{ marginBottom: '16px' }}>アクセス推移（過去7日間）</h3>
              <div className="chart">📊 アクセス推移グラフ (実装予定)</div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="section">
            <table>
              <thead>
                <tr>
                  <th>IP アドレス</th>
                  <th>状態</th>
                  <th>理由</th>
                  <th>ブロック日時</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      読み込み中...
                    </td>
                  </tr>
                ) : ipManagement.length > 0 ? (
                  ipManagement.map((ip) => (
                    <tr key={ip.id}>
                      <td><span className="ip-address">{ip.ip_address}</span></td>
                      <td>
                        {ip.is_blocked && <span className="badge blocked">ブロック済み</span>}
                        {ip.is_whitelisted && <span className="badge approved">ホワイトリスト</span>}
                        {!ip.is_blocked && !ip.is_whitelisted && <span className="badge active">正常</span>}
                      </td>
                      <td>{ip.block_reason || '-'}</td>
                      <td>{ip.blocked_at ? new Date(ip.blocked_at).toLocaleString('ja-JP') : '-'}</td>
                      <td>
                        {ip.is_blocked ? (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUnblockIP(ip.ip_address)}
                          >
                            ブロック解除
                          </button>
                        ) : (
                          <button
                            className="btn btn-reject"
                            onClick={() => handleBlockIP(ip.ip_address, '手動ブロック')}
                          >
                            ブロック
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      IP管理データがありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

