import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { message } from 'antd';
import PurchaseHeader from './components/PurchaseHeader';
import CartItem from './components/CartItem';
import CouponSection from './components/CouponSection';
import OrderSummary from './components/OrderSummary';
import PurchaseProtection from './components/PurchaseProtection';
import PaymentForm from './components/PaymentForm';
import EmptyCart from './components/EmptyCart';
import { API_URL } from '../config/constants';
import { api } from '../config/api';
import './index.css';

export default function PurchasePage() {
  const history = useHistory();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null); // 바로 구매 상품
  const [availableCartItems, setAvailableCartItems] = useState([]); // 장바구니에 있는 다른 상품들
  const [selectedCartItems, setSelectedCartItems] = useState([]); // 선택된 장바구니 상품들
  const [loading, setLoading] = useState(true);

  // 상품 정보를 가져오는 함수
  const fetchProduct = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/products/${id}`);
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
        // URL 파라미터에서 buyNow 확인
        const searchParams = new URLSearchParams(location.search);
        const buyNowId = searchParams.get('buyNow');

        if (buyNowId) {
          // 바로 구매 모드: 해당 상품만 표시
          const product = await fetchProduct(buyNowId);
          setBuyNowItem(product);
          setCartItems([product]);

          // 장바구니에 있는 다른 상품들도 가져오기 (하단에 표시용)
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const cartItemIds = JSON.parse(savedCart);
              // 바로 구매 상품 제외한 다른 상품들
              const otherItemIds = cartItemIds.filter(id => id.toString() !== buyNowId.toString());
              if (otherItemIds.length > 0) {
                const otherItems = await Promise.all(
                  otherItemIds.map(id => fetchProduct(id))
                );
                setAvailableCartItems(otherItems);
              }
            } catch (e) {
              console.error('Failed to parse cart data:', e);
            }
          }
        } else {
          // 일반 장바구니 모드: 장바구니의 모든 상품 표시
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const cartItemIds = JSON.parse(savedCart);
              const items = await Promise.all(
                cartItemIds.map(id => fetchProduct(id))
              );
              setCartItems(items);
            } catch (e) {
              console.error('Failed to parse cart data:', e);
            }
          }
        }
      } catch (error) {
        console.error('エラー発生 : ', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.search]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // 장바구니에서 제거
  const removeFromCart = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    // 선택된 장바구니 상품에서도 제거
    setSelectedCartItems(selectedCartItems.filter(id => id !== itemId));
    // localStorage도 업데이트
    const updatedIds = updatedItems.map(item => item.id);
    localStorage.setItem('cart', JSON.stringify(updatedIds));
  };

  // 장바구니 상품 선택/해제
  const toggleCartItemSelection = (itemId) => {
    setSelectedCartItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 선택된 장바구니 상품들을 결제 목록에 추가
  const addSelectedToCart = () => {
    const selectedItems = availableCartItems.filter(item => 
      selectedCartItems.includes(item.id) && 
      !cartItems.some(cartItem => cartItem.id === item.id) // 중복 체크
    );
    setCartItems([...cartItems, ...selectedItems]);
    setSelectedCartItems([]);
    // 추가된 상품들을 availableCartItems에서 제거
    setAvailableCartItems(availableCartItems.filter(item => 
      !selectedCartItems.includes(item.id)
    ));
  };

  // 쿠폰 적용
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning('쿠폰 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await api.coupons.validate(couponCode, subtotal);
      const couponData = response.data.coupon;
      const discountAmount = parseFloat(response.data.discountAmount);
      
      setAppliedCoupon({
        code: couponData.code,
        discount: discountAmount / subtotal,
        discountAmount: discountAmount,
        label: couponData.discount_type === 'rate' 
          ? `${couponData.discount_value}% OFF`
          : `¥${discountAmount.toLocaleString()} OFF`,
        couponId: couponData.coupon_id
      });
      message.success('쿠폰이 적용되었습니다.');
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      const errorMessage = error.response?.data?.error || '쿠폰 적용에 실패했습니다.';
      message.error(errorMessage);
    }
  };

  // 가격 계산 (현재 결제 목록의 상품들만)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = appliedCoupon ? (appliedCoupon.discountAmount || subtotal * appliedCoupon.discount) : 0;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    // 사용자 정보 확인
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      return;
    }

    // 결제 폼 표시
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (cardData) => {
    setPaymentData(cardData);
    
    // 사용자 정보 확인
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      history.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userFromStorage);
      
      // 주문 생성
      const orderData = {
        user_id: user.id,
        total_amount: total,
        payment_method: 'credit_card',
        card_company: cardData.cardCompany,
        card_number: cardData.cardNumber.replace(/\s/g, ''),
        card_cvc: cardData.cardCvc,
        exp_month: parseInt(cardData.expMonth),
        exp_year: parseInt(cardData.expYear),
        status: 'pending',
      };

      const orderResponse = await api.orders.create(orderData);
      const orderId = orderResponse.data.order.id;
      
      // 주문 아이템 생성
      await Promise.all(cartItems.map(item => 
        api.orderItems.create({
          order_id: orderId,
          product_id: item.id,
          quantity: 1,
          unit_price: item.price,
          has_review: false
        })
      ));

      // 쿠폰이 적용된 경우 주문 쿠폰 생성
      if (appliedCoupon && appliedCoupon.couponId) {
        await api.orderCoupons.create({
          order_id: orderId,
          user_id: user.id,
          coupon_id: appliedCoupon.couponId,
          applied_value: discount
        });
      }

      // 장바구니 비우기
      localStorage.removeItem('cart');

      // 구매 확정 페이지로 이동
      history.push('/confirmation');
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMessage = error.response?.data?.error || '주문 생성에 실패했습니다.';
      message.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PurchaseHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-900 mb-2">
            <ShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h2>
          <p className="text-gray-600">
            Review your selected AI developers before purchase
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : cartItems.length === 0 && availableCartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 */}
            <div className="lg:col-span-2 space-y-4">
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
                    カートに追加された商品
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    一緒に購入したい商品を選択してください
                  </p>
                  <div className="space-y-3">
                    {availableCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCartItems.includes(item.id)}
                          onChange={() => toggleCartItemSelection(item.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
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
                      </div>
                    ))}
                  </div>
                  {selectedCartItems.length > 0 && (
                    <button
                      onClick={addSelectedToCart}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      選択した商品を追加 ({selectedCartItems.length})
                    </button>
                  )}
                </div>
              )}

              {/* 쿠폰 */}
              <CouponSection
                couponCode={couponCode}
                onCouponCodeChange={setCouponCode}
                onApplyCoupon={applyCoupon}
                appliedCoupon={appliedCoupon}
              />

              {/* 결제 폼 */}
              {showPaymentForm && (
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  isLoading={false}
                />
              )}
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                discount={discount}
                tax={tax}
                total={total}
                appliedCoupon={appliedCoupon}
                onCheckout={handleCheckout}
                showPaymentForm={showPaymentForm}
              />

              {/* 보증 정보 */}
              <PurchaseProtection />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

