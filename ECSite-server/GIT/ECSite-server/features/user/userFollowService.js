const models = require("../../db/initializer");

// 팔로우하기
exports.followUser = async (followerId, followingId) => {
    // 자기 자신 팔로우 불가
    if (followerId === followingId) {
        throw new Error('자기 자신을 팔로우할 수 없습니다');
    }
    
    // follower 확인
    const follower = await models.User.findByPk(followerId);
    if (!follower) {
        throw new Error('팔로우하는 사용자를 찾을 수 없습니다');
    }
    
    // following 확인
    const following = await models.User.findByPk(followingId);
    if (!following) {
        throw new Error('팔로우할 사용자를 찾을 수 없습니다');
    }
    
    // 권한 체크: follower는 role='user'만 가능
    if (follower.role !== 'user') {
        throw new Error('일반 사용자만 팔로우할 수 있습니다');
    }
    
    // 권한 체크: following은 role='admin'만 가능
    if (following.role !== 'admin') {
        throw new Error('관리자만 팔로우할 수 있습니다');
    }
    
    // 이미 팔로우 중인지 확인
    const existingFollow = await models.UserFollow.findOne({
        where: {
            follower_id: followerId,
            following_id: followingId
        }
    });
    
    if (existingFollow) {
        throw new Error('이미 팔로우 중입니다');
    }
    
    // 팔로우 생성
    const follow = await models.UserFollow.create({
        follower_id: followerId,
        following_id: followingId
    });
    
    // follower_count 증가
    await following.increment('follower_count');
    
    return follow.toJSON();
};

// 언팔로우하기
exports.unfollowUser = async (followerId, followingId) => {
    // 팔로우 관계 확인
    const follow = await models.UserFollow.findOne({
        where: {
            follower_id: followerId,
            following_id: followingId
        }
    });
    
    if (!follow) {
        throw new Error('팔로우 관계를 찾을 수 없습니다');
    }
    
    // 팔로우 삭제
    await follow.destroy();
    
    // following 사용자 확인
    const following = await models.User.findByPk(followingId);
    if (following && following.follower_count > 0) {
        // follower_count 감소 (0 이하로 내려가지 않도록)
        await following.decrement('follower_count');
    }
    
    return true;
};

// 팔로우 상태 확인
exports.getFollowStatus = async (followerId, followingId) => {
    // following 사용자 확인
    const following = await models.User.findByPk(followingId);
    if (!following) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    // 팔로우 여부 확인
    const isFollowing = await models.UserFollow.findOne({
        where: {
            follower_id: followerId,
            following_id: followingId
        }
    });
    
    // can_follow 체크
    let canFollow = false;
    if (followerId) {
        const follower = await models.User.findByPk(followerId);
        if (follower) {
            // 권한 체크: follower.role == 'user' && following.role == 'admin' && follower_id != following_id
            canFollow = follower.role === 'user' && 
                       following.role === 'admin' && 
                       followerId !== followingId &&
                       !isFollowing;
        }
    }
    
    return {
        is_following: !!isFollowing,
        can_follow: canFollow
    };
};

// 팔로워 목록 조회 (role='admin'인 유저만 조회 가능)
exports.getFollowers = async (userId, page = 1, limit = 20) => {
    // 사용자 확인
    const user = await models.User.findByPk(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    // 권한 체크: role='admin'만 조회 가능
    if (user.role !== 'admin') {
        throw new Error('관리자만 팔로워 목록을 조회할 수 있습니다');
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.UserFollow.findAndCountAll({
        where: { following_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    // 팔로워 정보 조인
    const followersWithUsers = await Promise.all(
        rows.map(async (follow) => {
            const followJson = follow.toJSON();
            const follower = await models.User.findByPk(follow.follower_id, {
                attributes: { exclude: ['password_hash'] }
            });
            return {
                ...followJson,
                follower: follower ? follower.toJSON() : null
            };
        })
    );
    
    return {
        followers: followersWithUsers,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

// 팔로잉 목록 조회 (role='user'인 유저만 조회 가능)
exports.getFollowing = async (userId, page = 1, limit = 20) => {
    // 사용자 확인
    const user = await models.User.findByPk(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    // 권한 체크: role='user'만 조회 가능
    if (user.role !== 'user') {
        throw new Error('일반 사용자만 팔로잉 목록을 조회할 수 있습니다');
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.UserFollow.findAndCountAll({
        where: { follower_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    // 팔로잉 정보 조인
    const followingWithUsers = await Promise.all(
        rows.map(async (follow) => {
            const followJson = follow.toJSON();
            const following = await models.User.findByPk(follow.following_id, {
                attributes: { exclude: ['password_hash'] }
            });
            return {
                ...followJson,
                following: following ? following.toJSON() : null
            };
        })
    );
    
    return {
        following: followingWithUsers,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

