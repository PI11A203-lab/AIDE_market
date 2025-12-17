import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Save, Github, Hash, X, Eye, EyeOff } from 'lucide-react';
import { message } from 'antd';

export default function PersonalInfoSection({ user, onUpdate }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    is_email_public: user.is_email_public || false,
    github_url: user.github_url || '',
    developer_type: user.developer_type || '',
    tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const isMountedRef = useRef(true);

  // 컴포넌트 언마운트 시 플래그 설정
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // user가 변경될 때 formData 업데이트
  useEffect(() => {
    if (user && isMountedRef.current) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        is_email_public: user.is_email_public || false,
        github_url: user.github_url || '',
        developer_type: user.developer_type || '',
        tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : [],
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    // 유효성 검사
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      message.error(t('profile.settings.personalInfo.passwordMismatch'));
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      message.error(t('profile.settings.personalInfo.passwordMinLength'));
      return;
    }

    setSaving(true);
    try {
      // developer_type 처리: 빈 문자열이면 null로 변환
      const developerType = formData.developer_type && formData.developer_type.trim() !== '' 
        ? formData.developer_type.trim() 
        : null;
      
      const updateData = {
        username: formData.username,
        email: formData.email,
        is_email_public: formData.is_email_public,
        github_url: formData.github_url || null,
        developer_type: developerType,
        tags: formData.tags
      };
      
      console.log('업데이트할 데이터:', updateData); // 디버깅용

      // 비밀번호 변경이 있는 경우
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          message.error(t('profile.settings.personalInfo.passwordRequired'));
          setSaving(false);
          return;
        }
        updateData.password = formData.newPassword;
      }

      const result = await onUpdate(updateData);
      
      // 컴포넌트가 마운트되어 있는지 확인
      if (!isMountedRef.current) {
        return;
      }
      
      if (result.success) {
        message.success(t('profile.settings.personalInfo.updateSuccess'));
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        message.error(result.error || t('profile.settings.personalInfo.updateFail'));
      }
    } catch (error) {
      if (isMountedRef.current) {
        message.error(t('profile.settings.personalInfo.updateError'));
      }
    } finally {
      if (isMountedRef.current) {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      is_email_public: user.is_email_public || false,
      github_url: user.github_url || '',
      developer_type: user.developer_type || '',
      tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : [],
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTagInput('');
    setIsEditing(false);
  };

  const toggleEmailPublic = () => {
    setFormData(prev => ({
      ...prev,
      is_email_public: !prev.is_email_public
    }));
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <User className="w-6 h-6" />
          <h2>{t('profile.settings.personalInfo.title')}</h2>
        </div>
        {!isEditing && (
          <button 
            className="btn-edit"
            onClick={() => setIsEditing(true)}
          >
            {t('profile.settings.personalInfo.edit')}
          </button>
        )}
      </div>

      <div className="settings-section-content">
        <div className="form-group">
          <label className="form-label no-icon">{t('profile.settings.personalInfo.username')}</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder={t('profile.settings.personalInfo.usernamePlaceholder')}
            />
          ) : (
            <div className="form-value">{user.username || '-'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail className="w-4 h-4" />
            {t('profile.settings.personalInfo.email')}
          </label>
          {isEditing ? (
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder={t('profile.settings.personalInfo.emailPlaceholder')}
              />
              <div className="email-visibility">
                <button
                  type="button"
                  onClick={toggleEmailPublic}
                  className={`visibility-badge ${!formData.is_email_public ? 'private' : ''}`}
                >
                  {formData.is_email_public ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>{t('profile.settings.personalInfo.emailPublic')}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>{t('profile.settings.personalInfo.emailPrivate')}</span>
                    </>
                  )}
                </button>
                <span className="visibility-text">
                  {formData.is_email_public 
                    ? t('profile.settings.personalInfo.emailPublicDesc')
                    : t('profile.settings.personalInfo.emailPrivateDesc')}
                </span>
              </div>
            </div>
          ) : (
            <div className="form-value">
              <div>{user.email || '-'}</div>
              <div className="email-visibility">
                <span className={`visibility-badge ${!user.is_email_public ? 'private' : ''}`}>
                  {user.is_email_public ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>{t('profile.settings.personalInfo.emailPublic')}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>{t('profile.settings.personalInfo.emailPrivate')}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Github className="w-4 h-4" />
            {t('profile.settings.personalInfo.githubUrl')}
          </label>
          {isEditing ? (
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="form-input"
              placeholder={t('profile.settings.personalInfo.githubUrlPlaceholder')}
            />
          ) : (
            <div className="form-value">
              {user.github_url ? (
                <a 
                  href={user.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="form-value-link"
                >
                  {user.github_url}
                </a>
              ) : '-'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label no-icon">{t('profile.settings.personalInfo.developerType')}</label>
          {isEditing ? (
            <select
              name="developer_type"
              value={formData.developer_type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">{t('profile.settings.personalInfo.developerTypeNone')}</option>
              <option value="frontend">{t('profile.settings.personalInfo.developerTypes.frontend')}</option>
              <option value="backend">{t('profile.settings.personalInfo.developerTypes.backend')}</option>
              <option value="fullstack">{t('profile.settings.personalInfo.developerTypes.fullstack')}</option>
              <option value="mobile">{t('profile.settings.personalInfo.developerTypes.mobile')}</option>
              <option value="devops">{t('profile.settings.personalInfo.developerTypes.devops')}</option>
              <option value="data">{t('profile.settings.personalInfo.developerTypes.data')}</option>
              <option value="security">{t('profile.settings.personalInfo.developerTypes.security')}</option>
              <option value="infrastructure">{t('profile.settings.personalInfo.developerTypes.infrastructure')}</option>
              <option value="server">{t('profile.settings.personalInfo.developerTypes.server')}</option>
              <option value="management">{t('profile.settings.personalInfo.developerTypes.management')}</option>
              <option value="other">{t('profile.settings.personalInfo.developerTypes.other')}</option>
            </select>
          ) : (
            <div className="form-value">
              {user.developer_type ? (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold">
                  {user.developer_type === 'frontend' && t('profile.settings.personalInfo.developerTypes.frontend')}
                  {user.developer_type === 'backend' && t('profile.settings.personalInfo.developerTypes.backend')}
                  {user.developer_type === 'fullstack' && t('profile.settings.personalInfo.developerTypes.fullstack')}
                  {user.developer_type === 'mobile' && t('profile.settings.personalInfo.developerTypes.mobile')}
                  {user.developer_type === 'devops' && t('profile.settings.personalInfo.developerTypes.devops')}
                  {user.developer_type === 'data' && t('profile.settings.personalInfo.developerTypes.data')}
                  {user.developer_type === 'security' && t('profile.settings.personalInfo.developerTypes.security')}
                  {user.developer_type === 'infrastructure' && t('profile.settings.personalInfo.developerTypes.infrastructure')}
                  {user.developer_type === 'server' && t('profile.settings.personalInfo.developerTypes.server')}
                  {user.developer_type === 'management' && t('profile.settings.personalInfo.developerTypes.management')}
                  {user.developer_type === 'other' && t('profile.settings.personalInfo.developerTypes.other')}
                  {!['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data', 'security', 'infrastructure', 'server', 'management', 'other'].includes(user.developer_type) && user.developer_type}
                </span>
              ) : '-'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Hash className="w-4 h-4" />
            {t('profile.settings.personalInfo.tags')}
          </label>
          {isEditing ? (
            <div>
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="form-input"
                  placeholder={t('profile.settings.personalInfo.tagsPlaceholder')}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-add"
                >
                  {t('profile.settings.personalInfo.addTag')}
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-container">
                  {formData.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="tag-remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="form-value">
              {user.tags && user.tags.length > 0 ? (
                <div className="tags-container">
                  {Array.isArray(user.tags) ? user.tags.map((tag, idx) => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    return (
                      <span key={idx} className="tag">
                        #{tagName}
                      </span>
                    );
                  }) : null}
                </div>
              ) : '-'}
            </div>
          )}
        </div>

        {isEditing && (
          <>
            <div className="form-group">
              <label className="form-label">
                <Lock className="w-4 h-4" />
                {t('profile.settings.personalInfo.currentPassword')}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input"
                placeholder={t('profile.settings.personalInfo.currentPasswordPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="w-4 h-4" />
                {t('profile.settings.personalInfo.newPassword')}
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                placeholder={t('profile.settings.personalInfo.newPasswordPlaceholder')}
              />
            </div>

            {formData.newPassword && (
              <div className="form-group">
                <label className="form-label">
                  <Lock className="w-4 h-4" />
                  {t('profile.settings.personalInfo.confirmPassword')}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t('profile.settings.personalInfo.confirmPasswordPlaceholder')}
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                {t('profile.settings.personalInfo.cancel')}
              </button>
              <button 
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {t('profile.settings.personalInfo.save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

