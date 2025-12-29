const cron = require('node-cron');
const db = require('../db/initializer');
const { Op } = require('sequelize');
const ipManagementService = require('../features/security/ipManagementService');
const autoBlockService = require('../services/autoBlockService');

/**
 * 자동 차단 해제 스케줄러
 * 매 시간마다 실행 (매시 0분)
 */
const startAutoUnblockScheduler = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔓 自動ブロック解除スケジューラー実行中...');

    try {
      if (!db.IpManagement || !db.SecurityEvent) {
        console.warn('⚠️ 필요한 모델이 로드되지 않았습니다.');
        return;
      }

      const settings = await autoBlockService.getSecuritySettings();
      const blockDurationMs = settings.block_duration_hours * 3600000;
      const cutoffTime = new Date(Date.now() - blockDurationMs);

      console.log(`📅 カットオフ時刻: ${cutoffTime.toISOString()}`);
      console.log(`⏰ ブロック期間: ${settings.block_duration_hours}時間`);

      // 차단 시간이 지난 IP 찾기 (자동 차단만)
      const expiredBlocks = await db.IpManagement.findAll({
        where: {
          is_blocked: true,
          blocked_at: {
            [Op.lte]: cutoffTime
          },
          blocked_by: null // 자동 차단만 해제 (수동 차단은 유지)
        }
      });

      console.log(`📊 解除対象IP数: ${expiredBlocks.length}個`);

      let unblockCount = 0;

      for (const ip of expiredBlocks) {
        try {
          // IP 차단 해제
          await ipManagementService.unblockIP(ip.ip_address);

          // SecurityEvent 로깅
          await db.SecurityEvent.create({
            event_type: 'ip_blocked',
            ip_address: ip.ip_address,
            severity: 'low',
            details: {
              action: 'auto_unblock',
              reason: 'ブロック期間終了',
              duration_hours: settings.block_duration_hours,
              blocked_at: ip.blocked_at,
              unblocked_at: new Date().toISOString()
            }
          });

          unblockCount++;
          console.log(`✅ ${ip.ip_address} のブロックを解除しました`);
        } catch (error) {
          console.error(`❌ ${ip.ip_address} のブロック解除失敗:`, error);
        }
      }

      if (unblockCount > 0) {
        console.log(`✅ ${unblockCount}個のIPブロックを解除しました`);
      } else {
        console.log('ℹ️ 解除するIPブロックはありません');
      }
    } catch (error) {
      console.error('❌ 自動ブロック解除エラー:', error);
    }
  });

  console.log('✅ 自動ブロック解除スケジューラーを開始しました (毎時0分実行)');
};

/**
 * 수동 실행 함수 (테스트용)
 */
const runManualUnblock = async () => {
  console.log('🔓 手動ブロック解除実行...');
  
  try {
    if (!db.IpManagement || !db.SecurityEvent) {
      console.warn('⚠️ 필요한 모델이 로드되지 않았습니다.');
      return;
    }

    const settings = autoBlockService.getSecuritySettings();
    const blockDurationMs = settings.block_duration_hours * 3600000;
    const cutoffTime = new Date(Date.now() - blockDurationMs);

    const expiredBlocks = await db.IpManagement.findAll({
      where: {
        is_blocked: true,
        blocked_at: {
          [Op.lte]: cutoffTime
        },
        blocked_by: null
      }
    });

    let unblockCount = 0;

    for (const ip of expiredBlocks) {
      try {
        await ipManagementService.unblockIP(ip.ip_address);

        await db.SecurityEvent.create({
          event_type: 'ip_blocked',
          ip_address: ip.ip_address,
          severity: 'low',
          details: {
            action: 'auto_unblock',
            reason: 'ブロック期間終了',
            duration_hours: settings.block_duration_hours
          }
        });

        unblockCount++;
        console.log(`✅ ${ip.ip_address} のブロックを解除しました`);
      } catch (error) {
        console.error(`❌ ${ip.ip_address} のブロック解除失敗:`, error);
      }
    }

    console.log(`✅ ${unblockCount}個のIPブロックを解除しました`);
    return unblockCount;
  } catch (error) {
    console.error('❌ 手動ブロック解除エラー:', error);
    throw error;
  }
};

module.exports = {
  startAutoUnblockScheduler,
  runManualUnblock
};

