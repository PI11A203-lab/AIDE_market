/**
 * 정기결제 관련 이메일 템플릿 (3개 언어 지원: ko, en, ja)
 */

/**
 * 결제 5일 전 안내 이메일 템플릿
 */
exports.paymentReminderTemplate = (language, data) => {
    const { userName, nextPaymentDate, amount, cardCompany, last4, productList, changeCardLink, couponLink, manageLink, reminderLink } = data;
    
    const templates = {
        ko: {
            subject: `[AIDE Market] 정기결제 안내 - ${nextPaymentDate}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">안녕하세요 ${userName}님,</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            다음 정기결제가 <strong>${nextPaymentDate}</strong>에 예정되어 있습니다.
                        </p>
                        
                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">결제 정보</h3>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>다음 결제일:</strong> ${nextPaymentDate}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>결제 금액:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>결제 수단:</strong> ${cardCompany} ****-****-****-${last4}</p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">결제 상품</h3>
                            ${productList}
                        </div>

                        <div style="margin: 30px 0;">
                            <h3 style="color: #1A1A1A;">액션</h3>
                            <p style="margin: 10px 0;">
                                <a href="${changeCardLink}" style="color: #6366F1; text-decoration: none;">카드 정보 변경</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${couponLink}" style="color: #6366F1; text-decoration: none;">쿠폰 입력 (학생 계정용)</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${manageLink}" style="color: #6366F1; text-decoration: none;">구독 관리</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${reminderLink}" style="color: #6366F1; text-decoration: none; font-weight: bold;">정기결제 안내 페이지</a>
                            </p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">결제 실패 시</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                결제가 실패할 경우, 상품 활성화 코드가 정지되며 3일의 유예 기간이 제공됩니다.<br>
                                유예 기간 내에 재결제하시면 즉시 서비스를 재개할 수 있습니다.
                            </p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            문의사항이 있으시면 고객센터로 연락주세요.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: `[AIDE Market] Subscription Payment Reminder - ${nextPaymentDate}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">Hello ${userName},</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            Your next subscription payment is scheduled for <strong>${nextPaymentDate}</strong>.
                        </p>
                        
                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">Payment Information</h3>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>Next Payment Date:</strong> ${nextPaymentDate}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>Amount:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>Payment Method:</strong> ${cardCompany} ****-****-****-${last4}</p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">Subscription Products</h3>
                            ${productList}
                        </div>

                        <div style="margin: 30px 0;">
                            <h3 style="color: #1A1A1A;">Actions</h3>
                            <p style="margin: 10px 0;">
                                <a href="${changeCardLink}" style="color: #6366F1; text-decoration: none;">Change Payment Method</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${couponLink}" style="color: #6366F1; text-decoration: none;">Apply Coupon (Student Account)</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${manageLink}" style="color: #6366F1; text-decoration: none;">Manage Subscription</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${reminderLink}" style="color: #6366F1; text-decoration: none; font-weight: bold;">Subscription Reminder Page</a>
                            </p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">If Payment Fails</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                If payment fails, product activation codes will be suspended and a 3-day grace period will be provided.<br>
                                If you make a payment within the grace period, service will resume immediately.
                            </p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: `[AIDE Market] 定期支払いのお知らせ - ${nextPaymentDate}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">${userName}様</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            次の定期支払いが <strong>${nextPaymentDate}</strong> に予定されています。
                        </p>
                        
                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">支払い情報</h3>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>次回支払い日:</strong> ${nextPaymentDate}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>支払い金額:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #4B5563; margin: 5px 0;"><strong>支払い方法:</strong> ${cardCompany} ****-****-****-${last4}</p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #1A1A1A; margin-top: 0;">購読商品</h3>
                            ${productList}
                        </div>

                        <div style="margin: 30px 0;">
                            <h3 style="color: #1A1A1A;">アクション</h3>
                            <p style="margin: 10px 0;">
                                <a href="${changeCardLink}" style="color: #6366F1; text-decoration: none;">カード情報変更</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${couponLink}" style="color: #6366F1; text-decoration: none;">クーポン入力 (学生アカウント用)</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${manageLink}" style="color: #6366F1; text-decoration: none;">購読管理</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <a href="${reminderLink}" style="color: #6366F1; text-decoration: none; font-weight: bold;">定期支払い案内ページ</a>
                            </p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">支払い失敗の場合</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                支払いが失敗した場合、商品アクティベーションコードが停止され、3日の猶予期間が提供されます。<br>
                                猶予期間内に再支払いすると、サービスが即座に再開されます。
                            </p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            ご質問がございましたら、カスタマーサポートまでお問い合わせください。
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        }
    };

    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 결제 성공 이메일 템플릿
 */
exports.paymentSuccessTemplate = (language, data) => {
    const { userName, orderNumber, amount, paymentDate, nextPaymentDate } = data;
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 정기결제 완료',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">안녕하세요 ${userName}님,</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            정기결제가 성공적으로 완료되었습니다.
                        </p>
                        
                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #065F46; margin-top: 0;">결제 정보</h3>
                            <p style="color: #047857; margin: 5px 0;"><strong>주문 번호:</strong> ${orderNumber}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>결제 금액:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>결제일:</strong> ${paymentDate}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>다음 결제일:</strong> ${nextPaymentDate}</p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            감사합니다.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: '[AIDE Market] Subscription Payment Completed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">Hello ${userName},</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            Your subscription payment has been completed successfully.
                        </p>
                        
                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #065F46; margin-top: 0;">Payment Information</h3>
                            <p style="color: #047857; margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>Amount:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>Payment Date:</strong> ${paymentDate}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>Next Payment Date:</strong> ${nextPaymentDate}</p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            Thank you.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: '[AIDE Market] 定期支払い完了',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">${userName}様</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            定期支払いが正常に完了しました。
                        </p>
                        
                        <div style="background-color: #D1FAE5; border: 2px solid #10B981; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #065F46; margin-top: 0;">支払い情報</h3>
                            <p style="color: #047857; margin: 5px 0;"><strong>注文番号:</strong> ${orderNumber}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>支払い金額:</strong> ¥${amount.toLocaleString()}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>支払い日:</strong> ${paymentDate}</p>
                            <p style="color: #047857; margin: 5px 0;"><strong>次回支払い日:</strong> ${nextPaymentDate}</p>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            ありがとうございます。
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        }
    };

    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 결제 실패 이메일 템플릿
 */
exports.paymentFailedTemplate = (language, data) => {
    const { userName, paymentDate, failureReason, gracePeriodEndDate, retryPaymentLink } = data;
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 정기결제 실패 안내',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">안녕하세요 ${userName}님,</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            정기결제 처리 중 문제가 발생했습니다.
                        </p>
                        
                        <div style="background-color: #FEE2E2; border: 2px solid #EF4444; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #991B1B; margin-top: 0;">실패 정보</h3>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>결제 시도일:</strong> ${paymentDate}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>실패 사유:</strong> ${failureReason}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>유예 기간:</strong> ${gracePeriodEndDate}까지</p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">중요 안내</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                결제 실패로 인해 상품 활성화 코드가 정지되었습니다.<br>
                                ${gracePeriodEndDate}까지 재결제하시면 서비스를 계속 이용하실 수 있습니다.
                            </p>
                        </div>

                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${retryPaymentLink}" style="background-color: #6366F1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                재결제하기
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            유예 기간 내 재결제 시 즉시 서비스가 재개됩니다.<br>
                            문의사항이 있으시면 고객센터로 연락주세요.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: '[AIDE Market] Subscription Payment Failed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">Hello ${userName},</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            A problem occurred while processing your subscription payment.
                        </p>
                        
                        <div style="background-color: #FEE2E2; border: 2px solid #EF4444; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #991B1B; margin-top: 0;">Failure Information</h3>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>Payment Attempt Date:</strong> ${paymentDate}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>Failure Reason:</strong> ${failureReason}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>Grace Period:</strong> Until ${gracePeriodEndDate}</p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">Important Notice</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                Product activation codes have been suspended due to payment failure.<br>
                                If you make a payment before ${gracePeriodEndDate}, you can continue using the service.
                            </p>
                        </div>

                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${retryPaymentLink}" style="background-color: #6366F1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                Retry Payment
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            Service will resume immediately if payment is made within the grace period.<br>
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: '[AIDE Market] 定期支払い失敗のお知らせ',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">${userName}様</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            定期支払いの処理中に問題が発生しました。
                        </p>
                        
                        <div style="background-color: #FEE2E2; border: 2px solid #EF4444; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="color: #991B1B; margin-top: 0;">失敗情報</h3>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>支払い試行日:</strong> ${paymentDate}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>失敗理由:</strong> ${failureReason}</p>
                            <p style="color: #DC2626; margin: 5px 0;"><strong>猶予期間:</strong> ${gracePeriodEndDate}まで</p>
                        </div>

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0;">
                            <h4 style="color: #92400E; margin-top: 0;">重要な通知</h4>
                            <p style="color: #78350F; margin: 5px 0; font-size: 14px;">
                                支払い失敗により、商品アクティベーションコードが停止されました。<br>
                                ${gracePeriodEndDate}までに再支払いすると、サービスを継続してご利用いただけます。
                            </p>
                        </div>

                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${retryPaymentLink}" style="background-color: #6366F1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                                再支払いする
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            猶予期間内に再支払いすると、サービスが即座に再開されます。<br>
                            ご質問がございましたら、カスタマーサポートまでお問い合わせください。
                        </p>
                    </div>
                    <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        }
    };

    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 구독 생성 완료 이메일 템플릿
 */
exports.subscriptionCreatedTemplate = (language, data) => {
    const { userName, nextPaymentDate, amount } = data;
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 정기결제 신청 완료',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">안녕하세요 ${userName}님,</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            정기결제 신청이 완료되었습니다.
                        </p>
                        <p style="color: #4B5563; line-height: 1.6;">
                            다음 결제일은 <strong>${nextPaymentDate}</strong>입니다.
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            감사합니다.
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: '[AIDE Market] Subscription Created',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">Hello ${userName},</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            Your subscription has been created successfully.
                        </p>
                        <p style="color: #4B5563; line-height: 1.6;">
                            Your next payment date is <strong>${nextPaymentDate}</strong>.
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            Thank you.
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: '[AIDE Market] 定期購読の申し込み完了',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">${userName}様</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            定期購読の申し込みが完了しました。
                        </p>
                        <p style="color: #4B5563; line-height: 1.6;">
                            次回の支払い日は <strong>${nextPaymentDate}</strong> です。
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            ありがとうございます。
                        </p>
                    </div>
                </div>
            `
        }
    };

    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 구독 취소 이메일 템플릿
 */
exports.subscriptionCancelledTemplate = (language, data) => {
    const { userName } = data;
    
    const templates = {
        ko: {
            subject: '[AIDE Market] 정기결제 취소 안내',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">안녕하세요 ${userName}님,</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            정기결제가 취소되었습니다.
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            감사합니다.
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: '[AIDE Market] Subscription Cancelled',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">Hello ${userName},</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            Your subscription has been cancelled.
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            Thank you.
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: '[AIDE Market] 定期購読のキャンセル',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #1A1A1A; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">AIDE Market</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1A1A1A;">${userName}様</h2>
                        <p style="color: #4B5563; line-height: 1.6;">
                            定期購読がキャンセルされました。
                        </p>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                            ありがとうございます。
                        </p>
                    </div>
                </div>
            `
        }
    };

    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

