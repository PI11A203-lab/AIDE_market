import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Github, Image, Hash, Eye, EyeOff } from 'lucide-react';
import { message } from 'antd';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';

export default function PersonalInfoSection({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    github_url: user.github_url || '',
    is_email_public: user.is_email_public !== undefined ? user.is_email_public : false,
    selectedTags: Array.isArray(user.tags) ? user.tags.map(t => t.id || t) : [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user.profile_image ? `${API_URL}/${user.profile_image}` : null
  );
  const [allTags, setAllTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (user.profile_image) {
      setProfileImagePreview(`${API_URL}/${user.profile_image}`);
    } else {
      setProfileImagePreview(null);
    }
    
    // 사용자 정보가 변경되면 폼 데이터 업데이트 (편집 모드가 아닐 때만)
    if (!isEditing) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        github_url: user.github_url || '',
        is_email_public: user.is_email_public !== undefined ? user.is_email_public : false,
        selectedTags: Array.isArray(user.tags) ? user.tags.map(t => (typeof t === 'object' ? t.id : t)) : [],
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user, isEditing]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoadingTags(true);
    try {
      const response = await api.tags.getList();
      setAllTags(response.data.tags || []);
    } catch (error) {
      console.error('태그 로드 실패:', error);
      message.error('태그를 불러오는데 실패했습니다.');
    } finally {
      setLoadingTags(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      message.error('이미지 파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 검사
    if (!file.type.startsWith('image/')) {
      message.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const response = await api.upload.image(formDataObj);
      const imageUrl = response.data.imageUrl;

      // 미리보기 업데이트
      setProfileImagePreview(`${API_URL}/${imageUrl}`);

      // 폼 데이터에 이미지 URL 저장
      setFormData(prev => ({
        ...prev,
        profile_image: imageUrl
      }));

      message.success('프로필 사진이 업로드되었습니다.');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      message.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => {
      const selectedTags = prev.selectedTags || [];
      const isSelected = selectedTags.includes(tagId);
      
      return {
        ...prev,
        selectedTags: isSelected
          ? selectedTags.filter(id => id !== tagId)
          : [...selectedTags, tagId]
      };
    });
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
        github_url: formData.github_url || null,
        is_email_public: formData.is_email_public,
        tags: formData.selectedTags || []
      };

      // 프로필 이미지가 변경된 경우
      if (formData.profile_image) {
        updateData.profile_image = formData.profile_image;
      }

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
      github_url: user.github_url || '',
      is_email_public: user.is_email_public !== undefined ? user.is_email_public : false,
      selectedTags: Array.isArray(user.tags) ? user.tags.map(t => t.id || t) : [],
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setProfileImagePreview(user.profile_image ? `${API_URL}/${user.profile_image}` : null);
    setIsEditing(false);
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
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="이메일을 입력하세요"
            />
          ) : (
            <div className="form-value">{user.email || '-'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail className="w-4 h-4" />
            이메일 공개 여부
          </label>
          {isEditing ? (
            <label className="form-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_email_public"
                checked={formData.is_email_public}
                onChange={handleChange}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
              <span>이메일을 다른 사용자에게 공개</span>
            </label>
          ) : (
            <div className="form-value">
              {user.is_email_public ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                  <Eye className="w-4 h-4" />
                  공개
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                  <EyeOff className="w-4 h-4" />
                  비공개
                </span>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Image className="w-4 h-4" />
            프로필 사진
          </label>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profileImagePreview && (
                <div style={{ width: '120px', height: '120px', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <img 
                    src={profileImagePreview} 
                    alt="프로필 미리보기" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  disabled={uploadingImage}
                  style={{ width: 'auto' }}
                >
                  {uploadingImage ? '업로드 중...' : '사진 선택'}
                </button>
              </label>
            </div>
          ) : (
            <div className="form-value">
              {user.profile_image ? (
                <div style={{ width: '120px', height: '120px', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <img 
                    src={`${API_URL}/${user.profile_image}`} 
                    alt="프로필" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '0.75rem', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                  사진 없음
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Github className="w-4 h-4" />
            깃허브 링크
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
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  {user.github_url}
                </a>
              ) : (
                '-'
              )}
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
              {loadingTags ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>태그를 불러오는 중...</div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: '0.75rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: '#f9fafb'
                }}>
                  {allTags.map((tag) => {
                    const isSelected = formData.selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: `2px solid ${isSelected ? '#3b82f6' : '#d1d5db'}`,
                          borderRadius: '0.5rem',
                          background: isSelected ? '#eff6ff' : 'white',
                          color: isSelected ? '#3b82f6' : '#374151',
                          cursor: 'pointer',
                          fontWeight: isSelected ? '600' : '500',
                          transition: 'all 0.2s',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.target.style.borderColor = '#93c5fd';
                            e.target.style.background = '#f0f9ff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.background = 'white';
                          }
                        }}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                선택한 태그: {formData.selectedTags.length}개
              </div>
            </div>
          ) : (
            <div className="form-value">
              {Array.isArray(user.tags) && user.tags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        padding: '0.25rem 0.75rem', 
                        background: '#eff6ff', 
                        color: '#3b82f6', 
                        borderRadius: '9999px', 
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      #{typeof tag === 'object' ? tag.name : tag}
                    </span>
                  ))}
                </div>
              ) : (
                '-'
              )}
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

