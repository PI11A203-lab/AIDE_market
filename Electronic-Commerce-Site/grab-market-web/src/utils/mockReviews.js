/**
 * 상품별 Mock 리뷰 생성 (상품 상세 페이지 및 리뷰 관리 페이지에서 공통 사용)
 * @param {number} productId - 상품 ID
 * @param {number} reviewCount - 생성할 리뷰 수
 * @param {string} productName - 상품명
 * @returns {Array} mock 리뷰 배열 (상품 상세용 형식: author, text, date, helpful 등)
 */
export function generateMockReviews(productId, reviewCount, productName) {
  const getRandom = (currentSeed) => {
    const newSeed = (currentSeed * 9301 + 49297) % 233280;
    return { value: newSeed / 233280, seed: newSeed };
  };

  const developerTypes = [
    'フルスタック開発者', 'フロントエンド開発者', 'バックエンド開発者', 'モバイル開発者',
    'データサイエンティスト', '機械学習エンジニア', 'DevOpsエンジニア', 'UI/UXデザイナー',
    'QAエンジニア', 'セキュリティエンジニア'
  ];

  const nicknames = [
    'nana', 'taro', 'hanako', 'sato', 'yamada', 'tanaka', 'watanabe', 'ito', 'nakamura', 'kobayashi',
    'kato', 'yoshida', 'yamamoto', 'suzuki', 'saito', 'matsumoto', 'inoue', 'kimura', 'hayashi', 'shimizu',
    'yamaguchi', 'mori', 'abe', 'okada', 'goto', 'hasegawa', 'ishida', 'sasaki', 'fujita', 'endo',
    'aoki', 'fukuda', 'nishimura', 'miura', 'takagi', 'okamoto', 'maeda', 'fujii', 'nakajima', 'harada',
    'ono', 'tamura', 'takeuchi', 'kaneko', 'wada', 'nakagawa', 'ishikawa', 'ueda', 'morita', 'hirai'
  ];

  const reviewTitles = [
    '素晴らしい商品です', '期待以上の品質', 'とても満足しています', '使いやすくて便利',
    '高品質なサービス', 'おすすめです', '期待通りでした', '価格以上の価値', '迅速な対応',
    'プロフェッショナル', '優れたパフォーマンス', '完璧なソリューション', '信頼できる開発者',
    '丁寧なサポート', '革新的なアプローチ'
  ];

  const reviewTexts = [
    'この商品は期待以上の品質でした。非常に満足しています。',
    '使いやすく、機能も充実しています。おすすめです。',
    'プロフェッショナルな対応で、迅速に問題を解決していただきました。',
    '価格以上の価値があると思います。今後も利用したいです。',
    '高品質なサービスで、期待通りでした。',
    '優れたパフォーマンスと丁寧なサポートに感謝しています。',
    '革新的なアプローチで、ビジネスに大きな価値をもたらしました。',
    '信頼できる開発者で、安心して依頼できます。',
    '完璧なソリューションを提供していただき、ありがとうございました。',
    '非常に満足しています。また利用したいと思います。'
  ];

  const lowRatingTitles = [
    '改善の余地があります', '期待していたものと違いました', 'もう少し検討が必要',
    '機能が限定的でした', 'サポートが不十分でした'
  ];

  const lowRatingTexts = [
    '期待していた機能が一部不足していました。改善を期待します。',
    '基本的な機能は動作しますが、もう少し使いやすさが向上すると良いと思います。',
    '価格に対して機能が限定的でした。',
    'サポート対応がもう少し迅速だと良いと思います。',
    '全体的には問題ありませんが、いくつか改善点があります。'
  ];

  const mockReviews = [];
  const now = new Date();

  for (let i = 0; i < reviewCount; i++) {
    let currentSeed = productId + i;
    const getNextRandom = () => {
      const result = getRandom(currentSeed);
      currentSeed = result.seed;
      return result.value;
    };

    const includeLowRatings = productId % 2 === 0;
    let rating, titleIndex, textIndex;
    const randomValue = getNextRandom();

    if (includeLowRatings && randomValue < 0.08) {
      rating = Math.floor(getNextRandom() * 2) + 1;
      titleIndex = Math.floor(getNextRandom() * lowRatingTitles.length);
      textIndex = Math.floor(getNextRandom() * lowRatingTexts.length);
    } else {
      rating = Math.floor(getNextRandom() * 3) + 3;
      titleIndex = Math.floor(getNextRandom() * reviewTitles.length);
      textIndex = Math.floor(getNextRandom() * reviewTexts.length);
    }

    const ratingDecimal = getNextRandom() < 0.3 ? 0.5 : 0;
    const finalRating = rating + ratingDecimal;
    const nickname = nicknames[Math.floor(getNextRandom() * nicknames.length)];
    const developerType = developerTypes[Math.floor(getNextRandom() * developerTypes.length)];
    const daysAgo = Math.floor(getNextRandom() * 365);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - daysAgo);
    const helpfulCount = Math.floor(getNextRandom() * 20);

    mockReviews.push({
      id: `mock_${productId}_${i}`,
      author: nickname,
      avatar: nickname.substring(0, 2).toUpperCase(),
      rating: finalRating,
      title: (rating <= 2 ? lowRatingTitles : reviewTitles)[titleIndex],
      text: (rating <= 2 ? lowRatingTexts : reviewTexts)[textIndex],
      review_images: [],
      date: reviewDate.toISOString(),
      project: productName,
      helpful: helpfulCount,
      is_helpful: false,
      isCurrentUser: false,
      developer_type: developerType,
    });
  }

  return mockReviews;
}

/**
 * 상품 상세용 mock 리뷰를 Admin 리뷰 관리용 형식으로 변환
 */
export function toAdminReviewFormat(mockReview, product) {
  return {
    id: mockReview.id,
    rating: mockReview.rating,
    comment: mockReview.text || '',
    review_text: mockReview.text || '',
    created_at: mockReview.date,
    helpful_count: mockReview.helpful || 0,
    verified: false,
    user: { username: mockReview.author || 'User', email: '' },
    product: {
      id: product?.id,
      name: product?.name || mockReview.project,
      image: product?.image || null,
      icon: product?.icon || '📦',
    },
  };
}
