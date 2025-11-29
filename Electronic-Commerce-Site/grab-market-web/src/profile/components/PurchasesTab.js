import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { api } from '../../config/api';

export default function PurchasesTab({ orders }) {
  const history = useHistory();
  const [orderItemCounts, setOrderItemCounts] = useState({});

  // 각 주문의 아이템 개수 가져오기
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const fetchItemCounts = async () => {
      const counts = {};
      
      // 모든 주문의 아이템 개수를 병렬로 가져오기
      const promises = orders.map(async (order) => {
        try {
          const response = await api.orderItems.getByOrder(order.id);
          const items = response.data?.orderItems || [];
          return { orderId: order.id, count: items.length };
        } catch (error) {
          console.error(`Failed to fetch items for order ${order.id}:`, error);
          return { orderId: order.id, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(({ orderId, count }) => {
        counts[orderId] = count;
      });

      setOrderItemCounts(counts);
    };

    fetchItemCounts();
  }, [orders]);

  // 주문 목록을 날짜별로 그룹화
  const groupOrdersByDate = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    const grouped = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.purchased_at || order.createdAt || Date.now());
      const dateKey = orderDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
    });
    
    // 날짜순으로 정렬 (최신순)
    return Object.entries(grouped).sort((a, b) => {
      return new Date(b[1][0].purchased_at || b[1][0].createdAt) - 
             new Date(a[1][0].purchased_at || a[1][0].createdAt);
    });
  };

  const handleOrderClick = (orderId) => {
    history.push(`/order/${orderId}`);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">주문 내역이 없습니다</p>
        <p className="text-gray-500 text-sm mt-2">구매한 AI 개발자들이 여기에 표시됩니다</p>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);

  return (
    <div className="purchases-container">
      {groupedOrders.map(([date, dateOrders]) => (
        <div key={date} className="order-date-group">
          <h3 className="order-date-header">{date}</h3>
          <div className="orders-list">
            {dateOrders.map((order) => {
              const itemCount = orderItemCounts[order.id] ?? 0;
              return (
                <div
                  key={order.id}
                  className="order-card"
                  onClick={() => handleOrderClick(order.id)}
                >
                  <div className="order-card-header">
                    <div className="order-info">
                      <span className="order-number">주문번호: {order.order_number || `ORD-${order.id}`}</span>
                      <span className="order-status">{order.status === 'pending' ? '결제 대기' : order.status === 'completed' ? '완료' : order.status}</span>
                    </div>
                    <ChevronRight className="order-arrow" />
                  </div>
                  <div className="order-card-body">
                    <div className="order-summary">
                      <span className="order-total-label">총 주문 금액</span>
                      <span className="order-total-amount">¥{order.total_amount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-item-count">{itemCount}개 주문</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
