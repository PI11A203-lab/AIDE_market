import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { message } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './IPManagement.css';
import './Products.css'; // 공통 스타일 사용

// 색상 팔레트
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // IP 접속 추이 그래프 컴포넌트
  const AccessTrendChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
      fetchAccessTrend();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const fetchAccessTrend = async () => {
      setLoading(true);
      try {
        const response = await api.superAdmin.ip.getAccessTrendData({ days });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('アクセス推移取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3>アクセス推移</h3>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5'
            }}
          >
            <option value={7}>過去7日間</option>
            <option value={14}>過去14日間</option>
            <option value={30}>過去30日間</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#6366F1" name="総アクセス数" strokeWidth={2} />
            <Line type="monotone" dataKey="unique" stroke="#10B981" name="ユニークIP" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 국가별 접속 분포 컴포넌트
  const CountryDistributionChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchCountryDistribution();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCountryDistribution = async () => {
      try {
        const response = await api.superAdmin.ip.getCountryDistribution({ days: 7 });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('国別分布取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</div>;
    }

    if (data.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>データがありません</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>国別アクセス分布 (過去7日間)</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 시간대별 접속 분포 컴포넌트
  const HourlyAccessChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchHourlyAccess();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHourlyAccess = async () => {
      try {
        const response = await api.superAdmin.ip.getHourlyAccessDistribution({ days: 7 });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('時間帯別アクセス取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>時間帯別アクセス数 (過去7日間)</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              label={{ value: '時刻', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'アクセス数', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // TOP 접속 IP 테이블 컴포넌트
  const TopAccessIPsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchTopIPs();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTopIPs = async () => {
      try {
        const response = await api.superAdmin.ip.getTopAccessIPs({ days: 7, limit: 10 });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('TOPアクセスIP取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>読み込み中...</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>TOPアクセスIPアドレス (過去7日間)</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>順位</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>IPアドレス</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>国</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>アクセス数</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5', fontFamily: 'monospace', color: '#6366F1' }}>
                  {item.ip}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5' }}>
                  {item.country || '-'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5' }}>
                  {item.accessCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            データがありません
          </div>
        )}
      </div>
    );
  };

  return (
    <SuperAdminLayout>
      <div className="ip-management-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">IP管理</h1>
            <p className="page-subtitle">アクセスログ、統計、IPブロック管理</p>
          </div>
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
            {/* 🎨 그래프 섹션 추가 */}
            <AccessTrendChart />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <CountryDistributionChart />
              <HourlyAccessChart />
            </div>
            
            <TopAccessIPsTable />
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

