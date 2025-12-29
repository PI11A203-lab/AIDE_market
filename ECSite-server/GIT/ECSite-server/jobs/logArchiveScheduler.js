const cron = require('node-cron');
const db = require('../db/initializer');
const { Op } = require('sequelize');

/**
 * 로그 아카이빙 스케줄러
 * 
 * 매일 새벽 3시에 실행
 * - 90일 이상 된 ip_access_logs 삭제
 * - 90일 이상 된 security_events 삭제 (심각도 low/medium만)
 * - high/critical 이벤트는 180일 보관
 */

const startLogArchiveScheduler = () => {
  cron.schedule('0 3 * * *', async () => {
    console.log('🗄️ Log archive scheduler started...');
    
    try {
      if (!db.IpAccessLog || !db.SecurityEvent) {
        console.warn('⚠️ 필요한 모델이 로드되지 않았습니다.');
        return;
      }

      const now = new Date();
      const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
      const oneEightyDaysAgo = new Date(now - 180 * 24 * 60 * 60 * 1000);

      // IP Access Logs 정리 (90일 이상)
      const deletedAccessLogs = await db.IpAccessLog.destroy({
        where: {
          created_at: {
            [Op.lt]: ninetyDaysAgo
          }
        }
      });

      console.log(`✅ Deleted ${deletedAccessLogs} old IP access logs`);

      // Security Events 정리
      // low/medium: 90일, high/critical: 180일
      const deletedLowEvents = await db.SecurityEvent.destroy({
        where: {
          created_at: {
            [Op.lt]: ninetyDaysAgo
          },
          severity: {
            [Op.in]: ['low', 'medium']
          }
        }
      });

      const deletedHighEvents = await db.SecurityEvent.destroy({
        where: {
          created_at: {
            [Op.lt]: oneEightyDaysAgo
          },
          severity: {
            [Op.in]: ['high', 'critical']
          }
        }
      });

      console.log(`✅ Deleted ${deletedLowEvents} low/medium security events`);
      console.log(`✅ Deleted ${deletedHighEvents} high/critical security events`);

      console.log('✅ Log archive completed');

    } catch (error) {
      console.error('❌ Log archive error:', error);
    }
  });

  console.log('✅ Log archive scheduler started (daily at 3:00 AM)');
};

// 수동 실행 함수 (테스트용)
const runManualArchive = async () => {
  console.log('⚠️ Manual log archive triggered');
  
  try {
    if (!db.IpAccessLog || !db.SecurityEvent) {
      console.warn('⚠️ 필요한 모델이 로드되지 않았습니다.');
      return { deletedAccessLogs: 0, deletedEvents: 0 };
    }

    // 테스트용으로 30일로 설정
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deletedAccessLogs = await db.IpAccessLog.destroy({
      where: {
        created_at: {
          [Op.lt]: thirtyDaysAgo
        }
      }
    });

    const deletedEvents = await db.SecurityEvent.destroy({
      where: {
        created_at: {
          [Op.lt]: thirtyDaysAgo
        },
        severity: {
          [Op.in]: ['low', 'medium']
        }
      }
    });

    console.log(`✅ Manual archive: ${deletedAccessLogs} access logs, ${deletedEvents} events`);
    return { deletedAccessLogs, deletedEvents };
  } catch (error) {
    console.error('❌ Manual archive error:', error);
    throw error;
  }
};

module.exports = { startLogArchiveScheduler, runManualArchive };

