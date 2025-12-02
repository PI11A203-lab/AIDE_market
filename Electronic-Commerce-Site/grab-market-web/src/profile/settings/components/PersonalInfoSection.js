import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Github, Hash, X, Eye, EyeOff } from 'lucide-react';
import { message } from 'antd';

export default function PersonalInfoSection({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    is_email_public: user.is_email_public || false,
    github_url: user.github_url || '',
    tags: Array.isArray(user.tags) ? user.tags.map(t => typeof t === 'object' ? t.name : t) : [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  // user가 변경될 때 formData 업데이트
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        is_email_public: user.is_email_public || false,
        github_url: user.github_url || '',
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
      message.error('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      message.error('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        is_email_public: formData.is_email_public,
        github_url: formData.github_url || null,
        tags: formData.tags
      };

      // 비밀번호 변경이 있는 경우
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          message.error('현재 비밀번호를 입력해주세요.');
          setSaving(false);
          return;
        }
        updateData.password = formData.newPassword;
      }

      const result = await onUpdate(updateData);
      
      if (result.success) {
        message.success('개인정보가 성공적으로 업데이트되었습니다.');
        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        message.error(result.error || '업데이트에 실패했습니다.');
      }
    } catch (error) {
      message.error('업데이트 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      is_email_public: user.is_email_public || false,
      github_url: user.github_url || '',
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
          <h2>개인정보</h2>
        </div>
        {!isEditing && (
          <button 
            className="btn-edit"
            onClick={() => setIsEditing(true)}
          >
            수정
          </button>
        )}
      </div>

      <div className="settings-section-content">
        <div className="form-group">
          <label className="form-label">
            <User className="w-4 h-4" />
            사용자명
          </label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="사용자명을 입력하세요"
            />
          ) : (
            <div className="form-value">{user.username || '-'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail className="w-4 h-4" />
            이메일
          </label>
          {isEditing ? (
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input mb-2"
                placeholder="이메일을 입력하세요"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleEmailPublic}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    formData.is_email_public
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formData.is_email_public ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>공개</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>비공개</span>
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-600">
                  {formData.is_email_public 
                    ? '프로필 페이지에 이메일이 표시됩니다' 
                    : '프로필 페이지에 이메일이 표시되지 않습니다'}
                </span>
              </div>
            </div>
          ) : (
            <div className="form-value">
              <div className="mb-1">{user.email || '-'}</div>
              <div className="text-sm text-gray-500">
                {user.is_email_public ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Eye className="w-3 h-3" />
                    공개
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <EyeOff className="w-3 h-3" />
                    비공개
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Github className="w-4 h-4" />
            GitHub URL
          </label>
          {isEditing ? (
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="form-input"
              placeholder="https://github.com/username"
            />
          ) : (
            <div className="form-value">
              {user.github_url ? (
                <a 
                  href={user.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.github_url}
                </a>
              ) : '-'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Hash className="w-4 h-4" />
            해시태그
          </label>
          {isEditing ? (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="form-input flex-1"
                  placeholder="해시태그를 입력하고 Enter를 누르세요"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  추가
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-600"
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
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(user.tags) ? user.tags.map((tag, idx) => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    return (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
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
                현재 비밀번호 (비밀번호 변경 시 필수)
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock className="w-4 h-4" />
                새 비밀번호
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="새 비밀번호를 입력하세요 (선택사항)"
              />
            </div>

            {formData.newPassword && (
              <div className="form-group">
                <label className="form-label">
                  <Lock className="w-4 h-4" />
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                취소
              </button>
              <button 
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

