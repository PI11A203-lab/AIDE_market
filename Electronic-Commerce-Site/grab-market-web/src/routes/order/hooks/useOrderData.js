import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { API_URL } from '../../../config/constants';
import { api } from '../../../config/api';

export function useOrderData(orderId) {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = useCallback(async () => {
    try {
      // 주문 정보 가져오기 (orderItems, orderCoupons 포함)
      const orderResponse = await api.orders.getById(orderId);
      const orderData = orderResponse.data.order;
      setOrder(orderData);

      // ⚠️ 새로운 API 응답 구조: orderItems가 이미 포함되어 있음
      const items = orderData.orderItems || [];

      // 각 아이템의 상품 정보가 이미 포함되어 있지만, 태그 정보가 없을 수 있으므로 확인
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          // product 정보가 이미 포함되어 있는 경우
          if (item.product) {
            // 태그 정보가 없으면 가져오기
            if (!item.tags && item.product.id) {
              try {
                const productResponse = await axios.get(`${API_URL}/api/products/${item.product.id}`);
                return {
                  ...item,
                  product: productResponse.data.product,
                  tags: productResponse.data.tags || []
                };
              } catch (error) {
                console.error(`Failed to fetch tags for product ${item.product.id}:`, error);
                return { ...item, tags: [] };
              }
            }
            return { ...item, tags: item.tags || [] };
          }
          
          // product 정보가 없는 경우 (하위 호환성)
          try {
            const productResponse = await axios.get(`${API_URL}/api/products/${item.product_id}`);
            return {
              ...item,
              product: productResponse.data.product,
              tags: productResponse.data.tags || []
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.product_id}:`, error);
            return { ...item, product: null, tags: [] };
          }
        })
      );

      setOrderItems(itemsWithProducts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load order data:', error);
      message.error('주문 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  return {
    order,
    orderItems,
    setOrderItems,
    loading,
    reloadOrderData: loadOrderData
  };
}

