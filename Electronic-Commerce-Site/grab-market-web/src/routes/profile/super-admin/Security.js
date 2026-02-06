import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { message, Input, Switch, Button } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  mockSecurityStats,
  mockSecurityEvents,
  mockBots, // eslint-disable-line no-unused-vars
  mockSecuritySettings,
  mockEventTrendData,
  mockEventDistribution,
  mockHourlySecurityData,
  mockTopAttackIPs
} from './mockData';
import './Security.css';
import './Products.css'; // 공통 스타일 사용

const USE_MOCK_ON_ERROR = true;

// 색상 팔레트
const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export default function Security() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bots, setBots] = useState([]);
  const [stats, setStats] = useState({
    todayEvents: 0,
    botDetected: 0,
    autoBlocked: 0,
    loginFailed: 0,
    todayEventsChange: 0,
    botDetectedChange: 0,
    autoBlockedChange: 0,
    loginFailedChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [filters, setFilters] = useState({ type: '', severity: '', ip: '', dateFrom: '', dateTo: '' });
  const [settings, setSettings] = useState({
    auto_block_enabled: true,
    bot_detection_threshold: 70,
    max_login_attempts: 5,
    block_duration_hours: 24
  });

  useEffect(() => {
    loadStats();
    if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'bots') {
      loadBots();
    } else if (activeTab === 'settings') {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.page, filters]);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const [todayEventsRes, yesterdayEventsRes, todayBotsRes, yesterdayBotsRes, todayStatsRes, yesterdayStatsRes] = await Promise.all([
        api.superAdmin.security.getEvents({ 
          limit: 1,
          dateFrom: today,
          dateTo: today
        }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.security.getEvents({ 
          limit: 1,
          dateFrom: yesterdayStr,
          dateTo: yesterdayStr
        }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.security.getBots({ 
          limit: 1,
          dateFrom: today,
          dateTo: today
        }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.security.getBots({ 
          limit: 1,
          dateFrom: yesterdayStr,
          dateTo: yesterdayStr
        }).catch(() => ({ data: { totalCount: 0 } })),
        api.superAdmin.security.getEventStats({ 
          dateFrom: today,
          dateTo: today
        }).catch(() => ({ data: {} })),
        api.superAdmin.security.getEventStats({ 
          dateFrom: yesterdayStr,
          dateTo: yesterdayStr
        }).catch(() => ({ data: {} }))
      ]);
      
      const todayEvents = todayEventsRes.data?.totalCount || 0;
      const yesterdayEvents = yesterdayEventsRes.data?.totalCount || 0;
      const todayBots = todayBotsRes.data?.totalCount || 0;
      const yesterdayBots = yesterdayBotsRes.data?.totalCount || 0;
      const todayAutoBlocked = todayStatsRes.data?.autoBlocked || 0;
      const yesterdayAutoBlocked = yesterdayStatsRes.data?.autoBlocked || 0;
      const todayLoginFailed = todayStatsRes.data?.loginFailed || 0;
      const yesterdayLoginFailed = yesterdayStatsRes.data?.loginFailed || 0;
      
      // 변화량 계산 (오늘 - 어제)
      const eventsChange = todayEvents - yesterdayEvents;
      const botsChange = todayBots - yesterdayBots;
      const autoBlockedChange = todayAutoBlocked - yesterdayAutoBlocked;
      const loginFailedChange = todayLoginFailed - yesterdayLoginFailed;
      
      setStats({
        todayEvents,
        botDetected: todayBots,
        autoBlocked: todayAutoBlocked,
        loginFailed: todayLoginFailed,
        todayEventsChange: eventsChange,
        botDetectedChange: botsChange,
        autoBlockedChange: autoBlockedChange,
        loginFailedChange: loginFailedChange
      });
    } catch (error) {
      console.error('보안 통계 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        setStats(mockSecurityStats);
      }
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await api.superAdmin.security.getEvents(params);
      setEvents(response.data.events || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('보안 이벤트 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        setEvents(mockSecurityEvents);
        setPagination(prev => ({ ...prev, total: mockSecurityEvents.length, totalPages: 1 }));
      } else {
        message.error(t('profile.superAdmin.security.messages.eventsLoadFail'));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBots = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      const response = await api.superAdmin.security.getBots(params);
      setBots(response.data.bots || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0
      }));
    } catch (error) {
      console.error('봇 목록 로드 실패:', error);
      message.error(t('profile.superAdmin.security.messages.botsLoadFail'));
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await api.superAdmin.security.getSettings();
      setSettings(response.data.settings || settings);
    } catch (error) {
      console.error('설정 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        setSettings(mockSecuritySettings);
      }
    }
  };

  const handleBlockBot = async (botId, reason = '') => {
    try {
      await api.superAdmin.security.blockBot(botId, reason);
      message.success(t('profile.superAdmin.security.messages.blockSuccess'));
      loadBots();
    } catch (error) {
      console.error('봇 차단 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.security.messages.blockFail'));
    }
  };


  const handleSaveSettings = async () => {
    try {
      await api.superAdmin.security.updateSettings(settings);
      message.success(t('profile.superAdmin.security.messages.saveSuccess'));
    } catch (error) {
      console.error('설정 저장 실패:', error);
      message.error(t('profile.superAdmin.security.messages.saveFail'));
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'badge critical';
      case 'high':
        return 'badge high';
      case 'medium':
        return 'badge pending';
      case 'low':
        return 'badge active';
      default:
        return 'badge';
    }
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      critical: t('profile.superAdmin.security.severity.critical'),
      high: t('profile.superAdmin.security.severity.high'),
      medium: t('profile.superAdmin.security.severity.medium'),
      low: t('profile.superAdmin.security.severity.low')
    };
    return labels[severity] || severity;
  };

  // 보안 이벤트 추이 그래프 컴포넌트
  const EventTrendChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchTrendData();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const fetchTrendData = async () => {
      if (!isMountedRef.current) return;
      setLoading(true);
      try {
        const response = await api.superAdmin.security.getEventTrendData({ days });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('이벤트 추이 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockEventTrendData(days));
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.security.loading')}</div>;
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
          <h3>{t('profile.superAdmin.security.charts.eventTrend')}</h3>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5'
            }}
          >
            <option value={7}>{t('profile.superAdmin.security.charts.days7')}</option>
            <option value={14}>{t('profile.superAdmin.security.charts.days14')}</option>
            <option value={30}>{t('profile.superAdmin.security.charts.days30')}</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="login_failed" stroke="#F59E0B" name={t('profile.superAdmin.security.charts.loginFailed')} strokeWidth={2} />
            <Line type="monotone" dataKey="bot_detected" stroke="#EF4444" name={t('profile.superAdmin.security.charts.botDetected')} strokeWidth={2} />
            <Line type="monotone" dataKey="api_abuse" stroke="#8B5CF6" name={t('profile.superAdmin.security.charts.apiAbuse')} strokeWidth={2} />
            <Line type="monotone" dataKey="scraping" stroke="#EC4899" name={t('profile.superAdmin.security.charts.scraping')} strokeWidth={2} />
            <Line type="monotone" dataKey="ip_blocked" stroke="#3B82F6" name={t('profile.superAdmin.security.charts.ipBlocked')} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 이벤트 유형별 분포 (파이 차트) 컴포넌트
  const EventDistributionChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchDistribution();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDistribution = async () => {
      try {
        const response = await api.superAdmin.security.getEventDistribution({ days: 7 });
        if (isMountedRef.current && response.data.success) {
          const eventTypeLabels = {
            login_failed: t('profile.superAdmin.security.charts.loginFailed'),
            bot_detected: t('profile.superAdmin.security.charts.botDetected'),
            api_abuse: t('profile.superAdmin.security.charts.apiAbuse'),
            scraping: t('profile.superAdmin.security.charts.scraping'),
            suspicious_activity: t('profile.superAdmin.security.charts.suspiciousActivity'),
            ip_blocked: t('profile.superAdmin.security.charts.ipBlocked')
          };

          const chartData = response.data.data.map(item => ({
            ...item,
            name: eventTypeLabels[item.name] || item.name
          }));
          
          if (isMountedRef.current) {
            setData(chartData);
          }
        }
      } catch (error) {
        console.error('이벤트 분포 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockEventDistribution);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.security.loading')}</div>;
    }

    if (data.length === 0) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.security.charts.noData')}</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.security.charts.eventDistribution')}</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

  // 시간대별 분포 (바 차트) 컴포넌트
  const HourlyDistributionChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      fetchHourlyData();
      
      return () => {
        isMountedRef.current = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHourlyData = async () => {
      try {
        const response = await api.superAdmin.security.getHourlyDistribution({ days: 7 });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('시간대별 데이터 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockHourlySecurityData);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.security.loading')}</div>;
    }

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.security.charts.hourlyDistribution')}</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              label={{ value: t('profile.superAdmin.ipManagement.charts.hour'), position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: t('profile.superAdmin.security.table.eventCount'), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // TOP 공격 IP 테이블 컴포넌트
  const TopAttackIPsTable = () => {
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
        const response = await api.superAdmin.security.getTopAttackIPs({ days: 7, limit: 10 });
        if (isMountedRef.current && response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('TOP 공격 IP 가져오기 실패:', error);
        if (USE_MOCK_ON_ERROR && isMountedRef.current) {
          setData(mockTopAttackIPs);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>{t('profile.superAdmin.security.loading')}</div>;
    }

    const severityColors = {
      critical: '#DC2626',
      high: '#F59E0B',
      medium: '#10B981',
      low: '#6B7280'
    };

    const severityLabels = {
      critical: t('profile.superAdmin.security.severity.critical'),
      high: t('profile.superAdmin.security.severity.high'),
      medium: t('profile.superAdmin.security.severity.medium'),
      low: t('profile.superAdmin.security.severity.low')
    };

    return (
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>{t('profile.superAdmin.security.topAttackIPs.title')}</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.security.table.rank')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.security.table.ipAddress')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.security.table.eventCount')}</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e5e5' }}>{t('profile.superAdmin.security.table.maxSeverity')}</th>
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
                  {item.eventCount}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e5e5' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: `${severityColors[item.maxSeverity]}20`,
                    color: severityColors[item.maxSeverity]
                  }}>
                    {severityLabels[item.maxSeverity]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {t('profile.superAdmin.security.empty.noAttackIPs')}
          </div>
        )}
      </div>
    );
  };

  return (
    <SuperAdminLayout>
      <div className="security-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('profile.superAdmin.security.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.security.subtitle')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.security.stats.todayEvents')}</div>
            <div className="stat-value">{stats.todayEvents}</div>
            <div className={stats.todayEventsChange !== 0 ? (stats.todayEventsChange > 0 ? "stat-change negative" : "stat-change") : "stat-change"} style={{ color: stats.todayEventsChange > 0 ? '#ef4444' : stats.todayEventsChange < 0 ? '#10b981' : '#666' }}>
              {stats.todayEventsChange > 0 ? t('profile.superAdmin.dashboard.stats.attention') : 
               stats.todayEventsChange < 0 ? `-${Math.abs(stats.todayEventsChange)}` : 
               t('profile.superAdmin.dashboard.stats.normal')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.security.stats.botDetected')}</div>
            <div className="stat-value">{stats.botDetected}</div>
            <div className={stats.botDetectedChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.botDetectedChange > 0 ? '#ef4444' : stats.botDetectedChange < 0 ? '#10b981' : '#666' }}>
              {stats.botDetectedChange > 0 ? `+${stats.botDetectedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.botDetectedChange < 0 ? `${stats.botDetectedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.security.stats.noChange')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.security.stats.autoBlocked')}</div>
            <div className="stat-value">{stats.autoBlocked}</div>
            <div className={stats.autoBlockedChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.autoBlockedChange > 0 ? '#ef4444' : stats.autoBlockedChange < 0 ? '#10b981' : '#666' }}>
              {stats.autoBlockedChange > 0 ? `+${stats.autoBlockedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.autoBlockedChange < 0 ? `${stats.autoBlockedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.security.stats.noChange')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{t('profile.superAdmin.security.stats.loginFailed')}</div>
            <div className="stat-value">{stats.loginFailed}</div>
            <div className={stats.loginFailedChange !== 0 ? "stat-change" : "stat-change"} style={{ color: stats.loginFailedChange > 0 ? '#ef4444' : stats.loginFailedChange < 0 ? '#10b981' : '#666' }}>
              {stats.loginFailedChange > 0 ? `+${stats.loginFailedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               stats.loginFailedChange < 0 ? `${stats.loginFailedChange} ${t('profile.superAdmin.dashboard.today')}` : 
               t('profile.superAdmin.security.stats.noChange')}
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            {t('profile.superAdmin.security.tabs.events')}
          </button>
          <button
            className={`tab ${activeTab === 'bots' ? 'active' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            {t('profile.superAdmin.security.tabs.bots')}
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            {t('profile.superAdmin.security.tabs.settings')}
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="section">
            {/* 🎨 그래프 섹션 추가 */}
            <EventTrendChart />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <EventDistributionChart />
              <HourlyDistributionChart />
            </div>
            
            <TopAttackIPsTable />

            <div className="filters">
              <div className="filter-item">
                <label>{t('profile.superAdmin.security.filters.eventType')}</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">{t('profile.superAdmin.security.filters.all')}</option>
                  <option value="login_failed">{t('profile.superAdmin.security.filters.loginFailed')}</option>
                  <option value="bot_detected">{t('profile.superAdmin.security.filters.botDetected')}</option>
                  <option value="api_abuse">{t('profile.superAdmin.security.filters.apiAbuse')}</option>
                  <option value="scraping">{t('profile.superAdmin.security.filters.scraping')}</option>
                  <option value="suspicious_activity">{t('profile.superAdmin.security.filters.suspiciousActivity')}</option>
                  <option value="ip_blocked">{t('profile.superAdmin.security.filters.ipBlocked')}</option>
                </select>
              </div>
              <div className="filter-item">
                <label>{t('profile.superAdmin.security.filters.severity')}</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                >
                  <option value="">{t('profile.superAdmin.security.filters.all')}</option>
                  <option value="critical">{t('profile.superAdmin.security.filters.critical')}</option>
                  <option value="high">{t('profile.superAdmin.security.filters.high')}</option>
                  <option value="medium">{t('profile.superAdmin.security.filters.medium')}</option>
                  <option value="low">{t('profile.superAdmin.security.filters.low')}</option>
                </select>
              </div>
              <div className="filter-item">
                <label>{t('profile.superAdmin.security.filters.ipAddress')}</label>
                <input
                  type="text"
                  placeholder={t('profile.superAdmin.security.filters.ipSearch')}
                  value={filters.ip}
                  onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
                />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>{t('profile.superAdmin.security.table.time')}</th>
                  <th>{t('profile.superAdmin.security.table.eventType')}</th>
                  <th>{t('profile.superAdmin.security.table.ipAddress')}</th>
                  <th>{t('profile.superAdmin.security.table.detail')}</th>
                  <th>{t('profile.superAdmin.security.table.severity')}</th>
                  <th>{t('profile.superAdmin.security.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.security.loading')}
                    </td>
                  </tr>
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td>{new Date(event.created_at).toLocaleString()}</td>
                      <td>{event.event_type}</td>
                      <td><span className="ip-address">{event.ip_address}</span></td>
                      <td>{event.request_path || '-'}</td>
                      <td>
                        <span className={getSeverityBadgeClass(event.severity)}>
                          {getSeverityLabel(event.severity)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${event.is_blocked ? 'blocked' : 'active'}`}>
                          {event.is_blocked ? t('profile.superAdmin.security.status.blocked') : t('profile.superAdmin.security.status.monitoring')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.security.empty.noEvents')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="section">
            <table>
              <thead>
                <tr>
                  <th>{t('profile.superAdmin.security.table.ipAddress')}</th>
                  <th>{t('profile.superAdmin.security.table.userAgent')}</th>
                  <th>{t('profile.superAdmin.security.table.detectionReason')}</th>
                  <th>{t('profile.superAdmin.security.table.confidence')}</th>
                  <th>{t('profile.superAdmin.security.table.detectionTime')}</th>
                  <th>{t('profile.superAdmin.security.table.action')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.security.loading')}
                    </td>
                  </tr>
                ) : bots.length > 0 ? (
                  bots.map((bot) => (
                    <tr key={bot.id}>
                      <td><span className="ip-address">{bot.ip_address}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {bot.user_agent || '-'}
                      </td>
                      <td>{bot.detection_reason}</td>
                      <td>{bot.confidence_score}%</td>
                      <td>{new Date(bot.created_at).toLocaleString()}</td>
                      <td>
                        {bot.is_blocked ? (
                          <span className="badge blocked">{t('profile.superAdmin.security.status.blocked')}</span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBlockBot(bot.id, t('profile.superAdmin.security.buttons.block'))}
                          >
                            {t('profile.superAdmin.security.buttons.block')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      {t('profile.superAdmin.security.empty.noBots')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="section">
            <h3 style={{ marginBottom: '24px' }}>{t('profile.superAdmin.security.settings.title')}</h3>
            
            <div className="setting-item">
              <div className="setting-label">
                <label>{t('profile.superAdmin.security.settings.autoBlock')}</label>
                <p className="setting-description">{t('profile.superAdmin.security.settings.autoBlockDesc')}</p>
              </div>
              <Switch
                checked={settings.auto_block_enabled}
                onChange={(checked) => setSettings({ ...settings, auto_block_enabled: checked })}
              />
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>{t('profile.superAdmin.security.settings.botDetection')}</label>
                <p className="setting-description">{t('profile.superAdmin.security.settings.botDetectionDesc')}</p>
              </div>
              <Input
                type="number"
                min={0}
                max={100}
                value={settings.bot_detection_threshold}
                onChange={(e) => setSettings({ ...settings, bot_detection_threshold: parseInt(e.target.value) || 70 })}
                style={{ width: '100px' }}
              />
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>{t('profile.superAdmin.security.settings.maxLoginAttempts')}</label>
                <p className="setting-description">{t('profile.superAdmin.security.settings.maxLoginAttemptsDesc')}</p>
              </div>
              <Input
                type="number"
                min={1}
                max={20}
                value={settings.max_login_attempts}
                onChange={(e) => setSettings({ ...settings, max_login_attempts: parseInt(e.target.value) || 5 })}
                style={{ width: '100px' }}
              />
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>{t('profile.superAdmin.security.settings.blockDuration')}</label>
                <p className="setting-description">{t('profile.superAdmin.security.settings.blockDurationDesc')}</p>
              </div>
              <Input
                type="number"
                min={1}
                max={168}
                value={settings.block_duration_hours}
                onChange={(e) => setSettings({ ...settings, block_duration_hours: parseInt(e.target.value) || 24 })}
                style={{ width: '100px' }}
              />
            </div>

            <div style={{ marginTop: '32px' }}>
              <Button type="primary" onClick={handleSaveSettings}>
                {t('profile.superAdmin.security.settings.save')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

