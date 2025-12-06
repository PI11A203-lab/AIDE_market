// 환경 변수 로드 (경로 명시적으로 지정)
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Docker環境でのデフォルト値
const getDbConfig = () => {
    const isDocker = process.env.DOCKER_ENV === 'true' || process.env.DB_HOST === 'mysql';
    
    return {
        username: process.env.DB_USERNAME || (isDocker ? 'aide_user' : 'root'),
        password: process.env.DB_PASSWORD || (isDocker ? 'aide_password' : 'root'),
        database: process.env.DB_NAME || 'aide_market',
        host: process.env.DB_HOST || (isDocker ? 'mysql' : '127.0.0.1'),
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || '5', 10),
            min: parseInt(process.env.DB_POOL_MIN || '0', 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
            idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
        },
        dialectOptions: {
            // Docker環境での接続タイムアウト設定
            connectTimeout: 60000,
            // SSL設定（本番環境用）
            ...(process.env.DB_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {})
        },
        // 接続リトライ設定
        retry: {
            max: 10,
            match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNREFUSED/,
                /ECONNRESET/,
                /ER_LOCK_WAIT_TIMEOUT/,
            ]
        }
    };
};

module.exports = {
    development: getDbConfig(),
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    },
    production: getDbConfig(),
};