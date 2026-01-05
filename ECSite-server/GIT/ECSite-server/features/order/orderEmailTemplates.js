/**
 * 주문 완료 이메일 템플릿 (3개 언어 지원: ko, en, ja)
 */

/**
 * 주문 완료 이메일 템플릿
 */
exports.orderConfirmationTemplate = (language, data) => {
    const { 
        userName, 
        orderNumber, 
        orderDate, 
        totalAmount, 
        products, 
        activationCodes,
        baseUrl 
    } = data;
    
    // 상품 목록 HTML 생성
    const productListHtml = products.map((product, index) => {
        const activationCode = activationCodes && activationCodes[index] 
            ? activationCodes[index].activation_code 
            : `ACTIVATION-${product.id}-${Date.now()}`;
        
        return `
            <div style="background-color: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; align-items: flex-start; gap: 16px;">
                    ${product.imageUrl ? `
                        <img src="${baseUrl}/${product.imageUrl}" alt="${product.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #E5E7EB;">
                    ` : `
                        <div style="width: 80px; height: 80px; background: #000000; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 24px;">
                            ${product.name.substring(0, 2)}
                        </div>
                    `}
                    <div style="flex: 1;">
                        <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                            ${product.name}
                        </h3>
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 12px 0;">
                            ${product.category_name || 'NLP'} • ¥${product.price.toLocaleString()}
                        </p>
                        <div style="background-color: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 8px; padding: 12px; margin-top: 12px;">
                            <p style="color: #6B7280; font-size: 12px; font-weight: 600; margin: 0 0 6px 0; text-transform: uppercase;">
                                🔑 アクティベーションコード
                            </p>
                            <code style="color: #1A1A1A; font-size: 16px; font-weight: 700; font-family: 'Courier New', monospace; word-break: break-all; display: block;">
                                ${activationCode}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 상품 적용 방법 안내 (언어별)
    const activationInstructions = {
        ko: `
            <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                    📌 AI開発者の適用方法
                </h3>
                <ol style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                    <li style="margin-bottom: 8px;">
                        <strong>AIDEプログラムを開く</strong><br>
                        <span style="font-size: 13px; color: #475569;">デスクトップまたはモバイルアプリでAIDEプログラムを起動してください。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>設定メニューにアクセス</strong><br>
                        <span style="font-size: 13px; color: #475569;">アプリの右上にある「設定」アイコン（⚙️）をタップします。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>アクティベーションセクションを選択</strong><br>
                        <span style="font-size: 13px; color: #475569;">設定メニューから「開発者ライセンス」または「アクティベーション」を選択します。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>コードを入力</strong><br>
                        <span style="font-size: 13px; color: #475569;">上記のアクティベーションコードをコピーして、入力欄に貼り付けます。コードは自動的に検証されます。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>確認と適用</strong><br>
                        <span style="font-size: 13px; color: #475569;">「アクティベート」ボタンをタップすると、AI開発者の機能が有効になります。数秒で完了します。</span>
                    </li>
                    <li>
                        <strong>使用開始</strong><br>
                        <span style="font-size: 13px; color: #475569;">アクティベーションが完了すると、プロジェクト作成時にこのAI開発者を選択できるようになります。</span>
                    </li>
                </ol>
                <p style="color: #64748B; font-size: 13px; margin-top: 16px; margin-bottom: 0;">
                    💡 <strong>ヒント:</strong> 複数のAI開発者をアクティベートすると、チーム機能で協力開発が可能になります。
                </p>
            </div>
        `,
        en: `
            <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                    📌 How to Apply AI Developer
                </h3>
                <ol style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                    <li style="margin-bottom: 8px;">
                        <strong>Open AIDE Program</strong><br>
                        <span style="font-size: 13px; color: #475569;">Launch the AIDE program on your desktop or mobile app.</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Access Settings Menu</strong><br>
                        <span style="font-size: 13px; color: #475569;">Tap the "Settings" icon (⚙️) in the top right corner of the app.</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Select Activation Section</strong><br>
                        <span style="font-size: 13px; color: #475569;">Choose "Developer License" or "Activation" from the settings menu.</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Enter Code</strong><br>
                        <span style="font-size: 13px; color: #475569;">Copy the activation code above and paste it into the input field. The code will be automatically verified.</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>Confirm and Apply</strong><br>
                        <span style="font-size: 13px; color: #475569;">Tap the "Activate" button to enable the AI developer features. This will complete in a few seconds.</span>
                    </li>
                    <li>
                        <strong>Start Using</strong><br>
                        <span style="font-size: 13px; color: #475569;">Once activated, you can select this AI developer when creating new projects.</span>
                    </li>
                </ol>
                <p style="color: #64748B; font-size: 13px; margin-top: 16px; margin-bottom: 0;">
                    💡 <strong>Tip:</strong> Activating multiple AI developers enables collaborative development through team features.
                </p>
            </div>
        `,
        ja: `
            <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="color: #1E40AF; margin-top: 0; font-size: 16px; font-weight: 700;">
                    📌 AI開発者の適用方法
                </h3>
                <ol style="color: #1E3A8A; line-height: 1.8; padding-left: 20px; margin: 10px 0;">
                    <li style="margin-bottom: 8px;">
                        <strong>AIDEプログラムを開く</strong><br>
                        <span style="font-size: 13px; color: #475569;">デスクトップまたはモバイルアプリでAIDEプログラムを起動してください。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>設定メニューにアクセス</strong><br>
                        <span style="font-size: 13px; color: #475569;">アプリの右上にある「設定」アイコン（⚙️）をタップします。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>アクティベーションセクションを選択</strong><br>
                        <span style="font-size: 13px; color: #475569;">設定メニューから「開発者ライセンス」または「アクティベーション」を選択します。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>コードを入力</strong><br>
                        <span style="font-size: 13px; color: #475569;">上記のアクティベーションコードをコピーして、入力欄に貼り付けます。コードは自動的に検証されます。</span>
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>確認と適用</strong><br>
                        <span style="font-size: 13px; color: #475569;">「アクティベート」ボタンをタップすると、AI開発者の機能が有効になります。数秒で完了します。</span>
                    </li>
                    <li>
                        <strong>使用開始</strong><br>
                        <span style="font-size: 13px; color: #475569;">アクティベーションが完了すると、プロジェクト作成時にこのAI開発者を選択できるようになります。</span>
                    </li>
                </ol>
                <p style="color: #64748B; font-size: 13px; margin-top: 16px; margin-bottom: 0;">
                    💡 <strong>ヒント:</strong> 複数のAI開発者をアクティベートすると、チーム機能で協力開発が可能になります。
                </p>
            </div>
        `
    };

    const templates = {
        ko: {
            subject: `[AIDE Market] 注文完了 - ${orderNumber}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="width: 80px; height: 80px; background: #000000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <span style="color: white; font-size: 48px;">✓</span>
                            </div>
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                購入完了！
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                ご購入ありがとうございます。AI開発者をご利用いただけます。
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                注文情報
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">注文番号</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600; font-family: monospace;">${orderNumber}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">注文日</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${orderDate}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">合計支払額</span>
                                <span style="color: #1A1A1A; font-size: 18px; font-weight: 700;">¥${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <h3 style="color: #1A1A1A; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">
                            購入したAI開発者
                        </h3>
                        ${productListHtml}

                        ${activationInstructions[language] || activationInstructions.ja}

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 30px 0; border-radius: 8px;">
                            <p style="color: #92400E; font-size: 14px; margin: 0; line-height: 1.6;">
                                <strong>⚠️ 重要:</strong> アクティベーションコードはご注文ごとに発行されます。コードを安全に保管してください。コードは一度のみ使用できます。
                            </p>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl}/confirmation" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                注文詳細を確認
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            ご質問やサポートが必要な場合は、<a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>までお気軽にお問い合わせください。
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        en: {
            subject: `[AIDE Market] Order Confirmation - ${orderNumber}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="width: 80px; height: 80px; background: #000000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <span style="color: white; font-size: 48px;">✓</span>
                            </div>
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                Purchase Complete!
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                Thank you for your purchase. Your AI developers are ready to use.
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                Order Information
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">Order Number</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600; font-family: monospace;">${orderNumber}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">Order Date</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${orderDate}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">Total Amount</span>
                                <span style="color: #1A1A1A; font-size: 18px; font-weight: 700;">¥${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <h3 style="color: #1A1A1A; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">
                            Purchased AI Developers
                        </h3>
                        ${productListHtml}

                        ${activationInstructions[language] || activationInstructions.en}

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 30px 0; border-radius: 8px;">
                            <p style="color: #92400E; font-size: 14px; margin: 0; line-height: 1.6;">
                                <strong>⚠️ Important:</strong> Activation codes are issued per order. Please keep your code safe. Each code can only be used once.
                            </p>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl}/confirmation" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                View Order Details
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            If you have any questions or need support, please feel free to contact us at <a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>.
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        },
        ja: {
            subject: `[AIDE Market] 注文完了 - ${orderNumber}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <div style="background-color: #000000; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">AIDE Market</h1>
                    </div>
                    
                    <div style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="width: 80px; height: 80px; background: #000000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <span style="color: white; font-size: 48px;">✓</span>
                            </div>
                            <h2 style="color: #1A1A1A; font-size: 28px; font-weight: 700; margin: 0 0 12px 0;">
                                購入完了！
                            </h2>
                            <p style="color: #6B7280; font-size: 16px; margin: 0;">
                                ご購入ありがとうございます。AI開発者をご利用いただけます。
                            </p>
                        </div>

                        <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                            <h3 style="color: #1A1A1A; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                                注文情報
                            </h3>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">注文番号</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600; font-family: monospace;">${orderNumber}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                                <span style="color: #6B7280; font-size: 14px;">注文日</span>
                                <span style="color: #1A1A1A; font-size: 14px; font-weight: 600;">${orderDate}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                                <span style="color: #6B7280; font-size: 14px;">合計支払額</span>
                                <span style="color: #1A1A1A; font-size: 18px; font-weight: 700;">¥${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <h3 style="color: #1A1A1A; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">
                            購入したAI開発者
                        </h3>
                        ${productListHtml}

                        ${activationInstructions[language] || activationInstructions.ja}

                        <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 30px 0; border-radius: 8px;">
                            <p style="color: #92400E; font-size: 14px; margin: 0; line-height: 1.6;">
                                <strong>⚠️ 重要:</strong> アクティベーションコードはご注文ごとに発行されます。コードを安全に保管してください。コードは一度のみ使用できます。
                            </p>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${baseUrl}/confirmation" style="display: inline-block; background-color: #000000; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                                注文詳細を確認
                            </a>
                        </div>

                        <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin-top: 40px;">
                            ご質問やサポートが必要な場合は、<a href="mailto:support@aidemarket.com" style="color: #1A1A1A; font-weight: 600;">support@aidemarket.com</a>までお気軽にお問い合わせください。
                        </p>
                    </div>

                    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} AIDE Market - AI Developer Marketplace
                        </p>
                    </div>
                </div>
            `
        }
    };

    // 지원하는 언어가 아니면 일본어로 폴백
    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ja';
    return templates[lang];
};

