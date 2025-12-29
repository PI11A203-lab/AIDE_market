/**
 * 스케줄러 수동 테스트 스크립트
 * 
 * 사용 방법:
 * node scripts/test_schedulers.js
 */

const db = require('../db/initializer');

/**
 * 자동 차단 해제 테스트
 */
const testAutoUnblock = async () => {
  console.log('🔓 자동 차단 해제 스케줄러 테스트\n');
  
  try {
    const { runManualUnblock } = require('../jobs/autoUnblockScheduler');
    const unblockCount = await runManualUnblock();
    console.log(`\n✅ 자동 차단 해제 완료: ${unblockCount}개 IP`);
    return unblockCount;
  } catch (error) {
    console.error('❌ 자동 차단 해제 실패:', error);
    throw error;
  }
};

/**
 * 로그 아카이빙 테스트
 */
const testLogArchive = async () => {
  console.log('🗄️  로그 아카이빙 스케줄러 테스트\n');
  
  try {
    const { runManualArchive } = require('../jobs/logArchiveScheduler');
    const result = await runManualArchive();
    console.log(`\n✅ 로그 아카이빙 완료:`);
    console.log(`   - IP Access Logs 삭제: ${result.deletedAccessLogs}개`);
    console.log(`   - Security Events 삭제: ${result.deletedEvents}개`);
    return result;
  } catch (error) {
    console.error('❌ 로그 아카이빙 실패:', error);
    throw error;
  }
};

/**
 * 메인 실행
 */
const runTests = async () => {
  console.log('🚀 스케줄러 테스트 시작\n');
  console.log('='.repeat(60));
  
  try {
    // DB 연결 확인
    await db.sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공\n');
    
    // 자동 차단 해제 테스트
    await testAutoUnblock();
    
    console.log('\n' + '-'.repeat(60) + '\n');
    
    // 로그 아카이빙 테스트
    await testLogArchive();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 모든 스케줄러 테스트 완료!');
    
  } catch (error) {
    console.error('\n❌ 테스트 실행 중 오류 발생:', error);
    process.exit(1);
  } finally {
    // DB 연결 종료
    await db.sequelize.close();
  }
};

// 스크립트 실행
if (require.main === module) {
  runTests();
}

module.exports = { testAutoUnblock, testLogArchive };

