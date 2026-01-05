// 이메일 전송 서비스
// Nodemailer를 사용하여 이메일을 전송합니다.

// 환경 변수 로드 (경로 명시적으로 지정)
const path = require('path');
const dotenv = require('dotenv');
// 상위 폴더의 .env 파일 참조 (이 파일은 features/user/ 폴더에 있음)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (err) {
    console.warn('nodemailer 패키지가 설치되지 않았습니다. npm install nodemailer를 실행하세요.');
    nodemailer = null;
}

/**
 * 이메일 전송 설정 가져오기
 */
const getEmailConfig = () => {
    // ⭐ 디버깅: 환경 변수 확인
    console.log('\n🔍 환경 변수 확인:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || '(기본값: kigawa.sakura.ne.jp)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '(기본값: 587)');
    console.log('SMTP_USER:', process.env.SMTP_USER || '(기본값: sumin@kigawa.net)');
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ 설정됨' : '❌ 설정 안됨');
    console.log('SMTP_SECURE:', process.env.SMTP_SECURE || '(기본값: false)');
    console.log('SMTP_FROM:', process.env.SMTP_FROM || '(기본값: sumin@kigawa.net)');
    
    // 환경 변수에서 SMTP 설정 가져오기 (기본값: sakura.ne.jp 서버)
    // 주의: 포트는 실제 서버 설정에 맞게 조정이 필요할 수 있습니다
    // 일반적인 포트: 587 (STARTTLS), 465 (SSL), 25 (일반)
    const config = {
        host: process.env.SMTP_HOST || 'kigawa.sakura.ne.jp',
        port: parseInt(process.env.SMTP_PORT || '587', 10), // 실제 서버 포트 확인 필요
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587/25
        auth: {
            user: process.env.SMTP_USER || 'sumin@kigawa.net',
            pass: process.env.SMTP_PASSWORD || 'YOUR_PASSWORD_HERE', // TODO: 실제 비밀번호로 변경 필요
        },
    };

    // 비밀번호가 기본값이면 null 반환 (이메일 전송 안 함)
    if (config.auth.pass === 'YOUR_PASSWORD_HERE') {
        console.log('❌ SMTP 비밀번호가 설정되지 않았습니다. (.env 파일에 SMTP_PASSWORD를 설정하세요)');
        return null;
    }

    // 설정이 모두 있는지 확인
    if (config.host && config.auth.user && config.auth.pass) {
        console.log('✅ SMTP 설정 완료 - 이메일 전송 가능');
        console.log(`   호스트: ${config.host}:${config.port} (secure: ${config.secure})`);
        console.log(`   사용자: ${config.auth.user}\n`);
        return config;
    }

    console.log('❌ SMTP 설정이 불완전합니다.\n');
    return null;
};

/**
 * 이메일 전송기 생성
 */
const createTransporter = () => {
    if (!nodemailer) {
        return null;
    }

    const config = getEmailConfig();
    
    if (!config) {
        // SMTP 설정이 없으면 null 반환 (개발 환경)
        return null;
    }

    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });
};

/**
 * 비밀번호 재설정 인증 코드 이메일 템플릿 생성 (다국어 지원)
 * @param {string} code - 6자리 인증 코드
 * @param {string} language - 언어 코드 ('ko', 'en', 'ja')
 * @returns {object} 이메일 템플릿 (subject, html, text)
 */
