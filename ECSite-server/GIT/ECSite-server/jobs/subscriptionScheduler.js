/**
 * 정기결제 자동 실행 스케줄러
 * 매일 00:00에 실행하여 다음 결제일이 오늘인 구독들의 결제를 처리합니다.
 */

const cron = require('node-cron');
const models = require('../db/initializer');
const subscriptionService = require('../features/subscription/subscriptionService');
const emailService = require('../features/user/emailService');

/**
 * 다음 결제일이 오늘인 구독들의 결제 처리
 */
async function processDuePayments() {
    console.log('\n[정기결제 스케줄러] 결제 처리 시작...');
    
    try {
        // 다음 결제일이 오늘인 구독 조회
        const subscriptions = await subscriptionService.getSubscriptionsDueToday();
        
        if (subscriptions.length === 0) {
            console.log('[정기결제 스케줄러] 처리할 구독이 없습니다.');
            return;
        }

        console.log(`[정기결제 스케줄러] ${subscriptions.length}개의 구독 결제 처리 시작`);

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        // 각 구독에 대해 결제 처리
        for (const subscription of subscriptions) {
            const transaction = await models.sequelize.transaction();
            
            try {
                console.log(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 처리 중...`);
                
                // 결제 처리
                const result = await subscriptionService.processMonthlyPayment(
                    subscription.subscription_id,
                    transaction
                );

                if (result.success) {
                    results.success++;
                    
                    // 결제 성공 이메일 발송
                    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                    try {
                        await emailService.sendPaymentSuccessEmail(
                            subscription,
                            result.order,
                            baseUrl
                        );
                        console.log(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 성공 이메일 발송 완료`);
                    } catch (emailError) {
                        console.error(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 성공 이메일 발송 실패:`, emailError);
                    }

                    // 결제 성공 알림 기록
                    await models.SubscriptionNotification.create({
                        subscription_id: subscription.subscription_id,
                        notification_type: 'payment_success',
                        sent_at: new Date(),
                        email_sent: true,
                        email_sent_at: new Date()
                    }, { transaction });

                    await transaction.commit();
                    console.log(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 성공`);
                } else {
                    results.failed++;
                    
                    // 결제 실패 이메일 발송
                    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                    try {
                        await emailService.sendPaymentFailedEmail(
                            subscription,
                            result.error || '결제 처리 실패',
                            baseUrl
                        );
                        console.log(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 실패 이메일 발송 완료`);
                    } catch (emailError) {
                        console.error(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 실패 이메일 발송 실패:`, emailError);
                    }

                    // 결제 실패 알림 기록
                    await models.SubscriptionNotification.create({
                        subscription_id: subscription.subscription_id,
                        notification_type: 'payment_failed',
                        sent_at: new Date(),
                        email_sent: true,
                        email_sent_at: new Date()
                    }, { transaction });

                    await transaction.commit();
                    console.log(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 실패: ${result.error}`);
                }
            } catch (error) {
                await transaction.rollback();
                results.failed++;
                results.errors.push({
                    subscriptionId: subscription.subscription_id,
                    error: error.message
                });
                console.error(`[정기결제 스케줄러] 구독 ID ${subscription.subscription_id} 결제 처리 중 오류:`, error);
            }
        }

        console.log(`[정기결제 스케줄러] 결제 처리 완료 - 성공: ${results.success}, 실패: ${results.failed}`);
        
        if (results.errors.length > 0) {
            console.error('[정기결제 스케줄러] 오류 목록:', results.errors);
        }
    } catch (error) {
        console.error('[정기결제 스케줄러] 결제 처리 중 치명적 오류:', error);
    }
}

/**
 * 스케줄러 시작
 */
function start() {
    // 매일 00:00에 실행 (Cron: 0 0 * * *)
    const cronExpression = process.env.SUBSCRIPTION_CRON || '0 0 * * *';
    
    console.log(`[정기결제 스케줄러] 시작 - Cron: ${cronExpression}`);
    
    cron.schedule(cronExpression, async () => {
        await processDuePayments();
    }, {
        scheduled: true,
        timezone: "Asia/Tokyo" // 일본 시간 기준
    });

    // 개발 환경에서는 즉시 한 번 실행 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.RUN_SCHEDULER_IMMEDIATELY === 'true') {
        console.log('[정기결제 스케줄러] 개발 환경 - 즉시 실행');
        processDuePayments();
    }
}

/**
 * 스케줄러 중지
 */
function stop() {
    console.log('[정기결제 스케줄러] 중지');
    // node-cron은 중지 기능을 제공하지 않으므로, 스케줄러를 null로 설정하거나 프로세스를 종료해야 함
}

module.exports = {
    start,
    stop,
    processDuePayments // 테스트용
};

