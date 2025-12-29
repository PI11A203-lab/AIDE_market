/**
 * 보안 시스템 최종 테스트 스크립트
 * 
 * 사용 방법:
 * node scripts/test_security_system.js
 */

const axios = require('axios');
const baseURL = 'http://localhost:8081';

// 테스트용 토큰 (실제 테스트 시 super_admin 토큰 필요)
let authToken = '';

/**
 * 테스트 헬퍼 함수
 */
const test = async (name, fn) => {
  console.log(`\n🧪 테스트: ${name}`);
  try {
    await fn();
    console.log(`✅ 성공: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ 실패: ${name}`);
    console.error(`   에러: ${error.message}`);
    if (error.response) {
      console.error(`   상태: ${error.response.status}`);
      console.error(`   응답: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
};

/**
 * 1. IP 차단 테스트
 */
const testIPBlock = async () => {
  // Super Admin에서 IP 차단 필요 (수동)
  // 차단 후 테스트
  const testIP = '127.0.0.1'; // 실제 차단된 IP로 변경 필요
  
  try {
    await axios.get(`${baseURL}/api/products`, {
      headers: {
        'X-Forwarded-For': testIP
      }
    });
    console.log('   ⚠️  IP가 차단되지 않았거나 차단되지 않은 IP입니다.');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ IP 차단 정상 작동 (403 Forbidden)');
    } else {
      throw error;
    }
  }
};

/**
 * 2. 로그인 실패 테스트
 */
const testLoginFailure = async () => {
  console.log('   로그인 실패 5회 시도...');
  
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, {
        email: 'test@test.com',
        password: 'wrong_password'
      });
      
      if (i === 5) {
        console.log('   ⚠️  5번째 시도에서도 차단되지 않았습니다.');
      } else {
        console.log(`   ${i}번째 시도: 실패 (예상됨)`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          console.log(`   ✅ ${i}번째 시도: 차단됨 (429 Too Many Requests)`);
          console.log(`   응답: ${JSON.stringify(error.response.data)}`);
          break;
        } else if (error.response.status === 401) {
          console.log(`   ${i}번째 시도: 인증 실패 (401 Unauthorized) - 정상`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    
    // 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

/**
 * 3. 봇 탐지 테스트
 */
const testBotDetection = async () => {
  try {
    await axios.get(`${baseURL}/api/products`, {
      headers: {
        'User-Agent': 'bot/crawler'
      }
    });
    console.log('   ⚠️  봇이 탐지되지 않았거나 차단되지 않았습니다.');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('   ✅ 봇 탐지 정상 작동 (403 Forbidden)');
    } else {
      throw error;
    }
  }
};

/**
 * 4. Rate Limiting 테스트
 */
const testRateLimiting = async () => {
  console.log('   빠른 요청 110회 시도...');
  let successCount = 0;
  let rateLimitCount = 0;
  
  for (let i = 1; i <= 110; i++) {
    try {
      await axios.get(`${baseURL}/api/products`);
      successCount++;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        rateLimitCount++;
        if (i === 101) {
          console.log(`   ✅ ${i}번째 요청부터 Rate Limit 적용 (429 Too Many Requests)`);
        }
        break;
      } else {
        throw error;
      }
    }
    
    // 10ms 대기 (너무 빠르게 요청)
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  console.log(`   성공: ${successCount}회, Rate Limit: ${rateLimitCount}회`);
};

/**
 * 5. 메모리 통계 조회
 */
const testMemoryStats = async () => {
  if (!authToken) {
    console.log('   ⚠️  토큰이 필요합니다. 건너뜁니다.');
    return;
  }
  
  const response = await axios.get(`${baseURL}/api/admin/security/memory/stats`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  console.log('   메모리 사용량:', JSON.stringify(response.data.data.memoryUsage, null, 2));
  console.log('   스토어 크기:', JSON.stringify(response.data.data.storeSizes, null, 2));
};

/**
 * 6. 그래프 데이터 테스트
 */
const testGraphData = async () => {
  if (!authToken) {
    console.log('   ⚠️  토큰이 필요합니다. 건너뜁니다.');
    return;
  }
  
  const endpoints = [
    '/api/admin/security/events/trend?days=7',
    '/api/admin/security/events/distribution?days=7',
    '/api/admin/security/events/hourly?days=7',
    '/api/admin/security/events/top-ips?days=7&limit=10',
    '/api/admin/ip/access/trend?days=7',
    '/api/admin/ip/access/countries?days=7',
    '/api/admin/ip/access/hourly?days=7',
    '/api/admin/ip/access/top-ips?days=7&limit=10'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.data.success) {
        const dataLength = Array.isArray(response.data.data) 
          ? response.data.data.length 
          : Object.keys(response.data.data || {}).length;
        console.log(`   ✅ ${endpoint}: ${dataLength}개 데이터`);
      } else {
        console.log(`   ⚠️  ${endpoint}: success=false`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ${error.message}`);
    }
  }
};

/**
 * 7. 에러 핸들링 테스트
 */
const testErrorHandling = async () => {
  // 404 테스트
  try {
    await axios.get(`${baseURL}/api/not-found`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('   ✅ 404 에러 핸들링 정상 작동');
      console.log(`   응답: ${JSON.stringify(error.response.data)}`);
    } else {
      throw error;
    }
  }
  
  // 401 테스트 (토큰 없이)
  try {
    await axios.get(`${baseURL}/api/admin/security/events`);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('   ✅ 401 에러 핸들링 정상 작동');
    } else {
      throw error;
    }
  }
};

/**
 * 메인 테스트 실행
 */
const runTests = async () => {
  console.log('🚀 보안 시스템 최종 테스트 시작\n');
  console.log('='.repeat(60));
  
  const results = [];
  
  // 토큰이 제공된 경우에만 인증이 필요한 테스트 실행
  if (authToken) {
    results.push(await test('IP 차단 테스트', testIPBlock));
    results.push(await test('로그인 실패 테스트', testLoginFailure));
    results.push(await test('봇 탐지 테스트', testBotDetection));
    results.push(await test('Rate Limiting 테스트', testRateLimiting));
    results.push(await test('메모리 통계 조회', testMemoryStats));
    results.push(await test('그래프 데이터 테스트', testGraphData));
    results.push(await test('에러 핸들링 테스트', testErrorHandling));
  } else {
    console.log('\n⚠️  인증 토큰이 없습니다.');
    console.log('   환경 변수에 AUTH_TOKEN을 설정하거나 스크립트를 수정하세요.');
    console.log('   예: AUTH_TOKEN=your_token node scripts/test_security_system.js\n');
    
    // 인증이 필요없는 테스트만 실행
    results.push(await test('에러 핸들링 테스트', testErrorHandling));
  }
  
  // 결과 요약
  console.log('\n' + '='.repeat(60));
  console.log('📊 테스트 결과 요약');
  console.log('='.repeat(60));
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`✅ 성공: ${passed}/${total}`);
  console.log(`❌ 실패: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 모든 테스트 통과!');
  } else {
    console.log('\n⚠️  일부 테스트 실패. 위의 에러 메시지를 확인하세요.');
  }
};

// 환경 변수에서 토큰 가져오기
if (process.env.AUTH_TOKEN) {
  authToken = process.env.AUTH_TOKEN;
}

// 스크립트 실행
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ 테스트 실행 중 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = { runTests, test, testIPBlock, testLoginFailure, testBotDetection, testRateLimiting, testMemoryStats, testGraphData, testErrorHandling };

