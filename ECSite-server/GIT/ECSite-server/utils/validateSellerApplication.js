/**
 * 판매자 신청 자동 검증 함수
 * @param {Object} application - 신청 정보
 * @returns {Object} 검증 결과
 */
async function validateSellerApplication(application) {
  let totalScore = 0;
  const checks = [];

  // 1. 필수 정보 완성도 (20점)
  const requiredFields = [
    'seller_name',
    'contact_email',
    'phone',
    'specialization',
    'tech_stack',
    'portfolio_url',
    'product_description',
    'motivation'
  ];
  const completedFields = requiredFields.filter(field => {
    const value = application[field];
    return value && value.trim().length > 0;
  });
  const requiredScore = completedFields.length === requiredFields.length ? 20 : 0;
  totalScore += requiredScore;
  checks.push({
    category: '필수 정보',
    score: requiredScore,
    message: `${completedFields.length}/${requiredFields.length} 항목 완료`
  });

  // 2. 이메일 형식 (10점)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(application.contact_email)) {
    totalScore += 10;
    checks.push({
      category: '이메일',
      score: 10,
      message: '✅ 유효한 형식'
    });
  } else {
    checks.push({
      category: '이메일',
      score: 0,
      message: '❌ 유효하지 않은 형식'
    });
  }

  // 3. 전화번호 형식 (10점)
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  if (phoneRegex.test(application.phone)) {
    totalScore += 10;
    checks.push({
      category: '전화번호',
      score: 10,
      message: '✅ 유효한 형식'
    });
  } else {
    checks.push({
      category: '전화번호',
      score: 0,
      message: '❌ 유효하지 않은 형식'
    });
  }

  // 4. 포트폴리오 URL 접근 가능 (20점)
  try {
    // node-fetch 또는 axios 사용 시도
    let fetchFunc;
    try {
      fetchFunc = require('node-fetch');
    } catch {
      // node-fetch가 없으면 axios 사용
      const axios = require('axios');
      fetchFunc = async (url, options) => {
        try {
          const response = await axios.head(url, { timeout: 5000 });
          return { ok: response.status >= 200 && response.status < 300, status: response.status };
        } catch (error) {
          return { ok: false, status: error.response?.status || 0 };
        }
      };
    }
    
    const response = await fetchFunc(application.portfolio_url, {
      method: 'HEAD',
      timeout: 5000
    });
    
    if (response.ok) {
      totalScore += 20;
      checks.push({
        category: '포트폴리오 URL',
        score: 20,
        message: '✅ 접근 가능'
      });
    } else {
      checks.push({
        category: '포트폴리오 URL',
        score: 0,
        message: `❌ 접근 불가 (${response.status || '오류'})`
      });
    }
  } catch (error) {
    checks.push({
      category: '포트폴리오 URL',
      score: 0,
      message: '❌ 접근 불가 (타임아웃 또는 오류)'
    });
  }

  // 5. 텍스트 품질 (20점)
  const productDescLength = application.product_description ? application.product_description.trim().length : 0;
  const motivationLength = application.motivation ? application.motivation.trim().length : 0;
  
  let textScore = 0;
  if (productDescLength >= 100) {
    textScore += 10;
  }
  if (motivationLength >= 50) {
    textScore += 10;
  }
  totalScore += textScore;
  checks.push({
    category: '텍스트 품질',
    score: textScore,
    message: `상품 설명: ${productDescLength}자, 신청 동기: ${motivationLength}자`
  });

  // 6. 전문분야 유효성 (10점)
  const validCategories = ['frontend', 'backend', 'image', 'management', 'infrastructure', 'security', 'documents'];
  if (validCategories.includes(application.specialization)) {
    totalScore += 10;
    checks.push({
      category: '전문분야',
      score: 10,
      message: '✅ 유효한 카테고리'
    });
  } else {
    checks.push({
      category: '전문분야',
      score: 0,
      message: '❌ 유효하지 않은 카테고리'
    });
  }

  // 7. 기술 스택 입력 (10점)
  const techStackLength = application.tech_stack ? application.tech_stack.trim().length : 0;
  if (techStackLength >= 5) {
    totalScore += 10;
    checks.push({
      category: '기술 스택',
      score: 10,
      message: '✅ 입력됨'
    });
  } else {
    checks.push({
      category: '기술 스택',
      score: 0,
      message: '❌ 입력 부족'
    });
  }

  // 추천 판정
  let recommendation = 'review';
  let message = '⚠️ 검토 필요';
  
  if (totalScore >= 80) {
    recommendation = 'approved';
    message = '✅ 승인 권장';
  } else if (totalScore < 60) {
    recommendation = 'rejected';
    message = '❌ 반려 권장';
  }

  return {
    totalScore,
    recommendation,
    message,
    checks
  };
}

module.exports = validateSellerApplication;
