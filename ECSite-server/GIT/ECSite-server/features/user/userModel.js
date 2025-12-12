// features/user/userModel.js
// bcrypt 패키지가 필요합니다: npm install bcrypt
let bcrypt;
try {
    bcrypt = require('bcrypt');
} catch (err) {
    console.warn('bcrypt 패키지가 설치되지 않았습니다. 비밀번호 해싱 기능을 사용하려면 npm install bcrypt를 실행하세요.');
    // bcrypt가 없는 경우를 위한 fallback (실제 프로덕션에서는 bcrypt 사용 필수)
    bcrypt = {
        hash: async (password, saltRounds) => {
            throw new Error('bcrypt 패키지가 설치되지 않았습니다');
        },
        compare: async (password, hash) => {
            throw new Error('bcrypt 패키지가 설치되지 않았습니다');
        }
    };
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: true, // 구글 로그인 사용자는 비밀번호가 없을 수 있음
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: true,
            defaultValue: 'user',
        },
        profile_image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        is_email_public: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        github_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        google_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: '구글 고유 ID 저장'
        },
        auth_provider: {
            type: DataTypes.ENUM('local', 'google'),
            allowNull: true,
            defaultValue: 'local',
            comment: '인증 제공자: local 또는 google'
        },
        follower_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '팔로워 수'
        },
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        hooks: {
            beforeCreate: async (user) => {
                // password_hash가 있고 해시되지 않은 경우에만 해시 처리
                // 구글 로그인 사용자는 password_hash가 null일 수 있음
                if (user.password_hash && !user.password_hash.startsWith('$2')) {
                    // 비밀번호가 해시되지 않은 경우 해시 처리
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password_hash, saltRounds);
                }
            },
            beforeUpdate: async (user) => {
                // password_hash가 변경되었고, 값이 있고 해시되지 않은 경우에만 해시 처리
                if (user.changed('password_hash') && user.password_hash && !user.password_hash.startsWith('$2')) {
                    // 비밀번호가 변경되었고 해시되지 않은 경우 해시 처리
                    const saltRounds = 10;
                    user.password_hash = await bcrypt.hash(user.password_hash, saltRounds);
                }
            }
        }
    });
    
    // 비밀번호 검증 메서드
    User.prototype.validatePassword = async function(password) {
        // password_hash가 null인 경우 (구글 로그인 사용자)는 검증 불가
        if (!this.password_hash) {
            return false;
        }
        return await bcrypt.compare(password, this.password_hash);
    };
    
    // 비밀번호 해시 없이 사용자 정보 반환 (응답용)
    User.prototype.toSafeJSON = function() {
        const user = this.toJSON();
        delete user.password_hash;
        return user;
    };
    
    // 모델 간 관계 정의
    User.associate = function(models) {
        User.hasMany(models.Order, {
            foreignKey: 'user_id',
            as: 'orders'
        });
        User.hasMany(models.PaymentMethod, {
            foreignKey: 'user_id',
            as: 'paymentMethods'
        });
        User.hasMany(models.CreditCard, {
            foreignKey: 'user_id',
            as: 'creditCards'
        });
        User.hasMany(models.ProductFavorite, {
            foreignKey: 'user_id',
            as: 'favorites'
        });
        User.hasMany(models.ProductReview, {
            foreignKey: 'user_id',
            as: 'reviews'
        });
        User.hasMany(models.TeamComposition, {
            foreignKey: 'user_id',
            as: 'teamCompositions'
        });
        User.hasMany(models.UserMailSetting, {
            foreignKey: 'user_id',
            as: 'mailSetting'
        });
        User.hasMany(models.OrderCoupon, {
            foreignKey: 'user_id',
            as: 'orderCoupons'
        });
    };
    
    return User;
};

