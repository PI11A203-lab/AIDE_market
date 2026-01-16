const db = require('../../db/initializer');
const { sequelize, Sequelize } = db;
const { QueryTypes } = Sequelize;

// 신청 상태 확인
exports.getApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const hasApplied = !!user.seller_requested_at;
    let status = null;
    
    if (user.role === 'admin') {
      status = 'approved';
    } else if (user.seller_rejected_at) {
      status = 'rejected';
    } else if (user.seller_requested_at) {
      status = 'pending';
    }

    res.json({
      hasApplied,
      status,
      requestedAt: user.seller_requested_at,
      approvedAt: user.seller_approved_at,
      rejectedAt: user.seller_rejected_at,
      rejectionReason: user.seller_rejection_reason
    });
  } catch (error) {
    console.error('신청 상태 확인 오류:', error);
    res.status(500).json({ error: '신청 상태 확인 중 오류가 발생했습니다.' });
  }
};

// 판매자 신청
exports.apply = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      seller_name,
      contact_email,
      phone,
      specialization,
      tech_stack,
      portfolio_url,
      product_description,
      motivation,
      business_number,
      github_url
    } = req.body;

    // 이미 신청했는지 확인
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (user.seller_requested_at) {
      return res.status(400).json({ error: '이미 판매자 신청을 했습니다.' });
    }

    // 입력 유효성 검증
    const errors = [];

    // 필수 필드 검증
    if (!seller_name || seller_name.trim().length === 0) {
      errors.push('판매자명을 입력해주세요.');
    }
    if (!contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      errors.push('유효한 이메일 주소를 입력해주세요.');
    }
    if (!phone || !/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(phone)) {
      errors.push('유효한 전화번호를 입력해주세요. (형식: 010-1234-5678)');
    }
    if (!specialization) {
      errors.push('전문분야를 선택해주세요.');
    }
    if (!tech_stack || tech_stack.trim().length === 0) {
      errors.push('기술 스택을 입력해주세요.');
    }
    if (!portfolio_url || !/^https?:\/\/.+/.test(portfolio_url)) {
      errors.push('유효한 포트폴리오 URL을 입력해주세요.');
    }
    if (!product_description || product_description.trim().length < 100 || product_description.trim().length > 500) {
      errors.push('상품 설명은 100자 이상 500자 이하여야 합니다.');
    }
    if (!motivation || motivation.trim().length < 50 || motivation.trim().length > 200) {
      errors.push('신청 동기는 50자 이상 200자 이하여야 합니다.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    // seller_application_data에 JSON으로 저장
    const applicationData = {
      seller_name: seller_name.trim(),
      contact_email: contact_email.trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      tech_stack: tech_stack.trim(),
      portfolio_url: portfolio_url.trim(),
      product_description: product_description.trim(),
      motivation: motivation.trim(),
      business_number: business_number ? business_number.trim() : null,
      github_url: github_url ? github_url.trim() : null
    };

    // 업데이트
    await user.update({
      seller_application_data: applicationData,
      seller_requested_at: new Date()
    });

    res.json({
      success: true,
      message: '판매자 신청이 완료되었습니다.'
    });
  } catch (error) {
    console.error('판매자 신청 오류:', error);
    res.status(500).json({ error: '판매자 신청 중 오류가 발생했습니다.' });
  }
};
