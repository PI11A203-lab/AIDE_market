import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      common: {
        backHome: '홈으로 가기',
        loading: '로딩 중...',
        logout: '로그아웃',
        login: '로그인',
        close: '닫기',
        untitled: '제목 없음',
        unknown: '알 수 없음',
        other: '기타',
      },
      notifications: {
        team: {
          templateTeamDeleted: '템플릿 팀이 삭제되었습니다.',
          templateTeamDeleteFail: '템플릿 팀 삭제에 실패했습니다.',
          favoriteRemoved: '{{productName}}이(가) 찜목록에서 삭제되었습니다.',
          favoriteRemoveFail: '찜목록에서 삭제하는 데 실패했습니다.',
        },
        templates: {
          loginRequired: '로그인이 필요합니다.',
          cartAddedPartial: '{{count}}개 상품이 장바구니에 추가되었습니다. {{failedCount}}개 상품은 추가할 수 없습니다.',
          cartAdded: '{{count}}개 상품이 장바구니에 추가되었습니다.',
          cartAddAllFail: '모든 상품을 장바구니에 추가할 수 없습니다. (이미 구매했거나 장바구니에 있는 상품일 수 있습니다)',
          cartAddError: '장바구니 추가 중 오류가 발생했습니다.',
          noProductsToAdd: '추가할 상품이 없습니다.',
          teamAddedPartial: '{{count}}개 상품이 팀에 추가되었습니다. {{failedCount}}개 상품은 추가할 수 없습니다.',
          teamAdded: '{{count}}개 상품이 팀에 추가되었습니다.',
          teamAddAllFail: '팀에 추가할 수 있는 상품이 없습니다.',
          teamAddError: '팀 추가 중 오류가 발생했습니다.',
        },
        product: {
          productLoadFail: '상품 정보를 가져올 수 없습니다.',
          favoriteAdded: '{{productName}}이(가) 선택 가능한 AI 개발자 목록에 추가되었습니다.',
          favoriteAlreadyExists: '{{productName}}은(는) 이미 찜목록에 있습니다.',
          favoriteAddFail: '찜목록 추가에 실패했습니다.',
          favoriteRemoved: '찜목록에서 제거되었습니다.',
          favoriteAddedToFavorites: '찜목록에 추가되었습니다.',
          favoriteUpdateFail: '찜목록 업데이트에 실패했습니다.',
          selectRating: '별점을 선택해주세요.',
          loginRequired: '로그인이 필요합니다.',
          userInfoLoadFail: '사용자 정보를 불러올 수 없습니다.',
          reviewUpdated: '리뷰가 수정되었습니다.',
          ownReviewHelpful: '본인의 리뷰에는 helpful을 할 수 없습니다.',
          reviewDeleted: '리뷰가 삭제되었습니다.',
        },
        share: {
          linkCopied: '링크가 클립보드에 복사되었습니다.',
          linkCopyFail: '링크 복사에 실패했습니다.',
          instagramCopyInfo: '링크를 복사했습니다. Instagram 앱에서 붙여넣어 공유하세요.',
        },
        subscription: {
          cancelled: '구독이 취소되었습니다.',
          cancelFail: '구독 취소에 실패했습니다.',
          emailLinkInfo: '이메일 링크는 다음 결제 안내 이메일에서 확인할 수 있습니다.',
          loadFail: '구독 정보를 불러올 수 없습니다.',
        },
        purchase: {
          paymentMethodCheckError: '결제방법을 확인하는 중 오류가 발생했습니다.',
          loginRequired: '로그인이 필요합니다.',
        },
      },
      profile: {
        tabs: {
          purchases: '구매한 AI',
          reviews: '내 리뷰',
          teams: '내 팀',
          favorites: '즐겨찾기',
        },
        hero: {
          settings: '설정',
          followers: '팔로워',
          following: '팔로잉',
          github: 'GitHub',
        },
        purchases: {
          empty: '구매한 상품이 없습니다',
          orderNumber: '주문: {{number}}',
          status: {
            pending: '결제 대기',
            completed: '완료',
          },
          totalAmount: '총 금액',
          items: '{{count}}개',
        },
        reviews: {
          empty: '작성한 리뷰가 없습니다',
          selectRating: '별점을 선택해주세요.',
          loginRequired: '로그인이 필요합니다.',
          parseError: '사용자 정보를 불러올 수 없습니다.',
          updateSuccess: '리뷰가 수정되었습니다.',
          updateFail: '리뷰 수정에 실패했습니다.',
          deleteConfirm: '정말 이 리뷰를 삭제하시겠습니까?',
          noReviewId: '리뷰 ID를 찾을 수 없습니다.',
          noUserId: '사용자 ID를 찾을 수 없습니다.',
          deleteSuccess: '리뷰가 삭제되었습니다.',
          deleteFail: '리뷰 삭제에 실패했습니다.',
          deleteUnauthorized: '리뷰를 삭제할 권한이 없습니다.',
          deleteNotFound: '리뷰를 찾을 수 없습니다.',
          deleteServerError: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          ratingLabel: '별점',
          reviewContentLabel: '리뷰 내용',
          reviewPlaceholder: '리뷰를 작성해주세요...',
          save: '저장',
          cancel: '취소',
          expand: '확대',
          reviewImage: '리뷰 이미지 {{index}}',
          edit: '수정',
          delete: '삭제',
          ratingPoints: '{{rating}}점',
        },
        studentVerification: {
          page: {
            title: '학생 인증',
            subtitle: '학생 계정으로 인증하면 모든 상품에 50% 할인을 받을 수 있습니다',
            backToSettings: '프로필 설정으로 돌아가기',
            loading: '로딩 중...',
            loginRequired: '로그인이 필요합니다.',
            loadStatusError: '학생 인증 상태를 불러올 수 없습니다.',
            uploadSuccess: '✅ 학생 인증이 신청되었습니다. 관리자 검토 목록에 추가되었습니다.',
            uploadFail: '학생 인증 신청에 실패했습니다.',
            currentStatus: '현재 상태',
            statusBadge: {
              verified: '인증 완료',
              pending: '검토 중',
              notApplied: '미인증',
            },
            statusCard: {
              verifiedDate: '인증 완료일',
              expiryDate: '만료일',
              daysRemaining: '{{days}}일 남음',
              expired: '만료됨',
              discountApplied: '✓ 학생 할인 (50%)이 적용되고 있습니다',
              pendingTitle: '관리자 검토 대기 중입니다',
              pendingDescription: '학생증이 업로드되었습니다. 관리자 승인을 기다리고 있습니다.',
              notAppliedDescription: '학생 인증을 신청하려면 학생증 또는 재학증명서를 업로드해주세요.',
              expiredTitle: '학생 인증이 만료되었습니다',
              expiredDescription: '만료일: {{date}}',
              expiredRenew: '학생 할인을 계속 받으려면 학생증을 다시 업로드해주세요.',
            },
            upload: {
              title: '학생증 업로드',
              description: '다음 서류 중 하나를 업로드해주세요:',
              documentTypes: {
                studentId: '학생증 (앞면, 뒷면 모두 포함)',
                enrollment: '재학증명서',
                registration: '수강신청증 (최근 학기)',
              },
              selectFile: '파일 선택',
              uploadButton: '📤 학생 인증 신청하기',
              uploading: '업로드 중...',
              uploadNote: '업로드 버튼을 클릭하면 관리자 검토 목록에 표시됩니다',
              fileRequired: '학생증 파일을 선택해주세요.',
              fileReSelect: '파일을 다시 선택해주세요.',
              fileTypeError: '이미지 또는 PDF 파일만 업로드 가능합니다.',
              fileSizeError: '파일 크기는 10MB 이하여야 합니다.',
              disabledMessage: '현재 상태에서는 새 문서를 업로드할 수 없습니다.',
              uploadedMessage: '✓ 문서가 업로드되었습니다',
              viewDocument: '{{filename}} (클릭하여 확인)',
            },
            pendingAlert: {
              title: '⏳ 인증 대기 중',
              description: '학생증이 성공적으로 업로드되었습니다. 관리자 검토 후 승인됩니다.',
              note: '승인 완료까지 보통 1-2영업일이 소요됩니다.',
              adminButton: '관리자 페이지에서 승인하기',
            },
            guide: {
              title: '학생 인증 안내',
              item1: '학생 인증 시 모든 상품에 50% 할인이 자동으로 적용됩니다.',
              item2: '학생 할인은 쿠폰 할인과 중복 적용 가능하며, 최대 70%까지 할인됩니다.',
              item3: '학생 인증은 1년간 유효합니다. 만료 전에 갱신해주세요.',
              item4: '업로드된 문서는 관리자 검토 후 승인됩니다.',
              item5: '인증이 거부된 경우 고객센터로 문의해주세요.',
            },
          },
        },
        teams: {
          emptyTitle: '아직 생성된 팀이 없습니다',
          emptySubtitle: 'AI 개발자들로 나만의 팀을 구성해보세요',
          noDate: '날짜 없음',
          noMembers: '멤버 없음',
          synergy: 'Synergy',
          synergyScore: '팀 시너지 점수',
          membersTitle: '팀 멤버',
          createdAt: '생성일',
          memberCount: '팀원 수',
          deleteConfirm: '이 팀을 삭제하시겠습니까?',
          deleteSuccess: '팀이 삭제되었습니다.',
          deleteFail: '팀 삭제에 실패했습니다.',
          delete: '삭제',
          edit: '편집',
          membersLabel: '{{count}}명',
          categories: {
            image: '이미지 생성',
            infrastructure: '인프라',
            documents: '문서',
          },
        },
        favorites: {
          empty: '찜목록이 비어있습니다',
          removeSuccess: '찜목록에서 제거되었습니다.',
          removeFail: '찜목록에서 제거하는데 실패했습니다.',
          noProduct: '상품 정보를 찾을 수 없습니다.',
        },
        superAdmin: {
          layout: {
            title: '사이트 관리자',
            menuToggle: '메뉴 토글',
            closeMenu: '메뉴 닫기',
          },
          sidebar: {
            dashboard: '대시보드',
            products: '상품 승인 관리',
            studentVerifications: '학생 인증 관리',
            ipManagement: 'IP 관리',
            security: '보안',
          },
          dashboard: {
            title: '관리자 대시보드',
            subtitle: '시스템 전체의 관리 및 보안',
            loading: '로딩 중...',
            stats: {
              pendingProducts: '승인 대기 상품',
              pendingStudents: '학생 인증 신청',
              pendingSellerApplications: '판매자 신청 관리',
              todayAccess: '오늘의 접속',
              securityEvents: '보안 이벤트',
              attention: '주의',
              normal: '정상',
              noNewRequest: '신청 없음',
              noChange: '변화 없음',
            },
            recent: '최근',
            productRequest: '상품 신청',
            pending: '대기 중',
            today: '오늘',
            percent: '+0%',
            sections: {
              pendingProducts: '승인 대기 상품',
              recentActivity: '최근 활동',
            },
            table: {
              productName: '상품명',
              category: '카테고리',
              price: '가격',
              applicant: '신청자',
              requestDate: '신청일',
              status: '상태',
              time: '시각',
              event: '이벤트',
              detail: '상세',
            },
            empty: {
              noPendingProducts: '승인 대기 중인 상품이 없습니다',
              noRecentActivity: '최근 활동이 없습니다',
            },
          },
          products: {
            title: '상품 승인 관리',
            subtitle: '유저 상품의 승인·거부',
            loading: '로딩 중...',
            stats: {
              pending: '승인 대기',
            },
            filters: {
              status: '상태',
              all: '전체',
              pending: '승인 대기',
              approved: '승인 완료',
              rejected: '거부',
              search: '검색',
              searchPlaceholder: '상품명으로 검색...',
            },
            card: {
              applicant: '신청자',
              price: '가격',
              category: '카테고리',
              requestDate: '신청일',
              status: '상태',
              noDescription: '설명 없음',
            },
            actions: {
              approve: '✓ 승인',
              reject: '× 거부',
            },
            messages: {
              loadFail: '상품 목록을 불러오는데 실패했습니다.',
              approveSuccess: '상품이 승인되었습니다.',
              approveFail: '상품 승인에 실패했습니다.',
              rejectWarning: '거부 사유를 입력해주세요.',
              rejectSuccess: '상품이 거부되었습니다.',
              rejectFail: '상품 거부에 실패했습니다.',
            },
            rejectModal: {
              title: '상품 거부',
              content: '상품을 거부하는 이유를 입력해주세요.',
              placeholder: '거부 이유...',
              ok: '거부',
              cancel: '취소',
            },
            empty: '승인 대기 중인 상품이 없습니다',
          },
          studentVerifications: {
            title: '학생 인증 관리',
            subtitle: '학생 인증 신청의 승인·거부',
            loading: '로딩 중...',
            stats: {
              pending: '승인 대기',
            },
            filters: {
              search: '검색',
              searchPlaceholder: '이름 또는 메일로 검색...',
            },
            card: {
              requestDate: '신청일',
              status: '상태',
            },
            actions: {
              viewDocument: '📄 학생증 이미지 표시',
              approve: '✓ 승인',
              reject: '× 거부',
            },
            messages: {
              loadFail: '학생 인증 목록을 불러오는데 실패했습니다.',
              approveSuccess: '학생 인증이 승인되었습니다.',
              approveFail: '학생 인증 승인에 실패했습니다.',
              rejectWarning: '거부 사유를 입력해주세요.',
              rejectSuccess: '학생 인증이 거부되었습니다.',
              rejectFail: '학생 인증 거부에 실패했습니다.',
              documentLoadFail: '문서를 불러오는데 실패했습니다.',
            },
            documentModal: {
              title: '인증 문서',
              user: '사용자',
            },
            rejectModal: {
              title: '학생 인증 거부',
              content: '학생 인증을 거부하는 이유를 입력해주세요.',
              placeholder: '거부 이유...',
              ok: '거부',
              cancel: '취소',
            },
            empty: '승인 대기 중인 신청이 없습니다',
          },
          ipManagement: {
            title: 'IP 관리',
            subtitle: 'IP 접속 로그 및 차단 관리',
            loading: '로딩 중...',
            tabs: {
              logs: '접속 로그',
              management: '차단 관리',
              stats: '통계',
            },
            stats: {
              todayAccess: '오늘 접속',
              uniqueIPs: '고유 IP',
              blocked: '차단됨',
              countries: '국가 수',
              noChange: '변화 없음',
              new: '신규',
            },
            messages: {
              logsLoadFail: 'IP 로그를 불러오는데 실패했습니다.',
              managementLoadFail: 'IP 관리 목록을 불러오는데 실패했습니다.',
              statsLoadFail: '통계 로드 실패',
              blockSuccess: 'IP가 차단되었습니다.',
              blockFail: 'IP 차단에 실패했습니다.',
              unblockSuccess: 'IP 차단이 해제되었습니다.',
              unblockFail: 'IP 차단 해제에 실패했습니다.',
            },
            charts: {
              accessTrend: '접속 추이',
              accessTrendFetchFail: '접속 추이 가져오기 실패',
              countryDistribution: '국가별 접속 분포 (최근 7일)',
              countryDistributionFetchFail: '국가별 분포 가져오기 실패',
              hourlyAccess: '시간대별 접속 수 (최근 7일)',
              hourlyAccessFetchFail: '시간대별 접속 가져오기 실패',
              noData: '데이터가 없습니다',
              days7: '최근 7일',
              days14: '최근 14일',
              days30: '최근 30일',
              totalAccess: '총 접속 수',
              uniqueIP: '고유 IP',
              hour: '시각',
              accessCount: '접속 수',
            },
            filters: {
              ipAddress: 'IP 주소',
              ipSearch: 'IP 검색...',
              country: '국가',
              countrySearch: '국가 검색...',
            },
            table: {
              ipAddress: 'IP 주소',
              user: '사용자',
              page: '페이지',
              country: '국가/지역',
              time: '시각',
              status: '상태',
              state: '상태',
              reason: '이유',
              blockDate: '차단 일시',
              action: '액션',
              rank: '순위',
              accessCount: '접속 수',
            },
            status: {
              blocked: '차단됨',
              whitelisted: '화이트리스트',
              normal: '정상',
            },
            buttons: {
              unblock: '차단 해제',
              block: '차단',
            },
            empty: {
              noLogs: '로그가 없습니다',
              noIPManagement: 'IP 관리 데이터가 없습니다',
              noTopIPs: '데이터가 없습니다',
            },
            topIPs: {
              title: 'TOP 접속 IP 주소 (최근 7일)',
            },
          },
          security: {
            title: '보안 관리',
            subtitle: '보안 이벤트 및 봇 감지 관리',
            loading: '로딩 중...',
            tabs: {
              events: '보안 이벤트',
              bots: '봇 관리',
              settings: '보안 설정',
            },
            severity: {
              critical: '중요',
              high: '높음',
              medium: '중간',
              low: '낮음',
            },
            messages: {
              eventsLoadFail: '보안 이벤트를 불러오는데 실패했습니다.',
              botsLoadFail: '봇 목록을 불러오는데 실패했습니다.',
              settingsLoadFail: '설정 로드 실패',
              blockSuccess: '봇이 차단되었습니다.',
              blockFail: '봇 차단에 실패했습니다.',
              unblockSuccess: '봇 차단이 해제되었습니다.',
              unblockFail: '봇 차단 해제에 실패했습니다.',
              saveSuccess: '설정이 저장되었습니다.',
              saveFail: '설정 저장에 실패했습니다.',
            },
            charts: {
              eventTrend: '보안 이벤트 추이',
              eventTrendFetchFail: '이벤트 추이 가져오기 실패',
              eventDistribution: '이벤트 타입별 분포 (최근 7일)',
              eventDistributionFetchFail: '이벤트 분포 가져오기 실패',
              hourlyDistribution: '시간대별 분포 (최근 7일)',
              hourlyDistributionFetchFail: '시간대별 분포 가져오기 실패',
              noData: '데이터가 없습니다',
              days7: '최근 7일',
              days14: '최근 14일',
              days30: '최근 30일',
              loginFailed: '로그인 실패',
              botDetected: '봇 감지',
              apiAbuse: 'API 남용',
              scraping: '스크래핑',
              suspiciousActivity: '의심스러운 활동',
              ipBlocked: 'IP 차단',
            },
            settings: {
              title: '보안 설정',
              autoBlock: '자동 봇 차단',
              autoBlockDesc: '의심스러운 봇을 자동으로 차단합니다',
              botDetection: '봇 감지 임계값',
              botDetectionDesc: '이 값 이상의 신뢰도로 봇을 자동 차단합니다 (0-100)',
              maxLoginAttempts: '최대 로그인 시도 횟수',
              maxLoginAttemptsDesc: '이 횟수를 초과하면 자동으로 차단됩니다',
              blockDuration: '차단 지속 시간 (시간)',
              blockDurationDesc: '차단이 자동으로 해제될 때까지의 시간',
              save: '설정 저장',
            },
            filters: {
              eventType: '이벤트 타입',
              all: '전체',
              loginFailed: '로그인 실패',
              botDetected: '봇 감지',
              apiAbuse: 'API 남용',
              scraping: '스크래핑',
              suspiciousActivity: '의심스러운 활동',
              ipBlocked: 'IP 블록',
              severity: '심각도',
              critical: '중요',
              high: '높음',
              medium: '중간',
              low: '낮음',
              ipAddress: 'IP 주소',
              ipSearch: 'IP 검색...',
            },
            table: {
              time: '시각',
              eventType: '이벤트 타입',
              ipAddress: 'IP 주소',
              detail: '상세',
              severity: '심각도',
              status: '상태',
              userAgent: 'User-Agent',
              detectionReason: '검출 이유',
              confidence: '신뢰도',
              detectionTime: '검출 시각',
              action: '액션',
              rank: '순위',
              eventCount: '이벤트 수',
              maxSeverity: '최고 심각도',
            },
            status: {
              blocked: '차단됨',
              monitoring: '감시 중',
            },
            buttons: {
              block: '차단',
            },
            stats: {
              todayEvents: '오늘의 이벤트',
              botDetected: '봇 검출',
              autoBlocked: '자동 차단',
              loginFailed: '로그인 실패',
              noChange: '변화 없음',
            },
            empty: {
              noEvents: '이벤트가 없습니다',
              noBots: '봇이 검출되지 않았습니다',
              noAttackIPs: '공격 IP가 없습니다',
            },
            topAttackIPs: {
              title: 'TOP 공격 IP 주소 (최근 7일)',
            },
          },
          templates: {
            title: '템플릿 관리',
            subtitle: '프로젝트 유형별 AI 상품 세트를 관리합니다.',
            create: '템플릿 등록',
            edit: '템플릿 수정',
            table: {
              id: 'ID',
              name: '템플릿 이름',
              description: '설명',
              productCount: '포함 상품 수',
              createdAt: '생성일',
              action: '작업',
              view: '상세',
              edit: '수정',
              delete: '삭제',
            },
            form: {
              name: '템플릿 이름 *',
              namePlaceholder: '예: 웹 애플리케이션 개발',
              description: '설명',
              descriptionPlaceholder: '예: 풀스택 웹 앱을 만들기 위한 AI 세트',
              iconUrl: '아이콘 URL',
              iconUrlPlaceholder: '예: /images/templates/web.png',
              products: '포함 상품',
              selectedProducts: '선택된 상품',
              searchProducts: '상품 검색...',
              noProducts: '상품을 찾을 수 없습니다.',
              added: '추가됨',
              allCategories: '전체',
            },
            modal: {
              save: '저장',
              cancel: '취소',
            },
            messages: {
              nameRequired: '템플릿 이름을 입력해주세요.',
              createSuccess: '템플릿이 생성되었습니다.',
              updateSuccess: '템플릿이 수정되었습니다.',
              deleteSuccess: '템플릿이 삭제되었습니다.',
              deleteConfirm: '템플릿을 삭제하시겠습니까?',
              deleteConfirmOk: '삭제',
              deleteConfirmCancel: '취소',
              saveFail: '템플릿 저장에 실패했습니다.',
              deleteFail: '템플릿 삭제에 실패했습니다.',
            },
          },
          sellerApplications: {
            title: '판매자 신청 관리',
            filters: {
              all: '전체',
              pending: '대기중',
              approved: '승인됨',
              rejected: '반려됨',
            },
            table: {
              id: 'ID',
              applicant: '신청자',
              sellerName: '판매자명',
              email: '이메일',
              specialization: '전문분야',
              requestDate: '신청일',
              status: '상태',
              action: '작업',
              viewDetail: '상세보기',
            },
            status: {
              approved: '✅ 승인됨',
              rejected: '❌ 반려됨',
              pending: '⏳ 대기중',
            },
            messages: {
              loading: '로딩 중...',
              empty: '신청 내역이 없습니다.',
              loadFail: '신청 목록을 불러오는 중 오류가 발생했습니다.',
            },
            detail: {
              title: '판매자 신청 상세',
              backToList: '← 목록으로',
              validation: {
                title: '자동 검증 결과',
                score: '점 / 100점',
                messages: {
                  approved: '✔ 승인 권장',
                  review: '⚠ 검토 필요',
                  rejected: '✖ 승인 불가',
                },
                categories: {
                  requiredInfo: '필수 정보',
                  email: '이메일',
                  phone: '전화번호',
                  techStack: '기술 스택',
                  portfolio: '포트폴리오',
                  github: 'GitHub',
                  businessNumber: '사업자등록번호',
                  textQuality: '텍스트 품질',
                  specialization: '전문분야',
                },
                checkMessages: {
                  '필수 정보: 8/8 항목 완료': '필수 정보: 8/8 항목 완료',
                  '필수 정보: 일부 항목 누락': '필수 정보: 일부 항목 누락',
                  '이메일: 유효한 형식': '이메일: 유효한 형식',
                  '이메일: 형식 오류': '이메일: 형식 오류',
                  '기술 스택: 충분한 입력': '기술 스택: 충분한 입력',
                  '기술 스택: X 입력 부족': '기술 스택: 입력 부족',
                  '포트폴리오: URL 제공됨': '포트폴리오: URL 제공됨',
                  '포트폴리오: URL 없음': '포트폴리오: URL 없음',
                  'GitHub: URL 제공됨': 'GitHub: URL 제공됨',
                  'GitHub: URL 없음': 'GitHub: URL 없음',
                  '사업자등록번호: 제공됨': '사업자등록번호: 제공됨',
                  '사업자등록번호: 없음': '사업자등록번호: 없음',
                },
              },
              applicantInfo: {
                title: '신청자 정보',
                username: '아이디:',
                email: '이메일:',
                joinDate: '가입일:',
              },
              applicationInfo: {
                title: '판매자 신청 정보',
                sellerName: '판매자명:',
                contactEmail: '정산 이메일:',
                phone: '연락처:',
                specialization: '전문분야:',
                techStack: '기술 스택:',
                portfolio: '포트폴리오:',
                github: 'GitHub:',
                businessNumber: '사업자등록번호:',
                productDescription: '상품 설명',
                motivation: '신청 동기',
              },
              actions: {
                approve: '승인',
                reject: '반려',
              },
              rejectModal: {
                title: '반려 사유 입력',
                placeholder: '반려 사유를 입력하세요',
                ok: '반려 확인',
                cancel: '취소',
              },
              messages: {
                loading: '로딩 중...',
                loadFail: '상세 정보를 불러오는 중 오류가 발생했습니다.',
                approveConfirm: '이 신청을 승인하시겠습니까?',
                approveSuccess: '승인이 완료되었습니다.',
                approveFail: '승인 처리 중 오류가 발생했습니다.',
                rejectWarning: '반려 사유를 입력해주세요.',
                rejectSuccess: '반려 처리가 완료되었습니다.',
                rejectFail: '반려 처리 중 오류가 발생했습니다.',
                dataLoadFail: '데이터를 불러올 수 없습니다.',
              },
            },
          },
        },
        settings: {
          title: '설정',
          backToProfile: '프로필로 돌아가기',
          loading: '로딩 중...',
          personalInfo: {
            title: '개인정보',
            edit: '수정',
            cancel: '취소',
            save: '저장',
            username: '사용자명',
            usernamePlaceholder: '사용자명을 입력하세요',
            email: '이메일',
            emailPlaceholder: '이메일을 입력하세요',
            emailPublic: '공개',
            emailPrivate: '비공개',
            emailPublicDesc: '프로필 페이지에 이메일이 표시됩니다',
            emailPrivateDesc: '프로필 페이지에 이메일이 표시되지 않습니다',
            githubUrl: 'GitHub URL',
            githubUrlPlaceholder: 'https://github.com/username',
            developerType: '개발자 타입',
            developerTypeNone: '선택 안함',
            developerTypes: {
              frontend: '프론트엔드 개발자',
              backend: '백엔드 개발자',
              fullstack: '풀스택 개발자',
              mobile: '모바일 개발자',
              devops: 'DevOps 엔지니어',
              data: '데이터 엔지니어/과학자',
              security: '세큐리티 개발자',
              infrastructure: '인프라 엔지니어',
              server: '서버 개발자',
              management: '매니저먼트',
              other: '기타',
            },
            tags: '해시태그',
            tagsPlaceholder: '해시태그를 입력하고 Enter를 누르세요',
            addTag: '추가',
            currentPassword: '현재 비밀번호 (비밀번호 변경 시 필수)',
            currentPasswordPlaceholder: '현재 비밀번호를 입력하세요',
            newPassword: '새 비밀번호',
            newPasswordPlaceholder: '새 비밀번호를 입력하세요 (선택사항)',
            confirmPassword: '새 비밀번호 확인',
            confirmPasswordPlaceholder: '새 비밀번호를 다시 입력하세요',
            updateSuccess: '개인정보가 성공적으로 업데이트되었습니다.',
            updateFail: '업데이트에 실패했습니다.',
            updateError: '업데이트 중 오류가 발생했습니다.',
            passwordMismatch: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
            passwordMinLength: '비밀번호는 최소 6자 이상이어야 합니다.',
            passwordRequired: '현재 비밀번호를 입력해주세요.',
            unmountError: '컴포넌트가 언마운트되었습니다.',
          },
          paymentMethods: {
            title: '결제방법',
            add: '추가',
            cancel: '취소',
            save: '저장',
            delete: '삭제',
            paymentMethod: '결제 방법',
            creditCard: '신용카드',
            debitCard: '체크카드',
            cardCompany: '카드사',
            cardNumber: '카드 번호',
            cardNumberPlaceholder: '카드 번호를 입력하세요',
            expMonth: '만료 월',
            expYear: '만료 연도',
            cvc: 'CVC',
            expiryDate: '만료일',
            empty: '등록된 결제방법이 없습니다.',
            addSuccess: '결제방법이 추가되었습니다.',
            addFail: '결제방법 추가에 실패했습니다.',
            addError: '결제방법 추가 중 오류가 발생했습니다.',
            deleteConfirm: '이 결제방법을 삭제하시겠습니까?',
            deleteSuccess: '결제방법이 삭제되었습니다.',
            deleteFail: '결제방법 삭제에 실패했습니다.',
            deleteError: '결제방법 삭제 중 오류가 발생했습니다.',
            cannotDeleteLast: '최소 하나의 결제 수단은 등록되어 있어야 합니다. 새로운 결제 수단을 먼저 추가해주세요.',
            cannotDeleteLastTooltip: '마지막 결제 수단은 삭제할 수 없습니다. 새로운 결제 수단을 먼저 추가해주세요.',
            allFieldsRequired: '모든 필드를 입력해주세요.',
            cardNumberInvalid: '카드 번호는 13~19자리여야 합니다.',
            cvcInvalid: 'CVC는 3자리 또는 4자리여야 합니다.',
            expMonthInvalid: '만료 월은 1~12 사이여야 합니다.',
            expYearInvalid: '만료 연도가 유효하지 않습니다.',
          },
          studentVerification: {
            title: '학생 인증',
            manage: '학생 인증 관리',
            status: {
              verified: '인증 완료',
              pending: '인증 대기 중',
              expired: '인증 만료',
              notApplied: '미인증',
            },
            description: {
              verified: '학생 할인(50%)이 적용 중입니다.',
              verifiedWithExpiry: '학생 할인(50%)이 적용 중입니다. 만료까지 {{days}}일 남았습니다.',
              pending: '학생증이 업로드되었습니다. 관리자 검토 후 승인됩니다.',
              expired: '학생 인증이 만료되었습니다. 갱신해주세요.',
              notApplied: '학생 인증을 신청하면 모든 상품에 50% 할인을 받을 수 있습니다.',
            },
            labels: {
              verifiedDate: '인증 완료일:',
              expiryDate: '만료일:',
              status: '상태:',
              pendingStatus: '관리자 검토 대기 중',
            },
            info: {
              title: '학생 인증 안내',
              item1: '학생 인증 시 모든 상품에 50% 할인이 자동으로 적용됩니다.',
              item2: '학생 할인은 쿠폰 할인과 중복 적용 가능하며, 최대 70%까지 할인됩니다.',
              item3: '학생 인증은 1년간 유효합니다.',
            },
          },
        },
        admin: {
          sidebar: {
            dashboard: '대시보드',
            products: '상품',
            reviews: '리뷰',
            orders: '주문',
            upload: '상품 업로드',
          },
          upload: {
            title: '상품 업로드',
            subtitle: '새로운 상품을 등록하고 마켓플레이스에 추가하세요.',
          },
          hero: {
            github: 'GitHub',
            followers: '팔로워',
          },
          stats: {
            totalProducts: '총 상품',
            totalRevenue: '총 매출',
            followers: '팔로워',
            reviews: '리뷰',
          },
          recentProducts: {
            title: '내 상품 최근 5개',
            viewAll: '모든 상품 보기 →',
            empty: '등록된 상품이 없습니다',
            categoryFallback: 'AI 개발자',
          },
          recentReviews: {
            title: '최근 리뷰 3개',
            empty: '리뷰가 없습니다',
            productFallback: 'AI 개발자',
          },
          loading: '로딩 중...',
          orders: {
            title: '판매 내역',
            export: '내보내기',
            filters: {
              dateRange: '기간',
              product: '상품',
              statusLabel: '상태',
              sort: '정렬',
              reset: '초기화',
              dateOptions: {
                all: '전체',
                today: '오늘',
                week: '이번 주',
                month: '이번 달',
                quarter: '이번 분기',
                year: '올해',
              },
              productAll: '전체 상품',
              statusAll: '전체 상태',
              statusOptions: {
                completed: '완료',
                pending: '대기',
                cancelled: '취소',
              },
              sortOptions: {
                recent: '최신순',
                oldest: '오래된순',
                amountHigh: '금액(높은순)',
                amountLow: '금액(낮은순)',
              },
            },
            summary: {
              totalOrders: '총 주문수',
              thisMonth: '이번 달 매출',
              completed: '완료',
              pending: '대기',
              avgOrderValue: '평균 주문 금액',
            },
            table: {
              orderId: '주문 번호',
              product: '상품',
              buyer: '구매자',
              amount: '금액',
              status: '상태',
              date: '날짜',
              actions: '작업',
              view: '보기',
              statusText: {
                completed: '완료',
                pending: '대기',
                cancelled: '취소',
              },
            },
            empty: {
              title: '주문이 없습니다',
              desc: '주문 데이터가 없습니다.',
              descWithFilters: '조건을 변경하거나 리셋해보세요.',
            },
          },
          reviewsPage: {
            title: '리뷰 관리',
            subtitle: '상품에 대한 모든 리뷰를 관리하세요',
            filters: {
              search: '리뷰 검색',
              searchPlaceholder: '리뷰어 또는 내용으로 검색...',
              product: '상품',
              productAll: '전체 상품',
              rating: '평점',
              ratingAll: '전체 평점',
              ratingOption: {
                five: '5점',
                four: '4점',
                three: '3점',
                two: '2점',
                one: '1점',
              },
              sort: '정렬',
              sortOptions: {
                recent: '최신순',
                oldest: '오래된순',
                ratingHigh: '평점 높은순',
                ratingLow: '평점 낮은순',
                helpful: '도움순',
              },
              reset: '초기화',
            },
            summary: {
              totalReviews: '총 리뷰',
              averageRating: '평균 평점',
              thisMonth: '이번 달',
              positive: '긍정 (4-5★)',
              needsAttention: '주의 필요 (1-3★)',
            },
            statsCards: {
              reviews: '리뷰',
            },
            empty: {
              title: '리뷰가 없습니다',
              titleWithFilters: '조건에 맞는 리뷰가 없습니다',
              desc: '고객 리뷰가 등록되면 여기에 표시됩니다.',
              descWithFilters: '필터를 조정하여 다른 결과를 확인하세요.',
            },
            item: {
              userFallback: 'User',
              verified: '인증된 구매',
              notVerified: '미인증',
              helpful: '{{count}}명이 도움이 되었다고 표시',
              viewProduct: '상품 보기',
            },
          },
        },
      },
      teamBuilder: {
        introTitle: '이상적인 AI 팀을 구성해보세요',
        introSubtitle: '최대 {{max}}명까지 선택해 팀을 만들 수 있어요',
        availableTitle: '선택 가능한 AI 개발자',
        teamTitle: 'AI 팀',
        noDevelopers: '선택된 개발자가 없습니다',
        selectDevelopers: '개발자를 선택해주세요',
        teamTotal: '팀 합계',
        namePlaceholder: '팀 이름을 입력하세요',
        save: '팀 저장하기',
        saving: '저장 중...',
        tipTitle: '프로덕트 문서',
        tipDescription: '다양한 전문성을 가진 팀을 구성해 최고의 결과를 만들어보세요!',
        scrollLeft: '왼쪽으로 스크롤',
        scrollRight: '오른쪽으로 스크롤',
        templateTeams: '템플릿 팀',
        template: '템플릿',
        addTemplateTeam: '추가',
        memberUnit: '명',
        quickStartTitle: '빠른 시작을 위한 사전 구성 팀',
        templateCardAIs: '{{count}}개 AI · 시너지: {{synergy}}',
        messages: {
          selectMembers: '팀원을 선택해주세요.',
          loginRequired: '로그인이 필요합니다.',
          saveSuccess: '팀이 저장되었습니다!',
          saveFail: '팀 저장에 실패했습니다.',
        },
      },
      synergy: {
        label: '팀 시너지',
        exceptional: '최고 수준',
        excellent: '매우 우수',
        good: '좋음',
        keepBuilding: '조금 더 보강하세요',
      },
      chart: {
        title: '팀 스탯',
        explanation: '설명',
        explanationTitle: '육각형 그래프 설명',
        explanationDescription: '이 그래프는 팀의 6가지 능력을 시각화합니다. 각 능력은 0-100점으로 표시되며, 팀 전체의 평균값을 보여줍니다.',
        statsTitle: '능력 설명',
        stats: {
          teamwork: '팀워크: 다른 AI와의 협업 능력',
          stability: '안정성: 안정적이고 신뢰할 수 있는 성능',
          speed: '속도: 빠른 처리 및 응답 속도',
          creativity: '창의성: 새로운 아이디어와 혁신적 접근',
          productivity: '생산성: 효율적인 작업 처리 능력',
          maintainability: '유지보수성: 코드 품질 및 관리 용이성',
        },
        synergyNote: '팀을 구성할 때 각 능력의 균형을 고려하면 더 나은 시너지를 얻을 수 있습니다.',
        showIndividualComparison: '개별 상품 비교 보기',
        teamAverage: '팀 평균',
        legend: '범례',
      },
      teamBenefits: {
        title: 'AI 팀의 효과',
        subtitle: '개별 AI를 단독으로 사용할 때와 팀으로 조합했을 때의 성능 비교',
        avgImprovement: '평균 개선도',
        percentImprovement: '개선률',
        individual: '개별 평균',
        team: '팀 평균',
        tipTitle: '팀 구성의 이점',
        tipDescription: '여러 AI를 팀으로 구성하면 개별 상품의 약점을 보완하고 강점을 극대화하여 전체적인 성능이 크게 향상됩니다.',
      },
      developerCard: {
        teamwork: '팀워크',
        creative: '창의성',
        productivity: '생산성',
        add: '추가',
        remove: '제거',
        removeFromFavorites: '찜목록에서 삭제',
      },
      header: {
        title: 'AIDE Market',
      },
      auth: {
        login: {
          title: '로그인',
          emailLabel: '이메일 주소',
          emailPlaceholder: 'your@email.com',
          passwordLabel: '비밀번호',
          passwordPlaceholder: '••••••••',
          rememberMe: '로그인 상태 유지',
          forgotPassword: '비밀번호를 잊으셨나요?',
          signInButton: '로그인',
          signingIn: '로그인 중...',
          noAccount: '계정이 없으신가요?',
          signUpLink: '무료로 가입하기',
          success: '로그인에 성공했습니다.',
          fail: '로그인에 실패했습니다.',
          error: '로그인 중 오류가 발생했습니다.',
          errors: {
            invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
            userNotFound: '등록되지 않은 이메일 주소입니다. 이메일 주소를 확인해주세요.',
            wrongPassword: '비밀번호가 올바르지 않습니다. 비밀번호를 다시 확인해주세요.',
            googleAccount: '이 계정은 Google 로그인을 사용합니다. Google 로그인 버튼을 사용해주세요.',
            serverError: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          },
          terms: '서비스 약관',
          privacy: '개인정보 처리방침',
          agreeText: '로그인 시 다음에 동의하게 됩니다',
        },
        forgotPassword: {
          title: '비밀번호 찾기',
          subtitle: '비밀번호를 재설정하려면 이메일 주소를 입력하세요.',
          emailLabel: '이메일 주소',
          emailPlaceholder: 'your@email.com',
          submitButton: '재설정 링크 보내기',
          submitting: '전송 중...',
          backToLogin: '로그인으로 돌아가기',
          emailSent: '인증 코드가 이메일로 전송되었습니다. 이메일을 확인해주세요.',
          emailServerNotConfigured: '이메일 서버가 설정되지 않았습니다. 코드 표시: {{code}}',
          requestError: '비밀번호 재설정 요청 중 오류가 발생했습니다.',
        },
        resetPassword: {
          title: '비밀번호 재설정',
          subtitle: '새 비밀번호를 입력하세요.',
          newPasswordLabel: '새 비밀번호',
          confirmPasswordLabel: '비밀번호 확인',
          passwordPlaceholder: '••••••••',
          submitButton: '비밀번호 변경',
          submitting: '비밀번호 변경 중...',
          backToLogin: '로그인으로 돌아가기',
          success: '비밀번호가 성공적으로 변경되었습니다.',
          resetError: '비밀번호 재설정 중 오류가 발생했습니다.',
          invalidToken: '유효하지 않은 재설정 토큰입니다.',
          noToken: '토큰이 제공되지 않았습니다.',
          passwordMismatch: '비밀번호가 일치하지 않습니다.',
          passwordMinLength: '비밀번호는 최소 8자 이상이어야 합니다.',
          passwordRequired: '비밀번호를 입력해주세요.',
          confirmPasswordRequired: '비밀번호 확인을 입력해주세요.',
        },
        verifyCode: {
          title: '인증 코드 입력',
          subtitle1: '{{email}}로 전송된',
          subtitle2: '6자리 인증 코드를 입력해주세요.',
          codeLabel: '인증 코드',
          codeHint: '이메일로 전송된 6자리 숫자를 입력하세요',
          verifying: '확인 중...',
          verify: '확인',
          noEmail: '이메일 정보가 없습니다.',
          verifySuccess: '인증 코드가 확인되었습니다.',
          verifyError: '인증 코드 확인 중 오류가 발생했습니다.',
          noCodeReceived: '코드를 받지 못하셨나요?',
          resend: '다시 전송하기',
          devCodeInfo: '개발 환경 코드: {{code}}',
        },
        signup: {
          title: '계정 만들기',
          subtitle: '수천 명의 개발자들과 함께 놀라운 AI 솔루션을 만들어보세요',
          success: '회원가입에 성공했습니다.',
          fail: '회원가입에 실패했습니다. 다시 시도해주세요.',
          error: '회원가입 중 오류가 발생했습니다.',
          agreeText: '가입 시 다음에 동의하게 됩니다',
          terms: '서비스 약관',
          privacy: '개인정보 처리방침',
          usernameLabel: '사용자명',
          usernamePlaceholder: 'username',
          emailLabel: '이메일 주소',
          emailPlaceholder: 'your@email.com',
          passwordLabel: '비밀번호',
          passwordPlaceholder: '••••••••',
          confirmPasswordLabel: '비밀번호 확인',
          rememberMe: '로그인 상태 유지',
          creating: '계정 생성 중...',
          createButton: '계정 만들기',
          alreadyHaveAccount: '이미 계정이 있으신가요?',
          signIn: '로그인',
          errors: {
            usernameRequired: '사용자명을 입력해주세요.',
            usernameMinLength: '사용자명은 최소 3자 이상이어야 합니다.',
            usernameInvalid: '사용자명은 영문, 숫자, 언더스코어만 사용할 수 있습니다.',
            emailRequired: '이메일을 입력해주세요.',
            emailInvalid: '올바른 이메일 형식이 아닙니다.',
            passwordRequired: '비밀번호를 입력해주세요.',
            passwordMinLength: '비밀번호는 최소 8자 이상이어야 합니다.',
            confirmPasswordRequired: '비밀번호 확인을 입력해주세요.',
            passwordMismatch: '비밀번호가 일치하지 않습니다.',
          },
        },
      },
      home: {
        nav: {
          marketplace: '마켓플레이스',
          rankings: '랭킹',
          templates: '템플릿',
          teams: '팀',
          resources: '리소스',
        },
        searchPlaceholder: '개발자 검색...',
        heroTitle: '최고의 AI 개발자를 발견하고 함께 만들어가세요',
        heroSubtitle: '{{count}}개 이상의 검증된 AI 개발자가 당신의 아이디어를 실현할 준비가 되어 있습니다.\n지금 바로 팀을 구성해 보세요.',
        heroPrimary: '지금 탐색',
        heroSecondary: '더 알아보기',
        rankingTitle: '이달의 Top Ranking',
        rankingSubtitle: '이번 달 최고의 성과를 낸 AI 개발자',
        viewAll: '전체 보기',
        seeAll: '전체 보기',
        sort: {
          download: '다운로드 순',
          rating: '평점 높은 순',
          price: '가격 낮은 순',
          priceDesc: '최근 등록 순',
        },
        tabs: {
          all: '전체',
          fe: '프론트엔드',
          be: '백엔드',
          design: '디자인',
          mg: 'AI/ML',
          inf: '인프라',
          sec: '보안',
          doc: '문서',
        },
        ranking: {
          projects: '프로젝트',
          skill: '스킬',
        },
        recommended: {
          title: '추천 AI 개발자',
          subtitle: '당신의 취향에 맞춰 선별된 AI 개발자',
        },
        pagination: {
          prev: '이전',
          next: '다음',
        },
        noProducts: '해당하는 상품이 없습니다',
        sellerApplyLink: 'AI 개발자로서 당신의 제품을 판매하고 수익을 창출하세요. 판매자로 전환하여 마켓플레이스에서 상품을 등록하고 판매할 수 있습니다.',
        sellerApplyClickHere: '여기를 클릭하세요',
      },
      templates: {
        pageTitle: 'AI 프로젝트 템플릿',
        pageSubtitle: '프로젝트 유형별로 필요한 AI 상품을 한눈에 확인하고 선택하세요',
        categories: {
          all: '전체',
          web: '웹개발',
          app: '어플개발',
          data: '데이터 분석',
          document: '문서',
          image: '이미지생성',
        },
        empty: '등록된 템플릿이 없습니다.',
        productCount: '{{count}}개의 AI 상품',
        featured: {
          title: '추천 템플릿',
        },
        detail: {
          backToList: '템플릿 목록으로 돌아가기',
          purchased: '{{count}}명이 구매했습니다',
          aiProducts: '{{count}}개의 AI 상품',
          buyNow: '바로 구매',
          addToCart: '장바구니에 추가',
          addToTeam: '팀으로 추가',
          projectDescription: '프로젝트 설명',
          whySelected: '왜 이 AI로 구성되었나요?',
          aiDescriptions: '어떤 AI인가요?',
          compatibilityTable: 'AI 적합성 비교표',
          projectType: '프로젝트 유형',
          verySuitable: '매우 적합',
          suitable: '적합',
          normal: '보통',
          unsuitable: '부적합',
          templateProducts: '이 템플릿의 상품',
        },
      },
      resources: {
        pageTitle: '리소스',
        pageSubtitle: 'AI 개발자를 더 효과적으로 활용하기 위한 가이드, 템플릿, 그리고 유용한 자료들',
        categories: {
          all: '전체',
          guide: '가이드',
          category: '카테고리별',
          faq: 'FAQ',
          template: '템플릿',
          stats: '통계',
        },
        empty: '검색 결과가 없습니다.',
        items: {
          guide1: {
            title: 'AI 개발자 활용 가이드',
            description: 'AIDE Market에서 AI 개발자를 처음 사용하는 분들을 위한 완벽한 시작 가이드입니다. 계정 생성부터 첫 프로젝트 완성까지 단계별로 안내합니다.',
            content: `## AI 개발자 활용 가이드

### 1단계: 계정 설정
- 회원가입 및 프로필 설정
- 관심 카테고리 선택
- 학생 인증으로 50% 할인 받기

### 2단계: AI 개발자 탐색
- 마켓플레이스에서 원하는 개발자 검색
- 카테고리별 필터링 활용
- 평점 및 리뷰 확인

### 3단계: 개발자 선택
- 프로젝트 요구사항 분석
- 예산 계획 수립
- 여러 개발자 비교 검토

### 4단계: 프로젝트 시작
- 개발자 구매 및 다운로드
- 프로젝트에 통합
- 지속적인 협업 및 관리

### 팁
- 무료 체험 버전 활용하기
- 팀 기능으로 여러 개발자 조합하기
- 정기 업데이트 확인하기`,
          },
          guide2: {
            title: '팀 구성 최적화 가이드',
            description: '최대 10명의 AI 개발자로 강력한 팀을 구성하는 방법과 시너지 효과를 극대화하는 전략을 배워보세요. 팀 빌딩의 베스트 프랙티스를 제공합니다.',
            content: `## 팀 구성 최적화 가이드

### 팀 구성 전략
1. **역할 분담**: 각 개발자의 전문 분야를 고려
   - 프론트엔드: UI/UX 구현
   - 백엔드: 서버 및 API 개발
   - 디자인: 시각적 요소 디자인
   - 인프라: 배포 및 관리

2. **시너지 효과**: 다양한 카테고리 조합으로 +20% 성능 향상
   - 상호 보완적 기술 스택 선택
   - 커뮤니케이션 스킬 고려

3. **예산 최적화**
   - 필수 개발자 우선 선택
   - 프로젝트 단계별 팀 확장

### 추천 팀 조합
- **웹 애플리케이션**: 프론트엔드 + 백엔드 + 디자인
- **API 서비스**: 백엔드 + 인프라 + 보안
- **모바일 앱**: 프론트엔드 + 디자인 + 백엔드

### 시너지 점수 계산
- 기본 스탯 평균 + 팀 크기 보너스 + 다양성 보너스`,
          },
          guide3: {
            title: 'AI 개발자 평가 가이드',
            description: 'AI 개발자를 선택할 때 고려해야 할 요소와 평가 기준을 알아보세요. 평점, 리뷰, 기술 스택, 가격 등을 종합적으로 평가하는 방법을 안내합니다.',
            content: `## AI 개발자 평가 가이드

### 평가 항목

#### 1. 기술적 역량
- **평점**: 4.5 이상 권장
- **기술 스택**: 프로젝트 요구사항과 일치 여부
- **업데이트 주기**: 최근 업데이트 날짜 확인

#### 2. 사용자 리뷰
- **리뷰 수**: 충분한 리뷰가 있는지 확인
- **평균 평점**: 전체적인 평가 확인
- **상세 리뷰**: 실제 사용 경험 확인

#### 3. 가격 대비 성능
- **비용**: 예산 내에서 최적의 선택
- **기능**: 제공 기능이 가격에 적합한지
- **할인**: 학생 할인, 프로모션 활용

#### 4. 커뮤니티 지원
- **문서화**: 문서의 완성도
- **예제**: 사용 예제 제공 여부
- **지원**: 문제 해결 지원 여부

### 체크리스트
- [ ] 프로젝트 요구사항과 기술 스택 일치
- [ ] 평점 4.5 이상
- [ ] 최근 3개월 이내 업데이트
- [ ] 리뷰 10개 이상
- [ ] 예산 내 가격
- [ ] 충분한 문서화

### 비교 방법
1. 여러 개발자 나열
2. 평가 항목별 점수 매기기
3. 종합 점수로 비교
4. 실제 리뷰 확인 후 최종 결정`,
          },
          category1: {
            title: '프론트엔드 AI 활용법',
            description: 'React, Vue, Next.js 등 프론트엔드 개발에 특화된 AI 개발자들을 활용하여 효율적인 웹 개발을 시작하세요. 컴포넌트 개발부터 상태 관리까지 다룹니다.',
            content: `## 프론트엔드 AI 활용법

### 주요 활용 분야
- **컴포넌트 개발**: 재사용 가능한 UI 컴포넌트 자동 생성
- **상태 관리**: Redux, Context API 등 상태 관리 패턴 구현
- **스타일링**: CSS-in-JS, Tailwind CSS 스타일 자동 생성
- **성능 최적화**: 번들 크기 최적화, 코드 스플리팅

### 추천 개발자
1. **React 전문가**: 컴포넌트 아키텍처 설계
2. **TypeScript 전문가**: 타입 안정성 향상
3. **디자인 시스템 전문가**: 일관된 UI 구현

### 실전 예제
\`\`\`jsx
// AI가 생성한 컴포넌트 예시
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
};
\`\`\``,
          },
          category2: {
            title: '백엔드 AI 활용법',
            description: 'Node.js, Python, Go 등 백엔드 인프라와 API 개발을 위한 AI 개발자들을 활용하는 방법을 알아보세요. 데이터베이스 설계부터 마이크로서비스 아키텍처까지.',
            content: `## 백엔드 AI 활용법

### 주요 활용 분야
- **API 개발**: RESTful API, GraphQL 엔드포인트 생성
- **데이터베이스**: 스키마 설계, 쿼리 최적화
- **인증/보안**: JWT, OAuth 구현
- **마이크로서비스**: 서비스 분리 및 통신 설계

### 추천 개발자
1. **API 설계 전문가**: RESTful API 구조 설계
2. **데이터베이스 전문가**: 효율적인 스키마 설계
3. **보안 전문가**: 인증 및 보안 패턴 구현

### 실전 예제
\`\`\`javascript
// AI가 생성한 API 라우트 예시
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
\`\`\``,
          },
          category3: {
            title: '디자인 AI 활용법',
            description: 'Figma, Adobe XD 등 디자인 도구와 연동하여 UI/UX 디자인 프로세스에 AI 개발자를 통합하세요. 디자인 시스템부터 프로토타이핑까지.',
            content: `## 디자인 AI 활용법

### 주요 활용 분야
- **디자인 시스템**: 일관된 컴포넌트 라이브러리 구축
- **프로토타이핑**: 빠른 프로토타입 제작
- **사용자 경험**: UX 플로우 설계 및 개선
- **시각적 요소**: 아이콘, 일러스트레이션 생성

### 추천 개발자
1. **UI 디자이너**: 인터페이스 디자인
2. **UX 연구원**: 사용자 경험 개선
3. **브랜딩 전문가**: 일관된 브랜드 아이덴티티

### 디자인 워크플로우
1. 와이어프레임 설계
2. 시각적 디자인 작업
3. 프로토타입 제작
4. 개발자와 협업`,
          },
          faq1: {
            title: '자주 묻는 질문 (FAQ)',
            description: 'AIDE Market 이용 시 가장 자주 묻는 질문과 답변을 모았습니다. 계정, 결제, 기술 지원 등 다양한 주제를 다룹니다.',
            content: `## 자주 묻는 질문

### 계정 관련
**Q: 회원가입은 어떻게 하나요?**
A: 상단 헤더의 "로그인" 버튼을 클릭하고 "회원가입"을 선택하세요. 이메일 인증 후 계정을 생성할 수 있습니다.

**Q: 학생 할인을 받으려면?**
A: 프로필 설정에서 학생 인증을 신청하세요. 학생증을 업로드하면 50% 할인 혜택을 받을 수 있습니다.

### 구매 및 결제
**Q: 구매한 AI 개발자는 어떻게 사용하나요?**
A: 구매 후 다운로드 섹션에서 다운로드하고 프로젝트에 통합하세요.

**Q: 환불이 가능한가요?**
A: 구매 후 7일 이내 환불이 가능합니다. 문제가 있으시면 고객 지원팀에 문의하세요.

### 기술 지원
**Q: AI 개발자와 관련된 문제가 발생했어요**
A: 각 개발자의 리뷰 섹션에서 도움을 받거나, 커뮤니티 포럼에서 질문하세요.`,
          },
          faq2: {
            title: '결제 및 구매 가이드',
            description: '상품 구매부터 결제, 다운로드까지의 전체 프로세스를 자세히 안내합니다. 결제 방법, 할인 쿠폰, 주문 관리 등을 다룹니다.',
            content: `## 결제 및 구매 가이드

### 구매 프로세스
1. **상품 선택**: 마켓플레이스에서 원하는 AI 개발자 선택
2. **장바구니 추가**: 쇼핑 카트 아이콘 클릭
3. **결제 진행**: 구매 페이지에서 결제 정보 입력
4. **다운로드**: 결제 완료 후 즉시 다운로드 가능

### 결제 방법
- **신용카드**: Visa, Mastercard, JCB 지원
- **계좌이체**: 온라인 계좌이체 가능
- **간편결제**: PayPal, Stripe 등

### 할인 혜택
- 학생 인증: 50% 할인
- 쿠폰 코드: 프로모션 코드 입력
- 팀 구매: 5명 이상 구매 시 추가 할인

### 주문 관리
- 주문 내역: 프로필 > 구매한 AI에서 확인
- 영수증: 이메일로 자동 발송
- 다운로드: 구매한 AI 페이지에서 재다운로드 가능`,
          },
          template1: {
            title: '프로젝트 템플릿',
            description: '다양한 프로젝트 유형에 맞춘 스타터 템플릿을 다운로드하세요. React, Vue, Next.js, Node.js 등 인기 프레임워크 템플릿 제공.',
            content: `## 프로젝트 템플릿

### 제공 템플릿 목록

#### 웹 애플리케이션
- **React + TypeScript**: 모던 React 애플리케이션 템플릿
- **Next.js + Tailwind CSS**: SEO 최적화된 웹사이트
- **Vue 3 + Vite**: 빠른 개발 환경 구성

#### 백엔드 서비스
- **Node.js + Express**: RESTful API 서버
- **Python + FastAPI**: 고성능 API 서버
- **Go + Gin**: 경량 마이크로서비스

#### 풀스택
- **Next.js + Prisma**: 풀스택 타입 안전 애플리케이션
- **Remix + PostgreSQL**: 서버 사이드 렌더링 앱

### 사용 방법
1. 템플릿 선택 및 다운로드
2. 의존성 설치: \`npm install\`
3. 환경 변수 설정
4. 개발 서버 실행: \`npm run dev\`

### 커스터마이징
- 템플릿을 기반으로 원하는 대로 수정 가능
- AI 개발자를 추가하여 기능 확장`,
          },
          template2: {
            title: '코드 스니펫 라이브러리',
            description: '자주 사용하는 코드 스니펫과 예제를 검색하고 활용하세요. 인증, API 통신, 폼 처리 등 실무에서 바로 사용 가능한 코드 제공.',
            content: `## 코드 스니펫 라이브러리

### 카테고리별 스니펫

#### 인증 & 보안
- JWT 토큰 생성 및 검증
- 비밀번호 해싱 (bcrypt)
- OAuth 로그인 구현

#### API 통신
- Axios 인터셉터 설정
- 에러 핸들링
- 리트라이 로직

#### 폼 처리
- React Hook Form 예제
- 유효성 검사
- 파일 업로드

#### 데이터베이스
- ORM 쿼리 예제
- 트랜잭션 처리
- 관계형 쿼리

### 사용 예제
\`\`\`javascript
// JWT 토큰 검증 예제
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
\`\`\`

### 기여하기
- 유용한 스니펫을 커뮤니티에 공유하세요
- 개선 제안을 환영합니다`,
          },
          stats1: {
            title: '마켓 트렌드 분석',
            description: '인기 카테고리와 최신 트렌드를 확인하여 프로젝트에 적용해보세요. 월간 통계와 카테고리별 인기도를 제공합니다.',
            content: `## 마켓 트렌드 분석

### 이번 달 인기 카테고리
1. **프론트엔드** (35%): React, Next.js 관련 개발자 인기
2. **AI/ML** (28%): 머신러닝 모델 개발 수요 증가
3. **백엔드** (22%): API 및 서버 인프라 개발
4. **디자인** (15%): UI/UX 디자인 서비스

### 트렌드 인사이트
- **TypeScript**: 점점 더 많은 프로젝트에서 타입 안정성 요구
- **클라우드 네이티브**: 인프라 자동화 수요 증가
- **접근성**: 웹 접근성(A11y) 중요성 증가

### 성장 추세
- 월간 신규 개발자: +15%
- 평균 평점: 4.7/5.0
- 사용자 만족도: 92%

### 추천 조합
현재 가장 인기 있는 팀 조합:
- 프론트엔드 + 백엔드 + 디자인 (시너지 +18%)`,
          },
          stats2: {
            title: '성공 사례',
            description: 'AIDE Market을 활용하여 성공한 프로젝트 사례들을 살펴보세요. 스타트업부터 기업 프로젝트까지 다양한 성공 스토리를 확인할 수 있습니다.',
            content: `## 성공 사례

### 스타트업 프로젝트
**이커머스 플랫폼 구축**
- 팀 구성: 프론트엔드 + 백엔드 + 디자인 (3명)
- 기간: 3개월
- 결과: MVP 완성 및 시리즈 A 투자 유치

### 기업 프로젝트
**내부 관리 시스템 구축**
- 팀 구성: 프론트엔드 + 백엔드 + 인프라 (5명)
- 기간: 6개월
- 결과: 개발 시간 50% 단축, 운영 효율성 향상

### 개인 프로젝트
**포트폴리오 웹사이트**
- 팀 구성: 프론트엔드 + 디자인 (2명)
- 기간: 2주
- 결과: 취업 성공 및 GitHub 스타 500+ 획득

### 주요 성공 요소
1. 적절한 개발자 선택
2. 명확한 프로젝트 목표
3. 지속적인 커뮤니케이션
4. 팀 시너지 효과 활용

### 후기
"AI 개발자들을 활용하여 빠르게 프로토타입을 만들 수 있었고, 
실제 서비스 출시까지 시간을 크게 단축할 수 있었습니다." - 프로젝트 리더`,
          },
        },
      },
      subscription: {
        manage: {
          title: '구독 관리',
          subtitle: '정기결제 구독을 관리하고 결제 정보를 확인하세요',
          loginRequired: '로그인이 필요합니다.',
          loadFail: '구독 목록을 불러올 수 없습니다.',
          failedTitle: '결제 실패한 구독이 있습니다',
          failedDescription: '{{count}}개의 구독 결제가 실패했습니다. 유예 기간 내에 재결제해주세요.',
          goToFailedPage: '결제 실패 페이지로 이동',
          activeTitle: '활성 구독',
          otherTitle: '기타 구독',
          emptyTitle: '구독이 없습니다',
          emptyDescription: '정기결제 구독을 시작하려면 상품을 구매할 때 정기결제 옵션을 선택하세요.',
          browseProducts: '상품 둘러보기',
        },
        paymentFailed: {
          title: '결제 실패 관리',
          subtitle: '결제가 실패한 구독을 확인하고 재결제해주세요',
          loginRequired: '로그인이 필요합니다.',
          loadFail: '구독 목록을 불러올 수 없습니다.',
          emptyTitle: '결제 실패한 구독이 없습니다',
          emptyDescription: '모든 구독이 정상적으로 결제되고 있습니다.',
          goToManage: '구독 관리로 이동',
          alertTitle: '결제 실패 안내',
          alertDescription: '{{count}}개의 구독 결제가 실패했습니다. 유예 기간 내에 재결제하지 않으면 활성화 코드가 정지됩니다.',
          alertNote: '유예 기간은 결제 실패 후 3일입니다. 기간 내 재결제를 완료해주세요.',
          importantTitle: '중요 안내',
          importantItems: [
            '결제 실패 후 3일의 유예 기간이 제공됩니다.',
            '유예 기간 내 재결제하지 않으면 활성화 코드가 정지됩니다.',
            '정지된 활성화 코드는 재결제 후 자동으로 복구됩니다.',
            '결제 수단을 변경하려면 프로필 설정에서 카드를 등록하세요.',
            '문제가 계속되면 고객센터로 문의해주세요.',
          ],
          backToManage: '← 구독 관리로 돌아가기',
          retryConfirmTitle: '재결제 확인',
          retryConfirmContent: '등록된 결제 수단으로 즉시 재결제를 시도하시겠습니까?',
          retryButton: '재결제하기',
          retryCancel: '취소',
          retryInfo: '재결제 기능은 준비 중입니다. 고객센터로 문의해주세요.',
          retryFail: '재결제에 실패했습니다.',
        },
        reminder: {
          title: '정기결제 안내',
          subtitle: '다음 결제일과 구독 정보를 확인하세요',
          daysRemaining: '({{days}}일 남음)',
          loginRequired: '로그인이 필요합니다.',
          loadFail: '구독 정보를 불러올 수 없습니다.',
          notFoundTitle: '구독 정보를 찾을 수 없습니다',
          notFoundDescription: '링크가 만료되었거나 유효하지 않습니다.',
          goToManage: '구독 관리로 이동',
          infoTitle: '안내 사항',
          infoItems: [
            '정기결제는 매월 말일에 자동으로 결제됩니다.',
            '결제 실패 시 3일의 유예 기간이 제공됩니다.',
            '유예 기간 내 재결제하지 않으면 활성화 코드가 정지됩니다.',
            '구독 관리는 프로필 페이지에서 할 수 있습니다.',
          ],
          backToManage: '← 구독 관리로 돌아가기',
          couponApplied: '쿠폰이 적용되었습니다.',
          couponApplyFail: '쿠폰 적용에 실패했습니다.',
        },
      },
      order: {
        title: '주문 상세',
        backToProfile: '프로필로 돌아가기',
        notFound: '주문을 찾을 수 없습니다',
        itemsTitle: '주문 상품 ({{count}}개)',
        badge: '주문번호: {{number}}',
        status: {
          pending: '결제 대기',
          completed: '완료',
        },
        statusLabel: '주문 상태',
        summaryTitle: '주문 요약',
        totalLabel: '총 주문 금액',
        processing: '처리중',
        item: {
          noProduct: '상품 정보를 불러올 수 없습니다',
        },
        review: {
          completed: '리뷰가 작성되었습니다',
          title: '리뷰 작성',
          ratingLabel: '별점 :',
          ratingValue: '{{rating}}점',
          titleLabel: '리뷰 제목',
          titlePlaceholder: '리뷰 제목을 입력해주세요 (선택사항)',
          contentLabel: '리뷰 내용',
          contentPlaceholder: '리뷰를 작성해주세요... (선택사항)',
          imagesLabel: '사진 추가 (선택사항)',
          upload: '업로드',
          submit: '리뷰 작성',
          submitting: '작성 중...',
          imageOnly: '이미지 파일만 업로드 가능합니다.',
          imageSize: '이미지 크기는 5MB 이하여야 합니다.',
          uploadFail: '이미지 업로드에 실패했습니다.',
        },
      },
      product: {
        header: {
          backHome: '홈으로 가기',
        },
        tabs: {
          overview: '개요',
          projects: '프로젝트',
          reviews: '리뷰 ({{count}})',
        },
        price: {
          purchased: '구매됨',
          label: '가격',
          buyNow: '지금 구매',
          addToCart: '장바구니에 담기',
          addToTeam: '팀 구성에 추가',
          location: '위치',
          joined: '가입일 {{date}}',
          respondsIn: '{{time}} 내 응답',
          topDeveloper: '상위 1% 개발자',
          totalHires: '총 고용',
          completionRate: '완료율',
          responseTime: '응답 시간',
          skillLevel: '기술 수준',
          reviews: '리뷰',
        },
        overview: {
          title: '기술 및 역량',
        },
        trust: {
          title: '검증 및 신뢰',
          identity: '신원 인증 완료',
          topRated: '최고 평점 개발자',
          success: '156k+ 성공 프로젝트',
        },
        reviews: {
          filter: {
            label: '개발자 타입 필터:',
            ratingLabel: '별점 필터',
            all: '전체',
            count: '개의 리뷰',
            empty: '리뷰가 없습니다.',
            emptyFiltered: '{{type}}의 리뷰가 없습니다.',
            clearRating: '별점 필터 해제',
          },
        },
        recommended: {
          title: '추천 상품',
          description: '이 상품과 함께 자주 구매되는 상품',
          categoryTitle: '{{category}} 추천 상품',
          categoryDescription: '같은 카테고리의 추천 상품을 확인해보세요',
        },
        viewed: {
          title: '다른 고객들이 자주 조회하는 상품',
          description: '다른 고객들이 많이 본 인기 상품을 확인해보세요',
        },
        templates: {
          title: '이 상품이 포함된 템플릿',
          description: '이 상품을 활용할 수 있는 템플릿들을 확인해보세요',
        },
      },
      purchase: {
        header: {
          backHome: '홈으로 가기',
        },
        empty: {
          title: '장바구니가 비어 있습니다',
          description: 'AI 개발자를 둘러보고 팀 구성을 시작해보세요!',
          cta: '개발자 둘러보기',
        },
        productCard: {
          categoryFallback: 'AI 개발자',
          purchased: '구매됨',
        },
        cartItem: {
          remove: '삭제',
        },
        coupon: {
          title: '쿠폰 코드가 있나요?',
          placeholder: '코드 입력 (예: SAVE20)',
          apply: '적용',
          remove: '제거',
          applied: '쿠폰이 적용되었습니다: {{label}}',
        },
        summary: {
          title: '주문 요약',
          subtotal: '소계 ({{count}}개)',
          discount: '할인 ({{label}})',
          studentDiscount: '학생 할인 (50%)',
          tax: '세금 (10%)',
          total: '총액',
          checkout: '결제 진행',
          processing: '처리 중...',
          secure: 'Stripe로 보호되는 안전 결제',
          subscription: {
            agree: '한 달에 한 번씩 자동 결제에 동의합니다',
            description: '등록된 결제 수단으로 매월 말일에 자동으로 결제됩니다.',
            nextPayment: '다음 결제일: {{date}}',
          },
        },
        protection: {
          title: '구매 보호',
          guarantee: '30일 환불 보장',
          secure: '안전한 결제 처리',
          delivery: '이메일로 즉시 전송',
          support: '24/7 고객 지원',
        },
        payment: {
          title: '결제 정보',
          company: '카드사',
          number: '카드 번호',
          expMonth: '만료 월',
          expYear: '만료 연도',
          cvc: 'CVC',
          placeholders: {
            number: '1234 5678 9012 3456',
            cvc: '123',
          },
          errors: {
            cardNumberRequired: '카드 번호를 입력해주세요.',
            cardNumberInvalid: '올바른 카드 번호 형식이 아닙니다. (16자리 숫자)',
            cvcRequired: 'CVC를 입력해주세요.',
            cvcInvalid: '올바른 CVC 형식이 아닙니다. (3-4자리 숫자)',
            expMonthRequired: '만료 월을 선택해주세요.',
            expMonthInvalid: '올바른 월을 선택해주세요.',
            expYearRequired: '만료 연도를 선택해주세요.',
            expYearInvalid: '올바른 연도를 선택해주세요.',
          },
        },
        confirmation: {
          headerTitle: 'AIDE Market',
          success: {
            title: '구매가 완료되었습니다! 🎉',
            subtitle: '구매해 주셔서 감사합니다. AI 개발자가 바로 사용 가능합니다!',
            orderNumber: '주문번호 #{{number}}',
            subscription: {
              title: '정기결제가 설정되었습니다',
              nextPayment: '다음 결제일: {{date}}',
              description: '등록된 결제 수단으로 매월 말일에 자동으로 결제됩니다.',
            },
          },
          summary: {
            title: '주문 요약',
            number: '주문번호',
            date: '주문 일시',
            items: '총 {{count}}개 AI 개발자',
            total: '총 결제 금액',
            paid: '결제가 성공적으로 처리되었습니다',
            subscription: {
              title: '정기결제',
              nextPayment: '다음 결제일: {{date}}',
            },
          },
          actions: {
            browse: '다른 개발자 둘러보기',
            history: '구매 내역 보기',
          },
          aiList: {
            title: '구매한 AI 개발자',
            activation: '활성화 코드',
            document: '문서 보기',
            download: '문서 다운로드',
            guide: '가이드 보기',
            copy: '복사',
            copied: '복사됨!',
          },
          email: {
            title: '이메일 안내',
            description: '영수증과 활성화 정보가 이메일로 발송됩니다.',
            copy: '이메일 복사',
            copied: '복사됨!',
            stepsTitle: '⚡ 다음 단계:',
            steps: [
              'AIDE Market에서 온 메일을 확인하세요',
              '아래 활성화 코드를 복사하세요',
              'AIDE Program에서 코드를 등록하세요',
            ],
          },
          support: {
            title: '지원이 필요하신가요?',
            description: '문의 사항은 언제든지 고객센터로 연락주세요.',
            email: 'support@aidemarket.com',
            help: '도움말 센터',
            chat: '실시간 채팅',
          },
        },
        messages: {
          loginRequired: '로그인이 필요합니다.',
          alreadyPurchased: '이미 구매한 상품입니다. 한 유저당 한 상품은 한 번만 구매 가능합니다.',
          cartItemRemoved: '장바구니에서 제거되었습니다.',
          removeCartItemFail: '장바구니에서 제거하는데 실패했습니다.',
          couponCodeRequired: '쿠폰 코드를 입력해주세요.',
          couponApplied: '쿠폰이 적용되었습니다.',
          couponApplyFail: '쿠폰 적용에 실패했습니다.',
          couponRemoved: '쿠폰이 제거되었습니다.',
          paymentMethodRequired: '결제를 위해 카드를 등록해주세요.',
          goToPaymentMethod: '카드 등록 페이지로 이동하시겠습니까?',
          orderCreated: '주문이 생성되었습니다.',
          orderCreateFail: '주문 생성에 실패했습니다.',
          requestError: '요청 오류: {{message}}',
          authRequired: '인증이 필요합니다. 다시 로그인해주세요.',
          serverError: '서버 오류: {{message}}',
          networkError: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
          subscriptionCreateFail: '정기결제 구독 생성에 실패했습니다. 고객센터로 문의해주세요.',
          itemsRemovedFromCart: '{{count}}개의 상품이 이미 구매되어 장바구니에서 제거되었습니다.',
          alreadyPurchasedWarning: '이미 구매한 상품은 제외하고 주문을 진행합니다.',
          noItemsToPurchase: '구매 가능한 상품이 없습니다.',
          cartLoadFail: '장바구니를 불러오는데 실패했습니다.',
          superAdminCannotPurchase: '관리자 권한으로는 결제를 진행할 수 없습니다.',
        },
        availableCartItems: {
          title: '장바구니에 있는 다른 상품들',
          description: '함께 구매하고 싶은 상품을 선택해주세요',
          addToPurchase: '구매 목록에 추가',
        },
      },
      productAdmin: {
        list: {
          title: '내 상품',
          new: '새 상품',
          loading: '로딩 중...',
          filters: {
            search: '검색',
            searchPlaceholder: '상품명을 입력하세요...',
            category: '카테고리',
            categoryAll: '전체 카테고리',
            sort: '정렬',
            sortOptions: {
              recent: '최신순',
              name: '이름',
              sales: '판매',
              rating: '평점',
              price: '가격',
            },
            reset: '초기화',
          },
          summary: {
            totalProducts: '총 상품',
            totalSales: '총 판매',
            totalRevenue: '총 매출',
            avgRating: '평균 평점',
          },
          table: {
            id: 'ID',
            product: '상품',
            price: '가격',
            sales: '판매',
            rating: '평점',
            actions: '작업',
            details: '상세',
            edit: '수정',
            public: '공개보기',
            delete: '삭제',
            categoryFallback: 'AI 개발자',
          },
          empty: {
            title: '상품이 없습니다',
            desc: '첫 상품을 생성해보세요',
            descWithFilters: '필터를 조정해보세요',
            new: '새 상품',
          },
          messages: {
            loadFail: '상품 목록을 불러오는데 실패했습니다.',
            deleteConfirm: '{{name}}을(를) 삭제하시겠습니까?',
            deleteSuccess: '상품이 삭제되었습니다.',
            deleteFail: '상품 삭제에 실패했습니다.',
          },
        },
        detail: {
          loading: '상품을 불러오는 중...',
          loadError: '상품 정보를 불러오지 못했습니다.',
          retry: '다시 시도',
          back: '상품 목록으로',
          header: {
            edit: '수정',
            viewPublic: '상품 페이지 보기',
          },
          stats: {
            totalSales: '총 판매',
            totalRevenue: '총 매출',
            avgRating: '평균 평점',
          },
          chart: {
            title: '월별 판매',
            subtitle: '최근 12개월 판매 추이',
            empty: '판매 데이터가 없습니다.',
          },
          info: {
            name: '이름',
            price: '가격',
            category: '카테고리',
            created: '생성일',
            views: '조회수',
            favorites: '즐겨찾기',
          },
          meta: {
            creator: '제작자',
            created: '생성일',
            views: '조회수',
          },
          latestReview: {
            title: '최근 리뷰',
            subtitle: '최근 1개의 리뷰',
            viewAll: '모든 리뷰 보기',
            noReview: '아직 리뷰가 없습니다.',
            noComment: '코멘트가 없습니다.',
          },
        },
        upload: {
          title: '상품 등록',
          imageSection: '상품 이미지',
          imageUpload: '이미지 업로드',
          imageRequired: '상품 이미지를 업로드해주세요.',
          imageUploadSuccess: '이미지 업로드 완료',
          imageUploadFail: '이미지 업로드 실패',
          basicInfo: '기본 정보',
          productName: '상품명',
          productNamePlaceholder: '상품명을 입력하세요',
          productNameRequired: '상품명을 입력해주세요.',
          sellerName: '판매자명',
          sellerNamePlaceholder: '판매자명을 입력하세요',
          sellerNameRequired: '판매자명을 입력해주세요.',
          price: '가격',
          pricePlaceholder: '가격을 입력하세요',
          priceRequired: '가격을 입력해주세요.',
          priceMin: '가격은 0 이상이어야 합니다.',
          description: '상품 설명',
          descriptionPlaceholder: '상품에 대한 자세한 설명을 입력하세요',
          descriptionRequired: '상품 설명을 입력해주세요.',
          category: '카테고리',
          mainCategory: '메인 카테고리',
          mainCategoryPlaceholder: '카테고리를 선택하세요',
          subCategory: '서브 카테고리',
          subCategoryPlaceholder: '서브 카테고리를 선택하세요',
          techStack: '기술 스택',
          techStackPlaceholder: '예: React, Node.js, Python',
          statsSection: 'AI 통계 (선택사항)',
          statsDescription: '각 항목의 수치를 0-100 사이로 설정할 수 있습니다.',
          teamwork: '협업 능력 (Teamwork)',
          stability: '안정성 (Stability)',
          speed: '속도 (Speed)',
          creativity: '창의성 (Creativity)',
          productivity: '생산성 (Productivity)',
          maintainability: '유지보수성 (Maintainability)',
          submit: '상품 등록',
          reset: '초기화',
          success: '상품이 성공적으로 등록되었습니다!',
          fail: '상품 업로드에 실패했습니다.',
          categoryLoadFail: '카테고리 목록을 불러오는데 실패했습니다.',
          productIdError: '상품 생성 후 ID를 받지 못했습니다.',
          statsCreateFail: 'Stats 생성 실패 (상품은 생성됨)',
        },
      },
      creators: {
        title: 'Top Creators',
        subtitle: 'AI 마켓플레이스의 인기 크리에이터들을 만나보세요',
        empty: '표시할 크리에이터가 없습니다.',
        notFound: '크리에이터를 찾을 수 없습니다.',
        follow: '팔로우',
        following: '팔로잉',
        viewProfile: '프로필 보기',
        joinDate: '가입일:',
        productsTitle: '판매 중인 AI',
        noProducts: '아직 판매 중인 AI가 없습니다.',
        downloads: '다운로드',
        followers: '팔로워',
        followError: '팔로우 처리 중 오류가 발생했습니다.',
      },
      sellerInfo: {
        pageTitle: '판매자 안내',
        pageSubtitle: 'AI 마켓플레이스에서 판매자가 되어 상품을 판매하는 방법을 안내합니다.',
        whatIsSeller: '판매자란?',
        whatIsSellerText: '판매자는 AI 개발자로서 자신이 개발한 AI 제품을 마켓플레이스에 등록하고 판매할 수 있는 권한을 가진 사용자입니다. 일반 사용자와 달리 상품을 등록하고, 가격을 설정하며, 판매 수익을 창출할 수 있습니다.',
        benefits: '판매자 혜택',
        benefit1: 'AI 제품 등록 및 판매 가능',
        benefit2: '판매 수익 창출',
        benefit3: '상품 관리 대시보드 접근',
        benefit4: '판매 통계 및 분석 데이터 확인',
        benefit5: '리뷰 관리 및 고객 피드백 확인',
        benefit6: '주문 관리 및 정산 정보 확인',
        requirements: '판매자 신청 조건',
        requiredInfo: '필수 정보',
        optionalInfo: '선택 정보',
        req1: '판매자명',
        req2: '정산용 이메일',
        req3: '연락처 (010-XXXX-XXXX 형식)',
        req4: '전문분야 (카테고리 선택)',
        req5: '기술 스택',
        req6: '포트폴리오 URL',
        req7: '상품 설명 (100자 이상 500자 이하)',
        req8: '신청 동기 (50자 이상 200자 이하)',
        opt1: '사업자등록번호',
        opt2: 'GitHub URL',
        process: '신청 절차',
        step1Title: '신청서 작성',
        step1Text: '판매자 신청 폼에 필요한 정보를 입력합니다.',
        step2Title: '자동 검증',
        step2Text: '입력한 정보가 자동으로 검증됩니다. (100점 만점)',
        step3Title: '관리자 검토',
        step3Text: '사이트 관리자가 신청서를 검토합니다.',
        step4Title: '승인 완료',
        step4Text: '승인되면 판매자 권한이 부여되고 상품 등록이 가능합니다.',
        validation: '자동 검증 항목',
        validationText: '신청서는 다음과 같은 항목으로 자동 검증됩니다:',
        val1: '필수 정보 완성도 (20점) - 8개 필수 필드 모두 입력',
        val2: '이메일 형식 (10점) - 유효한 이메일 주소',
        val3: '전화번호 형식 (10점) - 올바른 전화번호 형식',
        val4: '포트폴리오 URL 접근 (20점) - 포트폴리오 사이트 접근 가능 여부',
        val5: '텍스트 품질 (20점) - 상품 설명 및 신청 동기 길이',
        val6: '전문분야 유효성 (10점) - 유효한 카테고리 선택',
        val7: '기술 스택 입력 (10점) - 기술 스택 정보 입력',
        validationNote: '참고: 80점 이상이면 승인 권장, 60점 이상이면 검토 필요, 60점 미만이면 반려 권장으로 분류됩니다.',
        applyButton: '판매자 신청하기',
        loginToApply: '로그인 후 신청하기',
      },
      sellerApply: {
        pageTitle: '판매자 신청',
        pageSubtitle: 'AI 판매자로 전환하여 상품을 판매하세요.',
        basicInfo: '기본 정보',
        aiDeveloperInfo: 'AI 개발자 정보',
        sellerName: '판매자명',
        sellerNamePlaceholder: '판매자명을 입력하세요',
        contactEmail: '정산용 이메일',
        contactEmailPlaceholder: 'example@email.com',
        phone: '연락처',
        phonePlaceholder: '010-1234-5678',
        specialization: '전문분야',
        specializationPlaceholder: '전문분야를 선택하세요',
        techStack: '기술 스택',
        techStackPlaceholder: '예: React, Node.js, Python',
        portfolioUrl: '포트폴리오 URL',
        portfolioUrlPlaceholder: 'https://your-portfolio.com',
        productDescription: '상품 설명',
        productDescriptionPlaceholder: '판매할 상품에 대한 설명을 작성해주세요 (100자 이상 500자 이하)',
        motivation: '신청 동기',
        motivationPlaceholder: '판매자로 신청하는 이유를 작성해주세요 (50자 이상 200자 이하)',
        optionalInfo: '선택 정보',
        businessNumber: '사업자등록번호',
        businessNumberPlaceholder: '사업자등록번호를 입력하세요 (선택사항)',
        githubUrl: 'GitHub URL',
        githubUrlPlaceholder: 'https://github.com/your-username (선택사항)',
        submit: '신청하기',
        alreadyApproved: '이미 판매자로 승인되었습니다.',
        alreadyPending: '이미 신청한 내역이 있습니다. 검토 중입니다.',
        rejected: '이전 신청이 반려되었습니다. 사유: {{reason}}',
        success: '판매자 신청이 완료되었습니다. 검토 후 결과를 알려드리겠습니다.',
        error: '신청 중 오류가 발생했습니다.',
        required: '*',
        minCharsRequired: '(최소 {{count}}자 필요)',
      },
    },
  },
  en: {
    translation: {
      common: {
        backHome: 'Back to Home',
        loading: 'Loading...',
        logout: 'Logout',
        login: 'Login',
        close: 'Close',
        untitled: 'Untitled',
        unknown: 'Unknown',
        other: 'Other',
      },
      notifications: {
        team: {
          templateTeamDeleted: 'Template team has been deleted.',
          templateTeamDeleteFail: 'Failed to delete template team.',
          favoriteRemoved: '{{productName}} has been removed from favorites.',
          favoriteRemoveFail: 'Failed to remove from favorites.',
        },
        templates: {
          loginRequired: 'Login required.',
          cartAddedPartial: '{{count}} products have been added to cart. {{failedCount}} products could not be added.',
          cartAdded: '{{count}} products have been added to cart.',
          cartAddAllFail: 'Unable to add all products to cart. (They may already be purchased or in cart)',
          cartAddError: 'An error occurred while adding to cart.',
          noProductsToAdd: 'No products to add.',
          teamAddedPartial: '{{count}} products have been added to team. {{failedCount}} products could not be added.',
          teamAdded: '{{count}} products have been added to team.',
          teamAddAllFail: 'No products available to add to team.',
          teamAddError: 'An error occurred while adding to team.',
        },
        product: {
          productLoadFail: 'Unable to load product information.',
          favoriteAdded: '{{productName}} has been added to available AI developers list.',
          favoriteAlreadyExists: '{{productName}} is already in favorites.',
          favoriteAddFail: 'Failed to add to favorites.',
          favoriteRemoved: 'Removed from favorites.',
          favoriteAddedToFavorites: 'Added to favorites.',
          favoriteUpdateFail: 'Failed to update favorites.',
          selectRating: 'Please select a rating.',
          loginRequired: 'Login required.',
          userInfoLoadFail: 'Unable to load user information.',
          reviewUpdated: 'Review has been updated.',
          ownReviewHelpful: 'You cannot mark helpful on your own review.',
          reviewDeleted: 'Review has been deleted.',
        },
        share: {
          linkCopied: 'Link has been copied to clipboard.',
          linkCopyFail: 'Failed to copy link.',
          instagramCopyInfo: 'Link copied. Paste it in Instagram app to share.',
        },
        subscription: {
          cancelled: 'Subscription has been cancelled.',
          cancelFail: 'Failed to cancel subscription.',
          emailLinkInfo: 'Email link can be found in the next payment notification email.',
          loadFail: 'Unable to load subscription information.',
        },
        purchase: {
          paymentMethodCheckError: 'An error occurred while checking payment method.',
          loginRequired: 'Login required.',
        },
      },
      header: {
        title: 'AIDE Market',
      },
      home: {
        nav: {
          marketplace: 'Marketplace',
          rankings: 'Rankings',
          templates: 'Templates',
          teams: 'Teams',
          resources: 'Resources',
        },
        searchPlaceholder: 'Search developers...',
        heroTitle: 'Discover the best AI developers and build together',
        heroSubtitle: 'Over {{count}} verified AI developers are ready to bring your ideas to life.\nStart building your team now.',
        heroPrimary: 'Explore Now',
        heroSecondary: 'Learn More',
        rankingTitle: 'Top Ranking This Month',
        rankingSubtitle: 'AI developers with the best performance this month',
        viewAll: 'View All',
        seeAll: 'View All',
        sort: {
          download: 'By Downloads',
          rating: 'By Rating',
          price: 'By Price (Low)',
          priceDesc: 'Recently Added',
        },
        tabs: {
          all: 'All',
          fe: 'Frontend',
          be: 'Backend',
          design: 'Design',
          mg: 'AI/ML',
          inf: 'Infrastructure',
          sec: 'Security',
          doc: 'Documentation',
        },
        ranking: {
          projects: 'projects',
          skill: 'skill',
        },
        recommended: {
          title: 'Recommended for You',
          subtitle: 'Handpicked AI developers based on your preferences',
        },
        pagination: {
          prev: 'Previous',
          next: 'Next',
        },
        noProducts: 'No matching products found',
        sellerApplyLink: 'Sell your products as an AI developer and generate revenue. Become a seller to register and sell products in the marketplace.',
        sellerApplyClickHere: 'Click here',
      },
      templates: {
        pageTitle: 'AI Project Templates',
        pageSubtitle: 'Browse and select AI products needed for each project type at a glance',
        categories: {
          all: 'All',
          web: 'Web Development',
          app: 'App Development',
          data: 'Data Analysis',
          document: 'Documents',
          image: 'Image Generation',
        },
        empty: 'No templates registered.',
        productCount: '{{count}} AI products',
        featured: {
          title: 'Featured Templates',
        },
        detail: {
          backToList: 'Back to Template List',
          purchased: '{{count}} people purchased',
          aiProducts: '{{count}} AI products',
          buyNow: 'Buy Now',
          addToCart: 'Add to Cart',
          addToTeam: 'Add to Team',
          projectDescription: 'Project Description',
          whySelected: 'Why were these AIs selected?',
          aiDescriptions: 'What are these AIs?',
          compatibilityTable: 'AI Suitability Comparison Table',
          projectType: 'Project Type',
          verySuitable: 'Very Suitable',
          suitable: 'Suitable',
          normal: 'Normal',
          unsuitable: 'Unsuitable',
          templateProducts: 'Products in this template',
        },
      },
      resources: {
        pageTitle: 'Resources',
        pageSubtitle: 'Guides, templates, and useful materials to help you utilize AI developers more effectively',
        categories: {
          all: 'All',
          guide: 'Guide',
          category: 'By Category',
          faq: 'FAQ',
          template: 'Template',
          stats: 'Statistics',
        },
        empty: 'No search results found.',
        items: {
          guide1: {
            title: 'AI Developer Usage Guide',
            description: 'A complete starter guide for those new to using AI developers on AIDE Market. Step-by-step instructions from account creation to completing your first project.',
            content: `## AI Developer Usage Guide

### Step 1: Account Setup
- Sign up and set up your profile
- Select categories of interest
- Get 50% discount with student verification

### Step 2: Explore AI Developers
- Search for desired developers in the marketplace
- Use category-specific filtering
- Check ratings and reviews

### Step 3: Select Developer
- Analyze project requirements
- Establish a budget plan
- Compare and review multiple developers

### Step 4: Start Project
- Purchase and download developer
- Integrate into project
- Ongoing collaboration and management

### Tips
- Use free trial versions
- Combine multiple developers with team feature
- Check regular updates`,
          },
          guide2: {
            title: 'Team Optimization Guide',
            description: 'Learn how to build a powerful team with up to 10 AI developers and maximize synergy effects. Best practices for team building.',
            content: `## Team Optimization Guide

### Team Building Strategy
1. **Role Allocation**: Consider each developer's expertise
   - Frontend: UI/UX implementation
   - Backend: Server and API development
   - Design: Visual element design
   - Infrastructure: Deployment and management

2. **Synergy Effects**: +20% performance improvement with diverse category combinations
   - Choose complementary technology stacks
   - Consider communication skills

3. **Budget Optimization**
   - Prioritize essential developers
   - Expand team by project phase

### Recommended Team Combinations
- **Web Application**: Frontend + Backend + Design
- **API Service**: Backend + Infrastructure + Security
- **Mobile App**: Frontend + Design + Backend

### Synergy Score Calculation
- Base stat average + Team size bonus + Diversity bonus`,
          },
          guide3: {
            title: 'AI Developer Evaluation Guide',
            description: 'Learn about factors and evaluation criteria to consider when selecting AI developers. A comprehensive guide to evaluating ratings, reviews, tech stacks, and pricing.',
            content: `## AI Developer Evaluation Guide

### Evaluation Criteria

#### 1. Technical Capability
- **Rating**: 4.5 or higher recommended
- **Tech Stack**: Match with project requirements
- **Update Frequency**: Check recent update dates

#### 2. User Reviews
- **Review Count**: Check for sufficient reviews
- **Average Rating**: Check overall evaluation
- **Detailed Reviews**: Check actual usage experiences

#### 3. Price-Performance Ratio
- **Cost**: Optimal choice within budget
- **Features**: Check if features justify price
- **Discounts**: Utilize student discounts, promotions

#### 4. Community Support
- **Documentation**: Check documentation completeness
- **Examples**: Check if usage examples are provided
- **Support**: Check if problem-solving support is available

### Checklist
- [ ] Tech stack matches project requirements
- [ ] Rating 4.5 or higher
- [ ] Updated within last 3 months
- [ ] 10 or more reviews
- [ ] Price within budget
- [ ] Sufficient documentation

### Comparison Method
1. List multiple developers
2. Score each evaluation item
3. Compare by overall score
4. Final decision after checking actual reviews`,
          },
          category1: {
            title: 'Frontend AI Utilization',
            description: 'Start efficient web development using AI developers specialized in React, Vue, Next.js, and other frontend technologies. From component development to state management.',
            content: `## Frontend AI Utilization

### Key Application Areas
- **Component Development**: Automatic generation of reusable UI components
- **State Management**: Implementation of state management patterns like Redux, Context API
- **Styling**: Automatic style generation with CSS-in-JS, Tailwind CSS
- **Performance Optimization**: Bundle size optimization, code splitting

### Recommended Developers
1. **React Expert**: Component architecture design
2. **TypeScript Expert**: Type safety improvement
3. **Design System Expert**: Consistent UI implementation

### Practical Example
\`\`\`jsx
// Example component generated by AI
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
};
\`\`\``,
          },
          category2: {
            title: 'Backend AI Utilization',
            description: 'Learn how to utilize AI developers for backend infrastructure and API development using Node.js, Python, Go, etc. From database design to microservice architecture.',
            content: `## Backend AI Utilization

### Key Application Areas
- **API Development**: RESTful API, GraphQL endpoint generation
- **Database**: Schema design, query optimization
- **Authentication/Security**: JWT, OAuth implementation
- **Microservices**: Service separation and communication design

### Recommended Developers
1. **API Design Expert**: RESTful API structure design
2. **Database Expert**: Efficient schema design
3. **Security Expert**: Authentication and security pattern implementation

### Practical Example
\`\`\`javascript
// Example API route generated by AI
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
\`\`\``,
          },
          category3: {
            title: 'Design AI Utilization',
            description: 'Integrate AI developers into your UI/UX design process by connecting with design tools like Figma and Adobe XD. From design systems to prototyping.',
            content: `## Design AI Utilization

### Key Application Areas
- **Design System**: Build consistent component libraries
- **Prototyping**: Rapid prototype creation
- **User Experience**: UX flow design and improvement
- **Visual Elements**: Icon and illustration generation

### Recommended Developers
1. **UI Designer**: Interface design
2. **UX Researcher**: User experience improvement
3. **Branding Expert**: Consistent brand identity

### Design Workflow
1. Wireframe design
2. Visual design work
3. Prototype creation
4. Collaboration with developers`,
          },
          faq1: {
            title: 'Frequently Asked Questions (FAQ)',
            description: 'A collection of the most frequently asked questions and answers about using AIDE Market. Covers various topics including accounts, payments, and technical support.',
            content: `## Frequently Asked Questions

### Account Related
**Q: How do I sign up?**
A: Click the "Login" button in the top header and select "Sign Up". You can create an account after email verification.

**Q: How do I get student discount?**
A: Apply for student verification in profile settings. Upload your student ID to receive a 50% discount.

### Purchase and Payment
**Q: How do I use purchased AI developers?**
A: Download from the download section after purchase and integrate into your project.

**Q: Can I get a refund?**
A: Refunds are available within 7 days of purchase. Contact customer support if you have any issues.

### Technical Support
**Q: I'm having issues with an AI developer**
A: Get help from each developer's review section or ask questions on the community forum.`,
          },
          faq2: {
            title: 'Payment and Purchase Guide',
            description: 'Detailed guide to the entire process from product purchase to payment and download. Covers payment methods, discount coupons, order management, and more.',
            content: `## Payment and Purchase Guide

### Purchase Process
1. **Select Product**: Choose desired AI developer from marketplace
2. **Add to Cart**: Click shopping cart icon
3. **Proceed to Payment**: Enter payment information on purchase page
4. **Download**: Available for immediate download after payment

### Payment Methods
- **Credit Card**: Visa, Mastercard, JCB supported
- **Bank Transfer**: Online bank transfer available
- **Easy Payment**: PayPal, Stripe, etc.

### Discount Benefits
- Student Verification: 50% discount
- Coupon Code: Enter promotion code
- Team Purchase: Additional discount for 5+ purchases

### Order Management
- Order History: Check in Profile > Purchased AI
- Receipt: Automatically sent via email
- Download: Re-download available on Purchased AI page`,
          },
          template1: {
            title: 'Project Templates',
            description: 'Download starter templates for various project types. Templates for popular frameworks like React, Vue, Next.js, Node.js, and more.',
            content: `## Project Templates

### Available Templates

#### Web Applications
- **React + TypeScript**: Modern React application template
- **Next.js + Tailwind CSS**: SEO-optimized website
- **Vue 3 + Vite**: Fast development environment setup

#### Backend Services
- **Node.js + Express**: RESTful API server
- **Python + FastAPI**: High-performance API server
- **Go + Gin**: Lightweight microservice

#### Full Stack
- **Next.js + Prisma**: Full-stack type-safe application
- **Remix + PostgreSQL**: Server-side rendering app

### Usage
1. Select and download template
2. Install dependencies: \`npm install\`
3. Set environment variables
4. Run development server: \`npm run dev\`

### Customization
- Modify template as needed
- Extend functionality by adding AI developers`,
          },
          template2: {
            title: 'Code Snippet Library',
            description: 'Search and utilize frequently used code snippets and examples. Ready-to-use code for authentication, API communication, form handling, and more.',
            content: `## Code Snippet Library

### Snippets by Category

#### Authentication & Security
- JWT token generation and verification
- Password hashing (bcrypt)
- OAuth login implementation

#### API Communication
- Axios interceptor setup
- Error handling
- Retry logic

#### Form Processing
- React Hook Form examples
- Validation
- File upload

#### Database
- ORM query examples
- Transaction processing
- Relational queries

### Usage Example
\`\`\`javascript
// JWT token verification example
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
\`\`\`

### Contributing
- Share useful snippets with the community
- Improvement suggestions welcome`,
          },
          stats1: {
            title: 'Market Trend Analysis',
            description: 'Check popular categories and latest trends to apply to your projects. Monthly statistics and category popularity rankings.',
            content: `## Market Trend Analysis

### This Month's Popular Categories
1. **Frontend** (35%): React, Next.js developers trending
2. **AI/ML** (28%): Increased demand for machine learning model development
3. **Backend** (22%): API and server infrastructure development
4. **Design** (15%): UI/UX design services

### Trend Insights
- **TypeScript**: Increasing demand for type safety in projects
- **Cloud Native**: Growing need for infrastructure automation
- **Accessibility**: Increasing importance of web accessibility (A11y)

### Growth Trends
- Monthly new developers: +15%
- Average rating: 4.7/5.0
- User satisfaction: 92%

### Recommended Combinations
Currently most popular team combination:
- Frontend + Backend + Design (Synergy +18%)`,
          },
          stats2: {
            title: 'Success Stories',
            description: 'Explore successful project cases using AIDE Market. Check out various success stories from startups to enterprise projects.',
            content: `## Success Stories

### Startup Project
**E-commerce Platform Development**
- Team: Frontend + Backend + Design (3 members)
- Duration: 3 months
- Result: MVP completion and Series A investment secured

### Enterprise Project
**Internal Management System Development**
- Team: Frontend + Backend + Infrastructure (5 members)
- Duration: 6 months
- Result: 50% reduction in development time, improved operational efficiency

### Personal Project
**Portfolio Website**
- Team: Frontend + Design (2 members)
- Duration: 2 weeks
- Result: Successful job placement and 500+ GitHub stars

### Key Success Factors
1. Appropriate developer selection
2. Clear project goals
3. Continuous communication
4. Team synergy effect utilization

### Testimonial
"Using AI developers allowed us to quickly create prototypes and significantly reduce time to service launch." - Project Leader`,
          },
        },
      },
      creators: {
        title: 'Top Creators',
        subtitle: 'Meet the popular creators of the AI marketplace',
        empty: 'No creators to display.',
        notFound: 'Creator not found.',
        follow: 'Follow',
        following: 'Following',
        viewProfile: 'View Profile',
        joinDate: 'Joined:',
        productsTitle: 'AI Products for Sale',
        noProducts: 'No AI products for sale yet.',
        downloads: 'Downloads',
        followers: 'Followers',
        followError: 'An error occurred while processing the follow action.',
      },
      sellerInfo: {
        pageTitle: 'Seller Information',
        pageSubtitle: 'Learn how to become a seller and sell products in the AI marketplace.',
        whatIsSeller: 'What is a Seller?',
        whatIsSellerText: 'A seller is a user with the authority to register and sell AI products they have developed in the marketplace as an AI developer. Unlike regular users, sellers can register products, set prices, and generate sales revenue.',
        benefits: 'Seller Benefits',
        benefit1: 'Register and sell AI products',
        benefit2: 'Generate sales revenue',
        benefit3: 'Access product management dashboard',
        benefit4: 'View sales statistics and analytics',
        benefit5: 'Manage reviews and customer feedback',
        benefit6: 'Manage orders and settlement information',
        requirements: 'Seller Application Requirements',
        requiredInfo: 'Required Information',
        optionalInfo: 'Optional Information',
        req1: 'Seller Name',
        req2: 'Settlement Email',
        req3: 'Contact (010-XXXX-XXXX format)',
        req4: 'Specialization (Category Selection)',
        req5: 'Tech Stack',
        req6: 'Portfolio URL',
        req7: 'Product Description (100-500 characters)',
        req8: 'Application Motivation (50-200 characters)',
        opt1: 'Business Registration Number',
        opt2: 'GitHub URL',
        process: 'Application Process',
        step1Title: 'Fill Application Form',
        step1Text: 'Enter the required information in the seller application form.',
        step2Title: 'Automatic Verification',
        step2Text: 'The entered information is automatically verified. (100 points total)',
        step3Title: 'Admin Review',
        step3Text: 'Site administrators review the application.',
        step4Title: 'Approval Complete',
        step4Text: 'Once approved, seller privileges are granted and product registration becomes available.',
        validation: 'Automatic Verification Items',
        validationText: 'Applications are automatically verified based on the following criteria:',
        val1: 'Required Information Completeness (20 points) - All 8 required fields filled',
        val2: 'Email Format (10 points) - Valid email address',
        val3: 'Phone Format (10 points) - Correct phone number format',
        val4: 'Portfolio URL Accessibility (20 points) - Portfolio site accessibility',
        val5: 'Text Quality (20 points) - Product description and application motivation length',
        val6: 'Specialization Validity (10 points) - Valid category selection',
        val7: 'Tech Stack Input (10 points) - Tech stack information provided',
        validationNote: 'Note: 80 points or above is recommended for approval, 60 points or above requires review, and below 60 points is recommended for rejection.',
        applyButton: 'Apply to be a Seller',
        loginToApply: 'Login to Apply',
      },
      sellerApply: {
        pageTitle: 'Seller Application',
        pageSubtitle: 'Become an AI seller and start selling products.',
        basicInfo: 'Basic Information',
        aiDeveloperInfo: 'AI Developer Information',
        sellerName: 'Seller Name',
        sellerNamePlaceholder: 'Enter seller name',
        contactEmail: 'Settlement Email',
        contactEmailPlaceholder: 'example@email.com',
        phone: 'Contact',
        phonePlaceholder: '010-1234-5678',
        specialization: 'Specialization',
        specializationPlaceholder: 'Select specialization',
        techStack: 'Tech Stack',
        techStackPlaceholder: 'e.g., React, Node.js, Python',
        portfolioUrl: 'Portfolio URL',
        portfolioUrlPlaceholder: 'https://your-portfolio.com',
        productDescription: 'Product Description',
        productDescriptionPlaceholder: 'Write a description of the product you want to sell (100-500 characters)',
        motivation: 'Application Motivation',
        motivationPlaceholder: 'Write why you are applying to be a seller (50-200 characters)',
        optionalInfo: 'Optional Information',
        businessNumber: 'Business Registration Number',
        businessNumberPlaceholder: 'Enter business registration number (optional)',
        githubUrl: 'GitHub URL',
        githubUrlPlaceholder: 'https://github.com/your-username (optional)',
        submit: 'Submit Application',
        alreadyApproved: 'You have already been approved as a seller.',
        alreadyPending: 'You have already submitted an application. It is under review.',
        rejected: 'Your previous application was rejected. Reason: {{reason}}',
        success: 'Seller application has been submitted. We will notify you of the result after review.',
        error: 'An error occurred during application.',
        required: '*',
        minCharsRequired: '(Minimum {{count}} characters required)',
      },
      profile: {
        tabs: {
          purchases: 'Purchased AI',
          reviews: 'My Reviews',
          teams: 'My Teams',
          favorites: 'Favorites',
        },
        hero: {
          settings: 'Settings',
          followers: 'Followers',
          following: 'Following',
          github: 'GitHub',
        },
        purchases: {
          empty: 'No purchased products',
          orderNumber: 'Order: {{number}}',
          status: {
            pending: 'Payment Pending',
            completed: 'Completed',
          },
          totalAmount: 'Total Amount',
          items: '{{count}} items',
        },
        reviews: {
          empty: 'No reviews written',
          selectRating: 'Please select a rating.',
          loginRequired: 'Login required.',
          parseError: 'Unable to load user information.',
          updateSuccess: 'Review has been updated.',
          updateFail: 'Failed to update review.',
          deleteConfirm: 'Are you sure you want to delete this review?',
          noReviewId: 'Review ID not found.',
          noUserId: 'User ID not found.',
          deleteSuccess: 'Review has been deleted.',
          deleteFail: 'Failed to delete review.',
          deleteUnauthorized: 'You do not have permission to delete this review.',
          deleteNotFound: 'Review not found.',
          deleteServerError: 'Server error occurred. Please try again later.',
          ratingLabel: 'Rating',
          reviewContentLabel: 'Review Content',
          reviewPlaceholder: 'Please write a review...',
          save: 'Save',
          cancel: 'Cancel',
          expand: 'Expand',
          reviewImage: 'Review Image {{index}}',
          edit: 'Edit',
          delete: 'Delete',
          ratingPoints: '{{rating}} points',
        },
        studentVerification: {
          page: {
            title: 'Student Verification',
            subtitle: 'Verify as a student to get 50% discount on all products',
            backToSettings: 'Back to Profile Settings',
            loading: 'Loading...',
            loginRequired: 'Login required.',
            loadStatusError: 'Unable to load student verification status.',
            uploadSuccess: '✅ Student verification application submitted. Added to admin review list.',
            uploadFail: 'Failed to submit student verification application.',
            currentStatus: 'Current Status',
            statusBadge: {
              verified: 'Verified',
              pending: 'Under Review',
              notApplied: 'Not Applied',
            },
            statusCard: {
              verifiedDate: 'Verification Date',
              expiryDate: 'Expiry Date',
              daysRemaining: '{{days}} days remaining',
              expired: 'Expired',
              discountApplied: '✓ Student discount (50%) is being applied',
              pendingTitle: 'Waiting for admin review',
              pendingDescription: 'Student ID has been uploaded. Waiting for admin approval.',
              notAppliedDescription: 'Please upload a student ID or enrollment certificate to apply for student verification.',
              expiredTitle: 'Student verification has expired',
              expiredDescription: 'Expiry Date: {{date}}',
              expiredRenew: 'Please upload your student ID again to continue receiving student discount.',
            },
            upload: {
              title: 'Upload Student ID',
              description: 'Please upload one of the following documents:',
              documentTypes: {
                studentId: 'Student ID (both front and back)',
                enrollment: 'Enrollment Certificate',
                registration: 'Course Registration Certificate (recent semester)',
              },
              selectFile: 'Select File',
              uploadButton: '📤 Apply for Student Verification',
              uploading: 'Uploading...',
              uploadNote: 'Clicking upload button will add to admin review list',
              fileRequired: 'Please select a student ID file.',
              fileReSelect: 'Please reselect the file.',
              fileTypeError: 'Only image or PDF files can be uploaded.',
              fileSizeError: 'File size must be 10MB or less.',
              disabledMessage: 'Cannot upload new document in current status.',
              uploadedMessage: '✓ Document has been uploaded',
              viewDocument: '{{filename}} (click to view)',
            },
            pendingAlert: {
              title: '⏳ Verification Pending',
              description: 'Student ID has been successfully uploaded. It will be approved after admin review.',
              note: 'Approval usually takes 1-2 business days.',
              adminButton: 'Approve in Admin Page',
            },
            guide: {
              title: 'Student Verification Guide',
              item1: 'Student verification automatically applies 50% discount on all products.',
              item2: 'Student discount can be combined with coupon discounts, up to 70% total discount.',
              item3: 'Student verification is valid for one year. Please renew before expiration.',
              item4: 'Uploaded documents will be approved after admin review.',
              item5: 'If verification is rejected, please contact customer service.',
            },
          },
        },
        teams: {
          emptyTitle: 'No teams created yet',
          emptySubtitle: 'Create your own team with AI developers',
          noDate: 'No date',
          noMembers: 'No members',
          synergy: 'Synergy',
          synergyScore: 'Team Synergy Score',
          membersTitle: 'Team Members',
          createdAt: 'Created At',
          memberCount: 'Team Members',
          deleteConfirm: 'Are you sure you want to delete this team?',
          deleteSuccess: 'Team has been deleted.',
          deleteFail: 'Failed to delete team.',
          delete: 'Delete',
          edit: 'Edit',
          membersLabel: '{{count}} members',
          categories: {
            image: 'Image Generation',
            infrastructure: 'Infrastructure',
            documents: 'Documents',
          },
        },
        favorites: {
          empty: 'Favorites list is empty',
          removeSuccess: 'Removed from favorites.',
          removeFail: 'Failed to remove from favorites.',
          noProduct: 'Product information not found.',
        },
        superAdmin: {
          layout: {
            title: 'Site Administrator',
            menuToggle: 'Toggle Menu',
            closeMenu: 'Close Menu',
          },
          sidebar: {
            dashboard: 'Dashboard',
            products: 'Product Approval Management',
            studentVerifications: 'Student Verification Management',
            ipManagement: 'IP Management',
            security: 'Security',
          },
          dashboard: {
            title: 'Site Administrator Dashboard',
            subtitle: 'System-wide management and monitoring',
            loading: 'Loading...',
            stats: {
              pendingProducts: 'Pending Products',
              pendingStudents: 'Student Verification Requests',
              pendingSellerApplications: 'Seller Applications',
              todayAccess: 'Today\'s Access',
              securityEvents: 'Security Events',
              attention: 'Attention',
              normal: 'Normal',
              noNewRequest: 'No new requests',
              noChange: 'No change',
            },
            recent: 'Recent',
            productRequest: 'Product Request',
            pending: 'Pending',
            today: 'Today',
            percent: '+0%',
            sections: {
              pendingProducts: 'Pending Products',
              recentActivity: 'Recent Activity',
            },
            table: {
              productName: 'Product Name',
              category: 'Category',
              price: 'Price',
              applicant: 'Applicant',
              requestDate: 'Request Date',
              status: 'Status',
              time: 'Time',
              event: 'Event',
              detail: 'Detail',
            },
            empty: {
              noPendingProducts: 'No pending products',
              noRecentActivity: 'No recent activity',
            },
          },
          products: {
            title: 'Product Approval Management',
            subtitle: 'Approve or reject products submitted by administrators',
            loading: 'Loading...',
            stats: {
              pending: 'Pending',
            },
            filters: {
              status: 'Status',
              all: 'All',
              pending: 'Pending',
              approved: 'Approved',
              rejected: 'Rejected',
              search: 'Search',
              searchPlaceholder: 'Search by product name...',
            },
            card: {
              applicant: 'Applicant',
              price: 'Price',
              category: 'Category',
              requestDate: 'Request Date',
              status: 'Status',
              noDescription: 'No description',
            },
            actions: {
              approve: '✓ Approve',
              reject: '× Reject',
            },
            messages: {
              loadFail: 'Failed to load product list.',
              approveSuccess: 'Product has been approved.',
              approveFail: 'Failed to approve product.',
              rejectWarning: 'Please enter a rejection reason.',
              rejectSuccess: 'Product has been rejected.',
              rejectFail: 'Failed to reject product.',
            },
            rejectModal: {
              title: 'Reject Product',
              content: 'Please enter the reason for rejecting the product.',
              placeholder: 'Rejection reason...',
              ok: 'Reject',
              cancel: 'Cancel',
            },
            empty: 'No pending products',
          },
          studentVerifications: {
            title: 'Student Verification Management',
            subtitle: 'Approve or reject student verification requests',
            loading: 'Loading...',
            stats: {
              pending: 'Pending',
            },
            filters: {
              search: 'Search',
              searchPlaceholder: 'Search by name or email...',
            },
            card: {
              requestDate: 'Request Date',
              status: 'Status',
            },
            actions: {
              viewDocument: '📄 View Student ID Image',
              approve: '✓ Approve',
              reject: '× Reject',
            },
            messages: {
              loadFail: 'Failed to load student verification list.',
              approveSuccess: 'Student verification has been approved.',
              approveFail: 'Failed to approve student verification.',
              rejectWarning: 'Please enter a rejection reason.',
              rejectSuccess: 'Student verification has been rejected.',
              rejectFail: 'Failed to reject student verification.',
              documentLoadFail: 'Failed to load document.',
            },
            documentModal: {
              title: 'Verification Document',
              user: 'User',
            },
            rejectModal: {
              title: 'Reject Student Verification',
              content: 'Please enter the reason for rejecting the student verification.',
              placeholder: 'Rejection reason...',
              ok: 'Reject',
              cancel: 'Cancel',
            },
            empty: 'No pending requests',
          },
          ipManagement: {
            title: 'IP Management',
            subtitle: 'IP access logs and block management',
            loading: 'Loading...',
            tabs: {
              logs: 'Access Logs',
              management: 'Block Management',
              stats: 'Statistics',
            },
            stats: {
              todayAccess: 'Today\'s Access',
              uniqueIPs: 'Unique IPs',
              blocked: 'Blocked',
              countries: 'Countries',
              noChange: 'No change',
              new: 'New',
            },
            messages: {
              logsLoadFail: 'Failed to load IP logs.',
              managementLoadFail: 'Failed to load IP management list.',
              statsLoadFail: 'Failed to load statistics',
              blockSuccess: 'IP has been blocked.',
              blockFail: 'Failed to block IP.',
              unblockSuccess: 'IP block has been removed.',
              unblockFail: 'Failed to unblock IP.',
            },
            charts: {
              accessTrend: 'Access Trend',
              accessTrendFetchFail: 'Failed to fetch access trend',
              countryDistribution: 'Country Access Distribution (Last 7 Days)',
              countryDistributionFetchFail: 'Failed to fetch country distribution',
              hourlyAccess: 'Hourly Access Count (Last 7 Days)',
              hourlyAccessFetchFail: 'Failed to fetch hourly access',
              noData: 'No data available',
              days7: 'Last 7 Days',
              days14: 'Last 14 Days',
              days30: 'Last 30 Days',
              totalAccess: 'Total Access',
              uniqueIP: 'Unique IP',
              hour: 'Hour',
              accessCount: 'Access Count',
            },
            filters: {
              ipAddress: 'IP Address',
              ipSearch: 'Search IP...',
              country: 'Country',
              countrySearch: 'Search country...',
            },
            table: {
              ipAddress: 'IP Address',
              user: 'User',
              page: 'Page',
              country: 'Country/Region',
              time: 'Time',
              status: 'Status',
              state: 'State',
              reason: 'Reason',
              blockDate: 'Block Date',
              action: 'Action',
              rank: 'Rank',
              accessCount: 'Access Count',
            },
            status: {
              blocked: 'Blocked',
              whitelisted: 'Whitelisted',
              normal: 'Normal',
            },
            buttons: {
              unblock: 'Unblock',
              block: 'Block',
            },
            empty: {
              noLogs: 'No logs available',
              noIPManagement: 'No IP management data',
              noTopIPs: 'No data available',
            },
            topIPs: {
              title: 'TOP Access IP Addresses (Last 7 Days)',
            },
          },
          security: {
            title: 'Security Management',
            subtitle: 'Security events and bot detection management',
            loading: 'Loading...',
            tabs: {
              events: 'Security Events',
              bots: 'Bot Management',
              settings: 'Security Settings',
            },
            severity: {
              critical: 'Critical',
              high: 'High',
              medium: 'Medium',
              low: 'Low',
            },
            messages: {
              eventsLoadFail: 'Failed to load security events.',
              botsLoadFail: 'Failed to load bot list.',
              settingsLoadFail: 'Failed to load settings',
              blockSuccess: 'Bot has been blocked.',
              blockFail: 'Failed to block bot.',
              unblockSuccess: 'Bot block has been removed.',
              unblockFail: 'Failed to unblock bot.',
              saveSuccess: 'Settings have been saved.',
              saveFail: 'Failed to save settings.',
            },
            charts: {
              eventTrend: 'Security Event Trend',
              eventTrendFetchFail: 'Failed to fetch event trend',
              eventDistribution: 'Event Type Distribution (Last 7 Days)',
              eventDistributionFetchFail: 'Failed to fetch event distribution',
              hourlyDistribution: 'Hourly Distribution (Last 7 Days)',
              hourlyDistributionFetchFail: 'Failed to fetch hourly distribution',
              noData: 'No data available',
              days7: 'Last 7 Days',
              days14: 'Last 14 Days',
              days30: 'Last 30 Days',
              loginFailed: 'Login Failed',
              botDetected: 'Bot Detected',
              apiAbuse: 'API Abuse',
              scraping: 'Scraping',
              suspiciousActivity: 'Suspicious Activity',
              ipBlocked: 'IP Blocked',
            },
            settings: {
              title: 'Security Settings',
              autoBlock: 'Auto Bot Block',
              autoBlockDesc: 'Automatically block suspicious bots',
              botDetection: 'Bot Detection Threshold',
              botDetectionDesc: 'Automatically block bots with confidence score above this value (0-100)',
              maxLoginAttempts: 'Max Login Attempts',
              maxLoginAttemptsDesc: 'Automatically block after exceeding this number of attempts',
              blockDuration: 'Block Duration (hours)',
              blockDurationDesc: 'Time until block is automatically removed',
              save: 'Save Settings',
            },
            filters: {
              eventType: 'Event Type',
              all: 'All',
              loginFailed: 'Login Failed',
              botDetected: 'Bot Detected',
              apiAbuse: 'API Abuse',
              scraping: 'Scraping',
              suspiciousActivity: 'Suspicious Activity',
              ipBlocked: 'IP Block',
              severity: 'Severity',
              critical: 'Critical',
              high: 'High',
              medium: 'Medium',
              low: 'Low',
              ipAddress: 'IP Address',
              ipSearch: 'Search IP...',
            },
            table: {
              time: 'Time',
              eventType: 'Event Type',
              ipAddress: 'IP Address',
              detail: 'Detail',
              severity: 'Severity',
              status: 'Status',
              userAgent: 'User-Agent',
              detectionReason: 'Detection Reason',
              confidence: 'Confidence',
              detectionTime: 'Detection Time',
              action: 'Action',
              rank: 'Rank',
              eventCount: 'Event Count',
              maxSeverity: 'Max Severity',
            },
            status: {
              blocked: 'Blocked',
              monitoring: 'Monitoring',
            },
            buttons: {
              block: 'Block',
            },
            stats: {
              todayEvents: 'Today\'s Events',
              botDetected: 'Bot Detected',
              autoBlocked: 'Auto Blocked',
              loginFailed: 'Login Failed',
            },
            empty: {
              noEvents: 'No events available',
              noBots: 'No bots detected',
              noAttackIPs: 'No attack IPs',
            },
            topAttackIPs: {
              title: 'TOP Attack IP Addresses (Last 7 Days)',
            },
          },
          templates: {
            title: 'Template Management',
            subtitle: 'Manage AI product sets by project type',
            create: 'Create Template',
            edit: 'Edit Template',
            table: {
              id: 'ID',
              name: 'Template Name',
              description: 'Description',
              productCount: 'Product Count',
              createdAt: 'Created At',
              action: 'Action',
              view: 'View',
              edit: 'Edit',
              delete: 'Delete',
            },
            form: {
              name: 'Template Name *',
              namePlaceholder: 'e.g., Web Application Development',
              description: 'Description',
              descriptionPlaceholder: 'e.g., AI set for building full-stack web apps',
              iconUrl: 'Icon URL',
              iconUrlPlaceholder: 'e.g., /images/templates/web.png',
              products: 'Included Products',
              selectedProducts: 'Selected Products',
              searchProducts: 'Search products...',
              noProducts: 'No products found.',
              added: 'Added',
              allCategories: 'All',
            },
            modal: {
              save: 'Save',
              cancel: 'Cancel',
            },
            messages: {
              nameRequired: 'Please enter template name.',
              createSuccess: 'Template has been created.',
              updateSuccess: 'Template has been updated.',
              deleteSuccess: 'Template has been deleted.',
              deleteConfirm: 'Are you sure you want to delete this template?',
              deleteConfirmOk: 'Delete',
              deleteConfirmCancel: 'Cancel',
              saveFail: 'Failed to save template.',
              deleteFail: 'Failed to delete template.',
            },
          },
          sellerApplications: {
            title: 'Seller Application Management',
            filters: {
              all: 'All',
              pending: 'Pending',
              approved: 'Approved',
              rejected: 'Rejected',
            },
            table: {
              id: 'ID',
              applicant: 'Applicant',
              sellerName: 'Seller Name',
              email: 'Email',
              specialization: 'Specialization',
              requestDate: 'Request Date',
              status: 'Status',
              action: 'Action',
              viewDetail: 'View Detail',
            },
            status: {
              approved: '✅ Approved',
              rejected: '❌ Rejected',
              pending: '⏳ Pending',
            },
            messages: {
              loading: 'Loading...',
              empty: 'No applications found.',
              loadFail: 'Failed to load application list.',
            },
            detail: {
              title: 'Seller Application Detail',
              backToList: '← Back to List',
              validation: {
                title: 'Auto Validation Result',
                score: 'points / 100 points',
                messages: {
                  approved: '✔ Approval Recommended',
                  review: '⚠ Review Required',
                  rejected: '✖ Approval Not Recommended',
                },
                categories: {
                  requiredInfo: 'Required Information',
                  email: 'Email',
                  phone: 'Phone',
                  techStack: 'Tech Stack',
                  portfolio: 'Portfolio',
                  github: 'GitHub',
                  businessNumber: 'Business Number',
                  textQuality: 'Text Quality',
                  specialization: 'Specialization',
                },
                checkMessages: {
                  '필수 정보: 8/8 항목 완료': 'Required Info: 8/8 items completed',
                  '필수 정보: 일부 항목 누락': 'Required Info: Some items missing',
                  '이메일: 유효한 형식': 'Email: Valid format',
                  '이메일: 형식 오류': 'Email: Format error',
                  '기술 스택: 충분한 입력': 'Tech Stack: Sufficient input',
                  '기술 스택: X 입력 부족': 'Tech Stack: Insufficient input',
                  '포트폴리오: URL 제공됨': 'Portfolio: URL provided',
                  '포트폴리오: URL 없음': 'Portfolio: No URL',
                  'GitHub: URL 제공됨': 'GitHub: URL provided',
                  'GitHub: URL 없음': 'GitHub: No URL',
                  '사업자등록번호: 제공됨': 'Business Number: Provided',
                  '사업자등록번호: 없음': 'Business Number: Not provided',
                },
              },
              applicantInfo: {
                title: 'Applicant Information',
                username: 'Username:',
                email: 'Email:',
                joinDate: 'Join Date:',
              },
              applicationInfo: {
                title: 'Seller Application Information',
                sellerName: 'Seller Name:',
                contactEmail: 'Contact Email:',
                phone: 'Phone:',
                specialization: 'Specialization:',
                techStack: 'Tech Stack:',
                portfolio: 'Portfolio:',
                github: 'GitHub:',
                businessNumber: 'Business Number:',
                productDescription: 'Product Description',
                motivation: 'Application Motivation',
              },
              actions: {
                approve: 'Approve',
                reject: 'Reject',
              },
              rejectModal: {
                title: 'Enter Rejection Reason',
                placeholder: 'Enter rejection reason',
                ok: 'Confirm Rejection',
                cancel: 'Cancel',
              },
              messages: {
                loading: 'Loading...',
                loadFail: 'Failed to load detail information.',
                approveConfirm: 'Are you sure you want to approve this application?',
                approveSuccess: 'Application has been approved.',
                approveFail: 'Failed to approve application.',
                rejectWarning: 'Please enter rejection reason.',
                rejectSuccess: 'Application has been rejected.',
                rejectFail: 'Failed to reject application.',
                dataLoadFail: 'Unable to load data.',
              },
            },
          },
        },
        settings: {
          title: 'Settings',
          backToProfile: 'Back to Profile',
          loading: 'Loading...',
          personalInfo: {
            title: 'Personal Information',
            edit: 'Edit',
            cancel: 'Cancel',
            save: 'Save',
            username: 'Username',
            usernamePlaceholder: 'Enter username',
            email: 'Email',
            emailPlaceholder: 'Enter email',
            emailPublic: 'Public',
            emailPrivate: 'Private',
            emailPublicDesc: 'Email will be displayed on profile page',
            emailPrivateDesc: 'Email will not be displayed on profile page',
            githubUrl: 'GitHub URL',
            githubUrlPlaceholder: 'https://github.com/username',
            developerType: 'Developer Type',
            developerTypeNone: 'None',
            developerTypes: {
              frontend: 'Frontend Developer',
              backend: 'Backend Developer',
              fullstack: 'Full Stack Developer',
              mobile: 'Mobile Developer',
              devops: 'DevOps Engineer',
              data: 'Data Engineer/Scientist',
              security: 'Security Developer',
              infrastructure: 'Infrastructure Engineer',
              server: 'Server Developer',
              management: 'Management',
              other: 'Other',
            },
            tags: 'Hashtags',
            tagsPlaceholder: 'Enter hashtags and press Enter',
            addTag: 'Add',
            currentPassword: 'Current Password (required for password change)',
            currentPasswordPlaceholder: 'Enter current password',
            newPassword: 'New Password',
            newPasswordPlaceholder: 'Enter new password (optional)',
            confirmPassword: 'Confirm New Password',
            confirmPasswordPlaceholder: 'Enter new password again',
            updateSuccess: 'Personal information has been successfully updated.',
            updateFail: 'Update failed.',
            updateError: 'An error occurred during update.',
            passwordMismatch: 'New password and confirm password do not match.',
            passwordMinLength: 'Password must be at least 6 characters.',
            passwordRequired: 'Please enter current password.',
            unmountError: 'Component has been unmounted.',
          },
          paymentMethods: {
            title: 'Payment Methods',
            add: 'Add',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            paymentMethod: 'Payment Method',
            creditCard: 'Credit Card',
            debitCard: 'Debit Card',
            cardCompany: 'Card Company',
            cardNumber: 'Card Number',
            cardNumberPlaceholder: 'Enter card number',
            expMonth: 'Expiry Month',
            expYear: 'Expiry Year',
            cvc: 'CVC',
            expiryDate: 'Expiry Date',
            empty: 'No registered payment methods.',
            addSuccess: 'Payment method has been added.',
            addFail: 'Failed to add payment method.',
            addError: 'An error occurred while adding payment method.',
            deleteConfirm: 'Are you sure you want to delete this payment method?',
            deleteSuccess: 'Payment method has been deleted.',
            deleteFail: 'Failed to delete payment method.',
            deleteError: 'An error occurred while deleting payment method.',
            cannotDeleteLast: 'At least one payment method must be registered. Please add a new payment method first.',
            cannotDeleteLastTooltip: 'The last payment method cannot be deleted. Please add a new payment method first.',
            allFieldsRequired: 'Please enter all fields.',
            cardNumberInvalid: 'Card number must be 13-19 digits.',
            cvcInvalid: 'CVC must be 3 or 4 digits.',
            expMonthInvalid: 'Expiry month must be between 1-12.',
            expYearInvalid: 'Expiry year is invalid.',
          },
          studentVerification: {
            title: 'Student Verification',
            manage: 'Manage Student Verification',
            status: {
              verified: 'Verified',
              pending: 'Pending',
              expired: 'Expired',
              notApplied: 'Not Applied',
            },
            description: {
              verified: 'Student discount (50%) is being applied.',
              verifiedWithExpiry: 'Student discount (50%) is being applied. {{days}} days until expiry.',
              pending: 'Student ID has been uploaded. Waiting for admin approval.',
              expired: 'Student verification has expired. Please renew.',
              notApplied: 'Apply for student verification to get 50% discount on all products.',
            },
            labels: {
              verifiedDate: 'Verification Date:',
              expiryDate: 'Expiry Date:',
              status: 'Status:',
              pendingStatus: 'Waiting for admin review',
            },
            info: {
              title: 'Student Verification Info',
              item1: 'Student verification automatically applies 50% discount on all products.',
              item2: 'Student discount can be combined with coupon discounts, up to 70% total discount.',
              item3: 'Student verification is valid for one year.',
            },
          },
        },
        admin: {
          sidebar: {
            dashboard: 'Dashboard',
            products: 'Products',
            reviews: 'Reviews',
            orders: 'Orders',
            upload: 'Upload Product',
          },
          upload: {
            title: 'Upload Product',
            subtitle: 'Register a new product and add it to the marketplace.',
          },
          hero: {
            github: 'GitHub',
            followers: 'Followers',
          },
          stats: {
            totalProducts: 'Total Products',
            totalRevenue: 'Total Revenue',
            followers: 'Followers',
            reviews: 'Reviews',
          },
          recentProducts: {
            title: 'My Recent 5 Products',
            viewAll: 'View All Products →',
            empty: 'No registered products',
            categoryFallback: 'AI Developer',
          },
          recentReviews: {
            title: 'Recent 3 Reviews',
            empty: 'No reviews',
            productFallback: 'AI Developer',
          },
          loading: 'Loading...',
          orders: {
            title: 'Sales History',
            export: 'Export',
            filters: {
              dateRange: 'Date Range',
              product: 'Product',
              statusLabel: 'Status',
              sort: 'Sort',
              reset: 'Reset',
              dateOptions: {
                all: 'All',
                today: 'Today',
                week: 'This Week',
                month: 'This Month',
                quarter: 'This Quarter',
                year: 'This Year',
              },
              productAll: 'All Products',
              statusAll: 'All Status',
              statusOptions: {
                completed: 'Completed',
                pending: 'Pending',
                cancelled: 'Cancelled',
              },
              sortOptions: {
                recent: 'Most Recent',
                oldest: 'Oldest',
                amountHigh: 'Amount (High)',
                amountLow: 'Amount (Low)',
              },
            },
            summary: {
              totalOrders: 'Total Orders',
              thisMonth: 'This Month Revenue',
              completed: 'Completed',
              pending: 'Pending',
              avgOrderValue: 'Average Order Value',
            },
            table: {
              orderId: 'Order Number',
              product: 'Product',
              buyer: 'Buyer',
              amount: 'Amount',
              status: 'Status',
              date: 'Date',
              actions: 'Actions',
              view: 'View',
              statusText: {
                completed: 'Completed',
                pending: 'Pending',
                cancelled: 'Cancelled',
              },
            },
            empty: {
              title: 'No Orders',
              desc: 'No order data.',
              descWithFilters: 'Try changing conditions or resetting.',
            },
          },
          reviewsPage: {
            title: 'Review Management',
            subtitle: 'Manage all reviews for your products',
            filters: {
              search: 'Search Reviews',
              searchPlaceholder: 'Search by reviewer or content...',
              product: 'Product',
              productAll: 'All Products',
              rating: 'Rating',
              ratingAll: 'All Ratings',
              ratingOption: {
                five: '5 stars',
                four: '4 stars',
                three: '3 stars',
                two: '2 stars',
                one: '1 star',
              },
              sort: 'Sort',
              sortOptions: {
                recent: 'Most Recent',
                oldest: 'Oldest',
                ratingHigh: 'Highest Rating',
                ratingLow: 'Lowest Rating',
                helpful: 'Most Helpful',
              },
              reset: 'Reset',
            },
            summary: {
              totalReviews: 'Total Reviews',
              averageRating: 'Average Rating',
              thisMonth: 'This Month',
              positive: 'Positive (4-5★)',
              needsAttention: 'Needs Attention (1-3★)',
            },
            statsCards: {
              reviews: 'Reviews',
            },
            empty: {
              title: 'No Reviews',
              titleWithFilters: 'No reviews matching filters',
              desc: 'Customer reviews will appear here when registered.',
              descWithFilters: 'Try adjusting filters to see different results.',
            },
            item: {
              userFallback: 'User',
              verified: 'Verified Purchase',
              notVerified: 'Not Verified',
              helpful: '{{count}} people found this helpful',
              viewProduct: 'View Product',
            },
          },
        },
      },
      teamBuilder: {
        introTitle: 'Build Your Ideal AI Team',
        introSubtitle: 'You can select up to {{max}} members to build your team',
        availableTitle: 'Available AI Developers',
        teamTitle: 'AI Team',
        noDevelopers: 'No developers selected',
        selectDevelopers: 'Please select developers',
        teamTotal: 'Team Total',
        namePlaceholder: 'Enter team name',
        save: 'Save Team',
        saving: 'Saving...',
        tipTitle: 'Product Documentation',
        tipDescription: 'Build a diverse team with various expertise to achieve the best results!',
        scrollLeft: 'Scroll Left',
        scrollRight: 'Scroll Right',
        templateTeams: 'Template Teams',
        template: 'Template',
        addTemplateTeam: 'Add',
        memberUnit: 'people',
        quickStartTitle: 'Pre-configured Teams for Quick Start',
        templateCardAIs: '{{count}} AIs · Synergy: {{synergy}}',
        messages: {
          selectMembers: 'Please select team members.',
          loginRequired: 'Login required.',
          saveSuccess: 'Team has been saved!',
          saveFail: 'Failed to save team.',
        },
      },
      synergy: {
        label: 'Team Synergy',
        exceptional: 'Exceptional',
        excellent: 'Excellent',
        good: 'Good',
        keepBuilding: 'Keep Building',
      },
      chart: {
        title: 'Team Stats',
        explanation: 'Explanation',
        explanationTitle: 'Hexagon Chart Explanation',
        explanationDescription: 'This chart visualizes the team\'s 6 abilities. Each ability is displayed on a scale of 0-100, showing the team\'s average values.',
        statsTitle: 'Ability Descriptions',
        stats: {
          teamwork: 'Teamwork: Ability to collaborate with other AIs',
          stability: 'Stability: Reliable and consistent performance',
          speed: 'Speed: Fast processing and response times',
          creativity: 'Creativity: New ideas and innovative approaches',
          productivity: 'Productivity: Efficient task processing capability',
          maintainability: 'Maintainability: Code quality and ease of management',
        },
        synergyNote: 'When building a team, considering the balance of each ability can lead to better synergy.',
        showIndividualComparison: 'Show Individual Product Comparison',
        teamAverage: 'Team Average',
        legend: 'Legend',
      },
      teamBenefits: {
        title: 'AI Team Benefits',
        subtitle: 'Compare performance: Individual AI vs. Team of AIs',
        avgImprovement: 'Avg Improvement',
        percentImprovement: 'Improvement %',
        individual: 'Individual Avg',
        team: 'Team Avg',
        tipTitle: 'Benefits of Team Composition',
        tipDescription: 'By forming a team of multiple AIs, you can compensate for individual weaknesses and maximize strengths, resulting in significantly improved overall performance.',
      },
      developerCard: {
        teamwork: 'Teamwork',
        creative: 'Creativity',
        productivity: 'Productivity',
        add: 'Add',
        remove: 'Remove',
        removeFromFavorites: 'Remove from Favorites',
      },
      auth: {
        login: {
          title: 'Login',
          emailLabel: 'Email Address',
          emailPlaceholder: 'your@email.com',
          passwordLabel: 'Password',
          passwordPlaceholder: '••••••••',
          rememberMe: 'Remember me',
          forgotPassword: 'Forgot password?',
          signInButton: 'Sign In',
          signingIn: 'Signing in...',
          noAccount: "Don't have an account?",
          signUpLink: 'Sign up for free',
          success: 'Login successful.',
          fail: 'Login failed.',
          error: 'An error occurred during login.',
          errors: {
            invalidCredentials: 'Email or password is incorrect.',
            userNotFound: 'Email address is not registered. Please check your email address.',
            wrongPassword: 'Password is incorrect. Please check your password again.',
            googleAccount: 'This account uses Google login. Please use the Google login button.',
            serverError: 'Server error occurred. Please try again later.',
          },
          terms: 'Terms of Service',
          privacy: 'Privacy Policy',
          agreeText: 'By logging in, you agree to the following',
        },
        forgotPassword: {
          title: 'Forgot Password',
          subtitle: 'Enter your email address to reset your password.',
          emailLabel: 'Email Address',
          emailPlaceholder: 'your@email.com',
          submitButton: 'Send Reset Link',
          submitting: 'Sending...',
          backToLogin: 'Back to Login',
          emailSent: 'Verification code has been sent to your email. Please check your email.',
          emailServerNotConfigured: 'Email server is not configured. Display code: {{code}}',
          requestError: 'An error occurred while requesting password reset.',
        },
        resetPassword: {
          title: 'Reset Password',
          subtitle: 'Enter your new password.',
          newPasswordLabel: 'New Password',
          confirmPasswordLabel: 'Confirm Password',
          passwordPlaceholder: '••••••••',
          submitButton: 'Change Password',
          submitting: 'Changing password...',
          backToLogin: 'Back to Login',
          success: 'Password has been successfully changed.',
          resetError: 'An error occurred while resetting password.',
          invalidToken: 'Invalid reset token.',
          noToken: 'Token not provided.',
          passwordMismatch: 'Passwords do not match.',
          passwordMinLength: 'Password must be at least 8 characters.',
          passwordRequired: 'Please enter password.',
          confirmPasswordRequired: 'Please enter confirm password.',
        },
        verifyCode: {
          title: 'Enter Verification Code',
          subtitle1: 'A 6-digit verification code has been sent to',
          subtitle2: '{{email}}',
          codeLabel: 'Verification Code',
          codeHint: 'Enter the 6-digit number sent to your email',
          verifying: 'Verifying...',
          verify: 'Verify',
          noEmail: 'Email information not available.',
          verifySuccess: 'Verification code has been verified.',
          verifyError: 'An error occurred while verifying code.',
          noCodeReceived: "Didn't receive the code?",
          resend: 'Resend',
          devCodeInfo: 'Development environment code: {{code}}',
        },
        signup: {
          title: 'Create Account',
          subtitle: 'Join thousands of developers to build amazing AI solutions together',
          success: 'Registration successful.',
          fail: 'Registration failed. Please try again.',
          error: 'An error occurred during registration.',
          agreeText: 'By signing up, you agree to the following',
          terms: 'Terms of Service',
          privacy: 'Privacy Policy',
          usernameLabel: 'Username',
          usernamePlaceholder: 'username',
          emailLabel: 'Email Address',
          emailPlaceholder: 'your@email.com',
          passwordLabel: 'Password',
          passwordPlaceholder: '••••••••',
          confirmPasswordLabel: 'Confirm Password',
          rememberMe: 'Remember me',
          creating: 'Creating account...',
          createButton: 'Create Account',
          alreadyHaveAccount: 'Already have an account?',
          signIn: 'Sign In',
          errors: {
            usernameRequired: 'Please enter username.',
            usernameMinLength: 'Username must be at least 3 characters.',
            usernameInvalid: 'Username can only contain letters, numbers, and underscores.',
            emailRequired: 'Please enter email.',
            emailInvalid: 'Invalid email format.',
            passwordRequired: 'Please enter password.',
            passwordMinLength: 'Password must be at least 8 characters.',
            confirmPasswordRequired: 'Please enter confirm password.',
            passwordMismatch: 'Passwords do not match.',
          },
        },
      },
      order: {
        title: 'Order Details',
        backToProfile: 'Back to Profile',
        notFound: 'Order not found',
        itemsTitle: 'Order Items ({{count}})',
        badge: 'Order Number: {{number}}',
        status: {
          pending: 'Payment Pending',
          completed: 'Completed',
        },
        statusLabel: 'Order Status',
        summaryTitle: 'Order Summary',
        totalLabel: 'Total Order Amount',
        processing: 'Processing',
        item: {
          noProduct: 'Unable to load product information',
        },
        review: {
          completed: 'Review has been written',
          title: 'Write Review',
          ratingLabel: 'Rating:',
          ratingValue: '{{rating}} points',
          titleLabel: 'Review Title',
          titlePlaceholder: 'Enter review title (optional)',
          contentLabel: 'Review Content',
          contentPlaceholder: 'Write your review... (optional)',
          imagesLabel: 'Add Photos (optional)',
          upload: 'Upload',
          submit: 'Submit Review',
          submitting: 'Submitting...',
          imageOnly: 'Only image files can be uploaded.',
          imageSize: 'Image size must be 5MB or less.',
          uploadFail: 'Failed to upload image.',
        },
      },
      product: {
        header: {
          backHome: 'Back to Home',
        },
        tabs: {
          overview: 'Overview',
          projects: 'Projects',
          reviews: 'Reviews ({{count}})',
        },
        price: {
          purchased: 'Purchased',
          label: 'Price',
          buyNow: 'Buy Now',
          addToCart: 'Add to Cart',
          addToTeam: 'Add to Team',
          location: 'Location',
          joined: 'Joined {{date}}',
          respondsIn: 'Responds in {{time}}',
          topDeveloper: 'Top 1% Developer',
        },
        overview: {
          title: 'Skills & Capabilities',
        },
        trust: {
          title: 'Verification & Trust',
          identity: 'Identity Verified',
          topRated: 'Top Rated Developer',
          success: '156k+ Successful Projects',
        },
        reviews: {
          filter: {
            label: 'Developer Type Filter:',
            ratingLabel: 'Rating Filter',
            all: 'All',
            count: 'reviews',
            empty: 'No reviews.',
            emptyFiltered: 'No {{type}} reviews.',
            clearRating: 'Clear Rating Filter',
          },
        },
        recommended: {
          title: 'Recommended Products',
          description: 'Frequently bought together with this product',
          categoryTitle: '{{category}} Recommended Products',
          categoryDescription: 'Check out recommended products in the same category',
        },
        viewed: {
          title: 'Other Customers Also Viewed',
          description: 'Check out popular products that other customers are viewing',
        },
        templates: {
          title: 'Templates with this Product',
          description: 'Check out templates that include this product',
        },
        notFound: {
          title: 'Product not found',
          subtitle: 'Product ID: {{id}}',
          apiUrl: 'API: {{url}}',
          errorInfo: 'Error Information:',
          errorMessage: 'A server error occurred. There may be a database issue.',
          errorDetail: 'Please check the browser console for details.',
          backToHome: 'Back to Main Page',
        },
        messages: {
          loginRequired: 'Login required.',
          addToCartSuccess: 'Added to cart',
          addToCartFail: 'Failed to add to cart.',
          alreadyPurchased: 'This product has already been purchased.',
          favoriteAdded: 'Added to favorites.',
          favoriteRemoved: 'Removed from favorites.',
          favoriteUpdateFail: 'Failed to update favorites.',
        },
      },
      purchase: {
        header: {
          backHome: 'Back to Home',
          title: 'Shopping Cart',
          subtitle: 'Review your selected AI developers before purchase',
        },
        empty: {
          title: 'Your cart is empty',
          description: 'Browse AI developers and start building your team!',
          cta: 'Browse Developers',
        },
        productCard: {
          categoryFallback: 'AI Developer',
          purchased: 'Purchased',
        },
        cartItem: {
          remove: 'Remove',
        },
        coupon: {
          title: 'Have a coupon code?',
          placeholder: 'Enter code (e.g., SAVE20)',
          apply: 'Apply',
          remove: 'Remove',
          applied: 'Coupon applied: {{label}}',
        },
        summary: {
          title: 'Order Summary',
          subtotal: 'Subtotal ({{count}} items)',
          discount: 'Discount ({{label}})',
          studentDiscount: 'Student Discount (50%)',
          tax: 'Tax (10%)',
          total: 'Total',
          checkout: 'Proceed to Checkout',
          processing: 'Processing...',
          secure: 'Secure payment protected by Stripe',
          subscription: {
            agree: 'I agree to automatic monthly payments',
            description: 'You will be charged automatically on the last day of each month using your registered payment method.',
            nextPayment: 'Next payment date: {{date}}',
          },
        },
        protection: {
          title: 'Purchase Protection',
          guarantee: '30-Day Money-Back Guarantee',
          secure: 'Secure Payment Processing',
          delivery: 'Instant Delivery via Email',
          support: '24/7 Customer Support',
        },
        payment: {
          title: 'Payment Information',
          company: 'Card Company',
          number: 'Card Number',
          expMonth: 'Expiry Month',
          expYear: 'Expiry Year',
          cvc: 'CVC',
          placeholders: {
            number: '1234 5678 9012 3456',
            cvc: '123',
          },
          errors: {
            cardNumberRequired: 'Please enter card number.',
            cardNumberInvalid: 'Invalid card number format. (16 digits)',
            cvcRequired: 'Please enter CVC.',
            cvcInvalid: 'Invalid CVC format. (3-4 digits)',
            expMonthRequired: 'Please select expiry month.',
            expMonthInvalid: 'Please select a valid month.',
            expYearRequired: 'Please select expiry year.',
            expYearInvalid: 'Please select a valid year.',
          },
        },
        confirmation: {
          headerTitle: 'AIDE Market',
          success: {
            title: 'Purchase Completed! 🎉',
            subtitle: 'Thank you for your purchase. Your AI developers are ready to use!',
            orderNumber: 'Order Number #{{number}}',
            subscription: {
              title: 'Recurring Payment Set Up',
              nextPayment: 'Next payment date: {{date}}',
              description: 'You will be charged automatically on the last day of each month using your registered payment method.',
            },
          },
          summary: {
            title: 'Order Summary',
            number: 'Order Number',
            date: 'Order Date',
            items: 'Total {{count}} AI Developers',
            total: 'Total Payment Amount',
            paid: 'Payment has been successfully processed',
            subscription: {
              title: 'Recurring Payment',
              nextPayment: 'Next payment date: {{date}}',
            },
          },
          actions: {
            browse: 'Browse Other Developers',
            history: 'View Purchase History',
          },
          aiList: {
            title: 'Purchased AI Developers',
            activation: 'Activation Code',
            document: 'View Document',
            download: 'Download Document',
            guide: 'View Guide',
            copy: 'Copy',
            copied: 'Copied!',
          },
          email: {
            title: 'Email Notification',
            description: 'Receipt and activation information will be sent to your email.',
            copy: 'Copy Email',
            copied: 'Copied!',
            stepsTitle: '⚡ Next Steps:',
            steps: [
              'Check your email from AIDE Market',
              'Copy the activation code below',
              'Register the code in AIDE Program',
            ],
          },
          support: {
            title: 'Need Support?',
            description: 'Please contact our customer service for any inquiries.',
            email: 'support@aidemarket.com',
            help: 'Help Center',
            chat: 'Live Chat',
          },
        },
        messages: {
          loginRequired: 'Login required.',
          alreadyPurchased: 'This product has already been purchased. One product can only be purchased once per user.',
          cartItemRemoved: 'Removed from cart.',
          removeCartItemFail: 'Failed to remove from cart.',
          couponCodeRequired: 'Please enter coupon code.',
          couponApplied: 'Coupon applied.',
          couponApplyFail: 'Failed to apply coupon.',
          couponRemoved: 'Coupon removed.',
          paymentMethodRequired: 'Please register a card for payment.',
          goToPaymentMethod: 'Would you like to go to the card registration page?',
          orderCreated: 'Order has been created successfully.',
          orderCreateFail: 'Failed to create order.',
          requestError: 'Request error: {{message}}',
          authRequired: 'Authentication required. Please login again.',
          serverError: 'Server error: {{message}}',
          networkError: 'Unable to connect to server. Please check your network.',
          subscriptionCreateFail: 'Failed to create recurring payment subscription. Please contact customer service.',
          itemsRemovedFromCart: '{{count}} items have been removed from cart as they were already purchased.',
          alreadyPurchasedWarning: 'Already purchased items will be excluded from the order.',
          noItemsToPurchase: 'No items available for purchase.',
          cartLoadFail: 'Failed to load cart.',
          superAdminCannotPurchase: 'You cannot proceed with payment as an administrator.',
        },
        availableCartItems: {
          title: 'Items in Cart',
          description: 'Select items you want to purchase together',
          addToPurchase: 'Add to purchase list',
        },
      },
      productAdmin: {
        list: {
          title: 'My Products',
          new: 'New Product',
          loading: 'Loading...',
          filters: {
            search: 'Search',
            searchPlaceholder: 'Enter product name...',
            category: 'Category',
            categoryAll: 'All Categories',
            sort: 'Sort',
            sortOptions: {
              recent: 'Most Recent',
              name: 'Name',
              sales: 'Sales',
              rating: 'Rating',
              price: 'Price',
            },
            reset: 'Reset',
          },
          summary: {
            totalProducts: 'Total Products',
            totalSales: 'Total Sales',
            totalRevenue: 'Total Revenue',
            avgRating: 'Average Rating',
          },
          table: {
            id: 'ID',
            product: 'Product',
            price: 'Price',
            sales: 'Sales',
            rating: 'Rating',
            actions: 'Actions',
            details: 'Details',
            edit: 'Edit',
            public: 'View Public',
            delete: 'Delete',
            categoryFallback: 'AI Developer',
          },
          empty: {
            title: 'No Products',
            desc: 'Create your first product',
            descWithFilters: 'Try adjusting filters',
            new: 'New Product',
          },
          messages: {
            loadFail: 'Failed to load product list.',
            deleteConfirm: 'Are you sure you want to delete {{name}}?',
            deleteSuccess: 'Product has been deleted.',
            deleteFail: 'Failed to delete product.',
          },
        },
        detail: {
          loading: 'Loading product...',
          loadError: 'Failed to load product information.',
          retry: 'Retry',
          back: 'Back to Product List',
          header: {
            edit: 'Edit',
            viewPublic: 'View Product Page',
          },
          stats: {
            totalSales: 'Total Sales',
            totalRevenue: 'Total Revenue',
            avgRating: 'Average Rating',
          },
          chart: {
            title: 'Monthly Sales',
            subtitle: 'Sales trend for the last 12 months',
            empty: 'No sales data.',
          },
          info: {
            name: 'Name',
            price: 'Price',
            category: 'Category',
            created: 'Created',
            views: 'Views',
            favorites: 'Favorites',
          },
          meta: {
            creator: 'Creator',
            created: 'Created',
            views: 'Views',
          },
          latestReview: {
            title: 'Latest Review',
            subtitle: 'Latest 1 review',
            viewAll: 'View All Reviews',
            noReview: 'No reviews yet.',
            noComment: 'No comment.',
          },
        },
        upload: {
          title: 'Register Product',
          imageSection: 'Product Image',
          imageUpload: 'Upload Image',
          imageRequired: 'Please upload product image.',
          imageUploadSuccess: 'Image upload complete',
          imageUploadFail: 'Image upload failed',
          basicInfo: 'Basic Information',
          productName: 'Product Name',
          productNamePlaceholder: 'Enter product name',
          productNameRequired: 'Please enter product name.',
          sellerName: 'Seller Name',
          sellerNamePlaceholder: 'Enter seller name',
          sellerNameRequired: 'Please enter seller name.',
          price: 'Price',
          pricePlaceholder: 'Enter price',
          priceRequired: 'Please enter price.',
          priceMin: 'Price must be 0 or greater.',
          description: 'Product Description',
          descriptionPlaceholder: 'Enter detailed description of the product',
          descriptionRequired: 'Please enter product description.',
          category: 'Category',
          mainCategory: 'Main Category',
          mainCategoryPlaceholder: 'Select category',
          subCategory: 'Sub Category',
          subCategoryPlaceholder: 'Select sub category',
          techStack: 'Tech Stack',
          techStackPlaceholder: 'e.g., React, Node.js, Python',
          statsSection: 'AI Stats (Optional)',
          statsDescription: 'You can set each stat value between 0-100.',
          teamwork: 'Teamwork',
          stability: 'Stability',
          speed: 'Speed',
          creativity: 'Creativity',
          productivity: 'Productivity',
          maintainability: 'Maintainability',
          submit: 'Register Product',
          reset: 'Reset',
          success: 'Product has been successfully registered!',
          fail: 'Failed to upload product.',
          categoryLoadFail: 'Failed to load category list.',
          productIdError: 'Did not receive product ID after creation.',
          statsCreateFail: 'Failed to create Stats (product was created).',
        },
      },
      subscription: {
        manage: {
          title: 'Subscription Management',
          subtitle: 'Manage recurring payment subscriptions and check payment information',
          loginRequired: 'Login required.',
          loadFail: 'Unable to load subscription list.',
          failedTitle: 'Failed Subscription Payments',
          failedDescription: '{{count}} subscription payments have failed. Please retry payment within the grace period.',
          goToFailedPage: 'Go to Payment Failed Page',
          activeTitle: 'Active Subscriptions',
          otherTitle: 'Other Subscriptions',
          emptyTitle: 'No Subscriptions',
          emptyDescription: 'To start a recurring payment subscription, select the subscription option when purchasing a product.',
          browseProducts: 'Browse Products',
        },
        paymentFailed: {
          title: 'Payment Failed Management',
          subtitle: 'Check failed subscription payments and retry payment',
          loginRequired: 'Login required.',
          loadFail: 'Unable to load subscription list.',
          emptyTitle: 'No Failed Subscription Payments',
          emptyDescription: 'All subscriptions are being paid normally.',
          goToManage: 'Go to Subscription Management',
          alertTitle: 'Payment Failed Notice',
          alertDescription: '{{count}} subscription payments have failed. If you do not retry payment within the grace period, activation codes will be suspended.',
          alertNote: 'The grace period is 3 days after payment failure. Please complete retry payment within this period.',
          importantTitle: 'Important Notice',
          importantItems: [
            'A 3-day grace period is provided after payment failure.',
            'If you do not retry payment within the grace period, activation codes will be suspended.',
            'Suspended activation codes will be automatically restored after retry payment.',
            'To change payment method, register a card in profile settings.',
            'If problems persist, please contact customer service.',
          ],
          backToManage: '← Back to Subscription Management',
          retryConfirmTitle: 'Retry Payment Confirmation',
          retryConfirmContent: 'Would you like to retry payment immediately using your registered payment method?',
          retryButton: 'Retry Payment',
          retryCancel: 'Cancel',
          retryInfo: 'Retry payment feature is being prepared. Please contact customer service.',
          retryFail: 'Failed to retry payment.',
        },
        reminder: {
          title: 'Recurring Payment Notice',
          subtitle: 'Check next payment date and subscription information',
          daysRemaining: '({{days}} days remaining)',
          loginRequired: 'Login required.',
          loadFail: 'Unable to load subscription information.',
          notFoundTitle: 'Subscription Not Found',
          notFoundDescription: 'The link has expired or is invalid.',
          goToManage: 'Go to Subscription Management',
          infoTitle: 'Notice',
          infoItems: [
            'Recurring payments are automatically charged on the last day of each month.',
            'A 3-day grace period is provided when payment fails.',
            'If you do not retry payment within the grace period, activation codes will be suspended.',
            'Subscription management can be done from the profile page.',
          ],
          backToManage: '← Back to Subscription Management',
          couponApplied: 'Coupon has been applied.',
          couponApplyFail: 'Failed to apply coupon.',
        },
      },
    },
  },
  ja: {
    translation: {
      common: {
        backHome: 'ホームに戻る',
        loading: '読み込み中...',
        logout: 'ログアウト',
        login: 'ログイン',
        close: '閉じる',
        untitled: 'タイトルなし',
        unknown: '不明',
        other: 'その他',
      },
      notifications: {
        team: {
          templateTeamDeleted: 'テンプレートチームが削除されました。',
          templateTeamDeleteFail: 'テンプレートチームの削除に失敗しました。',
          favoriteRemoved: '{{productName}}がお気に入りから削除されました。',
          favoriteRemoveFail: 'お気に入りから削除するのに失敗しました。',
        },
        templates: {
          loginRequired: 'ログインが必要です。',
          cartAddedPartial: '{{count}}個の商品がカートに追加されました。{{failedCount}}個の商品は追加できませんでした。',
          cartAdded: '{{count}}個の商品がカートに追加されました。',
          cartAddAllFail: 'すべての商品をカートに追加できませんでした。（すでに購入済みまたはカートにある商品の可能性があります）',
          cartAddError: 'カートへの追加中にエラーが発生しました。',
          noProductsToAdd: '追加する商品がありません。',
          teamAddedPartial: '{{count}}個の商品がチームに追加されました。{{failedCount}}個の商品は追加できませんでした。',
          teamAdded: '{{count}}個の商品がチームに追加されました。',
          teamAddAllFail: 'チームに追加できる商品がありません。',
          teamAddError: 'チームへの追加中にエラーが発生しました。',
        },
        product: {
          productLoadFail: '商品情報を取得できませんでした。',
          favoriteAdded: '{{productName}}が選択可能なAI開発者リストに追加されました。',
          favoriteAlreadyExists: '{{productName}}はすでにお気に入りにあります。',
          favoriteAddFail: 'お気に入りの追加に失敗しました。',
          favoriteRemoved: 'お気に入りから削除されました。',
          favoriteAddedToFavorites: 'お気に入りに追加されました。',
          favoriteUpdateFail: 'お気に入りの更新に失敗しました。',
          selectRating: '評価を選択してください。',
          loginRequired: 'ログインが必要です。',
          userInfoLoadFail: 'ユーザー情報を読み込めませんでした。',
          reviewUpdated: 'レビューが更新されました。',
          ownReviewHelpful: '自分のレビューにはhelpfulを付けることはできません。',
          reviewDeleted: 'レビューが削除されました。',
        },
        share: {
          linkCopied: 'リンクがクリップボードにコピーされました。',
          linkCopyFail: 'リンクのコピーに失敗しました。',
          instagramCopyInfo: 'リンクをコピーしました。Instagramアプリで貼り付けて共有してください。',
        },
        subscription: {
          cancelled: 'サブスクリプションがキャンセルされました。',
          cancelFail: 'サブスクリプションのキャンセルに失敗しました。',
          emailLinkInfo: 'メールリンクは次の支払い案内メールで確認できます。',
          loadFail: 'サブスクリプション情報を読み込めませんでした。',
        },
        purchase: {
          paymentMethodCheckError: '支払い方法の確認中にエラーが発生しました。',
          loginRequired: 'ログインが必要です。',
        },
      },
      header: {
        title: 'AIDE Market',
      },
      home: {
        nav: {
          marketplace: 'マーケットプレイス',
          rankings: 'ランキング',
          templates: 'テンプレート',
          teams: 'チーム',
          resources: 'リソース',
        },
        searchPlaceholder: '開発者を検索...',
        heroTitle: '最高のAI開発者を発見し、一緒に作りましょう',
        heroSubtitle: '{{count}}人以上の検証済みAI開発者があなたのアイデアを実現する準備ができています。\n今すぐチームを組んでみましょう。',
        heroPrimary: '今すぐ探索',
        heroSecondary: 'もっと見る',
        rankingTitle: '今月のトップランキング',
        rankingSubtitle: '今月最高の成果を上げたAI開発者',
        viewAll: 'すべて見る',
        seeAll: 'すべて見る',
        sort: {
          download: 'ダウンロード順',
          rating: '評価順',
          price: '価格順（安い順）',
          priceDesc: '最近追加された順',
        },
        tabs: {
          all: 'すべて',
          fe: 'フロントエンド',
          be: 'バックエンド',
          design: 'デザイン',
          mg: 'AI/ML',
          inf: 'インフラ',
          sec: 'セキュリティ',
          doc: 'ドキュメント',
        },
        ranking: {
          projects: 'プロジェクト',
          skill: 'スキル',
        },
        recommended: {
          title: 'おすすめのAI開発者',
          subtitle: 'あなたの好みに合わせて厳選されたAI開発者',
        },
        pagination: {
          prev: '前へ',
          next: '次へ',
        },
        noProducts: '該当する商品がありません',
        sellerApplyLink: 'AI開発者としてあなたの製品を販売し、収益を創出しましょう。販売者に転換してマーケットプレイスで商品を登録し、販売できます。',
        sellerApplyClickHere: 'ここをクリック',
      },
      templates: {
        pageTitle: 'AIプロジェクトテンプレート',
        pageSubtitle: 'プロジェクトタイプごとに必要なAI商品を一目で確認して選択できます',
        categories: {
          all: 'すべて',
          web: 'ウェブ開発',
          app: 'アプリ開発',
          data: 'データ分析',
          document: 'ドキュメント',
          image: '画像生成',
        },
        empty: '登録されたテンプレートがありません。',
        productCount: 'AI商品{{count}}個',
        featured: {
          title: 'おすすめテンプレート',
        },
        detail: {
          backToList: 'テンプレート一覧に戻る',
          purchased: '{{count}}人が購入しました',
          aiProducts: 'AI商品{{count}}個',
          buyNow: '今すぐ購入',
          addToCart: 'カートに追加',
          addToTeam: 'チームに追加',
          projectDescription: 'プロジェクト説明',
          whySelected: 'なぜこれらのAIが選択されたのですか？',
          aiDescriptions: 'これらのAIは何ですか？',
          compatibilityTable: 'AI適合性比較表',
          projectType: 'プロジェクトタイプ',
          verySuitable: '非常に適している',
          suitable: '適している',
          normal: '普通',
          unsuitable: '適さない',
          templateProducts: 'このテンプレートの商品',
        },
      },
      resources: {
        pageTitle: 'リソース',
        pageSubtitle: 'AI開発者をより効果的に活用するためのガイド、テンプレート、そして有用な資料',
        categories: {
          all: 'すべて',
          guide: 'ガイド',
          category: 'カテゴリー別',
          faq: 'FAQ',
          template: 'テンプレート',
          stats: '統計',
        },
        empty: '検索結果がありません。',
        items: {
          guide1: {
            title: 'AI開発者活用ガイド',
            description: 'AIDE MarketでAI開発者を初めて使用する方のための完全なスタートガイドです。アカウント作成から最初のプロジェクト完成まで段階的に案内します。',
            content: `## AI開発者活用ガイド

### 1ステップ: アカウント設定
- 会員登録とプロフィール設定
- 興味のあるカテゴリーを選択
- 学生認証で50%割引を受ける

### 2ステップ: AI開発者探索
- マーケットプレイスで希望の開発者を検索
- カテゴリー別フィルタリングを活用
- 評価とレビューを確認

### 3ステップ: 開発者選択
- プロジェクト要件の分析
- 予算計画の立案
- 複数の開発者を比較検討

### 4ステップ: プロジェクト開始
- 開発者の購入とダウンロード
- プロジェクトに統合
- 継続的な協業と管理

### ヒント
- 無料体験版を活用する
- チーム機能で複数の開発者を組み合わせる
- 定期的な更新を確認する`,
          },
          guide2: {
            title: 'チーム構成最適化ガイド',
            description: '最大10名のAI開発者で強力なチームを構成する方法とシナジー効果を最大化する戦略を学びましょう。チームビルディングのベストプラクティスを提供します。',
            content: `## チーム構成最適化ガイド

### チーム構成戦略
1. **役割分担**: 各開発者の専門分野を考慮
   - フロントエンド: UI/UX実装
   - バックエンド: サーバーおよびAPI開発
   - デザイン: 視覚的要素のデザイン
   - インフラ: デプロイと管理

2. **シナジー効果**: 多様なカテゴリーの組み合わせで+20%のパフォーマンス向上
   - 相互補完的な技術スタックを選択
   - コミュニケーションスキルを考慮

3. **予算最適化**
   - 必須開発者を優先選択
   - プロジェクト段階ごとにチームを拡張

### 推奨チーム構成
- **Webアプリケーション**: フロントエンド + バックエンド + デザイン
- **APIサービス**: バックエンド + インフラ + セキュリティ
- **モバイルアプリ**: フロントエンド + デザイン + バックエンド

### シナジースコア計算
- 基本ステータス平均 + チームサイズボーナス + 多様性ボーナス`,
          },
          guide3: {
            title: 'AI開発者評価ガイド',
            description: 'AI開発者を選択する際に考慮すべき要素と評価基準を学びましょう。評価、レビュー、技術スタック、価格などを総合的に評価する方法を案内します。',
            content: `## AI開発者評価ガイド

### 評価項目

#### 1. 技術的キャパシティ
- **評価**: 4.5以上を推奨
- **技術スタック**: プロジェクト要件との一致
- **更新頻度**: 最近の更新日を確認

#### 2. ユーザーレビュー
- **レビュー数**: 十分なレビューがあるか確認
- **平均評価**: 全体的な評価を確認
- **詳細レビュー**: 実際の使用経験を確認

#### 3. 価格対性能
- **コスト**: 予算内で最適な選択
- **機能**: 提供機能が価格に適しているか
- **割引**: 学生割引、プロモーション活用

#### 4. コミュニティサポート
- **ドキュメント化**: ドキュメントの完成度
- **例**: 使用例の提供有無
- **サポート**: 問題解決サポートの有無

### チェックリスト
- [ ] プロジェクト要件と技術スタックが一致
- [ ] 評価4.5以上
- [ ] 最近3ヶ月以内に更新
- [ ] レビュー10件以上
- [ ] 予算内の価格
- [ ] 十分なドキュメント化

### 比較方法
1. 複数の開発者をリストアップ
2. 評価項目ごとにスコアを付ける
3. 総合スコアで比較
4. 実際のレビューを確認して最終決定`,
          },
          category1: {
            title: 'フロントエンドAI活用法',
            description: 'React、Vue、Next.jsなどフロントエンド開発に特化したAI開発者を活用して効率的なWeb開発を始めましょう。コンポーネント開発から状態管理まで扱います。',
            content: `## フロントエンドAI活用法

### 主な活用分野
- **コンポーネント開発**: 再利用可能なUIコンポーネントの自動生成
- **状態管理**: Redux、Context APIなどの状態管理パターンの実装
- **スタイリング**: CSS-in-JS、Tailwind CSSスタイルの自動生成
- **パフォーマンス最適化**: バンドルサイズの最適化、コードスプリッティング

### 推奨開発者
1. **React専門家**: コンポーネントアーキテクチャ設計
2. **TypeScript専門家**: 型安全性の向上
3. **デザインシステム専門家**: 一貫したUI実装

### 実践例
\`\`\`jsx
// AIが生成したコンポーネント例
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
};
\`\`\``,
          },
          category2: {
            title: 'バックエンドAI活用法',
            description: 'Node.js、Python、GoなどのバックエンドインフラとAPI開発のためのAI開発者を活用する方法を学びましょう。データベース設計からマイクロサービスアーキテクチャまで。',
            content: `## バックエンドAI活用法

### 主な活用分野
- **API開発**: RESTful API、GraphQLエンドポイント生成
- **データベース**: スキーマ設計、クエリ最適化
- **認証/セキュリティ**: JWT、OAuth実装
- **マイクロサービス**: サービス分離と通信設計

### 推奨開発者
1. **API設計専門家**: RESTful API構造設計
2. **データベース専門家**: 効率的なスキーマ設計
3. **セキュリティ専門家**: 認証とセキュリティパターンの実装

### 実践例
\`\`\`javascript
// AIが生成したAPIルート例
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
\`\`\``,
          },
          category3: {
            title: 'デザインAI活用法',
            description: 'Figma、Adobe XDなどのデザインツールと連携してUI/UXデザインプロセスにAI開発者を統合しましょう。デザインシステムからプロトタイピングまで。',
            content: `## デザインAI活用法

### 主な活用分野
- **デザインシステム**: 一貫したコンポーネントライブラリの構築
- **プロトタイピング**: 迅速なプロトタイプ制作
- **ユーザー体験**: UXフローの設計と改善
- **視覚的要素**: アイコン、イラストレーション生成

### 推奨開発者
1. **UIデザイナー**: インターフェースデザイン
2. **UXリサーチャー**: ユーザー体験の改善
3. **ブランディング専門家**: 一貫したブランドアイデンティティ

### デザインワークフロー
1. ワイヤーフレーム設計
2. 視覚的デザイン作業
3. プロトタイプ制作
4. 開発者との協業`,
          },
          faq1: {
            title: 'よくある質問（FAQ）',
            description: 'AIDE Market利用時に最もよくある質問と回答をまとめました。アカウント、決済、技術サポートなど様々なトピックを扱います。',
            content: `## よくある質問

### アカウント関連
**Q: 会員登録はどのようにしますか？**
A: 上部ヘッダーの「ログイン」ボタンをクリックし、「会員登録」を選択してください。メール認証後、アカウントを作成できます。

**Q: 学生割引を受けるには？**
A: プロフィール設定で学生認証を申請してください。学生証をアップロードすると50%割引の特典を受けることができます。

### 購入および決済
**Q: 購入したAI開発者はどのように使用しますか？**
A: 購入後、ダウンロードセクションからダウンロードし、プロジェクトに統合してください。

**Q: 返金は可能ですか？**
A: 購入後7日以内に返金が可能です。問題がある場合はカスタマーサポートにお問い合わせください。

### 技術サポート
**Q: AI開発者に関連する問題が発生しました**
A: 各開発者のレビューセクションで助けを得るか、コミュニティフォーラムで質問してください。`,
          },
          faq2: {
            title: '決済および購入ガイド',
            description: '商品購入から決済、ダウンロードまでの全プロセスを詳しく案内します。決済方法、割引クーポン、注文管理などを扱います。',
            content: `## 決済および購入ガイド

### 購入プロセス
1. **商品選択**: マーケットプレイスで希望のAI開発者を選択
2. **カートに追加**: ショッピングカートアイコンをクリック
3. **決済進行**: 購入ページで決済情報を入力
4. **ダウンロード**: 決済完了後すぐにダウンロード可能

### 決済方法
- **クレジットカード**: Visa、Mastercard、JCB対応
- **銀行振込**: オンラインバンキング可能
- **簡単決済**: PayPal、Stripeなど

### 割引特典
- 学生認証: 50%割引
- クーポンコード: プロモーションコード入力
- チーム購入: 5名以上購入で追加割引

### 注文管理
- 注文履歴: プロフィール > 購入したAIで確認
- 領収書: メールで自動送信
- ダウンロード: 購入したAIページで再ダウンロード可能`,
          },
          template1: {
            title: 'プロジェクトテンプレート',
            description: '様々なプロジェクトタイプに合わせたスターターテンプレートをダウンロードしましょう。React、Vue、Next.js、Node.jsなどの人気フレームワークテンプレートを提供。',
            content: `## プロジェクトテンプレート

### 提供テンプレート一覧

#### Webアプリケーション
- **React + TypeScript**: モダンなReactアプリケーションテンプレート
- **Next.js + Tailwind CSS**: SEO最適化されたウェブサイト
- **Vue 3 + Vite**: 高速な開発環境構築

#### バックエンドサービス
- **Node.js + Express**: RESTful APIサーバー
- **Python + FastAPI**: 高性能APIサーバー
- **Go + Gin**: 軽量マイクロサービス

#### フルスタック
- **Next.js + Prisma**: フルスタック型安全アプリケーション
- **Remix + PostgreSQL**: サーバーサイドレンダリングアプリ

### 使用方法
1. テンプレートを選択してダウンロード
2. 依存関係をインストール: \`npm install\`
3. 環境変数を設定
4. 開発サーバーを実行: \`npm run dev\`

### カスタマイズ
- テンプレートをベースに自由に修正可能
- AI開発者を追加して機能を拡張`,
          },
          template2: {
            title: 'コードスニペットライブラリ',
            description: 'よく使用するコードスニペットと例を検索して活用しましょう。認証、API通信、フォーム処理など実務で即座に使用可能なコードを提供。',
            content: `## コードスニペットライブラリ

### カテゴリー別スニペット

#### 認証 & セキュリティ
- JWTトークンの生成と検証
- パスワードハッシュ化 (bcrypt)
- OAuthログイン実装

#### API通信
- Axiosインタセプター設定
- エラーハンドリング
- リトライロジック

#### フォーム処理
- React Hook Form例
- バリデーション
- ファイルアップロード

#### データベース
- ORMクエリ例
- トランザクション処理
- リレーショナルクエリ

### 使用例
\`\`\`javascript
// JWTトークン検証例
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
\`\`\`

### 貢献
- 有用なスニペットをコミュニティで共有してください
- 改善提案を歓迎します`,
          },
          stats1: {
            title: 'マーケットトレンド分析',
            description: '人気カテゴリーと最新トレンドを確認してプロジェクトに適用しましょう。月間統計とカテゴリー別人気度を提供します。',
            content: `## マーケットトレンド分析

### 今月の人気カテゴリー
1. **フロントエンド** (35%): React、Next.js関連開発者が人気
2. **AI/ML** (28%): 機械学習モデル開発の需要が増加
3. **バックエンド** (22%): APIおよびサーバーインフラ開発
4. **デザイン** (15%): UI/UXデザインサービス

### トレンドインサイト
- **TypeScript**: プロジェクトで型安全性への要求が増加
- **クラウドネイティブ**: インフラ自動化の需要が増加
- **アクセシビリティ**: Webアクセシビリティ(A11y)の重要性が増加

### 成長トレンド
- 月間新規開発者: +15%
- 平均評価: 4.7/5.0
- ユーザー満足度: 92%

### 推奨組み合わせ
現在最も人気のあるチーム組み合わせ:
- フロントエンド + バックエンド + デザイン (シナジー +18%)`,
          },
          stats2: {
            title: '成功事例',
            description: 'AIDE Marketを活用して成功したプロジェクト事例を閲覧しましょう。スタートアップから企業プロジェクトまで様々な成功ストーリーを確認できます。',
            content: `## 成功事例

### スタートアッププロジェクト
**ECプラットフォーム構築**
- チーム構成: フロントエンド + バックエンド + デザイン (3名)
- 期間: 3ヶ月
- 結果: MVP完成とシリーズA投資獲得

### 企業プロジェクト
**社内管理システム構築**
- チーム構成: フロントエンド + バックエンド + インフラ (5名)
- 期間: 6ヶ月
- 結果: 開発時間50%短縮、運営効率向上

### 個人プロジェクト
**ポートフォリオウェブサイト**
- チーム構成: フロントエンド + デザイン (2名)
- 期間: 2週間
- 結果: 就職成功とGitHubスター500+獲得

### 主な成功要因
1. 適切な開発者の選択
2. 明確なプロジェクト目標
3. 継続的なコミュニケーション
4. チームシナジー効果の活用

### レビュー
"AI開発者を活用して迅速にプロトタイプを作成でき、
実際のサービスリリースまで時間を大幅に短縮できました。" - プロジェクトリーダー`,
          },
        },
      },
      creators: {
        title: 'Top Creators',
        subtitle: 'AIマーケットプレイスの人気クリエイターをご紹介',
        empty: '表示するクリエイターがありません。',
        notFound: 'クリエイターが見つかりません。',
        follow: 'フォロー',
        following: 'フォロー中',
        viewProfile: 'プロフィールを見る',
        joinDate: '登録日:',
        productsTitle: '販売中のAI',
        noProducts: 'まだ販売中のAIがありません。',
        downloads: 'ダウンロード',
        followers: 'フォロワー',
        followError: 'フォロー処理中にエラーが発生しました。',
      },
      sellerInfo: {
        pageTitle: '販売者案内',
        pageSubtitle: 'AIマーケットプレイスで販売者になり、商品を販売する方法をご案内します。',
        whatIsSeller: '販売者とは？',
        whatIsSellerText: '販売者とは、AI開発者として自分が開発したAI製品をマーケットプレイスに登録して販売できる権限を持つユーザーです。一般ユーザーとは異なり、商品を登録し、価格を設定し、販売収益を創出できます。',
        benefits: '販売者の特典',
        benefit1: 'AI製品の登録および販売が可能',
        benefit2: '販売収益の創出',
        benefit3: '商品管理ダッシュボードへのアクセス',
        benefit4: '販売統計および分析データの確認',
        benefit5: 'レビュー管理および顧客フィードバックの確認',
        benefit6: '注文管理および決済情報の確認',
        requirements: '販売者申請条件',
        requiredInfo: '必須情報',
        optionalInfo: '選択情報',
        req1: '販売者名',
        req2: '決済用メール',
        req3: '連絡先 (010-XXXX-XXXX形式)',
        req4: '専門分野 (カテゴリ選択)',
        req5: '技術スタック',
        req6: 'ポートフォリオURL',
        req7: '商品説明 (100文字以上500文字以下)',
        req8: '申請動機 (50文字以上200文字以下)',
        opt1: '事業者登録番号',
        opt2: 'GitHub URL',
        process: '申請手順',
        step1Title: '申請書作成',
        step1Text: '販売者申請フォームに必要な情報を入力します。',
        step2Title: '自動検証',
        step2Text: '入力した情報が自動的に検証されます。(100点満点)',
        step3Title: '管理者レビュー',
        step3Text: 'サイト管理者が申請書をレビューします。',
        step4Title: '承認完了',
        step4Text: '承認されると販売者権限が付与され、商品登録が可能になります。',
        validation: '自動検証項目',
        validationText: '申請書は以下の項目で自動的に検証されます:',
        val1: '必須情報の完成度 (20点) - 8つの必須フィールドすべて入力',
        val2: 'メール形式 (10点) - 有効なメールアドレス',
        val3: '電話番号形式 (10点) - 正しい電話番号形式',
        val4: 'ポートフォリオURLアクセス (20点) - ポートフォリオサイトへのアクセス可能性',
        val5: 'テキスト品質 (20点) - 商品説明および申請動機の長さ',
        val6: '専門分野の有効性 (10点) - 有効なカテゴリ選択',
        val7: '技術スタック入力 (10点) - 技術スタック情報の入力',
        validationNote: '参考: 80点以上は承認推奨、60点以上はレビュー必要、60点未満は却下推奨として分類されます。',
        applyButton: '販売者申請する',
        loginToApply: 'ログインして申請',
      },
      sellerApply: {
        pageTitle: '販売者申請',
        pageSubtitle: 'AI販売者に転換して商品を販売しましょう。',
        basicInfo: '基本情報',
        aiDeveloperInfo: 'AI開発者情報',
        sellerName: '販売者名',
        sellerNamePlaceholder: '販売者名を入力してください',
        contactEmail: '決済用メール',
        contactEmailPlaceholder: 'example@email.com',
        phone: '連絡先',
        phonePlaceholder: '010-1234-5678',
        specialization: '専門分野',
        specializationPlaceholder: '専門分野を選択してください',
        techStack: '技術スタック',
        techStackPlaceholder: '例: React, Node.js, Python',
        portfolioUrl: 'ポートフォリオURL',
        portfolioUrlPlaceholder: 'https://your-portfolio.com',
        productDescription: '商品説明',
        productDescriptionPlaceholder: '販売する商品についての説明を記入してください (100文字以上500文字以下)',
        motivation: '申請動機',
        motivationPlaceholder: '販売者として申請する理由を記入してください (50文字以上200文字以下)',
        optionalInfo: '選択情報',
        businessNumber: '事業者登録番号',
        businessNumberPlaceholder: '事業者登録番号を入力してください (任意)',
        githubUrl: 'GitHub URL',
        githubUrlPlaceholder: 'https://github.com/your-username (任意)',
        submit: '申請する',
        alreadyApproved: 'すでに販売者として承認されています。',
        alreadyPending: 'すでに申請した履歴があります。レビュー中です。',
        rejected: '以前の申請が却下されました。理由: {{reason}}',
        success: '販売者申請が完了しました。レビュー後、結果をお知らせします。',
        error: '申請中にエラーが発生しました。',
        required: '*',
        minCharsRequired: '(最低{{count}}文字必要)',
      },
      profile: {
        tabs: {
          purchases: '購入したAI',
          reviews: '私のレビュー',
          teams: '私のチーム',
          favorites: 'お気に入り',
        },
        hero: {
          settings: '設定',
          followers: 'フォロワー',
          following: 'フォロー中',
          github: 'GitHub',
        },
        purchases: {
          empty: '購入した商品がありません',
          orderNumber: '注文: {{number}}',
          status: {
            pending: '支払い待ち',
            completed: '完了',
          },
          totalAmount: '合計金額',
          items: '{{count}}点',
        },
        reviews: {
          empty: 'レビューがありません',
          selectRating: '評価を選択してください。',
          loginRequired: 'ログインが必要です。',
          parseError: 'ユーザー情報を読み込めませんでした。',
          updateSuccess: 'レビューが更新されました。',
          updateFail: 'レビューの更新に失敗しました。',
          deleteConfirm: 'このレビューを削除してもよろしいですか？',
          noReviewId: 'レビューIDが見つかりません。',
          noUserId: 'ユーザーIDが見つかりません。',
          deleteSuccess: 'レビューが削除されました。',
          deleteFail: 'レビューの削除に失敗しました。',
          deleteUnauthorized: 'このレビューを削除する権限がありません。',
          deleteNotFound: 'レビューが見つかりません。',
          deleteServerError: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
          ratingLabel: '評価',
          reviewContentLabel: 'レビュー内容',
          reviewPlaceholder: 'レビューを書いてください...',
          save: '保存',
          cancel: 'キャンセル',
          expand: '拡大',
          reviewImage: 'レビュー画像 {{index}}',
          edit: '編集',
          delete: '削除',
          ratingPoints: '{{rating}}点',
        },
        studentVerification: {
          page: {
            title: '学生認証',
            subtitle: '学生アカウントとして認証すると、すべての商品に50%割引が適用されます',
            backToSettings: 'プロフィール設定に戻る',
            loading: '読み込み中...',
            loginRequired: 'ログインが必要です。',
            loadStatusError: '学生認証ステータスを読み込めませんでした。',
            uploadSuccess: '✅ 学生認証が申請されました。管理者レビューリストに追加されました。',
            uploadFail: '学生認証の申請に失敗しました。',
            currentStatus: '現在のステータス',
            statusBadge: {
              verified: '認証済み',
              pending: '審査中',
              notApplied: '未認証',
            },
            statusCard: {
              verifiedDate: '認証完了日',
              expiryDate: '有効期限',
              daysRemaining: '残り{{days}}日',
              expired: '期限切れ',
              discountApplied: '✓ 学生割引（50%）が適用されています',
              pendingTitle: '管理者審査待ちです',
              pendingDescription: '学生証がアップロードされました。管理者の承認を待っています。',
              notAppliedDescription: '学生認証を申請するには、学生証または在学証明書をアップロードしてください。',
              expiredTitle: '学生認証が期限切れになりました',
              expiredDescription: '有効期限: {{date}}',
              expiredRenew: '学生割引を継続して受け取るには、学生証を再度アップロードしてください。',
            },
            upload: {
              title: '学生証アップロード',
              description: '以下の書類のいずれかをアップロードしてください:',
              documentTypes: {
                studentId: '学生証（表裏両面を含む）',
                enrollment: '在学証明書',
                registration: '履修登録証明書（最近の学期）',
              },
              selectFile: 'ファイル選択',
              uploadButton: '📤 学生認証を申請する',
              uploading: 'アップロード中...',
              uploadNote: 'アップロードボタンをクリックすると管理者レビューリストに表示されます',
              fileRequired: '学生証ファイルを選択してください。',
              fileReSelect: 'ファイルを再度選択してください。',
              fileTypeError: '画像またはPDFファイルのみアップロード可能です。',
              fileSizeError: 'ファイルサイズは10MB以下である必要があります。',
              disabledMessage: '現在のステータスでは新しい書類をアップロードできません。',
              uploadedMessage: '✓ 書類がアップロードされました',
              viewDocument: '{{filename}}（クリックして確認）',
            },
            pendingAlert: {
              title: '⏳ 認証待ち',
              description: '学生証が正常にアップロードされました。管理者のレビュー後に承認されます。',
              note: '承認完了まで通常1〜2営業日かかります。',
              adminButton: '管理者ページで承認する',
            },
            guide: {
              title: '学生認証案内',
              item1: '学生認証により、すべての商品に50%割引が自動適用されます。',
              item2: '学生割引はクーポン割引と併用でき、最大70%まで割引されます。',
              item3: '学生認証は1年間有効です。期限前に更新してください。',
              item4: 'アップロードされた書類は管理者レビュー後に承認されます。',
              item5: '認証が拒否された場合は、カスタマーサービスにお問い合わせください。',
            },
          },
        },
        teams: {
          emptyTitle: 'まだ作成されたチームがありません',
          emptySubtitle: 'AI開発者で自分のチームを構成してみましょう',
          noDate: '日付なし',
          noMembers: 'メンバーなし',
          synergy: 'Synergy',
          synergyScore: 'チームシナジースコア',
          membersTitle: 'チームメンバー',
          createdAt: '作成日',
          memberCount: 'チームメンバー数',
          deleteConfirm: 'このチームを削除してもよろしいですか？',
          deleteSuccess: 'チームが削除されました。',
          deleteFail: 'チームの削除に失敗しました。',
          delete: '削除',
          edit: '編集',
          membersLabel: '{{count}}人',
          categories: {
            image: '画像生成',
            infrastructure: 'インフラ',
            documents: '文書',
          },
        },
        favorites: {
          empty: 'お気に入りリストが空です',
          removeSuccess: 'お気に入りから削除されました。',
          removeFail: 'お気に入りからの削除に失敗しました。',
          noProduct: '商品情報が見つかりません。',
        },
        superAdmin: {
          layout: {
            title: 'サイト管理者',
            menuToggle: 'メニュー切り替え',
            closeMenu: 'メニューを閉じる',
          },
          sidebar: {
            dashboard: 'ダッシュボード',
            products: '商品承認管理',
            studentVerifications: '学生認証管理',
            ipManagement: 'IP管理',
            security: 'セキュリティ',
          },
          dashboard: {
            title: 'サイト管理者ダッシュボード',
            subtitle: 'システム全体の管理と監視',
            loading: '読み込み中...',
            stats: {
              pendingProducts: '承認待ち商品',
              pendingStudents: '学生認証申請',
              pendingSellerApplications: '販売者申請管理',
              todayAccess: '今日のアクセス',
              securityEvents: 'セキュリティイベント',
              attention: '要注意',
              normal: '正常',
              noNewRequest: '新規申請なし',
              noChange: '変化なし',
            },
            recent: '最近',
            productRequest: '商品申請',
            pending: '承認待ち',
            today: '今日',
            percent: '+0%',
            sections: {
              pendingProducts: '承認待ち商品',
              recentActivity: '最近のアクティビティ',
            },
            table: {
              productName: '商品名',
              category: 'カテゴリ',
              price: '価格',
              applicant: '申請者',
              requestDate: '申請日',
              status: 'ステータス',
              time: '時刻',
              event: 'イベント',
              detail: '詳細',
            },
            empty: {
              noPendingProducts: '承認待ちの商品はありません',
              noRecentActivity: '最近のアクティビティはありません',
            },
          },
          products: {
            title: '商品承認管理',
            subtitle: '管理者が申請した商品の承認・却下',
            loading: '読み込み中...',
            stats: {
              pending: '承認待ち',
            },
            filters: {
              status: 'ステータス',
              all: 'すべて',
              pending: '承認待ち',
              approved: '承認済み',
              rejected: '却下',
              search: '検索',
              searchPlaceholder: '商品名で検索...',
            },
            card: {
              applicant: '申請者',
              price: '価格',
              category: 'カテゴリ',
              requestDate: '申請日',
              status: 'ステータス',
              noDescription: '説明なし',
            },
            actions: {
              approve: '✓ 承認',
              reject: '× 却下',
            },
            messages: {
              loadFail: '商品 목록을 불러오는데 실패했습니다.',
              approveSuccess: '商品が承認されました。',
              approveFail: '商品承認に失敗しました。',
              rejectWarning: '거부 사유를 입력해주세요.',
              rejectSuccess: '商品が却下されました。',
              rejectFail: '商品却下に失敗しました。',
            },
            rejectModal: {
              title: '商品却下',
              content: '商品を却下する理由を入力してください。',
              placeholder: '却下理由...',
              ok: '却下',
              cancel: 'キャンセル',
            },
            empty: '承認待ちの商品はありません',
          },
          studentVerifications: {
            title: '学生認証管理',
            subtitle: '学生認証申請の承認・却下',
            loading: '読み込み中...',
            stats: {
              pending: '承認待ち',
            },
            filters: {
              search: '検索',
              searchPlaceholder: '名前またはメールで検索...',
            },
            card: {
              requestDate: '申請日',
              status: 'ステータス',
            },
            actions: {
              viewDocument: '📄 学生証画像を表示',
              approve: '✓ 承認',
              reject: '× 却下',
            },
            messages: {
              loadFail: '学生認証 목록을 불러오는데 실패했습니다.',
              approveSuccess: '学生認証が承認されました。',
              approveFail: '学生認証承認に失敗しました。',
              rejectWarning: '거부 사유를 입력해주세요.',
              rejectSuccess: '学生認証が却下されました。',
              rejectFail: '学生認証却下に失敗しました。',
              documentLoadFail: '文書を読み込めませんでした。',
            },
            documentModal: {
              title: '認証文書',
              user: 'ユーザー',
            },
            rejectModal: {
              title: '学生認証却下',
              content: '学生認証を却下する理由を入力してください。',
              placeholder: '却下理由...',
              ok: '却下',
              cancel: 'キャンセル',
            },
            empty: '承認待ちの申請はありません',
          },
          ipManagement: {
            title: 'IP管理',
            subtitle: 'IPアクセスログおよびブロック管理',
            loading: '読み込み中...',
            tabs: {
              logs: 'アクセスログ',
              management: 'ブロック管理',
              stats: '統計',
            },
            stats: {
              todayAccess: '今日のアクセス',
              uniqueIPs: 'ユニークIP',
              blocked: 'ブロック中',
              countries: '国/地域',
              noChange: '変化なし',
              new: '新規',
            },
            messages: {
              logsLoadFail: 'IPログを読み込めませんでした。',
              managementLoadFail: 'IP管理リストを読み込めませんでした。',
              statsLoadFail: '統計の読み込みに失敗しました',
              blockSuccess: 'IPがブロックされました。',
              blockFail: 'IPブロックに失敗しました。',
              unblockSuccess: 'IPブロックが解除されました。',
              unblockFail: 'IPブロック解除に失敗しました。',
            },
            charts: {
              accessTrend: 'アクセス推移',
              accessTrendFetchFail: 'アクセス推移取得失敗',
              countryDistribution: '国別アクセス分布 (過去7日間)',
              countryDistributionFetchFail: '国別分布取得失敗',
              hourlyAccess: '時間帯別アクセス数 (過去7日間)',
              hourlyAccessFetchFail: '時間帯別アクセス取得失敗',
              noData: 'データがありません',
              days7: '過去7日間',
              days14: '過去14日間',
              days30: '過去30日間',
              totalAccess: '総アクセス数',
              uniqueIP: 'ユニークIP',
              hour: '時刻',
              accessCount: 'アクセス数',
            },
            filters: {
              ipAddress: 'IPアドレス',
              ipSearch: 'IP検索...',
              country: '国',
              countrySearch: '国検索...',
            },
            table: {
              ipAddress: 'IPアドレス',
              user: 'ユーザー',
              page: 'ページ',
              country: '国/地域',
              time: '時刻',
              status: 'ステータス',
              state: '状態',
              reason: '理由',
              blockDate: 'ブロック日時',
              action: 'アクション',
              rank: '順位',
              accessCount: 'アクセス数',
            },
            status: {
              blocked: 'ブロック済み',
              whitelisted: 'ホワイトリスト',
              normal: '正常',
            },
            buttons: {
              unblock: 'ブロック解除',
              block: 'ブロック',
            },
            empty: {
              noLogs: 'ログがありません',
              noIPManagement: 'IP管理データがありません',
              noTopIPs: 'データがありません',
            },
            topIPs: {
              title: 'TOPアクセスIPアドレス (過去7日間)',
            },
          },
          security: {
            title: 'セキュリティ管理',
            subtitle: 'セキュリティイベントおよびボット検出管理',
            loading: '読み込み中...',
            tabs: {
              events: 'セキュリティイベント',
              bots: 'ボット管理',
              settings: 'セキュリティ設定',
            },
            severity: {
              critical: '重要',
              high: '高',
              medium: '中',
              low: '低',
            },
            messages: {
              eventsLoadFail: 'セキュリティイベントを読み込めませんでした。',
              botsLoadFail: 'ボットリストを読み込めませんでした。',
              settingsLoadFail: '設定の読み込みに失敗しました',
              blockSuccess: 'ボットがブロックされました。',
              blockFail: 'ボットブロックに失敗しました。',
              unblockSuccess: 'ボットブロックが解除されました。',
              unblockFail: 'ボットブロック解除に失敗しました。',
              saveSuccess: '設定が保存されました。',
              saveFail: '設定の保存に失敗しました。',
            },
            charts: {
              eventTrend: 'セキュリティイベント推移',
              eventTrendFetchFail: 'イベント推移取得失敗',
              eventDistribution: 'イベントタイプ別分布 (過去7日間)',
              eventDistributionFetchFail: 'イベント分布取得失敗',
              hourlyDistribution: '時間帯別分布 (過去7日間)',
              hourlyDistributionFetchFail: '時間帯別分布取得失敗',
              noData: 'データがありません',
              days7: '過去7日間',
              days14: '過去14日間',
              days30: '過去30日間',
              loginFailed: 'ログイン失敗',
              botDetected: 'ボット検出',
              apiAbuse: 'API乱用',
              scraping: 'スクレイピング',
              suspiciousActivity: '疑わしい活動',
              ipBlocked: 'IP遮断',
            },
            settings: {
              title: 'セキュリティ設定',
              autoBlock: '自動ボットブロック',
              autoBlockDesc: '疑わしいボットを自動的にブロックします',
              botDetection: 'ボット検出閾値',
              botDetectionDesc: 'この値以上の信頼度でボットを自動ブロックします (0-100)',
              maxLoginAttempts: '最大ログイン試行回数',
              maxLoginAttemptsDesc: 'この回数を超えると自動的にブロックされます',
              blockDuration: 'ブロック持続時間 (時間)',
              blockDurationDesc: 'ブロックが自動的に解除されるまでの時間',
              save: '設定を保存',
            },
            filters: {
              eventType: 'イベントタイプ',
              all: 'すべて',
              loginFailed: 'ログイン失敗',
              botDetected: 'ボット検出',
              apiAbuse: 'API乱用',
              scraping: 'スクレイピング',
              suspiciousActivity: '疑わしい活動',
              ipBlocked: 'IPブロック',
              severity: '深刻度',
              critical: '重要',
              high: '高',
              medium: '中',
              low: '低',
              ipAddress: 'IPアドレス',
              ipSearch: 'IP検索...',
            },
            table: {
              time: '時刻',
              eventType: 'イベントタイプ',
              ipAddress: 'IPアドレス',
              detail: '詳細',
              severity: '深刻度',
              status: 'ステータス',
              userAgent: 'User-Agent',
              detectionReason: '検出理由',
              confidence: '信頼度',
              detectionTime: '検出時刻',
              action: 'アクション',
              rank: '順位',
              eventCount: 'イベント数',
              maxSeverity: '最高深刻度',
            },
            status: {
              blocked: 'ブロック済み',
              monitoring: '監視中',
            },
            buttons: {
              block: 'ブロック',
            },
            stats: {
              todayEvents: '今日のイベント',
              botDetected: 'ボット検出',
              autoBlocked: '自動ブロック',
              loginFailed: 'ログイン失敗',
              noChange: '変化なし',
            },
            empty: {
              noEvents: 'イベントがありません',
              noBots: 'ボットが検出されていません',
              noAttackIPs: '攻撃IPはありません',
            },
            topAttackIPs: {
              title: 'TOP攻撃IPアドレス (過去7日間)',
            },
          },
          templates: {
            title: 'テンプレート管理',
            subtitle: 'プロジェクトタイプ別のAI商品セットを管理します',
            create: 'テンプレート登録',
            edit: 'テンプレート編集',
            table: {
              id: 'ID',
              name: 'テンプレート名',
              description: '説明',
              productCount: '含まれる商品数',
              createdAt: '作成日',
              action: '操作',
              view: '詳細',
              edit: '編集',
              delete: '削除',
            },
            form: {
              name: 'テンプレート名 *',
              namePlaceholder: '例: Webアプリケーション開発',
              description: '説明',
              descriptionPlaceholder: '例: フルスタックWebアプリを作るためのAIセット',
              iconUrl: 'アイコンURL',
              iconUrlPlaceholder: '例: /images/templates/web.png',
              products: '含まれる商品',
              selectedProducts: '選択された商品',
              searchProducts: '商品検索...',
              noProducts: '商品が見つかりません。',
              added: '追加済み',
              allCategories: 'すべて',
            },
            modal: {
              save: '保存',
              cancel: 'キャンセル',
            },
            messages: {
              nameRequired: 'テンプレート名を入力してください。',
              createSuccess: 'テンプレートが作成されました。',
              updateSuccess: 'テンプレートが更新されました。',
              deleteSuccess: 'テンプレートが削除されました。',
              deleteConfirm: 'このテンプレートを削除してもよろしいですか？',
              deleteConfirmOk: '削除',
              deleteConfirmCancel: 'キャンセル',
              saveFail: 'テンプレートの保存に失敗しました。',
              deleteFail: 'テンプレートの削除に失敗しました。',
            },
          },
          sellerApplications: {
            title: '販売者申請管理',
            filters: {
              all: 'すべて',
              pending: '承認待ち',
              approved: '承認済み',
              rejected: '却下',
            },
            table: {
              id: 'ID',
              applicant: '申請者',
              sellerName: '販売者名',
              email: 'メール',
              specialization: '専門分野',
              requestDate: '申請日',
              status: 'ステータス',
              action: '操作',
              viewDetail: '詳細を見る',
            },
            status: {
              approved: '✅ 承認済み',
              rejected: '❌ 却下',
              pending: '⏳ 承認待ち',
            },
            messages: {
              loading: '読み込み中...',
              empty: '申請履歴がありません。',
              loadFail: '申請リストの読み込み中にエラーが発生しました。',
            },
            detail: {
              title: '販売者申請詳細',
              backToList: '← リストに戻る',
              validation: {
                title: '自動検証結果',
                score: '点 / 100点',
                messages: {
                  approved: '✔ 承認推奨',
                  review: '⚠ 要検討',
                  rejected: '✖ 承認不可',
                },
                categories: {
                  requiredInfo: '必須情報',
                  email: 'メール',
                  phone: '電話番号',
                  techStack: '技術スタック',
                  portfolio: 'ポートフォリオ',
                  github: 'GitHub',
                  businessNumber: '事業者登録番号',
                  textQuality: 'テキスト品質',
                  specialization: '専門分野',
                },
                checkMessages: {
                  '필수 정보: 8/8 항목 완료': '必須情報: 8/8項目完了',
                  '필수 정보: 일부 항목 누락': '必須情報: 一部項目欠落',
                  '이메일: 유효한 형식': 'メール: 有効な形式',
                  '이메일: 형식 오류': 'メール: 形式エラー',
                  '기술 스택: 충분한 입력': '技術スタック: 十分な入力',
                  '기술 스택: X 입력 부족': '技術スタック: 入力不足',
                  '포트폴리오: URL 제공됨': 'ポートフォリオ: URL提供済み',
                  '포트폴리오: URL 없음': 'ポートフォリオ: URLなし',
                  'GitHub: URL 제공됨': 'GitHub: URL提供済み',
                  'GitHub: URL 없음': 'GitHub: URLなし',
                  '사업자등록번호: 제공됨': '事業者登録番号: 提供済み',
                  '사업자등록번호: 없음': '事業자登録番号: なし',
                },
              },
              applicantInfo: {
                title: '申請者情報',
                username: 'ユーザーID:',
                email: 'メール:',
                joinDate: '登録日:',
              },
              applicationInfo: {
                title: '販売者申請情報',
                sellerName: '販売者名:',
                contactEmail: '決済メール:',
                phone: '連絡先:',
                specialization: '専門分野:',
                techStack: '技術スタック:',
                portfolio: 'ポートフォリオ:',
                github: 'GitHub:',
                businessNumber: '事業者登録番号:',
                productDescription: '商品説明',
                motivation: '申請動機',
              },
              actions: {
                approve: '承認',
                reject: '却下',
              },
              rejectModal: {
                title: '却下理由入力',
                placeholder: '却下理由を入力してください',
                ok: '却下確認',
                cancel: 'キャンセル',
              },
              messages: {
                loading: '読み込み中...',
                loadFail: '詳細情報の読み込み中にエラーが発生しました。',
                approveConfirm: 'この申請を承認してもよろしいですか？',
                approveSuccess: '承認が完了しました。',
                approveFail: '承認処理中にエラーが発生しました。',
                rejectWarning: '却下理由を入力してください。',
                rejectSuccess: '却下処理が完了しました。',
                rejectFail: '却下処理中にエラーが発生しました。',
                dataLoadFail: 'データを読み込めませんでした。',
              },
            },
          },
        },
        settings: {
          title: '設定',
          backToProfile: 'プロフィールに戻る',
          loading: '読み込み中...',
          personalInfo: {
            title: '個人情報',
            edit: '編集',
            cancel: 'キャンセル',
            save: '保存',
            username: 'ユーザー名',
            usernamePlaceholder: 'ユーザー名を入力してください',
            email: 'メールアドレス',
            emailPlaceholder: 'メールアドレスを入力してください',
            emailPublic: '公開',
            emailPrivate: '非公開',
            emailPublicDesc: 'プロフィールページにメールアドレスが表示されます',
            emailPrivateDesc: 'プロフィールページにメールアドレスが表示されません',
            githubUrl: 'GitHub URL',
            githubUrlPlaceholder: 'https://github.com/username',
            developerType: '開発者タイプ',
            developerTypeNone: '選択なし',
            developerTypes: {
              frontend: 'フロントエンド開発者',
              backend: 'バックエンド開発者',
              fullstack: 'フルスタック開発者',
              mobile: 'モバイル開発者',
              devops: 'DevOpsエンジニア',
              data: 'データエンジニア/サイエンティスト',
              security: 'セキュリティ開発者',
              infrastructure: 'インフラエンジニア',
              server: 'サーバー開発者',
              management: 'マネジメント',
              other: 'その他',
            },
            tags: 'ハッシュタグ',
            tagsPlaceholder: 'ハッシュタグを入力してEnterを押してください',
            addTag: '追加',
            currentPassword: '現在のパスワード（パスワード変更時必須）',
            currentPasswordPlaceholder: '現在のパスワードを入力してください',
            newPassword: '新しいパスワード',
            newPasswordPlaceholder: '新しいパスワードを入力してください（オプション）',
            confirmPassword: '新しいパスワード確認',
            confirmPasswordPlaceholder: '新しいパスワードを再度入力してください',
            updateSuccess: '個人情報が正常に更新されました。',
            updateFail: '更新に失敗しました。',
            updateError: '更新中にエラーが発生しました。',
            passwordMismatch: '新しいパスワードと確認パスワードが一致しません。',
            passwordMinLength: 'パスワードは6文字以上である必要があります。',
            passwordRequired: '現在のパスワードを入力してください。',
            unmountError: 'コンポーネントがアンマウントされました。',
          },
          paymentMethods: {
            title: '支払い方法',
            add: '追加',
            cancel: 'キャンセル',
            save: '保存',
            delete: '削除',
            paymentMethod: '支払い方法',
            creditCard: 'クレジットカード',
            debitCard: 'デビットカード',
            cardCompany: 'カード会社',
            cardNumber: 'カード番号',
            cardNumberPlaceholder: 'カード番号を入力してください',
            expMonth: '有効期限（月）',
            expYear: '有効期限（年）',
            cvc: 'CVC',
            expiryDate: '有効期限',
            empty: '登録された支払い方法がありません。',
            addSuccess: '支払い方法が追加されました。',
            addFail: '支払い方法の追加に失敗しました。',
            addError: '支払い方法の追加中にエラーが発生しました。',
            deleteConfirm: 'この支払い方法を削除してもよろしいですか？',
            deleteSuccess: '支払い方法が削除されました。',
            deleteFail: '支払い方法の削除に失敗しました。',
            deleteError: '支払い方法の削除中にエラーが発生しました。',
            cannotDeleteLast: '少なくとも1つの支払い方法は登録されている必要があります。新しい支払い方法を先に追加してください。',
            cannotDeleteLastTooltip: '最後の支払い方法は削除できません。新しい支払い方法を先に追加してください。',
            allFieldsRequired: 'すべてのフィールドを入力してください。',
            cardNumberInvalid: 'カード番号は13〜19桁である必要があります。',
            cvcInvalid: 'CVCは3桁または4桁である必要があります。',
            expMonthInvalid: '有効期限（月）は1〜12の間である必要があります。',
            expYearInvalid: '有効期限（年）が無効です。',
          },
          studentVerification: {
            title: '学生認証',
            manage: '学生認証管理',
            status: {
              verified: '認証済み',
              pending: '認証待ち',
              expired: '認証期限切れ',
              notApplied: '未認証',
            },
            description: {
              verified: '学生割引（50%）が適用されています。',
              verifiedWithExpiry: '学生割引（50%）が適用されています。期限まで残り{{days}}日です。',
              pending: '学生証がアップロードされました。管理者レビュー後に承認されます。',
              expired: '学生認証が期限切れになりました。更新してください。',
              notApplied: '学生認証を申請すると、すべての商品に50%割引が適用されます。',
            },
            labels: {
              verifiedDate: '認証完了日:',
              expiryDate: '有効期限:',
              status: 'ステータス:',
              pendingStatus: '管理者レビュー待ち',
            },
            info: {
              title: '学生認証案内',
              item1: '学生認証により、すべての商品に50%割引が自動適用されます。',
              item2: '学生割引はクーポン割引と併用でき、最大70%まで割引されます。',
              item3: '学生認証は1年間有効です。',
            },
          },
        },
        admin: {
          sidebar: {
            dashboard: 'ダッシュボード',
            products: '商品',
            reviews: 'レビュー',
            orders: '注文',
            upload: '商品アップロード',
          },
          upload: {
            title: '商品アップロード',
            subtitle: '新しい商品を登録してマーケットプレイスに追加しましょう。',
          },
          hero: {
            github: 'GitHub',
            followers: 'フォロワー',
          },
          stats: {
            totalProducts: '総商品',
            totalRevenue: '総売上',
            followers: 'フォロワー',
            reviews: 'レビュー',
          },
          recentProducts: {
            title: '私の最近の5商品',
            viewAll: 'すべての商品を見る →',
            empty: '登録された商品がありません',
            categoryFallback: 'AI開発者',
          },
          recentReviews: {
            title: '最近の3レビュー',
            empty: 'レビューがありません',
            productFallback: 'AI開発者',
          },
          loading: '読み込み中...',
          orders: {
            title: '販売履歴',
            export: 'エクスポート',
            filters: {
              dateRange: '期間',
              product: '商品',
              statusLabel: 'ステータス',
              sort: '並び替え',
              reset: 'リセット',
              dateOptions: {
                all: 'すべて',
                today: '今日',
                week: '今週',
                month: '今月',
                quarter: '今四半期',
                year: '今年',
              },
              productAll: 'すべての商品',
              statusAll: 'すべてのステータス',
              statusOptions: {
                completed: '完了',
                pending: '待ち',
                cancelled: 'キャンセル',
              },
              sortOptions: {
                recent: '最新順',
                oldest: '古い順',
                amountHigh: '金額（高い順）',
                amountLow: '金額（低い順）',
              },
            },
            summary: {
              totalOrders: '総注文数',
              thisMonth: '今月の売上',
              completed: '完了',
              pending: '待ち',
              avgOrderValue: '平均注文金額',
            },
            table: {
              orderId: '注文番号',
              product: '商品',
              buyer: '購入者',
              amount: '金額',
              status: 'ステータス',
              date: '日付',
              actions: '操作',
              view: '表示',
              statusText: {
                completed: '完了',
                pending: '待ち',
                cancelled: 'キャンセル',
              },
            },
            empty: {
              title: '注文がありません',
              desc: '注文データがありません。',
              descWithFilters: '条件を変更するかリセットしてください。',
            },
          },
          reviewsPage: {
            title: 'レビュー管理',
            subtitle: '商品に対するすべてのレビューを管理してください',
            filters: {
              search: 'レビュー検索',
              searchPlaceholder: 'レビュアーまたは内容で検索...',
              product: '商品',
              productAll: 'すべての商品',
              rating: '評価',
              ratingAll: 'すべての評価',
              ratingOption: {
                five: '5点',
                four: '4点',
                three: '3点',
                two: '2点',
                one: '1点',
              },
              sort: '並び替え',
              sortOptions: {
                recent: '最新順',
                oldest: '古い順',
                ratingHigh: '評価高い順',
                ratingLow: '評価低い順',
                helpful: '役立つ順',
              },
              reset: 'リセット',
            },
            summary: {
              totalReviews: '総レビュー',
              averageRating: '平均評価',
              thisMonth: '今月',
              positive: 'ポジティブ（4-5★）',
              needsAttention: '注意が必要（1-3★）',
            },
            statsCards: {
              reviews: 'レビュー',
            },
            empty: {
              title: 'レビューがありません',
              titleWithFilters: '条件に一致するレビューがありません',
              desc: '顧客レビューが登録されるとここに表示されます。',
              descWithFilters: 'フィルターを調整して異なる結果を確認してください。',
            },
            item: {
              userFallback: 'ユーザー',
              verified: '認証済み購入',
              notVerified: '未認証',
              helpful: '{{count}}人が役に立ったと評価',
              viewProduct: '商品を見る',
            },
          },
        },
      },
      teamBuilder: {
        introTitle: '理想的なAIチームを構成してみましょう',
        introSubtitle: '最大{{max}}人まで選択してチームを作成できます',
        availableTitle: '選択可能なAI開発者',
        teamTitle: 'AIチーム',
        noDevelopers: '選択された開発者がありません',
        selectDevelopers: '開発者を選択してください',
        teamTotal: 'チーム合計',
        namePlaceholder: 'チーム名を入力してください',
        save: 'チームを保存',
        saving: '保存中...',
        tipTitle: 'プロダクトドキュメント',
        tipDescription: '多様な専門性を持つチームを構成して最高の結果を作りましょう！',
        scrollLeft: '左にスクロール',
        scrollRight: '右にスクロール',
        templateTeams: 'テンプレートチーム',
        template: 'テンプレート',
        addTemplateTeam: '追加',
        memberUnit: '人',
        quickStartTitle: 'クイックスタート用の事前構成チーム',
        templateCardAIs: '{{count}}個のAI · シナジー: {{synergy}}',
        messages: {
          selectMembers: 'チームメンバーを選択してください。',
          loginRequired: 'ログインが必要です。',
          saveSuccess: 'チームが保存されました！',
          saveFail: 'チームの保存に失敗しました。',
        },
      },
      synergy: {
        label: 'チームシナジー',
        exceptional: '最高レベル',
        excellent: '非常に優秀',
        good: '良い',
        keepBuilding: 'もう少し強化しましょう',
      },
      chart: {
        title: 'チーム統計',
        explanation: '説明',
        explanationTitle: '六角形グラフの説明',
        explanationDescription: 'このグラフは、チームの6つの能力を視覚化します。各能力は0-100点で表示され、チーム全体の平均値を示します。',
        statsTitle: '能力の説明',
        stats: {
          teamwork: 'チームワーク: 他のAIとの協力能力',
          stability: '安定性: 安定した信頼性の高いパフォーマンス',
          speed: '速度: 高速な処理と応答速度',
          creativity: '創造性: 新しいアイデアと革新的なアプローチ',
          productivity: '生産性: 効率的な作業処理能力',
          maintainability: '保守性: コード品質と管理の容易さ',
        },
        synergyNote: 'チームを構築する際、各能力のバランスを考慮すると、より良いシナジーを得ることができます。',
        showIndividualComparison: '個別商品比較を表示',
        teamAverage: 'チーム平均',
        legend: '凡例',
      },
      teamBenefits: {
        title: 'AIチームの効果',
        subtitle: '個別のAIを単独で使う場合と、チームとして組み合わせた場合の性能を比較',
        avgImprovement: '平均改善度',
        percentImprovement: '改善率',
        individual: '個別平均',
        team: 'チーム平均',
        tipTitle: 'チーム構成の利点',
        tipDescription: '複数のAIをチームとして構成することで、個別商品の弱点を補完し、強みを最大化し、全体的な性能が大幅に向上します。',
      },
      developerCard: {
        teamwork: 'チームワーク',
        creative: '創造性',
        productivity: '生産性',
        add: '追加',
        remove: '削除',
        removeFromFavorites: 'お気に入りから削除',
      },
      auth: {
        login: {
          title: 'ログイン',
          emailLabel: 'メールアドレス',
          emailPlaceholder: 'your@email.com',
          passwordLabel: 'パスワード',
          passwordPlaceholder: '••••••••',
          rememberMe: 'ログイン状態を保持',
          forgotPassword: 'パスワードをお忘れですか？',
          signInButton: 'ログイン',
          signingIn: 'ログイン中...',
          noAccount: 'アカウントをお持ちでないですか？',
          signUpLink: '無料で登録',
          success: 'ログインに成功しました。',
          fail: 'ログインに失敗しました。',
          error: 'ログイン中にエラーが発生しました。',
          errors: {
            invalidCredentials: 'メールアドレスまたはパスワードが正しくありません。',
            userNotFound: '登録されていないメールアドレスです。メールアドレスを確認してください。',
            wrongPassword: 'パスワードが正しくありません。パスワードを再度確認してください。',
            googleAccount: 'このアカウントはGoogleログインを使用します。Googleログインボタンを使用してください。',
            serverError: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
          },
          terms: '利用規約',
          privacy: 'プライバシーポリシー',
          agreeText: 'ログインすると、以下に同意したことになります',
        },
        forgotPassword: {
          title: 'パスワードを忘れた場合',
          subtitle: 'パスワードをリセットするには、メールアドレスを入力してください。',
          emailLabel: 'メールアドレス',
          emailPlaceholder: 'your@email.com',
          submitButton: 'リセットリンクを送信',
          submitting: '送信中...',
          backToLogin: 'ログインに戻る',
          emailSent: '認証コードがメールで送信されました。メールを確認してください。',
          emailServerNotConfigured: 'メールサーバーが設定されていません。コード表示: {{code}}',
          requestError: 'パスワードリセットリクエスト中にエラーが発生しました。',
        },
        resetPassword: {
          title: 'パスワードリセット',
          subtitle: '新しいパスワードを入力してください。',
          newPasswordLabel: '新しいパスワード',
          confirmPasswordLabel: 'パスワード確認',
          passwordPlaceholder: '••••••••',
          submitButton: 'パスワードを変更',
          submitting: 'パスワード変更中...',
          backToLogin: 'ログインに戻る',
          success: 'パスワードが正常に変更されました。',
          resetError: 'パスワードリセット中にエラーが発生しました。',
          invalidToken: '無効なリセットトークンです。',
          noToken: 'トークンが提供されていません。',
          passwordMismatch: 'パスワードが一致しません。',
          passwordMinLength: 'パスワードは8文字以上である必要があります。',
          passwordRequired: 'パスワードを入力してください。',
          confirmPasswordRequired: 'パスワード確認を入力してください。',
        },
        verifyCode: {
          title: '認証コード入力',
          subtitle1: '{{email}}に送信された',
          subtitle2: '6桁の認証コードを入力してください。',
          codeLabel: '認証コード',
          codeHint: 'メールで送信された6桁の数字を入力してください',
          verifying: '確認中...',
          verify: '確認',
          noEmail: 'メール情報がありません。',
          verifySuccess: '認証コードが確認されました。',
          verifyError: '認証コードの確認中にエラーが発生しました。',
          noCodeReceived: 'コードを受信しませんでしたか？',
          resend: '再送信',
          devCodeInfo: '開発環境コード: {{code}}',
        },
        signup: {
          title: 'アカウント作成',
          subtitle: '何千人もの開発者と一緒に素晴らしいAIソリューションを作りましょう',
          success: '登録に成功しました。',
          fail: '登録に失敗しました。再度お試しください。',
          error: '登録中にエラーが発生しました。',
          agreeText: '登録すると、以下に同意したことになります',
          terms: '利用規約',
          privacy: 'プライバシーポリシー',
          usernameLabel: 'ユーザー名',
          usernamePlaceholder: 'username',
          emailLabel: 'メールアドレス',
          emailPlaceholder: 'your@email.com',
          passwordLabel: 'パスワード',
          passwordPlaceholder: '••••••••',
          confirmPasswordLabel: 'パスワード確認',
          rememberMe: 'ログイン状態を保持',
          creating: 'アカウント作成中...',
          createButton: 'アカウント作成',
          alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
          signIn: 'ログイン',
          errors: {
            usernameRequired: 'ユーザー名を入力してください。',
            usernameMinLength: 'ユーザー名は3文字以上である必要があります。',
            usernameInvalid: 'ユーザー名は英字、数字、アンダースコアのみ使用できます。',
            emailRequired: 'メールアドレスを入力してください。',
            emailInvalid: '正しいメール形式ではありません。',
            passwordRequired: 'パスワードを入力してください。',
            passwordMinLength: 'パスワードは8文字以上である必要があります。',
            confirmPasswordRequired: 'パスワード確認を入力してください。',
            passwordMismatch: 'パスワードが一致しません。',
          },
        },
      },
      order: {
        title: '注文詳細',
        backToProfile: 'プロフィールに戻る',
        notFound: '注文が見つかりません',
        itemsTitle: '注文商品（{{count}}点）',
        badge: '注文番号: {{number}}',
        status: {
          pending: '支払い待ち',
          completed: '完了',
        },
        statusLabel: '注文ステータス',
        summaryTitle: '注文サマリー',
        totalLabel: '総注文金額',
        processing: '処理中',
        item: {
          noProduct: '商品情報を読み込めません',
        },
        review: {
          completed: 'レビューが書かれました',
          title: 'レビューを書く',
          ratingLabel: '評価:',
          ratingValue: '{{rating}}点',
          titleLabel: 'レビュータイトル',
          titlePlaceholder: 'レビュータイトルを入力してください（オプション）',
          contentLabel: 'レビュー内容',
          contentPlaceholder: 'レビューを書いてください...（オプション）',
          imagesLabel: '写真を追加（オプション）',
          upload: 'アップロード',
          submit: 'レビューを送信',
          submitting: '送信中...',
          imageOnly: '画像ファイルのみアップロード可能です。',
          imageSize: '画像サイズは5MB以下である必要があります。',
          uploadFail: '画像のアップロードに失敗しました。',
        },
      },
      product: {
        header: {
          backHome: 'ホームに戻る',
        },
        tabs: {
          overview: '概要',
          projects: 'プロジェクト',
          reviews: 'レビュー（{{count}}）',
        },
        price: {
          purchased: '購入済み',
          label: '価格',
          buyNow: '今すぐ購入',
          addToCart: 'カートに追加',
          addToTeam: 'チーム構成に追加',
          location: '場所',
          joined: '{{date}}に登録',
          respondsIn: '{{time}}以内に応答',
          topDeveloper: '上位1%開発者',
          totalHires: '総雇用',
          completionRate: '完了率',
          responseTime: '応答時間',
          skillLevel: 'スキルレベル',
          reviews: 'レビュー',
        },
        overview: {
          title: '技術と能力',
        },
        trust: {
          title: '検証と信頼',
          identity: '本人確認完了',
          topRated: '最高評価開発者',
          success: '156k+成功プロジェクト',
        },
        reviews: {
          filter: {
            label: '開発者タイプフィルター:',
            ratingLabel: '評価フィルター',
            all: 'すべて',
            count: '件のレビュー',
            empty: 'レビューがありません。',
            emptyFiltered: '{{type}}のレビューがありません。',
            clearRating: '評価フィルターをクリア',
          },
        },
        recommended: {
          title: 'おすすめ商品',
          description: 'この商品と一緒によく購入される商品',
          categoryTitle: '{{category}}おすすめ商品',
          categoryDescription: '同じカテゴリーのおすすめ商品を確認してください',
        },
        viewed: {
          title: '他のお客様がよく閲覧している商品',
          description: '他のお客様がよく閲覧している人気商品を確認してください',
        },
        templates: {
          title: 'この商品が含まれるテンプレート',
          description: 'この商品を活用できるテンプレートを確認してください',
        },
        notFound: {
          title: '商品が見つかりませんでした',
          subtitle: '商品ID: {{id}}',
          apiUrl: 'API: {{url}}',
          errorInfo: 'エラー情報:',
          errorMessage: 'サーバーエラーが発生しました。データベースの問題の可能性があります。',
          errorDetail: 'ブラウザのコンソールで詳細を確認してください。',
          backToHome: 'メインページに戻る',
        },
        messages: {
          loginRequired: 'ログインが必要です。',
          addToCartSuccess: 'カートに追加しました',
          addToCartFail: 'カートへの追加に失敗しました。',
          alreadyPurchased: 'この商品はすでに購入済みです。',
          favoriteAdded: 'お気に入りに追加されました。',
          favoriteRemoved: 'お気に入りから削除されました。',
          favoriteUpdateFail: 'お気に入りの更新に失敗しました。',
        },
      },
      purchase: {
        header: {
          backHome: 'ホームに戻る',
          title: 'ショッピングカート',
          subtitle: '購入前に選択したAI開発者を確認してください',
        },
        empty: {
          title: 'カートが空です',
          description: 'AI開発者を閲覧してチーム構成を始めましょう！',
          cta: '開発者を閲覧',
        },
        productCard: {
          categoryFallback: 'AI開発者',
          purchased: '購入済み',
        },
        cartItem: {
          remove: '削除',
        },
        coupon: {
          title: 'クーポンコードをお持ちですか？',
          placeholder: 'コード入力（例: SAVE20）',
          apply: '適用',
          remove: '削除',
          applied: 'クーポンが適用されました: {{label}}',
        },
        summary: {
          title: '注文サマリー',
          subtotal: '小計（{{count}}点）',
          discount: '割引（{{label}}）',
          studentDiscount: '学生割引（50%）',
          tax: '税金（10%）',
          total: '合計',
          checkout: 'チェックアウトに進む',
          processing: '処理中...',
          secure: 'Stripeで保護された安全な支払い',
          subscription: {
            agree: '月1回の自動支払いに同意します',
            description: '登録された支払い方法で毎月末日に自動的に請求されます。',
            nextPayment: '次回支払い日: {{date}}',
          },
        },
        protection: {
          title: '購入保護',
          guarantee: '30日間返金保証',
          secure: '安全な支払い処理',
          delivery: 'メールで即座に送信',
          support: '24/7カスタマーサポート',
        },
        payment: {
          title: '支払い情報',
          company: 'カード会社',
          number: 'カード番号',
          expMonth: '有効期限（月）',
          expYear: '有効期限（年）',
          cvc: 'CVC',
          placeholders: {
            number: '1234 5678 9012 3456',
            cvc: '123',
          },
          errors: {
            cardNumberRequired: 'カード番号を入力してください。',
            cardNumberInvalid: '正しいカード番号形式ではありません。（16桁）',
            cvcRequired: 'CVCを入力してください。',
            cvcInvalid: '正しいCVC形式ではありません。（3-4桁）',
            expMonthRequired: '有効期限（月）を選択してください。',
            expMonthInvalid: '正しい月を選択してください。',
            expYearRequired: '有効期限（年）を選択してください。',
            expYearInvalid: '正しい年を選択してください。',
          },
        },
        confirmation: {
          headerTitle: 'AIDE Market',
          success: {
            title: '購入が完了しました！ 🎉',
            subtitle: 'ご購入ありがとうございます。AI開発者がすぐに使用可能です！',
            orderNumber: '注文番号 #{{number}}',
            subscription: {
              title: '定期支払いが設定されました',
              nextPayment: '次回支払い日: {{date}}',
              description: '登録された支払い方法で毎月末日に自動的に請求されます。',
            },
          },
          summary: {
            title: '注文サマリー',
            number: '注文番号',
            date: '注文日時',
            items: '合計{{count}}個のAI開発者',
            total: '総支払い金額',
            paid: '支払いが正常に処理されました',
            subscription: {
              title: '定期支払い',
              nextPayment: '次回支払い日: {{date}}',
            },
          },
          actions: {
            browse: '他の開発者を閲覧',
            history: '購入履歴を見る',
          },
          aiList: {
            title: '購入したAI開発者',
            activation: 'アクティベーションコード',
            document: 'ドキュメントを見る',
            download: 'ドキュメントをダウンロード',
            guide: 'ガイドを見る',
            copy: 'コピー',
            copied: 'コピーしました！',
          },
          email: {
            title: 'メール通知',
            description: '領収書とアクティベーション情報がメールで送信されます。',
            copy: 'メールをコピー',
            copied: 'コピーしました！',
            stepsTitle: '⚡ 次のステップ:',
            steps: [
              'AIDE Marketからのメールを確認してください',
              '以下のアクティベーションコードをコピーしてください',
              'AIDE Programでコードを登録してください',
            ],
          },
          support: {
            title: 'サポートが必要ですか？',
            description: 'お問い合わせはいつでもカスタマーサービスにお問い合わせください。',
            email: 'support@aidemarket.com',
            help: 'ヘルプセンター',
            chat: 'ライブチャット',
          },
        },
        messages: {
          loginRequired: 'ログインが必要です。',
          alreadyPurchased: 'この商品はすでに購入済みです。1ユーザーあたり1商品は1回のみ購入可能です。',
          cartItemRemoved: 'カートから削除されました。',
          removeCartItemFail: 'カートからの削除に失敗しました。',
          couponCodeRequired: 'クーポンコードを入力してください。',
          couponApplied: 'クーポンが適用されました。',
          couponApplyFail: 'クーポンの適用に失敗しました。',
          couponRemoved: 'クーポンが削除されました。',
          paymentMethodRequired: '支払いのためにカードを登録してください。',
          goToPaymentMethod: 'カード登録ページに移動しますか？',
          orderCreated: '注文が正常に作成されました。',
          orderCreateFail: '注文の作成に失敗しました。',
          requestError: 'リクエストエラー: {{message}}',
          authRequired: '認証が必要です。再度ログインしてください。',
          serverError: 'サーバーエラー: {{message}}',
          networkError: 'サーバーに接続できません。ネットワークを確認してください。',
          subscriptionCreateFail: '定期支払いサブスクリプションの作成に失敗しました。カスタマーサービスにお問い合わせください。',
          itemsRemovedFromCart: '{{count}}個の商品がすでに購入済みのためカートから削除されました。',
          alreadyPurchasedWarning: 'すでに購入済みの商品は注文から除外されます。',
          noItemsToPurchase: '購入可能な商品がありません。',
          cartLoadFail: 'カートの読み込みに失敗しました。',
          superAdminCannotPurchase: '管理者権限では決済を進めることはできません。',
        },
        availableCartItems: {
          title: 'カートに追加された商品',
          description: '一緒に購入したい商品を選択してください',
          addToPurchase: '購入リストに追加',
        },
      },
      productAdmin: {
        list: {
          title: '私の商品',
          new: '新商品',
          loading: '読み込み中...',
          filters: {
            search: '検索',
            searchPlaceholder: '商品名を入力してください...',
            category: 'カテゴリー',
            categoryAll: 'すべてのカテゴリー',
            sort: '並び替え',
            sortOptions: {
              recent: '最新順',
              name: '名前',
              sales: '販売',
              rating: '評価',
              price: '価格',
            },
            reset: 'リセット',
          },
          summary: {
            totalProducts: '総商品',
            totalSales: '総販売',
            totalRevenue: '総売上',
            avgRating: '平均評価',
          },
          table: {
            id: 'ID',
            product: '商品',
            price: '価格',
            sales: '販売',
            rating: '評価',
            actions: '操作',
            details: '詳細',
            edit: '編集',
            public: '公開表示',
            delete: '削除',
            categoryFallback: 'AI開発者',
          },
          empty: {
            title: '商品がありません',
            desc: '最初の商品を作成してみましょう',
            descWithFilters: 'フィルターを調整してみてください',
            new: '新商品',
          },
          messages: {
            loadFail: '商品リストの読み込みに失敗しました。',
            deleteConfirm: '{{name}}を削除してもよろしいですか？',
            deleteSuccess: '商品が削除されました。',
            deleteFail: '商品の削除に失敗しました。',
          },
        },
        detail: {
          loading: '商品を読み込み中...',
          loadError: '商品情報を読み込めませんでした。',
          retry: '再試行',
          back: '商品リストに戻る',
          header: {
            edit: '編集',
            viewPublic: '商品ページを見る',
          },
          stats: {
            totalSales: '総販売',
            totalRevenue: '総売上',
            avgRating: '平均評価',
          },
          chart: {
            title: '月別販売',
            subtitle: '最近12ヶ月の販売推移',
            empty: '販売データがありません。',
          },
          info: {
            name: '名前',
            price: '価格',
            category: 'カテゴリー',
            created: '作成日',
            views: '閲覧数',
            favorites: 'お気に入り',
          },
          meta: {
            creator: '作成者',
            created: '作成日',
            views: '閲覧数',
          },
          latestReview: {
            title: '最新レビュー',
            subtitle: '最新1レビュー',
            viewAll: 'すべてのレビューを見る',
            noReview: 'まだレビューがありません。',
            noComment: 'コメントがありません。',
          },
        },
        upload: {
          title: '商品登録',
          imageSection: '商品画像',
          imageUpload: '画像アップロード',
          imageRequired: '商品画像をアップロードしてください。',
          imageUploadSuccess: '画像アップロード完了',
          imageUploadFail: '画像アップロード失敗',
          basicInfo: '基本情報',
          productName: '商品名',
          productNamePlaceholder: '商品名を入力してください',
          productNameRequired: '商品名を入力してください。',
          sellerName: '販売者名',
          sellerNamePlaceholder: '販売者名を入力してください',
          sellerNameRequired: '販売者名を入力してください。',
          price: '価格',
          pricePlaceholder: '価格を入力してください',
          priceRequired: '価格を入力してください。',
          priceMin: '価格は0以上である必要があります。',
          description: '商品説明',
          descriptionPlaceholder: '商品についての詳細な説明を入力してください',
          descriptionRequired: '商品説明を入力してください。',
          category: 'カテゴリー',
          mainCategory: 'メインカテゴリー',
          mainCategoryPlaceholder: 'カテゴリーを選択してください',
          subCategory: 'サブカテゴリー',
          subCategoryPlaceholder: 'サブカテゴリーを選択してください',
          techStack: '技術スタック',
          techStackPlaceholder: '例: React, Node.js, Python',
          statsSection: 'AI統計（オプション）',
          statsDescription: '各項目の値を0-100の間で設定できます。',
          teamwork: 'チームワーク',
          stability: '安定性',
          speed: '速度',
          creativity: '創造性',
          productivity: '生産性',
          maintainability: '保守性',
          submit: '商品登録',
          reset: 'リセット',
          success: '商品が正常に登録されました！',
          fail: '商品のアップロードに失敗しました。',
          categoryLoadFail: 'カテゴリーリストの読み込みに失敗しました。',
          productIdError: '作成後に商品IDを受け取りませんでした。',
          statsCreateFail: 'Statsの作成に失敗しました（商品は作成されました）。',
        },
      },
      subscription: {
        manage: {
          title: 'サブスクリプション管理',
          subtitle: '定期支払いサブスクリプションを管理し、支払い情報を確認してください',
          loginRequired: 'ログインが必要です。',
          loadFail: 'サブスクリプションリストを読み込めませんでした。',
          failedTitle: '支払いが失敗したサブスクリプションがあります',
          failedDescription: '{{count}}件のサブスクリプション支払いが失敗しました。猶予期間内に再支払いしてください。',
          goToFailedPage: '支払い失敗ページに移動',
          activeTitle: 'アクティブなサブスクリプション',
          otherTitle: 'その他のサブスクリプション',
          emptyTitle: 'サブスクリプションがありません',
          emptyDescription: '定期支払いサブスクリプションを開始するには、商品を購入する際に定期支払いオプションを選択してください。',
          browseProducts: '商品を閲覧',
        },
        paymentFailed: {
          title: '支払い失敗管理',
          subtitle: '支払いが失敗したサブスクリプションを確認し、再支払いしてください',
          loginRequired: 'ログインが必要です。',
          loadFail: 'サブスクリプションリストを読み込めませんでした。',
          emptyTitle: '支払いが失敗したサブスクリプションがありません',
          emptyDescription: 'すべてのサブスクリプションが正常に支払われています。',
          goToManage: 'サブスクリプション管理に移動',
          alertTitle: '支払い失敗案内',
          alertDescription: '{{count}}件のサブスクリプション支払いが失敗しました。猶予期間内に再支払いしないと、アクティベーションコードが停止されます。',
          alertNote: '猶予期間は支払い失敗後3日です。期間内に再支払いを完了してください。',
          importantTitle: '重要な案内',
          importantItems: [
            '支払い失敗後3日の猶予期間が提供されます。',
            '猶予期間内に再支払いしないと、アクティベーションコードが停止されます。',
            '停止されたアクティベーションコードは再支払い後に自動的に復元されます。',
            '支払い方法を変更するには、プロフィール設定でカードを登録してください。',
            '問題が続く場合は、カスタマーサービスにお問い合わせください。',
          ],
          backToManage: '← サブスクリプション管理に戻る',
          retryConfirmTitle: '再支払い確認',
          retryConfirmContent: '登録された支払い方法で即座に再支払いを試みますか？',
          retryButton: '再支払いする',
          retryCancel: 'キャンセル',
          retryInfo: '再支払い機能は準備中です。カスタマーサービスにお問い合わせください。',
          retryFail: '再支払いに失敗しました。',
        },
        reminder: {
          title: '定期支払い案内',
          subtitle: '次回支払い日とサブスクリプション情報を確認してください',
          daysRemaining: '（残り{{days}}日）',
          loginRequired: 'ログインが必要です。',
          loadFail: 'サブスクリプション情報を読み込めませんでした。',
          notFoundTitle: 'サブスクリプション情報が見つかりません',
          notFoundDescription: 'リンクが期限切れまたは無効です。',
          goToManage: 'サブスクリプション管理に移動',
          infoTitle: '案内事項',
          infoItems: [
            '定期支払いは毎月末日に自動的に請求されます。',
            '支払い失敗時には3日の猶予期間が提供されます。',
            '猶予期間内に再支払いしないと、アクティベーションコードが停止されます。',
            'サブスクリプション管理はプロフィールページから行えます。',
          ],
          backToManage: '← サブスクリプション管理に戻る',
          couponApplied: 'クーポンが適用されました。',
          couponApplyFail: 'クーポンの適用に失敗しました。',
        },
      },
    },
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('appLanguage');
  if (stored && ['ko', 'en', 'ja'].includes(stored)) {
    return stored;
  }
  
  const browserLang = navigator.language?.split('-')[0];
  return ['ko', 'ja', 'en'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'ko', // 한국어로 fallback
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: false,
    returnNull: false,
    returnEmptyString: false,
    returnObjects: false, // 객체 반환 비활성화 (문자열만 반환)
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appLanguage', lng);
  }
});

export default i18n;