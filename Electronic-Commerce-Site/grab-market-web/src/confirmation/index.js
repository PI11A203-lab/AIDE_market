import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SuccessMessage from './components/SuccessMessage';
import EmailNotification from './components/EmailNotification';
import PurchasedAIList from './components/PurchasedAIList';
import OrderSummary from './components/OrderSummary';
import ActionButtons from './components/ActionButtons';
import SupportInfo from './components/SupportInfo';
import { API_URL } from '../config/constants';
import './index.css';

export default function PurchaseConfirmation() {
  const [purchasedAIs, setPurchasedAIs] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (userFromStorage) {
        try {
          const user = JSON.parse(userFromStorage);
          setUserEmail(user.email || 'user@example.com');
        } catch (e) {
          setUserEmail('user@example.com');
        }
      }

      // sessionStorage에서 최근 주문 정보 가져오기
      const lastOrderStr = sessionStorage.getItem('lastOrder');
      
      if (lastOrderStr) {
        try {
          const lastOrder = JSON.parse(lastOrderStr);
          
          // 주문 상품 정보 가져오기
          const items = await Promise.all(
            lastOrder.cartItems.map(item => 
              axios.get(`${API_URL}/api/products/${item.id}`)
                .then(res => {
                  const product = res.data.product;
                  return {
                    id: product.id,
                    name: product.name,
                    category: product.category_name || 'NLP',
                    price: product.price,
                    avatar: product.name.substring(0, 2),
                    activationCode: `${product.name.toUpperCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    documentUrl: '#'
                  };
                })
            )
          );
          
          setPurchasedAIs(items);
          
          // 주문 날짜 포맷팅
          const orderDate = new Date(lastOrder.orderDate);
          const formattedDate = orderDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          setOrderDetails({
            orderNumber: lastOrder.orderNumber || 'AIDE-2025-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            orderDate: formattedDate,
            total: lastOrder.total || items.reduce((sum, ai) => sum + ai.price, 0)
          });
          
          // sessionStorage에서 주문 정보 삭제 (한 번만 표시)
          sessionStorage.removeItem('lastOrder');
          
          setLoading(false);
        } catch (error) {
          console.error('주문 정보 로드 실패:', error);
          setLoading(false);
        }
      } else {
        // 주문 정보가 없으면 기본 메시지 표시
        console.warn('주문 정보를 찾을 수 없습니다.');
        setLoading(false);
        // 주문 정보가 없어도 빈 상태로 표시
        setOrderDetails({
          orderNumber: 'N/A',
          orderDate: new Date().toLocaleDateString('en-US'),
          total: 0
        });
      }
    };

    loadOrderData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading || !orderDetails) {
    return (
      <div className="confirmation-page">
        <Header />
        <main className="confirmation-main">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <Header />
      <main className="confirmation-main">
        <SuccessMessage orderNumber={orderDetails.orderNumber} />
        <EmailNotification userEmail={userEmail} onCopyEmail={copyToClipboard} />
        <PurchasedAIList purchasedAIs={purchasedAIs} onCopyCode={copyToClipboard} />
        <OrderSummary orderDetails={orderDetails} purchasedAIs={purchasedAIs} />
        <ActionButtons />
        <SupportInfo />
      </main>
    </div>
  );
}

