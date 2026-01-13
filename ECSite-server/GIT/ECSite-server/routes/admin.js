const express = require('express');
const router = express.Router();
const db = require('../db/initializer');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const { sequelize, Sequelize } = db;
const { QueryTypes } = Sequelize;

// 단일 SELECT 헬퍼
const selectQuery = (sql, replacements = []) =>
  sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

// ============================================
// 1. 대시보드 메인 API
// ============================================

// 통계 카드 데이터 (총 상품, 총 매출, 팔로워, 리뷰)
router.get('/stats', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;

  try {
    // 1. 총 상품 수
    const productsResult = await selectQuery(
      'SELECT COUNT(*) as total FROM products WHERE created_by = ?',
      [adminId]
    );

    // 2. 총 매출 (완료된 주문만)
    const revenueResult = await selectQuery(
      `
      SELECT SUM(oi.unit_price * oi.quantity) as total_revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ? AND o.status = 'completed'
    `,
      [adminId]
    );

    // 2-1. 총 판매 수 (완료된 주문만)
    const salesResult = await selectQuery(
      `
      SELECT COUNT(*) as total_sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ? AND o.status = 'completed'
    `,
      [adminId]
    );

    // 3. 팔로워 수
    const followerResult = await selectQuery(
      'SELECT follower_count FROM users WHERE id = ?',
      [adminId]
    );

    // 4. 리뷰 수
    const reviewResult = await selectQuery(
      `
      SELECT COUNT(*) as total_reviews
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
    `,
      [adminId]
    );

    res.json({
      total_products: productsResult[0]?.total || 0,
      total_sales: salesResult[0]?.total_sales || 0,
      total_revenue: revenueResult[0]?.total_revenue || 0,
      followers: followerResult[0]?.follower_count || 0,
      total_reviews: reviewResult[0]?.total_reviews || 0,
      // 하위 호환성을 위한 필드명
      totalProducts: productsResult[0]?.total || 0,
      totalSales: salesResult[0]?.total_sales || 0,
      totalRevenue: revenueResult[0]?.total_revenue || 0,
      totalReviews: reviewResult[0]?.total_reviews || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 월별 매출 추이 그래프 (2025년 4월부터 2026년 3월까지)
router.get('/sales-chart', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;

  try {
    const results = await selectQuery(
      `
      SELECT 
        DATE_FORMAT(o.purchased_at, '%Y-%m') as month,
        SUM(oi.unit_price * oi.quantity) as revenue,
        COUNT(DISTINCT o.id) as sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ?
        AND o.status = 'completed'
        AND o.purchased_at >= '2025-04-01 00:00:00'
        AND o.purchased_at < '2026-04-01 00:00:00'
      GROUP BY DATE_FORMAT(o.purchased_at, '%Y-%m')
      ORDER BY month ASC
    `,
      [adminId]
    );

    // 2025년 4월부터 2026년 3월까지 전체 데이터 생성 (빈 달은 0으로)
    const monthlyData = [];
    const startYear = 2025;
    const startMonth = 4; // 4월부터 시작
    const endYear = 2026;
    const endMonth = 3; // 3월까지

    // 2025년 4월부터 12월까지
    for (let month = startMonth; month <= 12; month++) {
      const monthStr = `${startYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        revenue: found ? parseFloat(found.revenue) || 0 : 0,
        sales: found ? parseInt(found.sales) || 0 : 0,
      });
    }

    // 2026년 1월부터 3월까지
    for (let month = 1; month <= endMonth; month++) {
      const monthStr = `${endYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        revenue: found ? parseFloat(found.revenue) || 0 : 0,
        sales: found ? parseInt(found.sales) || 0 : 0,
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Sales chart error:', error);
    res.status(500).json({ error: 'Failed to fetch sales chart' });
  }
});

// 쿠폰 사용량 그래프 (2025년 4월부터 2026년 3월까지, 월별)
router.get('/coupon-usage', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;

  try {
    const results = await selectQuery(
      `
      SELECT 
        DATE_FORMAT(oc.created_at, '%Y-%m') as month,
        COUNT(*) as usageCount,
        SUM(oc.applied_value) as discountAmount
      FROM order_coupons oc
      JOIN coupons c ON oc.coupon_id = c.coupon_id
      JOIN orders o ON oc.order_id = o.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ?
        AND o.status = 'completed'
        AND oc.created_at >= '2025-04-01 00:00:00'
        AND oc.created_at < '2026-04-01 00:00:00'
      GROUP BY DATE_FORMAT(oc.created_at, '%Y-%m')
      ORDER BY month ASC
    `,
      [adminId]
    );

    // 2025년 4월부터 2026년 3월까지 전체 데이터 생성 (빈 달은 0으로)
    const monthlyData = [];
    const startYear = 2025;
    const startMonth = 4; // 4월부터 시작
    const endYear = 2026;
    const endMonth = 3; // 3월까지

    // 2025년 4월부터 12월까지
    for (let month = startMonth; month <= 12; month++) {
      const monthStr = `${startYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        usageCount: found ? parseInt(found.usageCount) || 0 : 0,
        discountAmount: found ? parseFloat(found.discountAmount) || 0 : 0,
      });
    }

    // 2026년 1월부터 3월까지
    for (let month = 1; month <= endMonth; month++) {
      const monthStr = `${endYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        usageCount: found ? parseInt(found.usageCount) || 0 : 0,
        discountAmount: found ? parseFloat(found.discountAmount) || 0 : 0,
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Coupon usage error:', error);
    console.error('Error stack:', error.stack);
    // 에러 발생 시에도 빈 배열 반환 (프론트엔드에서 처리)
    res.json([]);
  }
});

// 최근 상품 5개
router.get('/recent-products', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const results = await selectQuery(
      `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.imageUrl,
        c.name as category,
        p.rating_average,
        p.rating_count,
        (SELECT COUNT(*) FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id AND o.status = 'completed') as sales
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.created_by = ?
      ORDER BY p.createdAt DESC
      LIMIT ?
    `,
      [adminId, limit]
    );

    res.json(results);
  } catch (error) {
    console.error('Recent products error:', error);
    res.status(500).json({ error: 'Failed to fetch recent products' });
  }
});

// 최근 리뷰 3개
router.get('/recent-reviews', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const limit = parseInt(req.query.limit, 10) || 3;

  try {
    const results = await selectQuery(
      `
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        r.helpful_count,
        u.username as author,
        p.id as product_id,
        p.name as product_name,
        p.imageUrl as product_image
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `,
      [adminId, limit]
    );

    res.json(results);
  } catch (error) {
    console.error('Recent reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch recent reviews' });
  }
});

// ============================================
// 2. 상품 관리 API
// ============================================

// 상품 목록 (페이지네이션, 검색, 필터, 정렬)
router.get('/products', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const { page = 1, limit = 10, search = '', category = '', sort = 'recent' } =
    req.query;

  const parsedLimit = parseInt(limit, 10);
  const offset = (parseInt(page, 10) - 1) * parsedLimit;

  try {
    // 정렬 조건
    let orderBy = 'p.createdAt DESC';
    if (sort === 'name') orderBy = 'p.name ASC';
    if (sort === 'sales') orderBy = 'sales DESC';
    if (sort === 'rating') orderBy = 'p.rating_average DESC';
    if (sort === 'price') orderBy = 'p.price DESC';

    // 검색/필터 조건
    const whereConditions = ['p.created_by = ?'];
    const params = [adminId];

    if (search) {
      whereConditions.push('p.name LIKE ?');
      params.push(`%${search}%`);
    }

    if (category) {
      whereConditions.push('p.category_id = ?');
      params.push(category);
    }

    const whereClause = whereConditions.join(' AND ');

    // 전체 개수
    const countResult = await selectQuery(
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      params
    );

    // 상품 목록
    const results = await selectQuery(
      `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.imageUrl,
        c.name as category,
        p.rating_average,
        p.rating_count,
        (SELECT COUNT(*) FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id AND o.status = 'completed') as sales
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `,
      [...params, parsedLimit, offset]
    );

    res.json({
      products: results,
      pagination: {
        total: countResult[0]?.total || 0,
        page: parseInt(page, 10),
        limit: parsedLimit,
        totalPages: Math.ceil((countResult[0]?.total || 0) / parsedLimit),
      },
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 상품 상세
router.get('/products/:id', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const productId = req.params.id;

  try {
    const product = await selectQuery(
      `
      SELECT 
        p.*,
        c.name as category_name,
        sc.name as sub_category_name,
        (SELECT COUNT(*) FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id AND o.status = 'completed') as total_sales,
        (SELECT SUM(oi.unit_price * oi.quantity) 
         FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = p.id AND o.status = 'completed') as total_revenue
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
      WHERE p.id = ? AND p.created_by = ?
    `,
      [productId, adminId]
    );

    if (!product.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product[0]);
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// 상품 통계 (판매수/매출/평점)
router.get('/products/:id/stats', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const productId = req.params.id;

  try {
    // 본인 상품인지 확인
    const productOwner = await selectQuery(
      'SELECT created_by, rating_average, rating_count FROM products WHERE id = ?',
      [productId]
    );

    if (!productOwner.length || productOwner[0].created_by !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const totals = await selectQuery(
      `
      SELECT 
        (SELECT COUNT(*) FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = ? AND o.status = 'completed') as total_sales,
        (SELECT SUM(oi.unit_price * oi.quantity) 
         FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.product_id = ? AND o.status = 'completed') as total_revenue
      `,
      [productId, productId]
    );

    res.json({
      totalSales: totals[0]?.total_sales || 0,
      totalRevenue: totals[0]?.total_revenue || 0,
      avgRating: productOwner[0]?.rating_average || 0,
      ratingCount: productOwner[0]?.rating_count || 0,
    });
  } catch (error) {
    console.error('Product stats error:', error);
    res.status(500).json({ error: 'Failed to fetch product stats' });
  }
});

// 상품 월별 판매 차트 (2025년 4월부터 2026년 3월까지)
router.get('/products/:id/sales-chart', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const productId = req.params.id;

  try {
    // 본인 상품인지 확인
    const productOwner = await selectQuery(
      'SELECT created_by FROM products WHERE id = ?',
      [productId]
    );

    if (!productOwner.length || productOwner[0].created_by !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const results = await selectQuery(
      `
      SELECT 
        DATE_FORMAT(o.purchased_at, '%Y-%m') as month,
        SUM(oi.unit_price * oi.quantity) as revenue,
        COUNT(DISTINCT o.id) as sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.product_id = ?
        AND o.status = 'completed'
        AND o.purchased_at >= '2025-04-01 00:00:00'
        AND o.purchased_at < '2026-04-01 00:00:00'
      GROUP BY DATE_FORMAT(o.purchased_at, '%Y-%m')
      ORDER BY month ASC
    `,
      [productId]
    );

    // 2025년 4월부터 2026년 3월까지 전체 데이터 생성 (빈 달은 0으로)
    const monthlyData = [];
    const startYear = 2025;
    const startMonth = 4; // 4월부터 시작
    const endYear = 2026;
    const endMonth = 3; // 3월까지

    // 2025년 4월부터 12월까지
    for (let month = startMonth; month <= 12; month++) {
      const monthStr = `${startYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        revenue: found ? parseFloat(found.revenue) || 0 : 0,
        sales: found ? parseInt(found.sales) || 0 : 0,
      });
    }

    // 2026년 1월부터 3월까지
    for (let month = 1; month <= endMonth; month++) {
      const monthStr = `${endYear}-${String(month).padStart(2, '0')}`;
      const found = results.find((r) => r.month === monthStr);
      monthlyData.push({
        month: monthStr,
        revenue: found ? parseFloat(found.revenue) || 0 : 0,
        sales: found ? parseInt(found.sales) || 0 : 0,
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Product sales chart error:', error);
    res.status(500).json({ error: 'Failed to fetch product sales chart' });
  }
});

// 상품 리뷰 (최근 N개)
router.get('/products/:id/reviews', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const productId = req.params.id;
  const limit = parseInt(req.query.limit, 10) || 3;

  try {
    // 본인 상품인지 확인
    const productOwner = await selectQuery(
      'SELECT created_by FROM products WHERE id = ?',
      [productId]
    );

    if (!productOwner.length || productOwner[0].created_by !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const reviews = await selectQuery(
      `
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        r.helpful_count,
        u.username as author
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `,
      [productId, limit]
    );

    res.json({ reviews });
  } catch (error) {
    console.error('Product reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch product reviews' });
  }
});

// 상품 삭제
router.delete('/products/:id', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const productId = req.params.id;

  try {
    const product = await selectQuery(
      'SELECT created_by FROM products WHERE id = ?',
      [productId]
    );

    if (!product.length || product[0].created_by !== adminId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await sequelize.query('DELETE FROM products WHERE id = ?', {
      replacements: [productId],
      type: QueryTypes.DELETE,
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================
// 3. 판매 내역 API
// ============================================

// 판매 내역 (페이지네이션, 필터)
router.get('/orders', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const {
    page = 1,
    limit = 20,
    dateRange = 'month',
    product = '',
    status = '',
    sort = 'recent',
  } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const offset = (parseInt(page, 10) - 1) * parsedLimit;

  try {
    const where = ['p.created_by = ?'];
    const params = [adminId];

    // 날짜 범위
    if (dateRange === 'today') where.push('o.purchased_at >= CURDATE()');
    if (dateRange === 'week')
      where.push('o.purchased_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    if (dateRange === 'month')
      where.push('o.purchased_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
    if (dateRange === 'quarter')
      where.push('o.purchased_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)');
    if (dateRange === 'year')
      where.push('o.purchased_at >= DATE_SUB(NOW(), INTERVAL 365 DAY)');

    // 상품 필터
    if (product) {
      where.push('p.id = ?');
      params.push(product);
    }

    // 상태 필터
    if (status) {
      where.push('o.status = ?');
      params.push(status);
    }

    // 정렬
    let orderBy = 'o.purchased_at DESC';
    if (sort === 'oldest') orderBy = 'o.purchased_at ASC';
    if (sort === 'amount-high') orderBy = 'o.total_amount DESC';
    if (sort === 'amount-low') orderBy = 'o.total_amount ASC';

    const whereClause = where.join(' AND ');

    // 전체 개수
    const countResult = await selectQuery(
      `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE ${whereClause}
    `,
      params
    );

    // 주문 목록
    const results = await selectQuery(
      `
      SELECT 
        o.id as order_id,
        o.order_number,
        o.total_amount,
        o.status,
        o.purchased_at,
        u.username as buyer_name,
        u.email as buyer_email,
        p.id as product_id,
        p.name as product_name,
        p.imageUrl as product_image,
        oi.quantity,
        oi.unit_price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `,
      [...params, parsedLimit, offset]
    );

    res.json({
      orders: results,
      pagination: {
        total: countResult[0]?.total || 0,
        page: parseInt(page, 10),
        limit: parsedLimit,
        totalPages: Math.ceil((countResult[0]?.total || 0) / parsedLimit),
      },
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 판매 통계
router.get('/orders/stats', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;

  try {
    // 총 주문 수
    const totalOrders = await selectQuery(
      `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ?
    `,
      [adminId]
    );

    // 이번 달 매출
    const thisMonthRevenue = await selectQuery(
      `
      SELECT SUM(oi.unit_price * oi.quantity) as revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ?
        AND o.status = 'completed'
        AND o.purchased_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `,
      [adminId]
    );

    // 상태별 주문 수
    const statusCounts = await selectQuery(
      `
      SELECT 
        o.status,
        COUNT(*) as count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ?
      GROUP BY o.status
    `,
      [adminId]
    );

    // 평균 주문 금액
    const avgOrder = await selectQuery(
      `
      SELECT AVG(o.total_amount) as avg_amount
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.created_by = ? AND o.status = 'completed'
    `,
      [adminId]
    );

    const stats = {
      totalOrders: totalOrders[0]?.total || 0,
      thisMonthRevenue: thisMonthRevenue[0]?.revenue || 0,
      completed: statusCounts.find((s) => s.status === 'completed')?.count || 0,
      pending: statusCounts.find((s) => s.status === 'pending')?.count || 0,
      cancelled:
        statusCounts.find((s) => s.status === 'cancelled')?.count || 0,
      avgOrderValue: avgOrder[0]?.avg_amount || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Orders stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order stats' });
  }
});

// ============================================
// 4. 리뷰 관리 API
// ============================================

// 리뷰 목록 (페이지네이션, 검색, 필터)
router.get('/reviews', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;
  const {
    page = 1,
    limit = 10,
    search = '',
    product = '',
    rating = '',
    sort = 'recent',
  } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const offset = (parseInt(page, 10) - 1) * parsedLimit;

  try {
    const whereConditions = ['p.created_by = ?'];
    const params = [adminId];

    if (search) {
      whereConditions.push('(r.review_text LIKE ? OR u.username LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (product) {
      whereConditions.push('p.id = ?');
      params.push(product);
    }

    if (rating) {
      whereConditions.push('r.rating = ?');
      params.push(rating);
    }

    let orderBy = 'r.created_at DESC';
    if (sort === 'oldest') orderBy = 'r.created_at ASC';
    if (sort === 'rating-high') orderBy = 'r.rating DESC';
    if (sort === 'rating-low') orderBy = 'r.rating ASC';
    if (sort === 'helpful') orderBy = 'r.helpful_count DESC';

    const whereClause = whereConditions.join(' AND ');

    // 전체 개수
    const countResult = await selectQuery(
      `SELECT COUNT(*) as total FROM product_reviews r
       JOIN products p ON r.product_id = p.id
       JOIN users u ON r.user_id = u.id
       WHERE ${whereClause}`,
      params
    );

    // 리뷰 목록
    const results = await selectQuery(
      `
      SELECT 
        r.id,
        r.rating,
        r.review_text,
        r.created_at,
        r.helpful_count,
        u.username as author,
        u.email as author_email,
        p.id as product_id,
        p.name as product_name,
        p.imageUrl as product_image
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `,
      [...params, parsedLimit, offset]
    );

    res.json({
      reviews: results,
      pagination: {
        total: countResult[0]?.total || 0,
        page: parseInt(page, 10),
        limit: parsedLimit,
        totalPages: Math.ceil((countResult[0]?.total || 0) / parsedLimit),
      },
    });
  } catch (error) {
    console.error('Admin reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// 리뷰 통계
router.get('/reviews/stats', auth, adminAuth, async (req, res) => {
  const adminId = req.user.id;

  try {
    // 총 리뷰 수
    const totalReviews = await selectQuery(
      `
      SELECT COUNT(*) as total
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
    `,
      [adminId]
    );

    // 평균 평점
    const avgRating = await selectQuery(
      `
      SELECT AVG(r.rating) as avg_rating
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
    `,
      [adminId]
    );

    // 이번 달 리뷰 수
    const thisMonth = await selectQuery(
      `
      SELECT COUNT(*) as count
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
        AND r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `,
      [adminId]
    );

    // 별점별 분포
    const ratingDistribution = await selectQuery(
      `
      SELECT 
        r.rating,
        COUNT(*) as count
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      WHERE p.created_by = ?
      GROUP BY r.rating
      ORDER BY r.rating DESC
    `,
      [adminId]
    );

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDistribution.forEach((item) => {
      const rating = parseInt(item.rating) || 0;
      const count = parseInt(item.count) || 0;
      if (rating >= 1 && rating <= 5) {
        distribution[rating] = count;
      }
    });
    
    console.log('[Admin Reviews Stats] ratingDistribution 쿼리 결과:', ratingDistribution);
    console.log('[Admin Reviews Stats] 최종 distribution:', distribution);

    const positive = distribution[5] + distribution[4];
    const needsAttention = distribution[3] + distribution[2] + distribution[1];

    res.json({
      totalReviews: totalReviews[0]?.total || 0,
      avgRating: parseFloat(avgRating[0]?.avg_rating || 0).toFixed(1),
      thisMonth: thisMonth[0]?.count || 0,
      positive,
      needsAttention,
      distribution,
    });
  } catch (error) {
    console.error('Reviews stats error:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

module.exports = router;

