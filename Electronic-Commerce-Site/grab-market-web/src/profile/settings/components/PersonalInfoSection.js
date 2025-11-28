import React, { useState } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { message } from 'antd';

export default function PersonalInfoSection({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        email: formData.email
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
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

