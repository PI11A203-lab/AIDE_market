import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, Globe, X } from 'lucide-react';
import { message } from 'antd';
import AvailableDevelopers from './components/AvailableDevelopers';
import TeamSidebar from './components/TeamSidebar';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import LogoutButton from '../home/components/LogoutButton';
import '../home/index.css';
import './index.css';
import { useTranslation } from 'react-i18next';

export default function TeamBuilder() {
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [availableDevelopers, setAvailableDevelopers] = useState([]);
  const [templateTeams, setTemplateTeams] = useState([]); // 템플릿 팀 구성 목록
  const [selectedTemplateTeamIds, setSelectedTemplateTeamIds] = useState(new Set()); // 선택된 템플릿 팀 ID들
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const maxTeamSize = 10;
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  // i18n 언어 변경 이벤트 구독
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userFromStorage) {
        try {
          setUser(JSON.parse(userFromStorage));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // 언어 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // URL 파라미터를 업데이트하는 함수
  // URL 파라미터 업데이트로 인한 불필요한 재실행 방지를 위한 ref
  const isUpdatingFromState = useRef(false);

  const updateURLParams = (teamIds) => {
    isUpdatingFromState.current = true; // 상태에서 URL을 업데이트하는 중임을 표시
    const searchParams = new URLSearchParams(location.search);
    if (teamIds.length > 0) {
      searchParams.set('team', teamIds.join(','));
    } else {
      searchParams.delete('team');
    }
    history.replace({
      pathname: location.pathname,
      search: searchParams.toString()
    });
    // 다음 렌더링 사이클 후 플래그 리셋
    setTimeout(() => {
      isUpdatingFromState.current = false;
    }, 0);
  };

  useEffect(() => {
    // URL 파라미터에서 선택된 팀원 ID들을 읽어오는 함수
    const getSelectedIdsFromURL = () => {
      const searchParams = new URLSearchParams(location.search);
      const teamParam = searchParams.get('team');
      if (teamParam) {
        return teamParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      }
      return [];
    };

    // 상태에서 URL을 업데이트하는 중이면 loadData를 실행하지 않음
    if (isUpdatingFromState.current) {
      return;
    }

    const loadData = async () => {
      try {
        // 사용자 정보 가져오기
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userFromStorage);
        const userId = userData.id;

        // 찜목록 가져오기
        const favoritesResponse = await api.favorites.getByUser(userId);
        const favoritesList = favoritesResponse.data?.favorites || [];
        
        // 찜목록에 있는 상품 ID만 추출 (여러 가능한 필드명 처리)
        const favoriteProductIds = favoritesList
          .map(fav => fav.product_id || fav.product?.id || fav.id)
          .filter(id => id != null);

        // 모든 상품 가져오기 (템플릿 팀 로드를 위해 먼저 가져옴)
        const productsResponse = await axios.get(`${API_URL}/api/products`);
        const allProducts = productsResponse.data?.products || [];
        
        // 찜목록에 있는 상품만 필터링
        const favoriteProducts = favoriteProductIds.length > 0 
          ? allProducts.filter(product => favoriteProductIds.includes(product.id))
          : [];

        // API 응답을 developer 형식으로 변환 (스탯 정보 포함)
        const developers = await Promise.all(
          favoriteProducts.map(async (product) => {
            // 각 상품의 스탯 정보 가져오기
            let productStats = {
              teamwork: 50,
              stability: 50,
              speed: 50,
              creativity: 50,
              productivity: 50,
              maintainability: 50
            };
            
            try {
              const statsResponse = await api.products.getStats(product.id);
              if (statsResponse.data?.stats) {
                productStats = {
                  teamwork: statsResponse.data.stats.teamwork || 50,
                  stability: statsResponse.data.stats.stability || 50,
                  speed: statsResponse.data.stats.speed || 50,
                  creativity: statsResponse.data.stats.creativity || 50,
                  productivity: statsResponse.data.stats.productivity || 50,
                  maintainability: statsResponse.data.stats.maintainability || 50
                };
              }
            } catch (error) {
              console.warn(`상품 ${product.id}의 스탯을 가져오는데 실패했습니다:`, error);
            }
            
            return {
              id: product.id,
              name: product.name,
              category: product.category_name || 'その他',
              categoryId: product.category_id,
              price: product.price,
              imageUrl: product.imageUrl,
              stats: productStats
            };
          })
        );
        
        setAvailableDevelopers(developers);
        
        // URL 파라미터에서 선택된 팀원 복원
        const selectedIds = getSelectedIdsFromURL();
        
        // localStorage에서 템플릿 팀 정보 복원
        let restoredTemplateTeamIds = new Set();
        let templateTeamsInfo = [];
        try {
          const savedTemplateTeamIds = localStorage.getItem('selectedTemplateTeamIds');
          const savedTemplateTeamsInfo = localStorage.getItem('templateTeamsInfo');
          if (savedTemplateTeamIds) {
            restoredTemplateTeamIds = new Set(JSON.parse(savedTemplateTeamIds));
          }
          if (savedTemplateTeamsInfo) {
            templateTeamsInfo = JSON.parse(savedTemplateTeamsInfo);
          }
        } catch (error) {
          console.error('템플릿 팀 정보 복원 실패:', error);
        }
        
        if (selectedIds.length > 0) {
          const restoredTeam = [];
          
          // 템플릿 팀 멤버 먼저 복원
          for (const templateTeam of templateTeamsInfo) {
            const templateMemberIds = templateTeam.memberIds || [];
            for (const memberId of templateMemberIds) {
              if (selectedIds.includes(memberId)) {
                // 먼저 developers(찜목록)에서 찾고, 없으면 allProducts에서 찾기
                let dev = developers.find(d => d.id === memberId);
                if (!dev) {
                  const product = allProducts.find(p => p.id === memberId);
                  if (product) {
                    // 스탯 정보 가져오기
                    let productStats = {
                      teamwork: 50,
                      stability: 50,
                      speed: 50,
                      creativity: 50,
                      productivity: 50,
                      maintainability: 50
                    };
                    
                    try {
                      const statsResponse = await api.products.getStats(product.id);
                      if (statsResponse.data?.stats) {
                        productStats = {
                          teamwork: statsResponse.data.stats.teamwork || 50,
                          stability: statsResponse.data.stats.stability || 50,
                          speed: statsResponse.data.stats.speed || 50,
                          creativity: statsResponse.data.stats.creativity || 50,
                          productivity: statsResponse.data.stats.productivity || 50,
                          maintainability: statsResponse.data.stats.maintainability || 50
                        };
                      }
                    } catch (error) {
                      console.warn(`상품 ${product.id}의 스탯을 가져오는데 실패했습니다:`, error);
                    }
                    
                    dev = {
                      id: product.id,
                      name: product.name,
                      category: product.category_name || 'その他',
                      categoryId: product.category_id,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      stats: productStats
                    };
                  }
                }
                if (dev) {
                  restoredTeam.push({
                    ...dev,
                    templateTeamId: templateTeam.id,
                    templateTeamName: templateTeam.name
                  });
                }
              }
            }
          }
          
          // 나머지 개별 상품 복원 (템플릿 팀에 속하지 않은 것들)
          const templateMemberIds = templateTeamsInfo.flatMap(t => t.memberIds || []);
          const individualIds = selectedIds.filter(id => !templateMemberIds.includes(id));
          for (const id of individualIds) {
            // 먼저 developers(찜목록)에서 찾고, 없으면 allProducts에서 찾기
            let dev = developers.find(d => d.id === id);
            if (!dev) {
              const product = allProducts.find(p => p.id === id);
              if (product) {
                // 스탯 정보 가져오기
                let productStats = {
                  teamwork: 50,
                  stability: 50,
                  speed: 50,
                  creativity: 50,
                  productivity: 50,
                  maintainability: 50
                };
                
                try {
                  const statsResponse = await api.products.getStats(product.id);
                  if (statsResponse.data?.stats) {
                    productStats = {
                      teamwork: statsResponse.data.stats.teamwork || 50,
                      stability: statsResponse.data.stats.stability || 50,
                      speed: statsResponse.data.stats.speed || 50,
                      creativity: statsResponse.data.stats.creativity || 50,
                      productivity: statsResponse.data.stats.productivity || 50,
                      maintainability: statsResponse.data.stats.maintainability || 50
                    };
                  }
                } catch (error) {
                  console.warn(`상품 ${product.id}의 스탯을 가져오는데 실패했습니다:`, error);
                }
                
                dev = {
                  id: product.id,
                  name: product.name,
                  category: product.category_name || 'その他',
                  categoryId: product.category_id,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  stats: productStats
                };
              }
            }
            if (dev && !restoredTeam.find(r => r.id === id)) {
              restoredTeam.push(dev);
            }
          }
          
          setSelectedTeam(restoredTeam);
          setSelectedTemplateTeamIds(restoredTemplateTeamIds);
        } else {
          setSelectedTemplateTeamIds(restoredTemplateTeamIds);
        }
        
        // 템플릿 팀 구성 로드 (항상 실행)
        await loadTemplateTeams(userId, allProducts);
        
        setLoading(false);
      } catch (error) {
        console.error('エラー発生 : ', error);
        setLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  // 템플릿 팀 구성 로드 함수
  const loadTemplateTeams = async (userId, allProducts) => {
    try {
      // 사용자의 팀 구성 목록 가져오기
      const teamsResponse = await api.teamCompositions.getByUser(userId, { limit: 100 });
      const teams = teamsResponse.data?.teamCompositions || teamsResponse.data?.teams || [];
      
      // 템플릿에서 생성된 팀만 필터링 (이름에 "템플릿" 또는 "テンプレート" 또는 "template" 포함)
      const templateTeamCompositions = teams.filter(team => {
        const name = (team.name || '').toLowerCase();
        return name.includes('템플릿') || name.includes('テンプレート') || name.includes('template');
      });
      
      // 각 템플릿 팀의 멤버 정보 가져오기
      const templateTeamsWithMembers = await Promise.all(
        templateTeamCompositions.map(async (team) => {
          try {
            const membersResponse = await api.teamMembers.getByTeam(team.id);
            const members = membersResponse.data?.teamMembers || membersResponse.data?.members || [];
            
            console.log(`팀 ${team.id} (${team.name})의 멤버 수:`, members.length);
            
            // 멤버 정보와 상품 정보 결합
            const membersWithProducts = [];
            
            for (const member of members) {
              // product_id를 숫자로 변환하여 타입 일치
              const memberProductId = typeof member.product_id === 'string' 
                ? parseInt(member.product_id) 
                : member.product_id;
              
              if (!memberProductId || isNaN(memberProductId)) {
                console.error(`유효하지 않은 product_id:`, member.product_id);
                continue;
              }
              
              // allProducts에서 상품 찾기 (타입 일치를 위해 숫자로 변환)
              let product = allProducts.find(p => {
                const productId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
                return productId === memberProductId;
              });
              
              // allProducts에 없으면 API에서 직접 가져오기
              if (!product) {
                try {
                  const productResponse = await axios.get(`${API_URL}/api/products/${memberProductId}`);
                  product = productResponse.data?.product || productResponse.data;
                  console.log(`상품 ${memberProductId}를 API에서 가져옴:`, product?.name);
                } catch (error) {
                  console.error(`상품 ${memberProductId}를 가져오는 데 실패:`, error);
                  continue;
                }
              }
              
              if (product) {
                const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id;
                const categoryId = typeof product.category_id === 'string' 
                  ? parseInt(product.category_id) 
                  : (product.category_id || null);
                
                // 스탯 정보 가져오기
                let productStats = {
                  teamwork: 50,
                  stability: 50,
                  speed: 50,
                  creativity: 50,
                  productivity: 50,
                  maintainability: 50
                };
                
                try {
                  const statsResponse = await api.products.getStats(productId);
                  if (statsResponse.data?.stats) {
                    productStats = {
                      teamwork: statsResponse.data.stats.teamwork || 50,
                      stability: statsResponse.data.stats.stability || 50,
                      speed: statsResponse.data.stats.speed || 50,
                      creativity: statsResponse.data.stats.creativity || 50,
                      productivity: statsResponse.data.stats.productivity || 50,
                      maintainability: statsResponse.data.stats.maintainability || 50
                    };
                  }
                } catch (error) {
                  console.warn(`상품 ${productId}의 스탯을 가져오는데 실패했습니다:`, error);
                }
                
                membersWithProducts.push({
                  id: productId,
                  name: product.name,
                  category: product.category_name || 'その他',
                  categoryId: categoryId,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  position: member.position,
                  stats: productStats
                });
              }
            }
            
            console.log(`팀 ${team.id} (${team.name})의 최종 멤버 수:`, membersWithProducts.length);
            
            return {
              id: team.id,
              name: team.name,
              synergyScore: team.total_synergy_score || 0,
              members: membersWithProducts,
              createdAt: team.created_at
            };
          } catch (error) {
            console.error(`팀 ${team.id}의 멤버 정보 로드 실패:`, error);
            return null;
          }
        })
      );
      
      // null 값 제거
      const validTeams = templateTeamsWithMembers.filter(Boolean);
      setTemplateTeams(validTeams);
    } catch (error) {
      console.error('템플릿 팀 구성 로드 실패:', error);
      setTemplateTeams([]);
    }
  };

  // 팀에 추가
  const addToTeam = (developer) => {
    if (selectedTeam.length < maxTeamSize && !selectedTeam.find(d => d.id === developer.id)) {
      const newTeam = [...selectedTeam, developer];
      setSelectedTeam(newTeam);
      // URL 파라미터 업데이트
      updateURLParams(newTeam.map(d => d.id));
    }
  };

  // 템플릿 팀 전체를 AIチーム에 추가
  const addTemplateTeamToSelectedTeam = (templateTeam) => {
    console.log('템플릿 팀 추가 시작:', templateTeam);
    console.log('템플릿 팀 멤버 전체:', templateTeam.members);
    
    // 템플릿 팀 ID를 숫자로 변환 (타입 일치를 위해)
    const templateTeamId = typeof templateTeam.id === 'string' ? parseInt(templateTeam.id) : templateTeam.id;
    
    // 템플릿 팀이 이미 추가되어 있는지 확인
    if (selectedTemplateTeamIds.has(templateTeamId)) {
      console.log('템플릿 팀이 이미 추가되어 있습니다:', templateTeamId);
      return;
    }

    // 템플릿 팀 멤버 확인
    if (!templateTeam.members || templateTeam.members.length === 0) {
      console.error('템플릿 팀 멤버가 없습니다:', templateTeam);
      return;
    }

    console.log('템플릿 팀 멤버 수:', templateTeam.members.length);
    console.log('현재 선택된 팀 크기:', selectedTeam.length);
    console.log('현재 selectedTeam 멤버 ID:', selectedTeam.map(d => d.id));
    console.log('최대 팀 크기:', maxTeamSize);

    // 최대 팀 크기 확인
    const remainingSlots = maxTeamSize - selectedTeam.length;
    if (remainingSlots <= 0) {
      console.log('팀 크기가 최대치에 도달했습니다.');
      return;
    }

    // 템플릿 팀의 멤버를 developer 형식으로 변환 (템플릿 팀 ID 포함)
    // 템플릿 팀의 모든 멤버를 추가하되, 남은 슬롯을 초과하지 않도록 함
    const membersToAdd = templateTeam.members.slice(0, Math.min(templateTeam.members.length, remainingSlots));
    
    console.log('추가할 멤버 수:', membersToAdd.length);
    console.log('추가할 멤버 목록:', membersToAdd.map(m => ({ id: m.id, name: m.name })));
    console.log('템플릿 팀 멤버 ID 목록:', membersToAdd.map(m => {
      const id = typeof m.id === 'string' ? parseInt(m.id) : m.id;
      return id;
    }));
    
    // 템플릿 팀의 모든 멤버를 추가
    // "選択可能한AI開発자" 목록에 있는 상품과 템플릿 팀은 별개이므로,
    // 템플릿 팀을 추가할 때는 이미 AIチーム에 있는 멤버만 제외
    const developersToAdd = membersToAdd
      .filter(member => {
        // member.id를 숫자로 변환
        const memberId = typeof member.id === 'string' ? parseInt(member.id) : member.id;
        
        // 이미 AIチーム(selectedTeam)에 추가된 멤버만 제외
        // "選択可能한AI開発자" 목록에만 있는 것은 제외하지 않음
        // (템플릿 팀과 "選択可能한AI開発자"는 별개의 개념)
        const alreadyInSelectedTeam = selectedTeam.find(d => {
          const devId = typeof d.id === 'string' ? parseInt(d.id) : d.id;
          return devId === memberId;
        });
        
        if (alreadyInSelectedTeam) {
          console.log('멤버가 이미 AIチーム에 추가되어 있습니다:', member.name, '(ID:', memberId, ')');
        } else {
          console.log('멤버를 AIチーム에 추가합니다:', member.name, '(ID:', memberId, ')');
        }
        return !alreadyInSelectedTeam;
      })
      .map(member => {
        // ID를 숫자로 통일
        const memberId = typeof member.id === 'string' ? parseInt(member.id) : member.id;
        const categoryId = typeof member.categoryId === 'string' 
          ? parseInt(member.categoryId) 
          : (member.categoryId || null);
        
        const developer = {
          id: memberId,
          name: member.name,
          category: member.category,
          categoryId: categoryId,
          price: member.price,
          imageUrl: member.imageUrl,
          templateTeamId: templateTeamId, // 템플릿 팀 ID 추가 (숫자로 통일)
          templateTeamName: templateTeam.name, // 템플릿 팀 이름 추가
          stats: member.stats || {
            teamwork: 50,
            stability: 50,
            speed: 50,
            creativity: 50,
            productivity: 50,
            maintainability: 50
          }
        };
        console.log(`멤버 ${member.name} 변환:`, {
          id: developer.id,
          templateTeamId: developer.templateTeamId,
          templateTeamName: developer.templateTeamName
        });
        return developer;
      });

    // 템플릿 팀의 모든 멤버를 추가해야 하므로, 필터링 후에도 멤버가 없으면 경고만 표시
    if (developersToAdd.length === 0) {
      console.warn('템플릿 팀의 모든 멤버가 이미 AIチーム에 추가되어 있습니다.');
      // 모든 멤버가 이미 추가되어 있어도 템플릿 팀 ID는 추가 (중복 방지용)
      if (!selectedTemplateTeamIds.has(templateTeamId)) {
        const newTemplateTeamIds = new Set([...selectedTemplateTeamIds, templateTeamId]);
        setSelectedTemplateTeamIds(newTemplateTeamIds);
      }
      return;
    }

    console.log('템플릿 팀 추가:', {
      templateTeamId,
      templateTeamName: templateTeam.name,
      membersCount: developersToAdd.length,
      members: developersToAdd.map(m => m.name),
      developersToAdd: developersToAdd // 전체 객체 확인
    });

    console.log('현재 selectedTeam:', selectedTeam);
    console.log('현재 selectedTeam 멤버 ID:', selectedTeam.map(d => d.id));
    console.log('현재 selectedTemplateTeamIds:', Array.from(selectedTemplateTeamIds));
    console.log('추가될 developersToAdd:', developersToAdd.map(d => ({ id: d.id, name: d.name })));

    const newTeam = [...selectedTeam, ...developersToAdd];
    const newTemplateTeamIds = new Set([...selectedTemplateTeamIds, templateTeamId]);
    
    console.log('새로운 newTeam:', newTeam);
    console.log('새로운 newTeam 멤버 ID:', newTeam.map(d => d.id));
    console.log('새로운 newTeam 크기:', newTeam.length);
    console.log('새로운 newTemplateTeamIds:', Array.from(newTemplateTeamIds));
    
    setSelectedTeam(newTeam);
    setSelectedTemplateTeamIds(newTemplateTeamIds);
    
    // localStorage에 템플릿 팀 정보 저장 (페이지 새로고침 시 복원용)
    try {
      const templateTeamsInfo = Array.from(newTemplateTeamIds).map(id => {
        const teamMembers = newTeam.filter(dev => dev.templateTeamId === id);
        return {
          id: id,
          name: teamMembers[0]?.templateTeamName || t('teamBuilder.template') + ' ' + t('teamBuilder.teamTitle'),
          memberIds: teamMembers.map(m => m.id)
        };
      });
      localStorage.setItem('selectedTemplateTeamIds', JSON.stringify(Array.from(newTemplateTeamIds)));
      localStorage.setItem('templateTeamsInfo', JSON.stringify(templateTeamsInfo));
    } catch (error) {
      console.error('템플릿 팀 정보 저장 실패:', error);
    }
    
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
  };

  // 템플릿 팀 전체를 AIチーム에서 제거
  const removeTemplateTeamFromSelectedTeam = (templateTeamId) => {
    const templateTeamIdNum = typeof templateTeamId === 'string' ? parseInt(templateTeamId) : templateTeamId;
    const newTeam = selectedTeam.filter(dev => dev.templateTeamId !== templateTeamIdNum);
    setSelectedTeam(newTeam);
    // 선택된 템플릿 팀 ID에서 제거
    const newSet = new Set(selectedTemplateTeamIds);
    newSet.delete(templateTeamIdNum);
    setSelectedTemplateTeamIds(newSet);
    
    // localStorage 업데이트
    try {
      const templateTeamsInfo = Array.from(newSet).map(id => {
        const teamMembers = newTeam.filter(dev => dev.templateTeamId === id);
        return {
          id: id,
          name: teamMembers[0]?.templateTeamName || t('teamBuilder.template') + ' ' + t('teamBuilder.teamTitle'),
          memberIds: teamMembers.map(m => m.id)
        };
      });
      localStorage.setItem('selectedTemplateTeamIds', JSON.stringify(Array.from(newSet)));
      localStorage.setItem('templateTeamsInfo', JSON.stringify(templateTeamsInfo));
    } catch (error) {
      console.error('템플릿 팀 정보 업데이트 실패:', error);
    }
    
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
  };

  // 템플릿 팀 삭제
  const deleteTemplateTeam = async (teamId) => {
    if (!user) {
      return;
    }

    try {
      // 팀 구성 삭제
      await api.teamCompositions.delete(teamId);
      
      // 템플릿 팀 목록에서 제거
      setTemplateTeams(prev => prev.filter(team => team.id !== teamId));
      
      // 선택된 팀에 있다면 제거
      const templateTeamIdNum = typeof teamId === 'string' ? parseInt(teamId) : teamId;
      if (selectedTemplateTeamIds.has(templateTeamIdNum)) {
        removeTemplateTeamFromSelectedTeam(templateTeamIdNum);
      }
      
      message.success(t('notifications.team.templateTeamDeleted'));
    } catch (error) {
      console.error('템플릿 팀 삭제 실패:', error);
      message.error(t('notifications.team.templateTeamDeleteFail'));
    }
  };

  // 팀에서 제거
  const removeFromTeam = (developerId) => {
    const newTeam = selectedTeam.filter(d => d.id !== developerId);
    setSelectedTeam(newTeam);
    // URL 파라미터 업데이트
    updateURLParams(newTeam.map(d => d.id));
  };

  // 찜목록에서 삭제
  const removeFromFavorites = async (productId) => {
    if (!user) {
      return;
    }

    try {
      const userId = user.id;
      const product = availableDevelopers.find(dev => dev.id === productId);
      const productName = product?.name || '상품';
      
      await api.favorites.delete(userId, productId);
      
      // 찜목록에서 제거된 상품을 availableDevelopers에서도 제거
      setAvailableDevelopers(prev => prev.filter(dev => dev.id !== productId));
      
      // 선택된 팀에 있다면 팀에서도 제거
      if (selectedTeam.find(d => d.id === productId)) {
        removeFromTeam(productId);
      }
      
      message.success(t('notifications.team.favoriteRemoved', { productName }));
    } catch (error) {
      console.error('찜목록에서 삭제 실패:', error);
      message.error(t('notifications.team.favoriteRemoveFail'));
    }
  };

  // 팀 평균 스탯 계산 (실제 API 스탯 사용)
  const calculateTeamStats = () => {
    if (selectedTeam.length === 0) {
      return [
        { stat: 'Teamwork', value: 0 },
        { stat: 'Stability', value: 0 },
        { stat: 'Speed', value: 0 },
        { stat: 'Creativity', value: 0 },
        { stat: 'Productivity', value: 0 },
        { stat: 'Maintainability', value: 0 }
      ];
    }

    const avgStats = selectedTeam.reduce((acc, dev) => ({
      teamwork: acc.teamwork + (dev.stats?.teamwork || 50),
      stability: acc.stability + (dev.stats?.stability || 50),
      speed: acc.speed + (dev.stats?.speed || 50),
      creativity: acc.creativity + (dev.stats?.creativity || 50),
      productivity: acc.productivity + (dev.stats?.productivity || 50),
      maintainability: acc.maintainability + (dev.stats?.maintainability || 50)
    }), { teamwork: 0, stability: 0, speed: 0, creativity: 0, productivity: 0, maintainability: 0 });

    const teamSize = selectedTeam.length;
    return [
      { stat: 'Teamwork', value: Math.round(avgStats.teamwork / teamSize) },
      { stat: 'Stability', value: Math.round(avgStats.stability / teamSize) },
      { stat: 'Speed', value: Math.round(avgStats.speed / teamSize) },
      { stat: 'Creativity', value: Math.round(avgStats.creativity / teamSize) },
      { stat: 'Productivity', value: Math.round(avgStats.productivity / teamSize) },
      { stat: 'Maintainability', value: Math.round(avgStats.maintainability / teamSize) }
    ];
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    return selectedTeam.reduce((sum, dev) => sum + dev.price, 0);
  };

  // 시너지 스코어 계산
  const calculateSynergyScore = () => {
    if (selectedTeam.length === 0) return 0;
    
    const teamStats = calculateTeamStats();
    const avgScore = teamStats.reduce((sum, stat) => sum + stat.value, 0) / teamStats.length;
    
    // 팀 크기 보너스
    const sizeBonus = selectedTeam.length * 3;
    
    // 다양성 보너스 (다른 카테고리)
    const categories = new Set(selectedTeam.map(d => d.category));
    const diversityBonus = categories.size * 5;
    
    return Math.round(avgScore + sizeBonus + diversityBonus);
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    setLanguage(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLanguage', value);
    }
    setLangOpen(false);
  };

  const currentLangLabel =
    languageOptions.find((opt) => opt.value === language)?.label || 'Language';

  const teamStats = calculateTeamStats();
  const synergyScore = calculateSynergyScore();
  const totalPrice = calculateTotalPrice();

  if (loading) {
    return (
      <div className="team-builder">
        {/* 헤더 */}
        <header className="header">
          <div className="header-inner">
            <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
              <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
            </Link>
            
            <nav className="nav">
              <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
              <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
              <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
              <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
              <Link to="/resources" className="nav-link">{t('home.nav.resources')}</Link>
            </nav>

            <div className="header-actions">
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    width: '200px',
                    height: '40px',
                    padding: '0 16px 0 40px',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1A1A1A',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#E5E7EB';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#F3F4F6';
                  }}
                />
              </div>
              <div className="custom-dropdown" ref={langRef} style={{ minWidth: '160px' }}>
                <button
                  className={`dropdown-button ${langOpen ? 'active' : ''}`}
                  onClick={() => setLangOpen((v) => !v)}
                >
                  <span className="dropdown-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Globe width={16} height={16} />
                    {currentLangLabel}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className={`dropdown-menu ${langOpen ? 'show' : ''}`}>
                  {languageOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`dropdown-item ${language === opt.value ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/purchase" className="icon-btn">
                <ShoppingCart width={20} height={20} />
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="btn-primary">
                    {user.nickname}
                  </Link>
                  <LogoutButton onLogout={handleLogout} />
                </>
              ) : (
                <Link to="/login" className="btn-primary">{t('common.login')}</Link>
              )}
            </div>
          </div>
        </header>
        <main className="team-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('common.loading')}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="team-builder">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo" style={{ color: '#1A1A1A', textDecoration: 'none' }}>
            <span className="logo-text" style={{ color: '#1A1A1A' }}>{t('header.title')}</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">{t('home.nav.marketplace')}</Link>
            <Link to="/rankings" className="nav-link">{t('home.nav.rankings')}</Link>
            <Link to="/templates" className="nav-link">{t('home.nav.templates')}</Link>
            <Link to="/team" className="nav-link active">{t('home.nav.teams')}</Link>
            <Link to="/resources" className="nav-link">{t('home.nav.resources')}</Link>
          </nav>

          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: '200px',
                  height: '40px',
                  padding: '0 16px 0 40px',
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#1A1A1A',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.background = '#E5E7EB';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#F3F4F6';
                }}
              />
            </div>
            <div className="custom-dropdown" ref={langRef} style={{ minWidth: '160px' }}>
              <button
                className={`dropdown-button ${langOpen ? 'active' : ''}`}
                onClick={() => setLangOpen((v) => !v)}
              >
                <span className="dropdown-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Globe width={16} height={16} />
                  {currentLangLabel}
                </span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-menu ${langOpen ? 'show' : ''}`}>
                {languageOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`dropdown-item ${language === opt.value ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/purchase" className="icon-btn">
              <ShoppingCart width={20} height={20} />
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="btn-primary">
                  {user.nickname}
                </Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <Link to="/login" className="btn-primary">{t('common.login')}</Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="team-main">
        <div className="team-intro">
          <h2 className="team-title">{t('teamBuilder.introTitle')}</h2>
          <p className="team-subtitle">
            {t('teamBuilder.introSubtitle', { max: maxTeamSize })}
          </p>
        </div>

        {/* 육각형 그래프 설명 섹션 */}
        <div className="hexagon-explanation-section">
          <div className="hexagon-explanation-card">
            <div className="hexagon-explanation-header">
              <div className="hexagon-header-text">
                <h3 className="hexagon-explanation-title">{t('chart.explanationTitle')}</h3>
                <p className="hexagon-explanation-subtitle">{t('chart.explanationDescription')}</p>
              </div>
            </div>
            
            <div className="hexagon-stats-grid">
              <div className="hexagon-stat-item" style={{ '--stat-color': '#3b82f6' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Teamwork</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.teamwork')}</p>
                </div>
              </div>
              
              <div className="hexagon-stat-item" style={{ '--stat-color': '#10b981' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Stability</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.stability')}</p>
                </div>
              </div>
              
              <div className="hexagon-stat-item" style={{ '--stat-color': '#f59e0b' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Speed</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.speed')}</p>
                </div>
              </div>
              
              <div className="hexagon-stat-item" style={{ '--stat-color': '#8b5cf6' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Creativity</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.creativity')}</p>
                </div>
              </div>
              
              <div className="hexagon-stat-item" style={{ '--stat-color': '#ec4899' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Productivity</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.productivity')}</p>
                </div>
              </div>
              
              <div className="hexagon-stat-item" style={{ '--stat-color': '#06b6d4' }}>
                <div className="hexagon-stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <div className="hexagon-stat-content">
                  <h4 className="hexagon-stat-name">Maintainability</h4>
                  <p className="hexagon-stat-desc">{t('chart.stats.maintainability')}</p>
                </div>
              </div>
            </div>
            
            <div className="hexagon-tip-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hexagon-tip-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p className="hexagon-tip-text">{t('chart.synergyNote')}</p>
            </div>
          </div>
        </div>

        <div className="team-content-grid">
          <div className="team-left-section">
            <AvailableDevelopers
              developers={availableDevelopers}
              selectedTeam={selectedTeam}
              maxTeamSize={maxTeamSize}
              onAddToTeam={addToTeam}
              onRemoveFromTeam={removeFromTeam}
              onDeleteFromFavorites={removeFromFavorites}
            />

            {/* 템플릿 팀 섹션 */}
            {templateTeams.length > 0 && (
              <div className="template-teams-section" style={{ marginTop: '2rem' }}>
                <div className="section-card">
                  <h3 className="section-title">
                    <span>{t('teamBuilder.templateTeams') || '템플릿 팀'}</span>
                  </h3>
                  
                  <div className="template-teams-list">
                    {templateTeams.map((team) => (
                      <div key={team.id} className="template-team-card" style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        marginBottom: '1rem',
                        background: '#ffffff',
                        position: 'relative'
                      }}>
                        {/* 템플릿 팀 삭제 버튼 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplateTeam(team.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: '#6B7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            transition: 'all 0.2s',
                            padding: '4px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#EF4444';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#6B7280';
                          }}
                          title="템플릿 팀 삭제"
                        >
                          <X size={18} />
                        </button>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingRight: '2rem' }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>
                            {team.name?.replace(/템플릿|テンプレート|template/gi, t('teamBuilder.template')) || team.name}
                          </h4>
                          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {t('synergy.label')}: {team.synergyScore}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                          {team.members.map((member) => (
                            <div key={member.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem',
                              background: '#F3F4F6',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem'
                            }}>
                              {member.imageUrl ? (
                                <img 
                                  src={`${API_URL}/${member.imageUrl}`}
                                  alt={member.name}
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                      e.target.nextSibling.textContent = member.name.substring(0, 2);
                                    }
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: '#9CA3AF',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}>
                                  {member.name.substring(0, 2)}
                                </div>
                              )}
                              <span style={{ color: '#1A1A1A' }}>{member.name}</span>
                              <span style={{ color: '#6B7280' }}>¥{member.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => addTemplateTeamToSelectedTeam(team)}
                          disabled={selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? '#E5E7EB'
                              : '#1A1A1A',
                            color: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? '#9CA3AF'
                              : '#ffffff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: selectedTeam.length >= maxTeamSize || selectedTemplateTeamIds.has(typeof team.id === 'string' ? parseInt(team.id) : team.id)
                              ? 'not-allowed'
                              : 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = '#374151';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = '#1A1A1A';
                            }
                          }}
                        >
                          {t('teamBuilder.addTemplateTeam')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <TeamSidebar
            selectedTeam={selectedTeam}
            maxTeamSize={maxTeamSize}
            teamStats={teamStats}
            synergyScore={synergyScore}
            totalPrice={totalPrice}
            onRemoveFromTeam={removeFromTeam}
            onRemoveTemplateTeam={removeTemplateTeamFromSelectedTeam}
            selectedTemplateTeamIds={selectedTemplateTeamIds}
          />
        </div>
      </main>
    </div>
  );
}