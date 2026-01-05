import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../config/api';
import ProfileHeader from '../components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';
import StudentVerificationSection from './components/StudentVerificationSection';
import './index.css';

export default function ProfileSettings() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // 학생 인증 상태 로드 함수
  const loadStudentStatus = async (userId) => {
    try {
      const studentResponse = await api.studentAccount.getStatus(userId);
      if (isMountedRef.current) {
        setStudentStatus(studentResponse.data);
      }
    } catch (error) {
      console.error('학생 인증 상태 로드 실패:', error);
      if (isMountedRef.current) {
        setStudentStatus(null);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const loadData = async () => {
      try {
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userFromStorage) {
          const userData = JSON.parse(userFromStorage);
          
          // 사용자 정보 로드
          try {
            const userResponse = await api.users.getById(userData.id);
            if (isMountedRef.current) {
              setUser(userResponse.data.user);
            }
          } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
          }
          
          // 결제방법 로드
          try {
            const paymentResponse = await api.paymentMethods.getByUser(userData.id);
            if (isMountedRef.current) {
              setPaymentMethods(paymentResponse.data.paymentMethods || []);
            }
          } catch (error) {
            console.error('결제방법 로드 실패:', error);
            if (isMountedRef.current) {
              setPaymentMethods([]);
            }
          }

          // 학생 인증 상태 로드
          await loadStudentStatus(userData.id);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    // 페이지 포커스 시 학생 인증 상태 자동 갱신
    const handleFocus = () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          loadStudentStatus(userData.id);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    // 주기적으로 학생 인증 상태 확인 (30초마다)
    const intervalId = setInterval(() => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          loadStudentStatus(userData.id);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    }, 30000); // 30초마다 확인

    window.addEventListener('focus', handleFocus);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  const handleUserUpdate = async (updatedData) => {
    try {
      console.log('API 업데이트 요청:', { userId: user.id, data: updatedData });
      const response = await api.users.update(user.id, updatedData);
      const updatedUser = response.data.user;
      console.log('API 업데이트 응답:', updatedUser);
      console.log('developer_type 확인:', updatedUser.developer_type);
      
      // 컴포넌트가 마운트되어 있는지 확인
      if (!isMountedRef.current) {
        return { success: false, error: '컴포넌트가 언마운트되었습니다.' };
      }
      
      setUser(updatedUser);
      
      // localStorage/sessionStorage 업데이트
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        const userData = JSON.parse(userFromStorage);
        const mergedUser = { 
          ...userData, 
          ...updatedUser,
          // 태그는 배열 형태로 저장
          tags: updatedUser.tags || []
        };
        console.log('로컬 스토리지 업데이트:', mergedUser);
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(mergedUser));
      }
      
      return { success: true };
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      console.error('에러 상세:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.error || '업데이트에 실패했습니다.' 
      };
    }
  };

  const handlePaymentMethodAdd = async (paymentData) => {
    try {
      const response = await api.paymentMethods.create({
        user_id: user.id,
        ...paymentData
      });
      const updatedMethods = [...paymentMethods, response.data.paymentMethod];
      setPaymentMethods(updatedMethods);
      return { success: true };
    } catch (error) {
      console.error('결제방법 추가 실패:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || '결제방법 추가에 실패했습니다.' 
      };
    }
  };

  const handlePaymentMethodDelete = async (paymentMethodId) => {
    try {
      await api.paymentMethods.delete(paymentMethodId);
      const updatedMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId);
      setPaymentMethods(updatedMethods);
      return { success: true };
    } catch (error) {
      console.error('결제방법 삭제 실패:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || '결제방법 삭제에 실패했습니다.' 
      };
    }
  };

  if (loading || !user) {
    return (
      <div className="profile-container">
        <ProfileHeader showBackButton={false} />
        <main className="profile-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('profile.settings.loading')}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        backButtonLink="/profile"
        backButtonText="profile.settings.backToProfile"
      />
      <main className="profile-settings-main">
        <div className="settings-header">
          <h1 className="settings-title">{t('profile.settings.title')}</h1>
        </div>

        <div className="settings-content">
          <PersonalInfoSection 
            user={user}
            onUpdate={handleUserUpdate}
          />

          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onAdd={handlePaymentMethodAdd}
            onDelete={handlePaymentMethodDelete}
          />

          <StudentVerificationSection studentStatus={studentStatus} />
        </div>
      </main>
    </div>
  );
}

