import React from 'react';
import { ShoppingBag, Star, Users, Heart } from 'lucide-react';

export default function StatsSection({ stats, onStatClick }) {
  return (
    <div className="profile-stats">
      <div className="stat-card" onClick={() => onStatClick && onStatClick('purchases')} style={{ cursor: 'pointer' }}>
        <ShoppingBag className="stat-icon" />
        <div className="stat-number">{stats.purchases}</div>
        <div className="stat-label">Purchases</div>
      </div>
      <div className="stat-card" onClick={() => onStatClick && onStatClick('reviews')} style={{ cursor: 'pointer' }}>
        <Star className="stat-icon" />
        <div className="stat-number">{stats.reviews}</div>
        <div className="stat-label">Reviews</div>
      </div>
      <div className="stat-card" onClick={() => onStatClick && onStatClick('teams')} style={{ cursor: 'pointer' }}>
        <Users className="stat-icon" />
        <div className="stat-number">{stats.teams}</div>
        <div className="stat-label">Teams</div>
      </div>
      <div className="stat-card" onClick={() => onStatClick && onStatClick('favorites')} style={{ cursor: 'pointer' }}>
        <Heart className="stat-icon" />
        <div className="stat-number">{stats.favorites}</div>
        <div className="stat-label">Favorites</div>
      </div>
    </div>
  );
}

