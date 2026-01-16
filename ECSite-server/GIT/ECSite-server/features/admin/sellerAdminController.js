const db = require('../../db/initializer');
const { sequelize, Sequelize } = db;
const { QueryTypes } = Sequelize;
const validateSellerApplication = require('../../utils/validateSellerApplication');

// 신청 목록
exports.getApplications = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    let whereClause = 'seller_requested_at IS NOT NULL';
    const params = [];

    if (status === 'pending') {
      whereClause += ' AND role = ? AND seller_rejected_at IS NULL';
      params.push('user');
    } else if (status === 'approved') {
      whereClause += ' AND role = ?';
      params.push('admin');
    } else if (status === 'rejected') {
      whereClause += ' AND seller_rejected_at IS NOT NULL';
    }

    const results = await sequelize.query(
      `
      SELECT 
        id as user_id,
        username,
        email,
        seller_requested_at,
        seller_application_data,
        seller_approved_at,
        seller_rejected_at,
        seller_rejection_reason,
        role
      FROM users
      WHERE ${whereClause}
      ORDER BY seller_requested_at DESC
    `,
      {
        replacements: params,
        type: QueryTypes.SELECT
      }
    );

    res.json(results);
  } catch (error) {
    console.error('신청 목록 조회 오류:', error);
    res.status(500).json({ error: '신청 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 신청 상세 + 자동 검증
exports.getApplicationDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (!user.seller_requested_at) {
      return res.status(400).json({ error: '판매자 신청 내역이 없습니다.' });
    }

    const application = user.seller_application_data || {};

    // 자동 검증 실행
    let validation = null;
    try {
      validation = await validateSellerApplication(application);
    } catch (error) {
      console.error('자동 검증 오류:', error);
      // 검증 오류가 있어도 계속 진행
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        seller_requested_at: user.seller_requested_at,
        seller_approved_at: user.seller_approved_at,
        seller_rejected_at: user.seller_rejected_at,
        seller_rejection_reason: user.seller_rejection_reason,
        role: user.role
      },
      application,
      validation
    });
  } catch (error) {
    console.error('신청 상세 조회 오류:', error);
    res.status(500).json({ error: '신청 상세 조회 중 오류가 발생했습니다.' });
  }
};

// 승인
exports.approve = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (!user.seller_requested_at) {
      return res.status(400).json({ error: '판매자 신청 내역이 없습니다.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: '이미 승인된 사용자입니다.' });
    }

    await user.update({
      role: 'admin',
      seller_approved_at: new Date()
    });

    res.json({
      success: true,
      message: '판매자 승인이 완료되었습니다.'
    });
  } catch (error) {
    console.error('승인 오류:', error);
    res.status(500).json({ error: '승인 처리 중 오류가 발생했습니다.' });
  }
};

// 반려
exports.reject = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ error: '반려 사유를 입력해주세요.' });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (!user.seller_requested_at) {
      return res.status(400).json({ error: '판매자 신청 내역이 없습니다.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: '이미 승인된 사용자는 반려할 수 없습니다.' });
    }

    await user.update({
      seller_rejected_at: new Date(),
      seller_rejection_reason: reason.trim()
    });

    res.json({
      success: true,
      message: '판매자 신청이 반려되었습니다.'
    });
  } catch (error) {
    console.error('반려 오류:', error);
    res.status(500).json({ error: '반려 처리 중 오류가 발생했습니다.' });
  }
};
