const productActivationService = require('./productActivationService');

/**
 * 사용자 활성화 코드 목록 조회
 */
exports.getUserActivations = async (req, res) => {
    try {
        const { userId } = req.params;
        const includeSuspended = req.query.includeSuspended === 'true';
        
        const activations = await productActivationService.getUserActivations(userId, includeSuspended);
        
        res.json({
            success: true,
            activations
        });
    } catch (error) {
        console.error('활성화 코드 목록 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 활성화 코드 재활성화 (재결제 후)
 */
exports.reactivateActivation = async (req, res) => {
    try {
        const { id } = req.params;
        
        const activation = await productActivationService.reactivateActivation(id);
        
        res.json({
            success: true,
            activation
        });
    } catch (error) {
        console.error('활성화 코드 재활성화 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 활성화 코드 검증
 */
exports.verifyActivationCode = async (req, res) => {
    try {
        const { code } = req.params;
        
        const result = await productActivationService.checkActivationCode(code);
        
        res.json({
            success: result.valid,
            ...result
        });
    } catch (error) {
        console.error('활성화 코드 검증 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

