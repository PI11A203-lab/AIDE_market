/**
 * 글로벌 에러 핸들러
 */

// 에러 로깅
const logError = (error, req) => {
  console.error('❌ Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('IP:', req.ip);
  console.error('Error:', error);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
};

// 에러 응답 포맷팅
const formatErrorResponse = (error, env = 'production') => {
  const response = {
    success: false,
    error: error.message || 'サーバーエラーが発生しました'
  };

  // 개발 환경에서만 스택 트레이스 포함
  if (env === 'development') {
    response.stack = error.stack;
  }

  return response;
};

// 에러 핸들러 미들웨어
exports.errorHandler = (error, req, res, next) => {
  logError(error, req);

  // Sequelize 에러
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'バリデーションエラー',
      details: error.errors ? error.errors.map(e => e.message) : [error.message]
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: '既に存在するデータです'
    });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: 'データベースエラーが発生しました'
    });
  }

  // JWT 에러
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: '無効なトークンです'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'トークンの有効期限が切れました'
    });
  }

  // 일반 에러
  const statusCode = error.statusCode || error.status || 500;
  const response = formatErrorResponse(error, process.env.NODE_ENV);

  res.status(statusCode).json(response);
};

// 404 핸들러
exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'ページが見つかりません',
    path: req.path
  });
};

// 비동기 핸들러 래퍼
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

