import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { api } from '../../../config/api';
import { AlertCircle } from 'lucide-react';
import ProfileHeader from '../../components/ProfileHeader';
import StudentStatusCard from './components/StudentStatusCard';
import StudentDocumentUpload from './components/StudentDocumentUpload';
import './index.css';

export default function StudentVerification() {
  const history = useHistory();
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadStudentStatus = async () => {
      try {
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning('로그인이 필요합니다.');
          history.push('/login');
          return;
        }

        const userData = JSON.parse(userFromStorage);
        setCurrentUserId(userData.id);

        const response = await api.studentAccount.getStatus(userData.id);
        setStudentStatus(response.data);
      } catch (error) {
        console.error('학생 인증 상태 조회 실패:', error);
        message.error('학생 인증 상태를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStudentStatus();
  }, [history]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);

      await api.studentAccount.verify(currentUserId, formData);
      message.success('학생 인증이 신청되었습니다. 검토 후 처리됩니다.');
      
      // 상태 새로고침
      const statusResponse = await api.studentAccount.getStatus(currentUserId);
      setStudentStatus(statusResponse.data);
    } catch (error) {
      console.error('학생 인증 신청 실패:', error);
      const errorMessage = error.response?.data?.error || '학생 인증 신청에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  const status = studentStatus?.account_type === 'student' && studentStatus?.student_verified_at
    ? (() => {
        if (!studentStatus.student_expires_at) return 'verified';
        const today = new Date();
        const expiresAt = new Date(studentStatus.student_expires_at);
        return expiresAt > today ? 'verified' : 'expired';
      })()
    : 'pending';

  const shouldShowUpload = status === 'pending' || status === 'expired';

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">학생 인증</h1>
          <p className="text-base text-gray-600">
            학생 계정으로 인증하면 모든 상품에 50% 할인을 받을 수 있습니다
          </p>
        </div>

        {/* 현재 상태 카드 */}
        <div className="mb-6">
          <StudentStatusCard studentStatus={studentStatus} />
        </div>

        {/* 학생증 업로드 섹션 */}
        {shouldShowUpload && (
          <div className="mb-6">
            <StudentDocumentUpload
              onUpload={handleUpload}
              uploading={uploading}
              currentDocument={studentStatus?.student_verification_document}
            />
          </div>
        )}

        {/* 안내 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            학생 인증 안내
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 학생 인증 시 모든 상품에 50% 할인이 자동으로 적용됩니다.</li>
            <li>• 학생 할인은 쿠폰 할인과 중복 적용 가능하며, 최대 70%까지 할인됩니다.</li>
            <li>• 학생 인증은 1년간 유효합니다. 만료 전에 갱신해주세요.</li>
            <li>• 업로드된 문서는 검토 후 승인됩니다. (테스트 환경에서는 자동 승인)</li>
            <li>• 인증이 거부된 경우 고객센터로 문의해주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
