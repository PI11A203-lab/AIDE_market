import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import StarRating from '../../components/StarRating';
import { useTranslation } from 'react-i18next';
import { getReviewContent } from '../../../../../utils/getReviewContent';

export default function LatestReviewSection({ latestReview, productId, formatDate }) {
  const { t, i18n } = useTranslation();
  const displayComment = latestReview ? getReviewContent(latestReview, i18n.language) : '';
  return (
    <section className="admin-product-detail__review">
      <div className="section-header">
        <div>
          <div className="section-title">{t('productAdmin.detail.latestReview.title')}</div>
          <div className="section-subtitle">{t('productAdmin.detail.latestReview.subtitle')}</div>
        </div>
        <Link to={`/products/${productId}#reviews`} className="view-all">
          {t('productAdmin.detail.latestReview.viewAll')}
          <ExternalLink size={14} />
        </Link>
      </div>
      {latestReview ? (
        <div className="review-card">
          <div className="review-avatar">
            {(latestReview.author || 'A').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="review-header">
              <div className="review-author">{latestReview.author}</div>
              <StarRating rating={latestReview.rating} />
            </div>
            <div className="review-date">{formatDate(latestReview.date)}</div>
            <p className="review-comment">{displayComment || t('productAdmin.detail.latestReview.noComment')}</p>
          </div>
        </div>
      ) : (
        <div className="review-empty">{t('productAdmin.detail.latestReview.noReview')}</div>
      )}
    </section>
  );
}

