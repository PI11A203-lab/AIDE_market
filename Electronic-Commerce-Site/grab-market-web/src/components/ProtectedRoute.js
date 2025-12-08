import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * 보호된 라우트 컴포넌트
 * 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  // 토큰 확인 (localStorage 또는 sessionStorage)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }, // 로그인 후 원래 페이지로 돌아가기 위해 저장
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;