const getPasswordResetEmailTemplate = (code, language = 'ko') => {
    const templates = {
        ko: {
            subject: 'AIDE Market - 비밀번호 재설정 인증 코드',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">비밀번호 재설정 인증 코드</h2>
                    <p>안녕하세요,</p>
                    <p>비밀번호 재설정을 요청하셨습니다. 아래 인증 코드를 입력하여 비밀번호를 재설정하세요.</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">인증 코드</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        이 코드는 <strong>10분 동안만</strong> 유효합니다.<br>
                        만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
비밀번호 재설정 인증 코드

안녕하세요,

비밀번호 재설정을 요청하셨습니다. 아래 인증 코드를 입력하여 비밀번호를 재설정하세요.

인증 코드: ${code}

이 코드는 10분 동안만 유효합니다.
만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.

© AIDE Market - AI Developer Marketplace
            `.trim()
        },
        en: {
            subject: 'AIDE Market - Password Reset Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">Password Reset Verification Code</h2>
                    <p>Hello,</p>
                    <p>You have requested to reset your password. Please enter the verification code below to reset your password.</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">Verification Code</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        This code is valid for <strong>10 minutes only</strong>.<br>
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
Password Reset Verification Code

Hello,

You have requested to reset your password. Please enter the verification code below to reset your password.

Verification Code: ${code}

This code is valid for 10 minutes only.
If you did not request a password reset, you can safely ignore this email.

© AIDE Market - AI Developer Marketplace
            `.trim()
        },
        ja: {
            subject: 'AIDE Market - パスワードリセット認証コード',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">パスワードリセット認証コード</h2>
                    <p>こんにちは、</p>
                    <p>パスワードリセットをリクエストされました。以下の認証コードを入力してパスワードをリセットしてください。</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">認証コード</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        このコードは<strong>10分間のみ</strong>有効です。<br>
                        パスワードリセットをリクエストしていない場合は、このメールを無視していただいても結構です。
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
パスワードリセット認証コード

こんにちは、

パスワードリセットをリクエストされました。以下の認証コードを入力してパスワードをリセットしてください。

認証コード: ${code}

このコードは10分間のみ有効です。
パスワードリセットをリクエストしていない場合は、このメールを無視していただいても結構です。

© AIDE Market - AI Developer Marketplace
            `.trim()
        }
    };

    // 지원하는 언어가 아니면 한국어로 폴백
    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 비밀번호 재설정 인증 코드 이메일 전송
 * @param {string} email - 수신자 이메일
 * @param {string} code - 6자리 인증 코드
 * @param {string} language - 사용자 언어 설정 ('ko', 'en', 'ja'), 기본값: 'ko'
 */
exports.sendPasswordResetCode = async (email, code, language = 'ko') => {
    // 언어별 이메일 템플릿 가져오기
    const template = getPasswordResetEmailTemplate(code, language);
    
    // 이메일 내용
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
    };

    const transporter = createTransporter();

    // 이메일 전송기가 없으면 (개발 환경)
    if (!transporter) {
        const langLabels = { ko: '한국어', en: 'English', ja: '日本語' };
        const langLabel = langLabels[language] || '한국어';
        console.log('\n========================================');
        console.log(`📧 비밀번호 재설정 인증 코드 (개발 환경) - ${langLabel}`);
        console.log('========================================');
        console.log('수신자:', email);
        console.log('언어:', language, `(${langLabel})`);
        console.log('제목:', mailOptions.subject);
        console.log('인증 코드:', code);
        console.log('========================================\n');
        
        // 개발 환경에서는 코드를 반환하여 프론트엔드에서 사용할 수 있도록 함
        return {
            sent: false,
            code: code, // 개발 환경에서만 코드 반환
        };
    }

    try {
        // 실제 이메일 전송
        const info = await transporter.sendMail(mailOptions);
        console.log('이메일 전송 성공:', info.messageId);
        
        return {
            sent: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        
        // 이메일 전송 실패 시에도 개발 환경처럼 처리
        const langLabels = { ko: '한국어', en: 'English', ja: '日本語' };
        const langLabel = langLabels[language] || '한국어';
        console.log('\n========================================');
        console.log(`📧 비밀번호 재설정 인증 코드 (전송 실패 - 개발 모드) - ${langLabel}`);
        console.log('========================================');
        console.log('수신자:', email);
        console.log('언어:', language, `(${langLabel})`);
        console.log('제목:', mailOptions.subject);
        console.log('인증 코드:', code);
        console.log('========================================\n');
        
        throw new Error('이메일 전송에 실패했습니다. SMTP 설정을 확인하세요.');
    }
};

/**
 * 정기결제 관련 이메일 전송 함수들
 */
const subscriptionEmailTemplates = require('../subscription/emailTemplates');

/**
 * 결제 5일 전 안내 이메일 전송
 */
exports.sendPaymentReminderEmail = async (subscription, nextPaymentDate, baseUrl) => {
    const user = subscription.user;
    const language = subscription.user_language || user?.preferred_language || 'ko';
    
    // 상품 목록 HTML 생성
    const productList = subscription.items && subscription.items.length > 0
        ? subscription.items.map(item => {
            const product = item.product || {};
            return `<p style="margin: 5px 0; color: #4B5563;">- ${product.name || '상품'} (¥${(item.unit_price || 0).toLocaleString()}) × ${item.quantity || 1}</p>`;
        }).join('')
        : '<p style="color: #4B5563;">상품 정보 없음</p>';

    // 카드 정보
    const card = subscription.creditCard || {};
    const cardCompany = card.card_company || '카드';
    const last4 = '1234'; // 실제로는 카드 번호의 마지막 4자리

    // 가격 계산
    const priceCalculationService = require('../order/priceCalculationService');
    const amount = await priceCalculationService.calculateSubscriptionPrice(
        subscription.items,
        user,
        subscription.coupon
    );

    // 링크 생성
    const reminderToken = subscription.reminder_token;
    const reminderLink = `${baseUrl}/subscription/reminder/${reminderToken}`;
    const changeCardLink = `${baseUrl}/profile/settings`;
    const couponLink = `${baseUrl}/subscription/manage`;
    const manageLink = `${baseUrl}/subscription/manage`;

    const template = subscriptionEmailTemplates.paymentReminderTemplate(language, {
        userName: user?.username || '고객',
        nextPaymentDate,
        amount,
        cardCompany,
        last4,
        productList,
        changeCardLink,
        couponLink,
        manageLink,
        reminderLink
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user?.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 결제 안내 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user?.email);
        console.log('제목:', mailOptions.subject);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('결제 안내 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('결제 안내 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 결제 성공 이메일 전송
 */
exports.sendPaymentSuccessEmail = async (subscription, order, baseUrl) => {
    const user = subscription.user || {};
    const language = subscription.user_language || user?.preferred_language || 'ko';

    const template = subscriptionEmailTemplates.paymentSuccessTemplate(language, {
        userName: user.username || '고객',
        orderNumber: order.order_number || order.id,
        amount: order.total_amount || 0,
        paymentDate: new Date().toISOString().split('T')[0],
        nextPaymentDate: subscription.next_payment_date
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 결제 성공 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user.email);
        console.log('제목:', mailOptions.subject);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('결제 성공 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('결제 성공 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 결제 실패 이메일 전송
 */
exports.sendPaymentFailedEmail = async (subscription, reason, baseUrl) => {
    const user = subscription.user || {};
    const language = subscription.user_language || user?.preferred_language || 'ko';

    const template = subscriptionEmailTemplates.paymentFailedTemplate(language, {
        userName: user.username || '고객',
        paymentDate: new Date().toISOString().split('T')[0],
        failureReason: reason || '결제 처리 실패',
        gracePeriodEndDate: subscription.grace_period_end_date || '',
        retryPaymentLink: `${baseUrl}/subscription/payment-failed`
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 결제 실패 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user.email);
        console.log('제목:', mailOptions.subject);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('결제 실패 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('결제 실패 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 구독 생성 완료 이메일 전송
 */
exports.sendSubscriptionCreatedEmail = async (subscription, baseUrl) => {
    const user = subscription.user || {};
    const language = subscription.user_language || user?.preferred_language || 'ko';

    const priceCalculationService = require('../order/priceCalculationService');
    const amount = await priceCalculationService.calculateSubscriptionPrice(
        subscription.items,
        user,
        subscription.coupon
    );

    const template = subscriptionEmailTemplates.subscriptionCreatedTemplate(language, {
        userName: user.username || '고객',
        nextPaymentDate: subscription.next_payment_date,
        amount
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 구독 생성 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user.email);
        console.log('제목:', mailOptions.subject);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('구독 생성 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('구독 생성 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 구독 취소 이메일 전송
 */
exports.sendSubscriptionCancelledEmail = async (subscription, baseUrl) => {
    const user = subscription.user || {};
    const language = subscription.user_language || user?.preferred_language || 'ko';

    const template = subscriptionEmailTemplates.subscriptionCancelledTemplate(language, {
        userName: user.username || '고객'
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 구독 취소 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user.email);
        console.log('제목:', mailOptions.subject);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('구독 취소 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('구독 취소 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 학생 인증 완료 이메일 전송
 */
exports.sendStudentVerifiedEmail = async (user, baseUrl) => {
    const language = user.preferred_language || 'ko';
    
    // 갱신일 포맷팅
    const currentDate = new Date().toLocaleDateString(
        language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'ko-KR',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 학생 인증 완료',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                학생 인증 완료
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                안녕하세요 ${user.username}님,
                            </p>
                        </div>

                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #065F46; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                ✓ 인증 완료
                            </h3>
                            <p style="color: #047857; font-size: 16px; line-height: 1.6; margin: 0;">
                                학생 인증이 완료되었습니다. 이제 <strong>50% 할인 혜택</strong>을 받으실 수 있습니다.
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                인증 정보
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">사용자명</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${user.username}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">인증 완료일</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${currentDate}</span>
                            </div>
                        </div>

                        <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                            <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                                💡 할인 혜택 안내
                            </h3>
                            <ul style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                                <li style="margin-bottom: 8px;">모든 AI 개발자 상품 구매 시 <strong>50% 할인</strong> 적용</li>
                                <li style="margin-bottom: 8px;">정기 구독 상품에도 할인 혜택 적용</li>
                                <li style="margin-bottom: 8px;">할인은 자동으로 적용되며 별도 쿠폰 입력 불필요</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl || 'http://localhost:3000'}" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                마켓 둘러보기
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            문의사항이 있으시면 <a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>으로 연락주세요.
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                        <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">
                            갱신일: ${currentDate}
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: '[AIDE Market] Student Verification Completed',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                Student Verification Completed
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                Hello ${user.username},
                            </p>
                        </div>

                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #065F46; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                ✓ Verification Complete
                            </h3>
                            <p style="color: #047857; font-size: 16px; line-height: 1.6; margin: 0;">
                                Your student verification has been completed. You can now enjoy <strong>50% discount benefits</strong>.
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                Verification Information
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">Username</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${user.username}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">Verified Date</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${currentDate}</span>
                            </div>
                        </div>

                        <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                            <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                                💡 Discount Benefits
                            </h3>
                            <ul style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                                <li style="margin-bottom: 8px;"><strong>50% discount</strong> on all AI developer products</li>
                                <li style="margin-bottom: 8px;">Discount applies to subscription products as well</li>
                                <li style="margin-bottom: 8px;">Discount is applied automatically, no coupon code needed</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl || 'http://localhost:3000'}" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                Browse Marketplace
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            If you have any questions, please contact us at <a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>.
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                        <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">
                            Updated: ${currentDate}
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: '[AIDE Market] 学生認証完了',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                学生認証完了
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                ${user.username}様
                            </p>
                        </div>

                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #065F46; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                ✓ 認証完了
                            </h3>
                            <p style="color: #047857; font-size: 16px; line-height: 1.6; margin: 0;">
                                学生認証が完了しました。これで<strong>50%割引</strong>の特典を受けることができます。
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                認証情報
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">ユーザー名</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${user.username}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">認証完了日</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${currentDate}</span>
                            </div>
                        </div>

                        <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                            <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                                💡 割引特典について
                            </h3>
                            <ul style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                                <li style="margin-bottom: 8px;">すべてのAI開発者商品購入時に<strong>50%割引</strong>適用</li>
                                <li style="margin-bottom: 8px;">定期購読商品にも割引特典適用</li>
                                <li style="margin-bottom: 8px;">割引は自動的に適用され、クーポンコードの入力は不要です</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl || 'http://localhost:3000'}" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                マーケットを見る
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            ご質問がございましたら、<a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>までお気軽にお問い合わせください。
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                        <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">
                            更新日: ${currentDate}
                        </p>
                    </div>
                </div>
            `
        }
    };

    const template = templates[language] || templates.ko;
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('📧 학생 인증 완료 이메일 (개발 환경)');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('학생 인증 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 학생 인증 만료 이메일 전송
 */
exports.sendStudentExpiredEmail = async (user, baseUrl) => {
    const language = user.preferred_language || 'ko';
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 학생 인증 만료 안내',
            html: `<div><h2>안녕하세요 ${user.username}님,</h2><p>학생 인증이 만료되었습니다. 학생 할인 혜택을 계속 받으시려면 재인증이 필요합니다.</p></div>`
        },
        en: {
            subject: '[AIDE Market] Student Verification Expired',
            html: `<div><h2>Hello ${user.username},</h2><p>Your student verification has expired. Re-verification is required to continue receiving student discount benefits.</p></div>`
        },
        ja: {
            subject: '[AIDE Market] 学生認証の有効期限切れ',
            html: `<div><h2>${user.username}様</h2><p>学生認証の有効期限が切れました。学生割引の特典を継続して受けるには、再認証が必要です。</p></div>`
        }
    };

    const template = templates[language] || templates.ko;
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('📧 학생 인증 만료 이메일 (개발 환경)');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('학생 만료 이메일 전송 실패:', error);
        throw error;
    }
};

