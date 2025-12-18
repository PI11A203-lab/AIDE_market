/**
 * 정기결제 알림 스케줄러
 * 매일 09:00에 실행하여 다음 결제일이 5일 후인 구독들에 대해 결제 안내 이메일을 발송합니다.
 */

const cron = require('node-cron');
const models = require('../db/initializer');
const subscriptionService = require('../features/subscription/subscriptionService');
const emailService = require('../features/user/emailService');

/**
 * 다음 결제일이 5일 후인 구독들에 대해 안내 이메일 발송
 */
async function sendPaymentReminders() {
    console.log('\n[알림 스케줄러] 결제 안내 이메일 발송 시작...');
    
    try {
        // 다음 결제일이 5일 후인 구독 조회
        const subscriptions = await subscriptionService.getSubscriptionsDueIn5Days();
        
        if (subscriptions.length === 0) {
            console.log('[알림 스케줄러] 안내 이메일을 보낼 구독이 없습니다.');
            return;
        }

        console.log(`[알림 스케줄러] ${subscriptions.length}개의 구독에 대해 안내 이메일 발송 시작`);

        const results = {
            sent: 0,
            skipped: 0,
            failed: 0,
            errors: []
        };

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // 각 구독에 대해 안내 이메일 발송
        for (const subscription of subscriptions) {
            try {
                // 이미 안내 이메일을 보냈는지 확인
                const existingNotification = await models.SubscriptionNotification.findOne({
                    where: {
                        subscription_id: subscription.subscription_id,
                        notification_type: 'payment_reminder',
                        sent_at: {
                            [models.sequelize.Op.gte]: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6일 이내
                        }
                    }
                });

                if (existingNotification) {
                    console.log(`[알림 스케줄러] 구독 ID ${subscription.subscription_id} - 이미 안내 이메일이 발송되었습니다.`);
                    results.skipped++;
                    continue;
                }

                // 안내 이메일 발송
                await emailService.sendPaymentReminderEmail(
                    subscription,
                    subscription.next_payment_date,
                    baseUrl
                );

                // 알림 기록 저장
                await models.SubscriptionNotification.create({
                    subscription_id: subscription.subscription_id,
                    notification_type: 'payment_reminder',
                    sent_at: new Date(),
                    email_sent: true,
                    email_sent_at: new Date()
                });

                results.sent++;
                console.log(`[알림 스케줄러] 구독 ID ${subscription.subscription_id} 안내 이메일 발송 완료`);
            } catch (error) {
                results.failed++;
                results.errors.push({
                    subscriptionId: subscription.subscription_id,
                    error: error.message
                });
                console.error(`[알림 스케줄러] 구독 ID ${subscription.subscription_id} 안내 이메일 발송 실패:`, error);
            }
        }

        console.log(`[알림 스케줄러] 안내 이메일 발송 완료 - 발송: ${results.sent}, 건너뜀: ${results.skipped}, 실패: ${results.failed}`);
        
        if (results.errors.length > 0) {
            console.error('[알림 스케줄러] 오류 목록:', results.errors);
        }
    } catch (error) {
        console.error('[알림 스케줄러] 안내 이메일 발송 중 치명적 오류:', error);
    }
}

/**
 * 스케줄러 시작
 */
function start() {
    // 매일 09:00에 실행 (Cron: 0 9 * * *)
    const cronExpression = process.env.NOTIFICATION_CRON || '0 9 * * *';
    
    console.log(`[알림 스케줄러] 시작 - Cron: ${cronExpression}`);
    
    cron.schedule(cronExpression, async () => {
        await sendPaymentReminders();
    }, {
        scheduled: true,
        timezone: "Asia/Tokyo" // 일본 시간 기준
    });

    // 개발 환경에서는 즉시 한 번 실행 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.RUN_SCHEDULER_IMMEDIATELY === 'true') {
        console.log('[알림 스케줄러] 개발 환경 - 즉시 실행');
        sendPaymentReminders();
    }
}

/**
 * 스케줄러 중지
 */
function stop() {
    console.log('[알림 스케줄러] 중지');
}

module.exports = {
    start,
    stop,
    sendPaymentReminders // 테스트용
};

