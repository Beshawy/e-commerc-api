const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// إنشاء Access Token (قصير المدى)
const createAccessToken = (payload) => {
    return jwt.sign(
        { userId: payload }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: process.env.JWT_EXPIRE || '15m',
            issuer: 'e-commerce-api',
            audience: 'e-commerce-client'
        }
    );
};

// إنشاء Refresh Token (طويل المدى)
const createRefreshToken = (payload) => {
    return jwt.sign(
        { 
            userId: payload,
            tokenType: 'refresh',
            jti: crypto.randomUUID() // JWT ID للتعريف الفريد
        }, 
        process.env.JWT_REFRESH_SECRET, 
        { 
            expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
            issuer: 'e-commerce-api',
            audience: 'e-commerce-client'
        }
    );
};

// التحقق من صحة Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'e-commerce-api',
            audience: 'e-commerce-client'
        });
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

// التحقق من صحة Refresh Token
const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
            issuer: 'e-commerce-api',
            audience: 'e-commerce-client'
        });
        
        if (decoded.tokenType !== 'refresh') {
            throw new Error('Invalid token type');
        }
        
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

// إنشاء زوج من الـ tokens
const createTokenPair = (userId) => {
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);
    
    return {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE || '15m'
    };
};

// تجديد الـ tokens
const refreshTokens = (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);
    return createTokenPair(decoded.userId);
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    createTokenPair,
    refreshTokens
};
