const jwt = require('jsonwebtoken');
const db = require('../db/initializer');

/**
 * 기본 인증 미들웨어
 * - Passport 세션(req.user)이나 Bearer JWT 토큰을 통해 사용자 정보를 확인
 * - 성공 시 req.user에 사용자 정보를 설정
 */
const auth = async (req, res, next) => {
  try {
    // 이미 Passport로 인증된 경우
    if (req.user) {
      return next();
    }

    const authHeader = req.headers.authorization || '';
    
    // Authorization 헤더가 없거나 Bearer로 시작하지 않는 경우
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7).trim(); // 'Bearer ' 제거 후 공백 제거
    
    // 토큰이 없거나 'null', 'undefined' 문자열인 경우
    if (!token || token === 'null' || token === 'undefined' || token.length === 0) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
      
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }

      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user.toJSON ? user.toJSON() : user;
      next();
    } catch (jwtError) {
      // JWT 관련 에러를 더 명확하게 처리
      if (jwtError.name === 'JsonWebTokenError') {
        console.error('JWT verification error:', jwtError.message);
        return res.status(401).json({ error: 'Invalid token' });
      } else if (jwtError.name === 'TokenExpiredError') {
        console.error('JWT expired:', jwtError.message);
        return res.status(401).json({ error: 'Token expired' });
      } else {
        throw jwtError; // 다른 에러는 재throw
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;

