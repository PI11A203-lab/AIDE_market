import React from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../../../../config/api';
import RatingStars from '../RatingStars';
import './index.css';

export default function ReviewForm({
  itemId,
  productId,
  hasReview,
  reviewForm,
  onRatingClick,
  onTitleChange,
  onCommentChange,
  onImageChange,
  onImageRemove,
  onSubmitReview
}) {
  if (hasReview) {
    return (
      <div className="review-completed">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>리뷰가 작성되었습니다</span>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h4 className="review-title">리뷰 작성</h4>

      {/* 별점 */}
      <div className="rating-section">
        <span className="rating-label">별점:</span>
        <RatingStars
          rating={reviewForm.rating || 0}
          onRatingClick={(rating) => onRatingClick(itemId, rating)}
          interactive={true}
        />
      </div>

      {/* 리뷰 제목 */}
      <div className="form-group">
        <label className="form-label">리뷰 제목</label>
        <input
          type="text"
          className="form-input"
          placeholder="리뷰 제목을 입력해주세요 (선택사항)"
          value={reviewForm.title || ''}
          onChange={(e) => onTitleChange(itemId, e.target.value)}
          maxLength={200}
        />
      </div>

      {/* 리뷰 내용 */}
      <div className="form-group">
        <label className="form-label">리뷰 내용</label>
        <textarea
          className="form-textarea"
          placeholder="리뷰를 작성해주세요... (선택사항)"
          value={reviewForm.comment || ''}
          onChange={(e) => onCommentChange(itemId, e.target.value)}
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="form-group">
        <label className="form-label">사진 추가 (선택사항)</label>
        <div className="image-upload-area">
          <Upload
            listType="picture-card"
            fileList={reviewForm.images || []}
            onChange={({ fileList }) => onImageChange(itemId, fileList)}
            onRemove={(file) => onImageRemove(itemId, file)}
            beforeUpload={(file) => {
              // 이미지 파일만 허용
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('이미지 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
              }
              // 파일 크기 제한 (5MB)
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                message.error('이미지 크기는 5MB 이하여야 합니다.');
                return Upload.LIST_IGNORE;
              }
              return false; // 자동 업로드 방지
            }}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const formData = new FormData();
                formData.append('image', file);
                const response = await api.upload.image(formData);
                onSuccess({ ...file, response: response.data }, file);
              } catch (error) {
                onError(error);
                message.error('이미지 업로드에 실패했습니다.');
              }
            }}
            maxCount={5}
          >
            {(reviewForm.images || []).length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>업로드</div>
              </div>
            )}
          </Upload>
        </div>
      </div>

      <button
        className="btn-submit"
        onClick={() => onSubmitReview(itemId, productId)}
        disabled={reviewForm.submitting}
      >
        {reviewForm.submitting ? '작성 중...' : '리뷰 작성'}
      </button>
    </div>
  );
}

