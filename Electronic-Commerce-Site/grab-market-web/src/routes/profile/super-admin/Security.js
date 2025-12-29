import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { message, Input, Switch, Button } from 'antd';
import './Security.css';
import './Products.css'; // 공통 스타일 사용

const { TextArea } = Input;

export default function Security() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [bots, setBots] = useState([]);
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
    if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'bots') {
      loadBots();
    } else if (activeTab === 'settings') {
      loadSettings();
    }
  }, [activeTab, pagination.page, filters]);

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
      message.error('보안 이벤트를 불러오는데 실패했습니다.');
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
      message.error('봇 목록을 불러오는데 실패했습니다.');
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
    }
  };

  const handleBlockBot = async (botId, reason = '') => {
    try {
      await api.superAdmin.security.blockBot(botId, reason);
      message.success('봇이 차단되었습니다.');
      loadBots();
    } catch (error) {
      console.error('봇 차단 실패:', error);
      message.error(error.response?.data?.error || '봇 차단에 실패했습니다.');
    }
  };

  const handleUnblockBot = async (botId) => {
    try {
      await api.superAdmin.security.unblockBot(botId);
      message.success('봇 차단이 해제되었습니다.');
      loadBots();
    } catch (error) {
      console.error('봇 차단 해제 실패:', error);
      message.error(error.response?.data?.error || '봇 차단 해제에 실패했습니다.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.superAdmin.security.updateSettings(settings);
      message.success('設定が保存されました。');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      message.error('設定の保存に失敗しました。');
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
      critical: '重要',
      high: '高',
      medium: '中',
      low: '低'
    };
    return labels[severity] || severity;
  };

  return (
    <SuperAdminLayout>
      <div className="security-page">
        <div className="header">
          <h1>セキュリティ管理</h1>
          <p>ボット検出、セキュリティイベント、脅威監視</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">今日のイベント</div>
            <div className="stat-value">5</div>
            <div className="stat-change negative">要注意</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ボット検出</div>
            <div className="stat-value">12</div>
            <div className="stat-change">+3 今日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">自動ブロック</div>
            <div className="stat-value">8</div>
            <div className="stat-change">+2 今日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ログイン失敗</div>
            <div className="stat-value">23</div>
            <div className="stat-change">+5 今日</div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            セキュリティイベント
          </button>
          <button
            className={`tab ${activeTab === 'bots' ? 'active' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            ボット管理
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            設定
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="section">
            <div className="filters">
              <div className="filter-item">
                <label>イベントタイプ</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">すべて</option>
                  <option value="login_failed">ログイン失敗</option>
                  <option value="bot_detected">ボット検出</option>
                  <option value="api_abuse">API乱用</option>
                  <option value="scraping">スクレイピング</option>
                  <option value="suspicious_activity">疑わしい活動</option>
                  <option value="ip_blocked">IPブロック</option>
                </select>
              </div>
              <div className="filter-item">
                <label>深刻度</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                >
                  <option value="">すべて</option>
                  <option value="critical">重要</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div className="filter-item">
                <label>IPアドレス</label>
                <input
                  type="text"
                  placeholder="IP検索..."
                  value={filters.ip}
                  onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
                />
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>時刻</th>
                  <th>イベントタイプ</th>
                  <th>IP アドレス</th>
                  <th>詳細</th>
                  <th>深刻度</th>
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
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td>{new Date(event.created_at).toLocaleString('ja-JP')}</td>
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
                          {event.is_blocked ? 'ブロック済み' : '監視中'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      イベントがありません
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
                  <th>IP アドレス</th>
                  <th>User-Agent</th>
                  <th>検出理由</th>
                  <th>信頼度</th>
                  <th>検出時刻</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      読み込み中...
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
                      <td>{new Date(bot.created_at).toLocaleString('ja-JP')}</td>
                      <td>
                        {bot.is_blocked ? (
                          <span className="badge blocked">ブロック済み</span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleBlockBot(bot.id, '手動ブロック')}
                          >
                            ブロック
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      ボットが検出されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="section">
            <h3 style={{ marginBottom: '24px' }}>セキュリティ設定</h3>
            
            <div className="setting-item">
              <div className="setting-label">
                <label>自動ボットブロック</label>
                <p className="setting-description">疑わしいボットを自動的にブロックします</p>
              </div>
              <Switch
                checked={settings.auto_block_enabled}
                onChange={(checked) => setSettings({ ...settings, auto_block_enabled: checked })}
              />
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>ボット検出閾値</label>
                <p className="setting-description">この値以上の信頼度でボットを自動ブロックします (0-100)</p>
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
                <label>最大ログイン試行回数</label>
                <p className="setting-description">この回数を超えると自動的にブロックされます</p>
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
                <label>ブロック持続時間 (時間)</label>
                <p className="setting-description">ブロックが自動的に解除されるまでの時間</p>
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
                設定を保存
              </Button>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}

