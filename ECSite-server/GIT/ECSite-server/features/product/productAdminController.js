const productAdminService = require('./productAdminService');

/**
 * 대기 중인 상품 목록 조회
 */
exports.getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;

    const result = await productAdminService.getPendingProducts(
      parseInt(page),
      parseInt(limit),
      { category_id: category, search }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('대기 중인 상품 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 상품 승인
 */
exports.approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const approvedBy = req.user.id;

    const product = await productAdminService.approveProduct(
      productId,
      approvedBy
    );

    res.json({
      success: true,
      message: '상품이 승인되었습니다.',
      product
    });
  } catch (error) {
    console.error('상품 승인 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 상품 거부
 */
exports.rejectProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { reason } = req.body;
    const rejectedBy = req.user.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: '거부 사유를 입력해주세요.'
      });
    }

    const product = await productAdminService.rejectProduct(
      productId,
      rejectedBy,
      reason
    );

    res.json({
      success: true,
      message: '상품이 거부되었습니다.',
      product
    });
  } catch (error) {
    console.error('상품 거부 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 상품 상세 조회
 */
exports.getPendingProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productAdminService.getPendingProductDetail(productId);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};

