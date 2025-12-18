/**
 * 학생 인증 만료 처리 스케줄러
 * 매일 00:00에 실행하여 만료된 학생 계정을 일반 계정으로 변경하고 이메일을 발송합니다.
 */

const cron = require('node-cron');
const models = require('../db/initializer');
const studentAccountService = require('../features/user/studentAccountService');
const emailService = require('../features/user/emailService');

/**
 * 만료된 학생 계정 처리
 */
async function expireStudentAccounts() {
    console.log('\n[학생 만료 스케줄러] 만료된 학생 계정 처리 시작...');
    
    try {
        const transaction = await models.sequelize.transaction();
        
        try {
            // 만료된 학생 계정 조회
            const expiredUsers = await studentAccountService.expireStudentAccounts(transaction);
            
            if (expiredUsers.length === 0) {
                console.log('[학생 만료 스케줄러] 만료된 학생 계정이 없습니다.');
                await transaction.commit();
                return;
            }

            console.log(`[학생 만료 스케줄러] ${expiredUsers.length}개의 학생 계정 만료 처리 시작`);

            const results = {
                processed: 0,
                emailSent: 0,
                emailFailed: 0,
                errors: []
            };

            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

            // 각 만료된 사용자에 대해 이메일 발송
            for (const user of expiredUsers) {
                try {
                    // 만료 이메일 발송
                    await emailService.sendStudentExpiredEmail(user, baseUrl);
                    results.emailSent++;
                    console.log(`[학생 만료 스케줄러] 사용자 ID ${user.id} 만료 이메일 발송 완료`);
                } catch (emailError) {
                    results.emailFailed++;
                    results.errors.push({
                        userId: user.id,
                        error: emailError.message
                    });
                    console.error(`[학생 만료 스케줄러] 사용자 ID ${user.id} 만료 이메일 발송 실패:`, emailError);
                }
            }

            // 계정 타입 변경은 이미 expireStudentAccounts에서 처리됨
            results.processed = expiredUsers.length;

            await transaction.commit();

            console.log(`[학생 만료 스케줄러] 만료 처리 완료 - 처리: ${results.processed}, 이메일 발송: ${results.emailSent}, 이메일 실패: ${results.emailFailed}`);
            
            if (results.errors.length > 0) {
                console.error('[학생 만료 스케줄러] 오류 목록:', results.errors);
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('[학생 만료 스케줄러] 만료 처리 중 치명적 오류:', error);
    }
}

/**
 * 스케줄러 시작
 */
function start() {
    // 매일 00:00에 실행 (Cron: 0 0 * * *)
    const cronExpression = process.env.STUDENT_EXPIRATION_CRON || '0 0 * * *';
    
    console.log(`[학생 만료 스케줄러] 시작 - Cron: ${cronExpression}`);
    
    cron.schedule(cronExpression, async () => {
        await expireStudentAccounts();
    }, {
        scheduled: true,
        timezone: "Asia/Tokyo" // 일본 시간 기준
    });

    // 개발 환경에서는 즉시 한 번 실행 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.RUN_SCHEDULER_IMMEDIATELY === 'true') {
        console.log('[학생 만료 스케줄러] 개발 환경 - 즉시 실행');
        expireStudentAccounts();
    }
}

/**
 * 스케줄러 중지
 */
function stop() {
    console.log('[학생 만료 스케줄러] 중지');
}

module.exports = {
    start,
    stop,
    expireStudentAccounts // 테스트용
};

