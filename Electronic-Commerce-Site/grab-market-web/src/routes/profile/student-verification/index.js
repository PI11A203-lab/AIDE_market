import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Upload } from 'antd';
import { UploadOutlined, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { api } from '../../../config/api';
import ProfileHeader from '../../components/ProfileHeader';
import './index.css';

export default function StudentVerification() {
  const history = useHistory();
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
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
        
        // 이미 업로드된 문서가 있으면 파일 목록에 표시
        if (response.data.student_verification_document) {
          setFileList([{
            uid: '-1',
            name: '학생증',
            status: 'done',
            url: response.data.student_verification_document
          }]);
        }
      } catch (error) {
        console.error('학생 인증 상태 조회 실패:', error);
        message.error('학생 인증 상태를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStudentStatus();
  }, [history]);

  const handleUpload = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.warning('학생증 파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', fileList[0].originFileObj);

      const response = await api.studentAccount.verify(currentUserId, formData);
      message.success('학생 인증이 신청되었습니다. 검토 후 처리됩니다.');
      
      // 상태 새로고침
      const statusResponse = await api.studentAccount.getStatus(currentUserId);
      setStudentStatus(statusResponse.data);
      
      // 파일 목록 업데이트
      if (statusResponse.data.student_verification_document) {
        setFileList([{
          uid: '-1',
          name: '학생증',
          status: 'done',
          url: statusResponse.data.student_verification_document
        }]);
      }
    } catch (error) {
      console.error('학생 인증 신청 실패:', error);
      const errorMessage = error.response?.data?.error || '학생 인증 신청에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          인증 완료
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          <Clock className="w-4 h-4" />
          검토 중
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
          <XCircle className="w-4 h-4" />
          미인증
        </span>
      );
    }
  };

  const isStudentActive = () => {
    if (!studentStatus || studentStatus.account_type !== 'student') {
      return false;
    }
    
    if (!studentStatus.student_expires_at) {
      return false;
    }
    
    const today = new Date();
    const expiresAt = new Date(studentStatus.student_expires_at);
    return expiresAt > today;
  };

  const daysUntilExpiry = () => {
    if (!studentStatus?.student_expires_at) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiresAt = new Date(studentStatus.student_expires_at);
    expiresAt.setHours(0, 0, 0, 0);
    const diff = expiresAt - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  const status = studentStatus?.account_type === 'student' && studentStatus?.student_verified_at
    ? (isStudentActive() ? 'verified' : 'expired')
    : 'pending';

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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">현재 상태</h2>
            {getStatusBadge(status)}
          </div>

          {status === 'verified' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">인증 완료일</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(studentStatus.student_verified_at)}
                  </p>
                </div>
              </div>
              {studentStatus.student_expires_at && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">만료일</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(studentStatus.student_expires_at)}
                    </p>
                    {daysUntilExpiry() !== null && (
                      <p className={`text-sm mt-1 ${daysUntilExpiry() > 30 ? 'text-green-600' : daysUntilExpiry() > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {daysUntilExpiry() > 0 
                          ? `${daysUntilExpiry()}일 남음`
                          : '만료됨'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-semibold">
                  ✓ 학생 할인 (50%)이 적용되고 있습니다
                </p>
              </div>
            </div>
          )}

          {status === 'pending' && !studentStatus?.student_verified_at && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                학생 인증을 신청하려면 학생증 또는 재학증명서를 업로드해주세요.
              </p>
            </div>
          )}

          {status === 'expired' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">
                학생 인증이 만료되었습니다
              </p>
              <p className="text-red-700">
                만료일: {formatDate(studentStatus.student_expires_at)}
              </p>
              <p className="text-sm text-red-600 mt-2">
                학생 할인을 계속 받으려면 학생증을 다시 업로드해주세요.
              </p>
            </div>
          )}
        </div>

        {/* 학생증 업로드 섹션 */}
        {(status === 'pending' || status === 'expired') && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">학생증 업로드</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                다음 서류 중 하나를 업로드해주세요:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>학생증 (앞면, 뒷면 모두 포함)</li>
                <li>재학증명서</li>
                <li>수강신청증 (최근 학기)</li>
              </ul>
            </div>

            <Upload
              fileList={fileList}
              beforeUpload={(file) => {
                // 파일 형식 검증
                const isImage = file.type.startsWith('image/');
                const isPdf = file.type === 'application/pdf';
                if (!isImage && !isPdf) {
                  message.error('이미지 또는 PDF 파일만 업로드 가능합니다.');
                  return false;
                }
                
                // 파일 크기 제한 (10MB)
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  message.error('파일 크기는 10MB 이하여야 합니다.');
                  return false;
                }
                
                setFileList([file]);
                return false; // 자동 업로드 방지
              }}
              onRemove={() => {
                setFileList([]);
              }}
              maxCount={1}
            >
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <UploadOutlined />
                <span>파일 선택</span>
              </button>
            </Upload>

            {fileList.length > 0 && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '업로드 중...' : '학생 인증 신청'}
              </button>
            )}

            {studentStatus?.student_verification_document && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">현재 업로드된 문서:</p>
                <a
                  href={studentStatus.student_verification_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {studentStatus.student_verification_document.split('/').pop()}
                </a>
              </div>
            )}
          </div>
        )}

        {/* 안내 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">학생 인증 안내</h3>
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

