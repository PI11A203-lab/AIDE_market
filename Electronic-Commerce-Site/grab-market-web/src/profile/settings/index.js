import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../../config/api';
import ProfileHeader from '../components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';
import './index.css';

export default function ProfileSettings() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadPaymentMethods();
  }, []);

  const loadUserData = async () => {
    try {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        const userData = JSON.parse(userFromStorage);
        const response = await api.users.getById(userData.id);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        const userData = JSON.parse(userFromStorage);
        const response = await api.paymentMethods.getByUser(userData.id);
        setPaymentMethods(response.data.paymentMethods || []);
      }
    } catch (error) {
      console.error('결제방법 로드 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      setPaymentMethods([]);
    }
  };

  const handleUserUpdate = async (updatedData) => {
    try {
      const response = await api.users.update(user.id, updatedData);
      const updatedUser = response.data.user;
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
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(mergedUser));
      }
      
      return { success: true };
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
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
        <ProfileHeader />
        <main className="profile-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader />
      <main className="profile-settings-main">
        <div className="settings-header">
          <h1 className="settings-title">설정</h1>
          <button 
            className="btn-back-to-profile"
            onClick={() => history.push('/profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            프로필로 돌아가기
          </button>
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
        </div>
      </main>
    </div>
  );
}

