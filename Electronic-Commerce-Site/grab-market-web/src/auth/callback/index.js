import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import './index.css';

export default function AuthCallback() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 추출
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      // 에러가 있는 경우
      console.error('구글 로그인 실패:', error);
      message.error('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      history.push('/login');
      return;
    }

    if (!token) {
      // 토큰이 없는 경우
      console.error('토큰이 없습니다');
      message.error('로그인 토큰을 받지 못했습니다. 다시 시도해주세요.');
      history.push('/login');
      return;
    }

    // JWT 토큰 디코딩 (Base64)
    const decodeJWT = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
      }
    };

    // 토큰에서 사용자 정보 추출
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.id) {
      console.error('토큰에서 사용자 정보를 추출할 수 없습니다');
      message.error('로그인 정보를 처리할 수 없습니다. 다시 시도해주세요.');
      history.push('/login');
      return;
    }

    // 서버에서 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${decodedToken.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = response.data.user;
        
        // 사용자 정보 저장
        const userInfo = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role || 'user',
          nickname: userData.username,
          profile_image: userData.profile_image
        };

        // 토큰과 사용자 정보 저장
        console.log('구글 로그인 성공, 토큰 및 사용자 정보 저장');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userInfo));

        message.success('구글 로그인에 성공했습니다!');
        history.push('/');
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        // 토큰은 저장하고 사용자 정보는 나중에 가져올 수 있도록
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
        
        // 최소한의 정보라도 저장 (토큰에서 추출한 정보)
        const minimalUserInfo = {
          id: decodedToken.id,
          email: decodedToken.email,
          username: decodedToken.email.split('@')[0],
          role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(minimalUserInfo));
        sessionStorage.setItem('user', JSON.stringify(minimalUserInfo));

        message.success('구글 로그인에 성공했습니다!');
        history.push('/');
      }
    };

    fetchUserInfo();
  }, [location, history]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A1A1A] mx-auto mb-4"></div>
        <p className="text-[#6B7280]">로그인 처리 중...</p>
      </div>
    </div>
  );
}

