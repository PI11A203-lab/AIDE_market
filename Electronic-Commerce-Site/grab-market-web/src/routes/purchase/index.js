import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import PurchaseHeader from './components/PurchaseHeader';
import CartItem from './components/CartItem';
import CouponSection from './components/CouponSection';
import OrderSummary from './components/OrderSummary';
import PurchaseProtection from './components/PurchaseProtection';
import EmptyCart from './components/EmptyCart';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import './index.css';

export default function PurchasePage() {
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null); // 바로 구매 상품
  const [availableCartItems, setAvailableCartItems] = useState([]); // 장바구니에 있는 다른 상품들
  const [loading, setLoading] = useState(true);

  // localStorage에서 언어 설정 불러오기 (메인 페이지에서 변경된 언어 반영)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 상품 정보를 가져오는 함수
  const fetchProduct = async (id) => {
    try {
      // 사용자 정보 가져오기
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      let currentUserId = null;
      if (userFromStorage) {
        try {
          const userData = JSON.parse(userFromStorage);
          currentUserId = userData.id;
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }

      const res = await axios.get(`${API_URL}/api/products/${id}`, {
        params: currentUserId ? { user_id: currentUserId } : {}
      });
      const product = res.data?.product;
      const tags = res.data?.tags || [];
      if (!product) {
        throw new Error('Product not found');
      }
      return {
        id: product.id,
        name: product.name,
        category: product.category_name || 'NLP',
        price: product.price,
        avatar: product.name.substring(0, 2),
        is_purchased: product.is_purchased === 1 || product.is_purchased === true,
        tags: tags.map(tag => tag.name || tag).length > 0 
          ? tags.map(tag => tag.name || tag) 
          : ['AI/ML', 'Expert']
      };
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 사용자 정보 확인
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userFromStorage) {
          message.warning(t('purchase.messages.loginRequired'));
          history.push('/login');
          return;
        }

        const userData = JSON.parse(userFromStorage);
        const userId = userData.id;
        setCurrentUser(userData); // 사용자 정보 저장

        // 사용자 정보 새로고침 (account_type 등 최신 정보 확인)
        try {
          const userResponse = await api.users.getById(userId);
          if (userResponse.data?.user) {
            setCurrentUser(userResponse.data.user);
            // localStorage/sessionStorage 업데이트
            const updatedUser = { ...userData, ...userResponse.data.user };
            if (localStorage.getItem('user')) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            } else if (sessionStorage.getItem('user')) {
              sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
        }

        // URL 파라미터에서 buyNow 확인
        const searchParams = new URLSearchParams(location.search);
        const buyNowId = searchParams.get('buyNow');

        if (buyNowId) {
          // 바로 구매 모드: 해당 상품만 표시
          const product = await fetchProduct(buyNowId);
          if (product.is_purchased) {
            message.warning(t('purchase.messages.alreadyPurchased'));
            history.push('/');
            return;
          }
          setBuyNowItem(product);
          setCartItems([product]);

          // 장바구니에 있는 다른 상품들도 가져오기 (하단에 표시용) - API 사용
          try {
            const cartResponse = await api.carts.getByUser(userId);
            const cartItems = cartResponse.data?.cartItems || [];
            // 바로 구매 상품 제외한 다른 상품들
            const otherItems = cartItems
              .filter(item => item.product_id.toString() !== buyNowId.toString())
              .map(item => ({
                id: item.product_id,
                name: item.product?.name || 'Unknown',
                category: 'NLP',
                price: item.product?.price || 0,
                avatar: (item.product?.name || 'U').substring(0, 2),
                is_purchased: false,
                tags: ['AI/ML', 'Expert']
              }));
            
            if (otherItems.length > 0) {
              const otherProducts = await Promise.all(
                otherItems.map(item => fetchProduct(item.id))
              );
              setAvailableCartItems(otherProducts);
            }
          } catch (e) {
            console.error('Failed to load cart from API:', e);
          }
        } else {
          // 일반 장바구니 모드: API에서 장바구니 로드
          try {
            const cartResponse = await api.carts.getByUser(userId);
            const cartItems = cartResponse.data?.cartItems || [];
            
            if (cartItems.length === 0) {
              setCartItems([]);
              setLoading(false);
              return;
            }

            // 각 장바구니 아이템의 상품 정보 가져오기
            const items = await Promise.all(
              cartItems.map(async (cartItem) => {
                try {
                  const product = await fetchProduct(cartItem.product_id);
                  return product;
                } catch (error) {
                  console.error(`Failed to fetch product ${cartItem.product_id}:`, error);
                  return null;
                }
              })
            );

            // null 제거 및 이미 구매한 상품 필터링
            const validItems = items.filter(item => item !== null);
            const purchasedItems = validItems.filter(item => item.is_purchased);
            const availableItems = validItems.filter(item => !item.is_purchased);
            
            if (purchasedItems.length > 0) {
              message.warning(t('purchase.messages.itemsRemovedFromCart', { count: purchasedItems.length }));
              // 장바구니에서 구매한 상품 제거 (API 호출)
              await Promise.all(
                purchasedItems.map(item => api.carts.removeItem(userId, item.id))
              );
            }
            
            setCartItems(availableItems);
          } catch (error) {
            console.error('Failed to load cart from API:', error);
            message.error(t('purchase.messages.cartLoadFail'));
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('エラー発生 : ', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.search, history, t]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubscription, setIsSubscription] = useState(true); // 정기결제 동의 여부
  const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보

  // localStorage에서 쿠폰 정보 복원
  useEffect(() => {
    const savedCouponCode = localStorage.getItem('purchaseCouponCode');
    const savedAppliedCoupon = localStorage.getItem('purchaseAppliedCoupon');
    
    if (savedCouponCode) {
      setCouponCode(savedCouponCode);
    }
    
    if (savedAppliedCoupon) {
      try {
        const coupon = JSON.parse(savedAppliedCoupon);
        setAppliedCoupon(coupon);
      } catch (e) {
        console.error('Failed to parse saved coupon:', e);
      }
    }
  }, []);

  // 쿠폰 코드 변경 핸들러
  const handleCouponCodeChange = (value) => {
    setCouponCode(value);
    // 쿠폰 코드만 localStorage에 저장 (적용된 쿠폰이 있으면 유지)
    if (value.trim()) {
      localStorage.setItem('purchaseCouponCode', value.trim());
    } else {
      localStorage.removeItem('purchaseCouponCode');
      // 쿠폰 코드가 비어있고 적용된 쿠폰도 없으면 적용된 쿠폰 정보도 제거
      if (!appliedCoupon) {
        localStorage.removeItem('purchaseAppliedCoupon');
      }
    }
  };

  // 장바구니에서 제거 (API 사용)
  const removeFromCart = async (itemId) => {
    try {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!userFromStorage) {
        message.warning(t('purchase.messages.loginRequired'));
        return;
      }

      const userData = JSON.parse(userFromStorage);
      const userId = userData.id;

      // API로 장바구니에서 제거
      await api.carts.removeItem(userId, itemId);

      const removedItem = cartItems.find(item => item.id === itemId);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      
      // 바로 구매 모드이고, 제거된 상품이 buyNowItem이 아닌 경우 availableCartItems에 다시 추가
      if (buyNowItem && removedItem && removedItem.id !== buyNowItem.id) {
        setAvailableCartItems([...availableCartItems, removedItem]);
      }

      message.success(t('purchase.messages.cartItemRemoved'));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      const errorMessage = error.response?.data?.error || t('purchase.messages.removeCartItemFail');
      message.error(errorMessage);
    }
  };

  // 장바구니 상품을 바로 결제 목록에 추가
  const addCartItemToPurchase = (item) => {
    // 중복 체크
    if (cartItems.some(cartItem => cartItem.id === item.id)) {
      return;
    }
    // 구매 목록에 추가
    setCartItems([...cartItems, item]);
    // availableCartItems에서 제거
    setAvailableCartItems(availableCartItems.filter(availableItem => availableItem.id !== item.id));
  };

  // 쿠폰 적용
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning(t('purchase.messages.couponCodeRequired'));
      return;
    }

    try {
      // 학생 할인 적용 후 금액으로 쿠폰 검증
      const originalSubtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
      const studentDiscountedSubtotal = applyStudentDiscount(originalSubtotal);
      
      const response = await api.coupons.validate(couponCode, studentDiscountedSubtotal);
      const couponData = response.data.coupon;
      const discountAmount = parseFloat(response.data.discountAmount);
      
      const couponInfo = {
        code: couponData.code,
        discount: discountAmount / studentDiscountedSubtotal,
        discountAmount: discountAmount,
        label: couponData.discount_type === 'rate' 
          ? `${couponData.discount_value}% OFF`
          : `¥${discountAmount.toLocaleString()} OFF`,
        couponId: couponData.coupon_id
      };
      
      setAppliedCoupon(couponInfo);
      
      // localStorage에 저장
      localStorage.setItem('purchaseCouponCode', couponCode.trim());
      localStorage.setItem('purchaseAppliedCoupon', JSON.stringify(couponInfo));
      
      message.success(t('purchase.messages.couponApplied'));
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      const errorMessage = error.response?.data?.error || t('purchase.messages.couponApplyFail');
      message.error(errorMessage);
      
      // 에러 발생 시 localStorage에서 제거
      localStorage.removeItem('purchaseCouponCode');
      localStorage.removeItem('purchaseAppliedCoupon');
      setAppliedCoupon(null);
    }
  };

  // 쿠폰 제거
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('purchaseCouponCode');
    localStorage.removeItem('purchaseAppliedCoupon');
    message.info(t('purchase.messages.couponRemoved'));
  };

  // 학생 할인 적용 여부 확인
  const isStudentActive = () => {
    if (!currentUser || currentUser.account_type !== 'student') {
      return false;
    }
    
    if (!currentUser.student_expires_at) {
      return false;
    }
    
    const today = new Date();
    const expiresAt = new Date(currentUser.student_expires_at);
    return expiresAt > today;
  };

  // 학생 할인 적용 (50%)
  const applyStudentDiscount = (price) => {
    if (isStudentActive()) {
      return Math.floor(price * 0.5);
    }
    return price;
  };

  // 가격 계산 (학생 할인 + 쿠폰 할인)
  const originalSubtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const studentDiscountedSubtotal = applyStudentDiscount(originalSubtotal);
  const studentDiscount = originalSubtotal - studentDiscountedSubtotal;
  
  // 쿠폰 할인 계산 (학생 할인 적용 후 금액에 대해)
  let couponDiscount = 0;
  if (appliedCoupon) {
    // 쿠폰 할인은 학생 할인이 적용된 금액에 대해 계산
    if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discount) {
      couponDiscount = Math.floor(studentDiscountedSubtotal * appliedCoupon.discount);
    }
  }
  
  // 최대 할인율 제한 (70%까지)
  const maxDiscount = Math.floor(originalSubtotal * 0.7);
  const totalDiscount = studentDiscount + couponDiscount;
  const finalDiscount = Math.min(totalDiscount, maxDiscount);
  const discount = finalDiscount;
  
  const subtotalAfterDiscount = originalSubtotal - finalDiscount;
  const tax = Math.floor(subtotalAfterDiscount * 0.1);
  const total = subtotalAfterDiscount + tax;

  const handleCheckout = async () => {
    // 정기결제 동의 확인 (정기결제가 활성화된 경우만)
    // 주의: 정기결제 체크박스는 기본값이 true이지만, 사용자가 체크 해제할 수 있음
    // 현재는 정기결제 필수이므로 확인 로직 유지

    // 사용자 정보 확인
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning(t('purchase.messages.loginRequired'));
      history.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userFromStorage);
      
      // 결제방법 확인
      const response = await api.paymentMethods.getByUser(user.id);
      const methods = response.data.paymentMethods || [];
      
      if (methods.length === 0) {
        message.warning(t('purchase.messages.paymentMethodRequired'), 3);
        setTimeout(() => {
          if (window.confirm(t('purchase.messages.goToPaymentMethod'))) {
            history.push('/profile/settings');
          }
        }, 500);
        return;
      }

      // 기본 결제방법 선택 (is_default가 true인 것 또는 첫 번째)
      const defaultPaymentMethod = methods.find(m => m.is_default) || methods[0];
      
      // 바로 주문 생성
      await processPayment(defaultPaymentMethod);
    } catch (error) {
      console.error('결제방법 확인 실패:', error);
      message.error('결제방법을 확인하는 중 오류가 발생했습니다.');
    }
  };

  const processPayment = async (paymentMethod) => {
    setIsProcessing(true);
    
    // 사용자 정보 확인
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      setIsProcessing(false);
      return;
    }

    try {
      const user = JSON.parse(userFromStorage);
      
      // 주문 생성 (새로운 API 구조: payment_id 사용)
      // total_amount는 세금 포함 최종 금액 (학생 할인 및 쿠폰 할인 적용됨)
      const orderData = {
        user_id: user.id,
        total_amount: Math.round(total), // 정수로 반올림 (세금 포함 최종 금액)
        payment_id: paymentMethod.id, // ⚠️ 결제수단 ID 사용
        status: 'completed', // 결제 완료로 바로 처리
        is_recurring: isSubscription, // 정기결제 여부
        is_first_payment: isSubscription, // 정기결제인 경우 첫 결제
      };
      
      console.log('주문 데이터:', orderData);

      const orderResponse = await api.orders.create(orderData);
      const orderId = orderResponse.data.order.id;
      
      // 주문 아이템 생성 (이미 구매한 상품은 제외)
      const validItems = cartItems.filter(item => !item.is_purchased);
      
      if (validItems.length === 0) {
        message.error(t('purchase.messages.noItemsToPurchase'));
        setIsProcessing(false);
        return;
      }
      
      if (validItems.length < cartItems.length) {
        message.warning(t('purchase.messages.alreadyPurchasedWarning'));
      }
      
      await Promise.all(validItems.map(item => 
        api.orderItems.create({
          order_id: orderId,
          product_id: item.id,
          quantity: 1,
          unit_price: item.price,
          has_review: false
        })
      ));

      // 쿠폰이 적용된 경우 주문 쿠폰 생성
      const couponId = appliedCoupon && appliedCoupon.couponId ? appliedCoupon.couponId : null;
      if (couponId) {
        await api.orderCoupons.create({
          order_id: orderId,
          user_id: user.id,
          coupon_id: couponId,
          applied_value: discount
        });
      }

      // 정기결제인 경우 구독 생성
      if (isSubscription) {
        try {
          // paymentMethod에서 card_id 가져오기
          // paymentMethod 구조: { id, card_id, user_id, ... }
          let cardId = paymentMethod.card_id;
          
          // card_id가 없으면 paymentMethod를 다시 조회하여 확인
          if (!cardId) {
            const paymentMethodDetail = await api.paymentMethods.getById(paymentMethod.id);
            cardId = paymentMethodDetail.data?.paymentMethod?.card_id;
          }
          
          if (!cardId) {
            throw new Error('카드 정보를 찾을 수 없습니다.');
          }

          // 사용자 언어 설정 (기본값: ko)
          const userLanguage = currentUser?.preferred_language || 'ko';

          // 구독 생성
          await api.subscriptions.create({
            orderId: orderId,
            cardId: cardId,
            couponId: couponId,
            userLanguage: userLanguage
          });

          console.log('정기결제 구독이 생성되었습니다.');
        } catch (subscriptionError) {
          console.error('구독 생성 실패:', subscriptionError);
          // 구독 생성 실패해도 주문은 완료되었으므로 경고만 표시
          message.warning(t('purchase.messages.subscriptionCreateFail'));
        }
      }

      // 다음 결제일 계산 (한 달 후 말일)
      const getNextPaymentDate = () => {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // 다음 달 말일
        return nextMonth;
      };

      // 주문 정보를 sessionStorage에 저장 (confirmation 페이지에서 사용)
      const orderInfo = {
        orderId: orderId,
        orderNumber: orderResponse.data.order?.order_number || `ORD-${Date.now()}`,
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price
        })),
        total: total,
        orderDate: new Date().toISOString(),
        isSubscription: isSubscription,
        nextPaymentDate: isSubscription ? getNextPaymentDate().toISOString() : null
      };
      sessionStorage.setItem('lastOrder', JSON.stringify(orderInfo));

      // 장바구니 비우기 (API 사용)
      try {
        await api.carts.clear(user.id);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        // 장바구니 비우기 실패해도 주문은 완료되었으므로 계속 진행
      }
      
      // 쿠폰 정보 제거 (결제 완료 후)
      localStorage.removeItem('purchaseCouponCode');
      localStorage.removeItem('purchaseAppliedCoupon');

      // 구매 확정 페이지로 이동
      history.push('/confirmation');
    } catch (error) {
      console.error('Failed to create order:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = t('purchase.messages.orderCreateFail');
      
      if (error.response) {
        // 서버에서 반환한 에러 메시지
        errorMessage = error.response.data?.error || errorMessage;
        
        // HTTP 상태 코드에 따른 메시지
        if (error.response.status === 400) {
          errorMessage = t('purchase.messages.requestError', { message: errorMessage });
        } else if (error.response.status === 401) {
          errorMessage = t('purchase.messages.authRequired');
          history.push('/login');
        } else if (error.response.status === 500) {
          errorMessage = t('purchase.messages.serverError', { message: errorMessage });
        }
      } else if (error.request) {
        errorMessage = t('purchase.messages.networkError');
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      message.error(errorMessage, 5);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#FAFAFA' }}>
      <PurchaseHeader />

      <main className="max-w-[1400px] mx-auto px-5 md:px-12 py-10">
        <div className="mb-10">
          <h1 className="flex items-center gap-3 text-4xl font-bold text-gray-900 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {t('purchase.header.title')}
          </h1>
          <p className="text-base text-gray-500">
            {t('purchase.header.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">{t('common.loading')}</div>
          </div>
        ) : cartItems.length === 0 && availableCartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* 장바구니 아이템 */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))}

              {/* 바로 구매 모드일 때 장바구니에 있는 다른 상품들 표시 */}
              {buyNowItem && availableCartItems.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('purchase.availableCartItems.title')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('purchase.availableCartItems.description')}
                  </p>
                  <div className="space-y-3">
                    {availableCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold">
                            {item.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <div className="flex gap-2 mt-1">
                              {item.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            ¥{item.price.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => addCartItemToPurchase(item)}
                          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transition shadow-sm hover:shadow-md"
                          title={t('purchase.availableCartItems.addToPurchase')}
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              {/* sticky 컨테이너: 주문 요약 + 보증 정보 함께 고정 */}
              <div className="sticky top-24">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={originalSubtotal}
                  studentDiscount={studentDiscount}
                  discount={discount}
                  tax={tax}
                  total={total}
                  appliedCoupon={appliedCoupon}
                  isStudent={isStudentActive()}
                  onCheckout={handleCheckout}
                  isProcessing={isProcessing}
                  isSubscription={isSubscription}
                  onSubscriptionChange={setIsSubscription}
                />

                {/* 쿠폰 */}
                <CouponSection
                  couponCode={couponCode}
                  onCouponCodeChange={handleCouponCodeChange}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                  appliedCoupon={appliedCoupon}
                />

                {/* 보증 정보 */}
                <PurchaseProtection />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

