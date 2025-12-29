const db = require('../db/initializer');

/**
 * admin 또는 super_admin 권한 체크 미들웨어
 */
const adminAuth = async (req, res, next) => {
  try {
    // req.user가 없는 경우 헤더에서 user-id 가져오기 (임시)
    let user = req.user;
    if (!user) {
      const userId = req.headers['user-id'];
      if (userId) {
        user = await db.User.findByPk(userId);
      }
    }

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return res.status(403).json({ 
        success: false,
        error: '관리자 권한이 필요합니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin 권한 체크 실패:', error);
    res.status(500).json({ 
      success: false,
      error: '권한 확인 중 오류가 발생했습니다.' 
    });
  }
};

/**
 * super_admin 권한 체크 미들웨어
 */
const requireSuperAdmin = async (req, res, next) => {
  try {
    // req.user가 없는 경우 헤더에서 user-id 가져오기 (임시)
    let user = req.user;
    if (!user) {
      const userId = req.headers['user-id'];
      if (userId) {
        user = await db.User.findByPk(userId);
      }
    }

    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false,
        error: '사이트 관리자 권한이 필요합니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('SuperAdmin 권한 체크 실패:', error);
    res.status(500).json({ 
      success: false,
      error: '권한 확인 중 오류가 발생했습니다.' 
    });
  }
};

module.exports = adminAuth;
module.exports.requireSuperAdmin = requireSuperAdmin;

