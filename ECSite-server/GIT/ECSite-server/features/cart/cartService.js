const models = require("../../db/initializer");

// 사용자의 활성 장바구니 가져오기 또는 생성
const getOrCreateActiveCart = async (userId) => {
    let cart = await models.Cart.findOne({
        where: {
            user_id: userId,
            status: 'active'
        }
    });

    if (!cart) {
        cart = await models.Cart.create({
            user_id: userId,
            status: 'active'
        });
    }

    return cart;
};

// 사용자별 장바구니 조회 (상품 정보 포함)
exports.getCartByUserId = async (userId) => {
    const cart = await getOrCreateActiveCart(userId);
    
    const cartItems = await models.CartItem.findAll({
        where: { cart_id: cart.id },
        include: [{
            model: models.Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'category_id', 'sub_category_id']
        }],
        order: [['added_at', 'DESC']]
    });

    return {
        cart: cart.toJSON(),
        cartItems: cartItems.map(item => {
            const itemJson = item.toJSON();
            return {
                id: itemJson.id,
                cart_id: itemJson.cart_id,
                product_id: itemJson.product_id,
                quantity: itemJson.quantity,
                added_at: itemJson.added_at,
                product: itemJson.product
            };
        })
    };
};

// 장바구니에 상품 추가
exports.addToCart = async (userId, productId, quantity = 1) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }

    // 이미 구매한 상품인지 확인 (선택사항)
    // 이 부분은 필요에 따라 추가할 수 있습니다

    const cart = await getOrCreateActiveCart(userId);

    // 이미 장바구니에 있는 상품인지 확인
    const existingItem = await models.CartItem.findOne({
        where: {
            cart_id: cart.id,
            product_id: productId
        }
    });

    if (existingItem) {
        // 수량 증가
        existingItem.quantity += quantity;
        await existingItem.save();
        return existingItem.toJSON();
    } else {
        // 새로 추가
        const cartItem = await models.CartItem.create({
            cart_id: cart.id,
            product_id: productId,
            quantity: quantity
        });
        return cartItem.toJSON();
    }
};

// 장바구니에서 상품 제거
exports.removeFromCart = async (userId, productId) => {
    const cart = await getOrCreateActiveCart(userId);

    const cartItem = await models.CartItem.findOne({
        where: {
            cart_id: cart.id,
            product_id: productId
        }
    });

    if (!cartItem) {
        throw new Error('장바구니에 해당 상품이 없습니다');
    }

    await cartItem.destroy();
    return true;
};

// 장바구니 아이템 수량 변경
exports.updateCartItemQuantity = async (userId, productId, quantity) => {
    if (quantity < 1) {
        throw new Error('수량은 1 이상이어야 합니다');
    }

    const cart = await getOrCreateActiveCart(userId);

    const cartItem = await models.CartItem.findOne({
        where: {
            cart_id: cart.id,
            product_id: productId
        }
    });

    if (!cartItem) {
        throw new Error('장바구니에 해당 상품이 없습니다');
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem.toJSON();
};

// 장바구니 비우기
exports.clearCart = async (userId) => {
    const cart = await getOrCreateActiveCart(userId);
    
    await models.CartItem.destroy({
        where: { cart_id: cart.id }
    });

    return true;
};

// 주문 완료 후 장바구니 상태 변경
exports.markCartAsOrdered = async (userId) => {
    const cart = await getOrCreateActiveCart(userId);
    
    cart.status = 'ordered';
    await cart.save();

    return cart.toJSON();
};

