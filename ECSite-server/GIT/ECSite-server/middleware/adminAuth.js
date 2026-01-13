const db = require('../db/initializer');
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰에서 사용자 정보 가져오기
 * @returns {Object|null} 사용자 객체 또는 null (토큰이 없거나 유효하지 않은 경우)
 * @throws {Error} 토큰이 만료된 경우 TokenExpiredError를 throw
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
    console.log('[getUserFromToken] JWT 디코딩 성공:', { id: decoded.id, email: decoded.email });
    
    if (!decoded || !decoded.id) {
      console.log('[getUserFromToken] decoded.id 없음');
      return null;
    }

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log('[getUserFromToken] DB에서 사용자 찾을 수 없음, id:', decoded.id);
      return null;
    }

    const userData = user.toJSON ? user.toJSON() : user;
    console.log('[getUserFromToken] 사용자 조회 성공:', { id: userData.id, email: userData.email, role: userData.role });
    return userData;
  } catch (error) {
    // 토큰 만료는 명시적으로 throw하여 상위에서 처리
    if (error.name === 'TokenExpiredError') {
      console.error('[getUserFromToken] JWT 토큰 만료:', error.message);
      throw error; // 토큰 만료는 상위로 전달
    }
    // 기타 JWT 오류는 로그만 남기고 null 반환
    console.error('[getUserFromToken] JWT 토큰 검증 실패:', error.name, error.message);
    return null;
  }
};

/**
 * admin 또는 super_admin 권한 체크 미들웨어
 */
const adminAuth = async (req, res, next) => {
  try {
    // auth 미들웨어에서 이미 req.user가 설정된 경우 우선 사용
    let user = req.user;
    
    if (user) {
      console.log('[adminAuth] req.user 사용:', { id: user.id, email: user.email, role: user.role });
    } else {
      // req.user가 없으면 JWT 토큰에서 사용자 정보 가져오기
      try {
        user = await getUserFromToken(req);
        console.log('[adminAuth] getUserFromToken 결과:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
      } catch (tokenError) {
        // 토큰 만료 오류 처리
        if (tokenError.name === 'TokenExpiredError') {
          console.log('[adminAuth] 토큰 만료');
          return res.status(401).json({ 
            success: false,
            error: '토큰이 만료되었습니다. 다시 로그인해주세요.',
            code: 'TOKEN_EXPIRED'
          });
        }
        // 기타 오류는 user가 null인 것으로 처리
        console.error('[adminAuth] getUserFromToken 에러:', tokenError.message);
        user = null;
      }
      
      // 헤더에서 user-id 가져오기 (임시, JWT가 없을 경우)
      if (!user) {
        const userId = req.headers['user-id'];
        if (userId) {
          console.log('[adminAuth] user-id 헤더에서 사용자 조회:', userId);
          user = await db.User.findByPk(userId);
          if (user) {
            user = user.toJSON ? user.toJSON() : user;
          }
        }
      }
    }

    console.log('[adminAuth] 최종 user:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
    
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      console.log('[adminAuth] 403 반환 - user 없음 또는 role 불일치:', user ? user.role : 'user is null');
      return res.status(403).json({ 
        success: false,
        error: '관리자 권한이 필요합니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[adminAuth] Admin 권한 체크 실패:', error);
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
    let user;
    try {
      user = await getUserFromToken(req);
    } catch (tokenError) {
      // 토큰 만료 오류 처리
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: '토큰이 만료되었습니다. 다시 로그인해주세요.',
          code: 'TOKEN_EXPIRED'
        });
      }
      // 기타 오류는 user가 null인 것으로 처리
      user = null;
    }
    
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

