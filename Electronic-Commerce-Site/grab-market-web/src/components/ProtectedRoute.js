import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * 보호된 라우트 컴포넌트
 * 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트
 * @param {React.Component} component - 렌더링할 컴포넌트
 * @param {boolean} requireAdmin - admin 권한이 필요한지 여부 (기본값: false)
 * @param {Object} rest - 기타 Route props
 */
const ProtectedRoute = ({ component: Component, requireAdmin = false, ...rest }) => {
  // 토큰 확인 (localStorage 또는 sessionStorage)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuthenticated = !!token;

  // 사용자 정보 확인
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
    return null;
  };

  const user = getUser();
  const isAdmin = user?.role === 'admin';

  return (
    <Route
      {...rest}
      render={(props) => {
        // 로그인하지 않은 경우
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }

        // admin 권한이 필요한데 admin이 아닌 경우
        if (requireAdmin && !isAdmin) {
          return (
            <Redirect
              to={{
                pathname: '/profile',
                state: { from: props.location, error: '관리자 권한이 필요합니다.' },
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;

