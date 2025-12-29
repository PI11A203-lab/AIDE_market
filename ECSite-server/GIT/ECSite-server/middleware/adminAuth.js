const db = require('../db/initializer');
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰에서 사용자 정보 가져오기
 */
const getUserFromToken = async (req) => {
  // 이미 req.user가 설정되어 있는 경우
  if (req.user) {
    return req.user;
  }

  // Authorization 헤더에서 JWT 토큰 확인
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  
  if (!token || token === 'null' || token === 'undefined' || token.length === 0) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
    
    if (!decoded || !decoded.id) {
      return null;
    }

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return null;
    }

    return user.toJSON ? user.toJSON() : user;
  } catch (error) {
    console.error('JWT 토큰 검증 실패:', error.message);
    return null;
  }
};

/**
 * admin 또는 super_admin 권한 체크 미들웨어
 */
const adminAuth = async (req, res, next) => {
  try {
    // JWT 토큰에서 사용자 정보 가져오기
    let user = await getUserFromToken(req);
    
    // 헤더에서 user-id 가져오기 (임시, JWT가 없을 경우)
    if (!user) {
      const userId = req.headers['user-id'];
      if (userId) {
        user = await db.User.findByPk(userId);
        if (user) {
          user = user.toJSON ? user.toJSON() : user;
        }
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
    // JWT 토큰에서 사용자 정보 가져오기
    let user = await getUserFromToken(req);
    
    // 헤더에서 user-id 가져오기 (임시, JWT가 없을 경우)
    if (!user) {
      const userId = req.headers['user-id'];
      if (userId) {
        user = await db.User.findByPk(userId);
        if (user) {
          user = user.toJSON ? user.toJSON() : user;
        }
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

