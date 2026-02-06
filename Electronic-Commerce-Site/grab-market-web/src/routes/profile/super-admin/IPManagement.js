import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { message } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  mockIPLogs,
  mockIPStats,
  mockIPManagement, // eslint-disable-line no-unused-vars
  mockAccessTrendData,
  mockCountryDistribution, // eslint-disable-line no-unused-vars
  mockHourlyAccessData,
  mockTopAccessIPs
} from './mockData';
import './IPManagement.css';
import './Products.css'; // 공통 스타일 사용

const USE_MOCK_ON_ERROR = true;

// 색상 팔레트
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export default function IPManagement() {
  const { t } = useTranslation();
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
    // 페이지 로드 시 항상 통계를 먼저 로드
    loadStats();
    
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
      if (USE_MOCK_ON_ERROR) {
        setLogs(mockIPLogs);
        setPagination(prev => ({ ...prev, total: mockIPLogs.length, totalPages: 1 }));
      } else {
        message.error(t('profile.superAdmin.ipManagement.messages.logsLoadFail'));
      }
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
      message.error(t('profile.superAdmin.ipManagement.messages.managementLoadFail'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const [todayStatsRes, yesterdayStatsRes, managementRes] = await Promise.all([
        api.superAdmin.ip.getStats({ dateFrom: today, dateTo: today }).catch(() => ({ data: {} })),
        api.superAdmin.ip.getStats({ dateFrom: yesterdayStr, dateTo: yesterdayStr }).catch(() => ({ data: {} })),
        api.superAdmin.ip.getManagement({ limit: 1 }).catch(() => ({ data: { totalCount: 0 } }))
      ]);
      
      const todayAccess = todayStatsRes.data?.todayAccess || todayStatsRes.data?.totalAccess || 0;
      const yesterdayAccess = yesterdayStatsRes.data?.todayAccess || yesterdayStatsRes.data?.totalAccess || 0;
      const todayUniqueIPs = todayStatsRes.data?.uniqueIPs || 0;
      const yesterdayUniqueIPs = yesterdayStatsRes.data?.uniqueIPs || 0;
      const todayCountries = todayStatsRes.data?.countries || 0;
      const yesterdayCountries = yesterdayStatsRes.data?.countries || 0;
      
      const blocked = managementRes.data?.totalCount || 0;
      
      // 변화량 계산 (오늘 - 어제)
      const accessChange = todayAccess - yesterdayAccess;
      const uniqueIPsChange = todayUniqueIPs - yesterdayUniqueIPs;
      const countriesChange = todayCountries - yesterdayCountries;
      
      setStats({
        todayAccess,
        uniqueIPs: todayUniqueIPs,
        blocked,
        countries: todayCountries,
        todayAccessChange: accessChange,
        uniqueIPsChange: uniqueIPsChange,
        blockedChange: 0, // 차단은 새로 추가된 것만 표시
        countriesChange: countriesChange
      });
    } catch (error) {
      console.error('통계 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        setStats(mockIPStats);
      } else {
        message.error(t('profile.superAdmin.ipManagement.messages.statsLoadFail'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ipAddress, reason = '') => {
    try {
      await api.superAdmin.ip.block({ ip_address: ipAddress, reason, memo: '' });
      message.success(t('profile.superAdmin.ipManagement.messages.blockSuccess'));
      loadIPManagement();
    } catch (error) {
      console.error('IP 차단 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.ipManagement.messages.blockFail'));
    }
  };

  const handleUnblockIP = async (ipAddress) => {
    try {
      await api.superAdmin.ip.unblock({ ip_address: ipAddress });
      message.success(t('profile.superAdmin.ipManagement.messages.unblockSuccess'));
      loadIPManagement();
    } catch (error) {
      console.error('IP 차단 해제 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.ipManagement.messages.unblockFail'));
    }
  };

  // IP 접속 추이 그래프 컴포넌트
  const AccessTrendChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchAccessTrend();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const fetchAccessTrend = async () => {
      if (!isMountedRef.current) return;
      setLoading(true);
      try {
        const response = await api.superAdmin.ip.getAccessTrendData({ days });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('접속 추이 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockAccessTrendData(days));
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.ipManagement.loading')}</div>;
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
          <h3>{t('profile.superAdmin.ipManagement.charts.accessTrend')}</h3>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5'
            }}
          >
            <option value={7}>{t('profile.superAdmin.ipManagement.charts.days7')}</option>
            <option value={14}>{t('profile.superAdmin.ipManagement.charts.days14')}</option>
            <option value={30}>{t('profile.superAdmin.ipManagement.charts.days30')}</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#3B82F6" name={t('profile.superAdmin.ipManagement.charts.totalAccess')} strokeWidth={2} />
            <Line type="monotone" dataKey="unique" stroke="#10B981" name={t('profile.superAdmin.ipManagement.charts.uniqueIP')} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 국가별 접속 분포 컴포넌트
  const CountryDistributionChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchCountryDistribution();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCountryDistribution = async () => {
      try {
        const response = await api.superAdmin.ip.getCountryDistribution({ days: 7 });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('국가별 분포 가져오기 실패:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.ipManagement.loading')}</div>;
    }

    if (data.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.ipManagement.charts.noData')}</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.ipManagement.charts.countryDistribution')}</h3>
        
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
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchHourlyAccess();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHourlyAccess = async () => {
      try {
        const response = await api.superAdmin.ip.getHourlyAccessDistribution({ days: 7 });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('시간대별 접속 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockHourlyAccessData);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.ipManagement.loading')}</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.ipManagement.charts.hourlyAccess')}</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              label={{ value: t('profile.superAdmin.ipManagement.charts.hour'), position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: t('profile.superAdmin.ipManagement.charts.accessCount'), angle: -90, position: 'insideLeft' }}
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
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchTopIPs();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTopIPs = async () => {
      try {
        const response = await api.superAdmin.ip.getTopAccessIPs({ days: 7, limit: 10 });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('TOP 접속 IP 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockTopAccessIPs);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.ipManagement.loading')}</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.ipManagement.topIPs.title')}</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.ipManagement.table.rank')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.ipManagement.table.ipAddress')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.ipManagement.table.country')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.ipManagement.table.accessCount')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5', fontFamily: 'monospace', color: '#3B82F6' }}>
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
            {t('profile.superAdmin.ipManagement.empty.noTopIPs')}
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
            <h1 className="page-title">{t('profile.superAdmin.ipManagement.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.ipManagement.subtitle')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.ipManagement.stats.todayAccess')}</div>
            <div className="stat-value">{stats.todayAccess.toLocaleString()}</div>
            <div className={stats.todayAccessChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.todayAccessChange > 0 ? '#10b981' : stats.todayAccessChange < 0 ? '#ef4444' : '#666' }}>
              {stats.todayAccessChange > 0 ? `+${stats.todayAccessChange.toLocaleString()}` : 
               stats.todayAccessChange < 0 ? `${stats.todayAccessChange.toLocaleString()}` : 
               t('profile.superAdmin.ipManagement.stats.noChange')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.ipManagement.stats.uniqueIPs')}</div>
            <div className="stat-value">{stats.uniqueIPs.toLocaleString()}</div>
            <div className={stats.uniqueIPsChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.uniqueIPsChange > 0 ? '#10b981' : stats.uniqueIPsChange < 0 ? '#ef4444' : '#666' }}>
              {stats.uniqueIPsChange > 0 ? `+${stats.uniqueIPsChange.toLocaleString()}` : 
               stats.uniqueIPsChange < 0 ? `${stats.uniqueIPsChange.toLocaleString()}` : 
               t('profile.superAdmin.ipManagement.stats.noChange')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.ipManagement.stats.blocked')}</div>
            <div className="stat-value">{stats.blocked}</div>
            <div className="stat-change" style={{ color: stats.blocked > 0 ? '#ef4444' : '#666' }}>
              {stats.blocked > 0 ? `${stats.blocked} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.ipManagement.stats.noChange')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.ipManagement.stats.countries')}</div>
            <div className="stat-value">{stats.countries}</div>
            <div className={stats.countriesChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.countriesChange > 0 ? '#10b981' : stats.countriesChange < 0 ? '#ef4444' : '#666' }}>
              {stats.countriesChange > 0 ? `+${stats.countriesChange} ${t('profile.superAdmin.ipManagement.stats.new')}` : 
               stats.countriesChange < 0 ? `${stats.countriesChange}` : 
               t('profile.superAdmin.ipManagement.stats.noChange')}
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            {t('profile.superAdmin.ipManagement.tabs.logs')}
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            {t('profile.superAdmin.ipManagement.tabs.stats')}
          </button>
          <button
            className={`tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            {t('profile.superAdmin.ipManagement.tabs.management')}
          </button>
        </div>

        {activeTab === 'logs' && (
          <div className="section">
            <div className="filters">
              <div className="filter-item">
                <label>{t('profile.superAdmin.ipManagement.filters.ipAddress')}</label>
                <input
                  type="text"
                  placeholder={t('profile.superAdmin.ipManagement.filters.ipSearch')}
                  value={filters.ip}
                  onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
                />
              </div>
              <div className="filter-item">
                <label>{t('profile.superAdmin.ipManagement.filters.country')}</label>
                <input
                  type="text"
                  placeholder={t('profile.superAdmin.ipManagement.filters.countrySearch')}
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>{t('profile.superAdmin.ipManagement.table.ipAddress')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.user')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.page')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.country')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.time')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.ipManagement.loading')}
                    </td>
                  </tr>
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td><span className="ip-address">{log.ip_address}</span></td>
                      <td>{log.user?.username || '-'}</td>
                      <td>{log.request_path}</td>
                      <td>{log.country || '-'}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${log.is_blocked ? 'blocked' : 'active'}`}>
                          {log.is_blocked ? t('profile.superAdmin.ipManagement.status.blocked') : t('profile.superAdmin.ipManagement.status.normal')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.ipManagement.empty.noLogs')}
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
                  <th>{t('profile.superAdmin.ipManagement.table.ipAddress')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.state')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.reason')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.blockDate')}</th>
                  <th>{t('profile.superAdmin.ipManagement.table.action')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.ipManagement.loading')}
                    </td>
                  </tr>
                ) : ipManagement.length > 0 ? (
                  ipManagement.map((ip) => (
                    <tr key={ip.id}>
                      <td><span className="ip-address">{ip.ip_address}</span></td>
                      <td>
                        {ip.is_blocked && <span className="badge blocked">{t('profile.superAdmin.ipManagement.status.blocked')}</span>}
                        {ip.is_whitelisted && <span className="badge approved">{t('profile.superAdmin.ipManagement.status.whitelisted')}</span>}
                        {!ip.is_blocked && !ip.is_whitelisted && <span className="badge active">{t('profile.superAdmin.ipManagement.status.normal')}</span>}
                      </td>
                      <td>{ip.block_reason || '-'}</td>
                      <td>{ip.blocked_at ? new Date(ip.blocked_at).toLocaleString() : '-'}</td>
                      <td>
                        {ip.is_blocked ? (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUnblockIP(ip.ip_address)}
                          >
                            {t('profile.superAdmin.ipManagement.buttons.unblock')}
                          </button>
                        ) : (
                          <button
                            className="btn btn-reject"
                            onClick={() => handleBlockIP(ip.ip_address, t('profile.superAdmin.ipManagement.buttons.block'))}
                          >
                            {t('profile.superAdmin.ipManagement.buttons.block')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.ipManagement.empty.noIPManagement')}
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

