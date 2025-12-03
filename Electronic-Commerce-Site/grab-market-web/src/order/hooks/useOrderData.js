import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';

export function useOrderData(orderId) {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = useCallback(async () => {
    try {
      // 주문 정보 가져오기
      const orderResponse = await api.orders.getById(orderId);
      const orderData = orderResponse.data.order;
      setOrder(orderData);

      // 주문 아이템 가져오기
      const itemsResponse = await api.orderItems.getByOrder(orderId);
      const items = itemsResponse.data?.orderItems || [];

      // 각 아이템의 상품 정보 가져오기
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const productResponse = await axios.get(`${API_URL}/api/products/${item.product_id}`);
            return {
              ...item,
              product: productResponse.data.product,
              tags: productResponse.data.tags || []
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.product_id}:`, error);
            return { ...item, product: null };
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