/**
 * 주문 완료 이메일 전송
 */
exports.sendOrderConfirmationEmail = async (order, user, baseUrl) => {
    if (!order || !user) {
        console.error('주문 또는 사용자 정보가 없습니다.');
        return { sent: false };
    }

    const language = user.preferred_language || 'ja';
    const orderEmailTemplates = require('../order/orderEmailTemplates');
    
    // 주문 상품 정보 가져오기
    const products = order.orderItems || [];
    const productData = products.map(item => ({
        id: item.product?.id || item.product_id,
        name: item.product?.name || '상품',
        price: item.product?.price || item.unit_price || 0,
        category_name: item.product?.category_name || 'NLP',
        imageUrl: item.product?.imageUrl || null
    }));

    // 액티베이션 코드 가져오기 (ProductActivation 테이블에서)
    const models = require('../../db/initializer');
    let activationCodes = [];
    try {
        activationCodes = await models.ProductActivation.findAll({
            where: { order_id: order.id },
            attributes: ['activation_code', 'product_id'],
            raw: true
        });
    } catch (err) {
        console.error('액티베이션 코드 조회 실패:', err);
    }

    // 주문 날짜 포맷팅
    const orderDate = order.purchased_at 
        ? new Date(order.purchased_at).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : new Date().toLocaleDateString();

    const template = orderEmailTemplates.orderConfirmationTemplate(language, {
        userName: user.username || 'お客様',
        orderNumber: order.order_number || order.id,
        orderDate: orderDate,
        totalAmount: order.total_amount || 0,
        products: productData,
        activationCodes: activationCodes,
        baseUrl: baseUrl || 'http://localhost:3000'
    });

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: user.email,
        subject: template.subject,
        html: template.html
    };

    const transporter = createTransporter();
    if (!transporter) {
        console.log('\n========================================');
        console.log('📧 주문 완료 이메일 (개발 환경)');
        console.log('========================================');
        console.log('수신자:', user.email);
        console.log('제목:', mailOptions.subject);
        console.log('주문 번호:', order.order_number || order.id);
        console.log('========================================\n');
        return { sent: false };
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('주문 완료 이메일 전송 성공:', info.messageId);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('주문 완료 이메일 전송 실패:', error);
        throw error;
    }
};

