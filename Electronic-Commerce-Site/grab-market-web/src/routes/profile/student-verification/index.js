import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { api } from '../../../config/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import StudentStatusCard from './components/StudentStatusCard';
import StudentDocumentUpload from './components/StudentDocumentUpload';
import './index.css';

export default function StudentVerification() {
  const history = useHistory();
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
        setCurrentUser(userData);

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
      message.success({
        content: '✅ 학생 인증이 신청되었습니다. 관리자 검토 목록에 추가되었습니다.',
        duration: 5
      });
      
      // 상태 새로고침 (업로드 후 즉시 대기 중 상태로 변경됨)
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

  // 테스트용 승인 처리 제거 - super_admin은 /profile/super-admin/student-verifications에서 승인해야 함

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 상태 계산 로직 개선
  const getStatus = () => {
    // student_verified_at이 null이 아니면 승인됨 (또는 만료됨)
    if (studentStatus?.student_verified_at) {
      if (studentStatus.student_expires_at) {
        const today = new Date();
        const expiresAt = new Date(studentStatus.student_expires_at);
        return expiresAt > today ? 'verified' : 'expired';
      }
      return 'verified';
    }
    
    // student_verified_at이 null이고 student_verification_document가 있으면 대기 중
    if (studentStatus?.student_verification_document) {
      return 'pending';
    }
    
    // 그 외에는 미신청
    return 'not_applied';
  };

  const status = getStatus();
  const isPending = status === 'pending';
  
  // super_admin 여부 확인
  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      
      <div className="max-w-4xl mx-auto px-5 md:px-12 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => history.push('/profile/settings')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">프로필 설정으로 돌아가기</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">학생 인증</h1>
          <p className="text-base text-gray-600">
            학생 계정으로 인증하면 모든 상품에 50% 할인을 받을 수 있습니다
          </p>
        </div>

        {/* 현재 상태 카드 */}
        <div className="mb-6">
          <StudentStatusCard studentStatus={studentStatus} />
        </div>

        {/* 학생증 업로드 섹션 - 상태에 관계없이 항상 표시 (대기 중일 때는 안내 메시지만 표시) */}
        <div className="mb-6">
          <StudentDocumentUpload
            onUpload={handleUpload}
            uploading={uploading}
            currentDocument={studentStatus?.student_verification_document}
            disabled={isPending || status === 'verified'}
          />
        </div>

        {/* 대기 중 상태 표시 (명확하게) */}
        {isPending && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">⏳</span>
                  인증 대기 중
                </h3>
                <p className="text-sm text-yellow-800 mb-2">
                  학생증이 성공적으로 업로드되었습니다. 관리자 검토 후 승인됩니다.
                </p>
                <p className="text-xs text-yellow-700">
                  승인 완료까지 보통 1-2영업일이 소요됩니다.
                </p>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="mt-4 pt-4 border-t border-yellow-300">
                <button
                  onClick={() => history.push('/profile/super-admin/student-verifications')}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
                >
                  관리자 페이지에서 승인하기
                </button>
              </div>
            )}
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
            <li>• 업로드된 문서는 관리자 검토 후 승인됩니다.</li>
            <li>• 인증이 거부된 경우 고객센터로 문의해주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
