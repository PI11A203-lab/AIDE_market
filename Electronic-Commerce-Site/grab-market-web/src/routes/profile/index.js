import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProfileHeader from './components/ProfileHeader';
import ProfileHero from './components/ProfileHero';
import TabNavigation from './components/TabNavigation';
import PurchasesTab from './components/PurchasesTab';
import ReviewsTab from './components/ReviewsTab';
import TeamsTab from './components/TeamsTab';
import FavoritesTab from './components/FavoritesTab';
import AdminDashboard from './admin/AdminDashboard';
import { api } from '../../config/api';
import { API_URL } from '../../config/constants';
import './index.css';

export default function UserProfile() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('purchases');
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]); // 주문 목록
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [teams, setTeams] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    // 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    let userData = null;
    if (userFromStorage) {
      try {
        userData = JSON.parse(userFromStorage);
        const userId = userData.id;
        
        // 현재 로그인한 사용자 정보 저장
        setCurrentUser(userData);
        
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
            role: apiUser.role || 'user',
            tags: Array.isArray(apiUser.tags) ? apiUser.tags.map(t => typeof t === 'object' ? t.name : t) : [],
            joinDate: apiUser.createdAt ? new Date(apiUser.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : 'January 2025',
            stats: {
              purchases: 0,
              reviews: 0,
              teams: 0,
              favorites: 0
            }
          });
          
          // 팔로워 수 가져오기 (admin 권한인 경우)
          if (apiUser.role === 'admin') {
            try {
              const followersResponse = await api.users.getFollowers(apiUser.id, { page: 1, limit: 1 });
              setFollowerCount(followersResponse.data.pagination?.total || apiUser.follower_count || 0);
            } catch (error) {
              console.error('팔로워 수 로드 실패:', error);
              setFollowerCount(apiUser.follower_count || 0);
            }
          }
          
          // 팔로잉 수 가져오기 (user 권한인 경우)
          if (apiUser.role === 'user') {
            try {
              const followingResponse = await api.users.getFollowing(apiUser.id, { page: 1, limit: 1 });
              setFollowingCount(followingResponse.data.pagination?.total || 0);
            } catch (error) {
              console.error('팔로잉 수 로드 실패:', error);
              setFollowingCount(0);
            }
          }
          
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

      // 팀 목록 가져오기
      api.teamCompositions.getByUser(userId)
        .then(response => {
          const teamsList = response.data?.teamCompositions || [];
          // 각 팀의 멤버 정보도 가져오기
          Promise.all(
            teamsList.map(async (team) => {
              try {
                const membersResponse = await api.teamMembers.getByTeam(team.id);
                const members = membersResponse.data?.teamMembers || [];
                return {
                  ...team,
                  members: members.map(m => ({
                    id: m.product_id,
                    name: m.product?.name || 'Unknown',
                    category: m.category?.name || 'その他',
                    imageUrl: m.product?.imageUrl
                  }))
                };
              } catch (err) {
                console.error(`Failed to load members for team ${team.id}:`, err);
                return { ...team, members: [] };
              }
            })
          ).then(teamsWithMembers => {
            setTeams(teamsWithMembers);
            setUser(prev => prev ? { 
              ...prev, 
              stats: { ...prev.stats, teams: teamsWithMembers.length } 
            } : prev);
          });
        })
        .catch(error => {
          console.error('Failed to load teams:', error);
          setTeams([]);
        });
    }

    setLoading(false);
  };

  useEffect(() => {
    // super-admin 권한 체크 및 리다이렉트
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        if (userData.role === 'super_admin') {
          history.replace('/profile/super-admin');
          return;
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

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
  }, [history]);

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

  // Super-admin인 경우 이미 리다이렉트됨 (useEffect에서 처리)
  // Admin인 경우 AdminDashboard 렌더링
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        backButtonLink="/"
        backButtonText="common.backHome"
      />

      <main className="profile-main">
        <ProfileHero 
          user={user} 
          currentUser={currentUser}
          followerCount={followerCount}
          followingCount={followingCount}
          onStatClick={setActiveTab}
          onFollowChange={async () => {
            // 팔로우 변경 시 데이터 새로고침
            if (user.role === 'admin') {
              try {
                const followersResponse = await api.users.getFollowers(user.id, { page: 1, limit: 1 });
                setFollowerCount(followersResponse.data.pagination?.total || 0);
              } catch (error) {
                console.error('팔로워 수 업데이트 실패:', error);
              }
            }
            if (user.role === 'user') {
              try {
                const followingResponse = await api.users.getFollowing(user.id, { page: 1, limit: 1 });
                setFollowingCount(followingResponse.data.pagination?.total || 0);
              } catch (error) {
                console.error('팔로잉 수 업데이트 실패:', error);
              }
            }
          }}
        />

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
          {activeTab === 'teams' && (
            <TeamsTab 
              teams={teams} 
              onTeamUpdate={() => {
                // 팀 목록 새로고침
                const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (userFromStorage) {
                  try {
                    const userData = JSON.parse(userFromStorage);
                    const userId = userData.id;
                    api.teamCompositions.getByUser(userId)
                      .then(response => {
                        const teamsList = response.data?.teamCompositions || [];
                        Promise.all(
                          teamsList.map(async (team) => {
                            try {
                              const membersResponse = await api.teamMembers.getByTeam(team.id);
                              const members = membersResponse.data?.teamMembers || [];
                              return {
                                ...team,
                                members: members.map(m => ({
                                  id: m.product_id,
                                  name: m.product?.name || 'Unknown',
                                  category: m.category?.name || 'その他',
                                  imageUrl: m.product?.imageUrl
                                }))
                              };
                            } catch (err) {
                              console.error(`Failed to load members for team ${team.id}:`, err);
                              return { ...team, members: [] };
                            }
                          })
                        ).then(teamsWithMembers => {
                          setTeams(teamsWithMembers);
                          setUser(prev => prev ? { 
                            ...prev, 
                            stats: { ...prev.stats, teams: teamsWithMembers.length } 
                          } : prev);
                        });
                      })
                      .catch(error => {
                        console.error('Failed to reload teams:', error);
                      });
                  } catch (e) {
                    console.error('Failed to parse user data:', e);
                  }
                }
              }}
            />
          )}
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