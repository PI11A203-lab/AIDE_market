import { useState, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { api } from '../../config/api';
import { clearRatingCache, setRatingCache } from '../../utils/ratingCache';

export function useReviewForm(orderItems, setOrderItems, reloadOrderData) {
  const [reviewForms, setReviewForms] = useState({});

  // 리뷰 폼 초기화
  const initializeReviewForms = useCallback((items) => {
    const forms = {};
    items.forEach(item => {
      forms[item.id] = {
        rating: 0,
        title: '',
        comment: '',
        images: [],
        submitting: false
      };
    });
    setReviewForms(forms);
  }, []);

  const handleRatingClick = useCallback((itemId, rating) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating
      }
    }));
  }, []);

  const handleCommentChange = useCallback((itemId, comment) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  }, []);

  const handleTitleChange = useCallback((itemId, title) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        title
      }
    }));
  }, []);

  const handleImageChange = useCallback((itemId, fileList) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: fileList
      }
    }));
  }, []);

  const handleImageRemove = useCallback((itemId, file) => {
    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: prev[itemId].images.filter(img => img.uid !== file.uid)
      }
    }));
  }, []);

  const handleSubmitReview = useCallback(async (itemId, productId) => {
    const form = reviewForms[itemId];
    
    if (!form.rating || form.rating === 0) {
      message.warning('별점을 선택해주세요.');
      return;
    }

    // 이미 리뷰가 작성되었는지 확인
    const orderItem = orderItems.find(item => item.id === itemId);
    if (orderItem?.has_review) {
      message.warning('이미 리뷰를 작성하셨습니다.');
      return;
    }

    // 사용자 정보 가져오기
    const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userFromStorage) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    let user;
    try {
      user = JSON.parse(userFromStorage);
    } catch (e) {
      message.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setReviewForms(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        submitting: true
      }
    }));

    // 이미지 업로드 처리
    let imageUrls = [];
    if (form.images && form.images.length > 0) {
      try {
        const uploadPromises = form.images.map(async (img) => {
          if (img.response?.imageUrl) {
            return img.response.imageUrl;
          } else if (img.originFileObj) {
            const formData = new FormData();
            formData.append('image', img.originFileObj);
            const uploadResponse = await api.upload.image(formData);
            return uploadResponse.data.imageUrl;
          }
          return null;
        });
        
        imageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
      } catch (error) {
        console.error('Failed to upload images:', error);
        message.warning('이미지 업로드에 실패했습니다. 리뷰는 작성되지만 이미지는 포함되지 않습니다.');
      }
    }

    try {
      await api.reviews.create({
        user_id: user.id,
        product_id: productId,
        order_item_id: itemId,
        rating: form.rating,
        title: form.title.trim() || null,
        review_text: form.comment.trim() || null,
        review_images: imageUrls.length > 0 ? imageUrls : null
      });

      message.success('리뷰가 작성되었습니다!');

      // 해당 상품의 별점 캐시 삭제 후 최신 별점으로 갱신
      clearRatingCache(productId);
      
      // 리뷰 작성 후 상품의 최신 별점 정보 가져와서 캐시 갱신
      try {
        const productResponse = await axios.get(`${API_URL}/api/products/${productId}`);
        const updatedProduct = productResponse.data?.product;
        if (updatedProduct) {
          setRatingCache(
            productId,
            updatedProduct.rating_average || 0,
            updatedProduct.rating_count || 0
          );
        }
      } catch (error) {
        console.error('Failed to update rating cache:', error);
      }

      // 주문 아이템의 has_review 업데이트
      setOrderItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, has_review: true } : item
      ));

      // 리뷰 폼 초기화
      setReviewForms(prev => ({
        ...prev,
        [itemId]: {
          rating: 0,
          title: '',
          comment: '',
          images: [],
          submitting: false
        }
      }));

      // 주문 데이터 새로고침
      await reloadOrderData();
    } catch (error) {
      console.error('Failed to submit review:', error);
      const errorMessage = error.response?.data?.error || '리뷰 작성에 실패했습니다.';
      message.error(errorMessage);
      setReviewForms(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          submitting: false
        }
      }));
    }
  }, [reviewForms, orderItems, setOrderItems, reloadOrderData]);

  return {
    reviewForms,
    initializeReviewForms,
    handleRatingClick,
    handleCommentChange,
    handleTitleChange,
    handleImageChange,
    handleImageRemove,
    handleSubmitReview
  };
}

