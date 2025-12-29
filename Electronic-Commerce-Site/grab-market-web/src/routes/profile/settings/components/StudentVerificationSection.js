import React from 'react';
import { useHistory } from 'react-router-dom';
import { GraduationCap, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

export default function StudentVerificationSection({ studentStatus }) {
  const history = useHistory();

  const getStatusInfo = () => {
    if (!studentStatus || studentStatus.account_type !== 'student' || !studentStatus.student_verified_at) {
      return {
        status: 'pending',
        icon: <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />,
        text: '인증 대기 중',
        description: '학생 인증을 신청하면 모든 상품에 50% 할인을 받을 수 있습니다.',
        color: 'yellow'
      };
    }

    const today = new Date();
    const expiresAt = studentStatus.student_expires_at ? new Date(studentStatus.student_expires_at) : null;

    if (expiresAt && expiresAt > today) {
      const daysUntilExpiry = Math.ceil((expiresAt - today) / (1000 * 60 * 60 * 24));
      return {
        status: 'verified',
        icon: <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />,
        text: '인증 완료',
        description: `학생 할인(50%)이 적용 중입니다. 만료까지 ${daysUntilExpiry}일 남았습니다.`,
        color: 'green'
      };
    }

    return {
      status: 'expired',
      icon: <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />,
      text: '인증 만료',
      description: '학생 인증이 만료되었습니다. 갱신해주세요.',
      color: 'red'
    };
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <GraduationCap className="w-6 h-6" />
          <h2>학생 인증</h2>
        </div>
        <button
          className="btn-add"
          onClick={() => history.push('/profile/student-verification')}
        >
          학생 인증 관리
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="settings-section-content">
        {/* 상태 카드 */}
        <div className={`student-status-card student-status-${statusInfo.color}`}>
          <div className="student-status-header">
            {statusInfo.icon}
            <span className="student-status-text">{statusInfo.text}</span>
          </div>
          <p className="student-status-description">{statusInfo.description}</p>

          {/* 인증 정보 */}
          {studentStatus?.student_verified_at && (
            <div className="student-status-details">
              <div className="student-status-detail-item">
                <span className="detail-label">인증 완료일:</span>
                <span className="detail-value">{formatDate(studentStatus.student_verified_at)}</span>
              </div>
              {studentStatus.student_expires_at && (
                <div className="student-status-detail-item">
                  <span className="detail-label">만료일:</span>
                  <span className="detail-value">{formatDate(studentStatus.student_expires_at)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="student-verification-info">
          <ul className="student-info-list">
            <li>• 학생 인증 시 모든 상품에 50% 할인이 자동으로 적용됩니다.</li>
            <li>• 학생 할인은 쿠폰 할인과 중복 적용 가능하며, 최대 70%까지 할인됩니다.</li>
            <li>• 학생 인증은 1년간 유효합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

