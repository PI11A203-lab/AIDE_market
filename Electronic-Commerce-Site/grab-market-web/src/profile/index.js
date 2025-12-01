import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileHero from './components/ProfileHero';
import TabNavigation from './components/TabNavigation';
import PurchasesTab from './components/PurchasesTab';
import ReviewsTab from './components/ReviewsTab';
import TeamsTab from './components/TeamsTab';
import FavoritesTab from './components/FavoritesTab';
import { api } from '../config/api';
import { API_URL } from '../config/constants';
import './index.css';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('purchases');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // 주문 목록
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    // 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    let userData = null;
    if (userFromStorage) {
      try {
        userData = JSON.parse(userFromStorage);
        const userId = userData.id;
        
        // API에서 최신 사용자 정보 가져오기
        try {
          const userResponse = await api.users.getById(userId);
          const apiUser = userResponse.data.user;
          
          // 프로필 이미지 URL 생성
          const avatarDisplay = apiUser.profile_image 
            ? `${API_URL}/${apiUser.profile_image}`
            : null;
          
          setUser({
            id: apiUser.id,
            name: apiUser.username || apiUser.nickname || 'User',
            avatar: avatarDisplay || (apiUser.username || 'User').substring(0, 2),
            email: apiUser.email || 'user@example.com',
            is_email_public: apiUser.is_email_public || false,
            profile_image: apiUser.profile_image || null,
            github_url: apiUser.github_url || null,
            tags: Array.isArray(apiUser.tags) ? apiUser.tags.map(t => typeof t === 'object' ? t.name : t) : [],
            joinDate: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : 'January 2025',
            stats: {
              purchases: 0,
              reviews: 0,
              teams: 0,
              favorites: 0
            }
          });
          
          userData = apiUser; // API에서 가져온 데이터로 업데이트
        } catch (apiError) {
          console.error('Failed to load user from API:', apiError);
          // API 실패 시 로컬 스토리지 데이터 사용
          setUser({
            id: userData.id,
            name: userData.nickname || userData.name || 'User',
            avatar: (userData.nickname || userData.name || 'User').substring(0, 2),
            email: userData.email || 'user@example.com',
            is_email_public: userData.is_email_public || false,
            profile_image: userData.profile_image || null,
            github_url: userData.github_url || null,
            tags: Array.isArray(userData.tags) ? userData.tags.map(t => typeof t === 'object' ? t.name : t) : [],
            joinDate: 'January 2025',
            stats: {
              purchases: 0,
              reviews: 0,
              teams: 0,
              favorites: 0
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // 주문 목록 가져오기 (API에서)
    if (userData && userData.id) {
      const userId = userData.id;
      
      // 주문 목록 가져오기
      api.orders.getByUser(userId)
        .then(response => {
          const ordersList = response.data?.orders || [];
          setOrders(ordersList);
          setUser(prev => prev ? { 
            ...prev, 
            stats: { ...prev.stats, purchases: ordersList.length } 
          } : prev);
        })
        .catch(error => {
          console.error('Failed to load orders:', error);
          setOrders([]);
        });
      
      // 찜목록 가져오기
      api.favorites.getByUser(userId)
        .then(response => {
          const favoritesList = response.data?.favorites || [];
          setFavorites(favoritesList);
          setUser(prev => prev ? { 
            ...prev, 
            stats: { ...prev.stats, favorites: favoritesList.length } 
          } : prev);
        })
        .catch(error => {
          console.error('Failed to load favorites:', error);
        });

      // 리뷰 가져오기
      api.reviews.getByUser(userId)
        .then(response => {
          const reviewsList = response.data?.reviews || [];
          setReviews(reviewsList);
          setUser(prev => prev ? { 
            ...prev, 
            stats: { ...prev.stats, reviews: reviewsList.length } 
          } : prev);
        })
        .catch(error => {
          console.error('Failed to load reviews:', error);
        });
    }

    // 팀은 빈 배열로 설정 (나중에 API 추가 가능)
    setTeams([]);
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();

    // 페이지 포커스 시 데이터 새로고침 (리뷰 작성 후 돌아올 때)
    const handleFocus = () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          const userId = userData.id;
          
          // 리뷰 목록 새로고침
          api.reviews.getByUser(userId)
            .then(response => {
              const reviewsList = response.data?.reviews || [];
              setReviews(reviewsList);
              setUser(prev => prev ? { 
                ...prev, 
                stats: { ...prev.stats, reviews: reviewsList.length } 
              } : prev);
            })
            .catch(error => {
              console.error('Failed to reload reviews:', error);
            });
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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

      <main className="profile-main">
        <ProfileHero user={user} />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="tab-content">
          {activeTab === 'purchases' && <PurchasesTab orders={orders} />}
          {activeTab === 'reviews' && (
            <ReviewsTab 
              reviews={reviews} 
              onReviewUpdate={() => {
                // 리뷰 목록 새로고침
                const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (userFromStorage) {
                  try {
                    const userData = JSON.parse(userFromStorage);
                    const userId = userData.id;
                    api.reviews.getByUser(userId)
                      .then(response => {
                        const reviewsList = response.data?.reviews || [];
                        setReviews(reviewsList);
                        setUser(prev => prev ? { 
                          ...prev, 
                          stats: { ...prev.stats, reviews: reviewsList.length } 
                        } : prev);
                      })
                      .catch(error => {
                        console.error('Failed to reload reviews:', error);
                      });
                  } catch (e) {
                    console.error('Failed to parse user data:', e);
                  }
                }
              }}
            />
          )}
          {activeTab === 'teams' && <TeamsTab teams={teams} />}
          {activeTab === 'favorites' && (
            <FavoritesTab 
              favorites={favorites} 
              userId={user.id}
              onRemove={(favoriteId) => {
                setFavorites(favorites.filter(fav => (fav.id || fav.favorite_id) !== favoriteId));
                setUser(prev => prev ? { 
                  ...prev, 
                  stats: { ...prev.stats, favorites: Math.max(0, prev.stats.favorites - 1) } 
                } : prev);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}