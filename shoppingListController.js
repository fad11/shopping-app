const { products, shoppingList, promoCodes } = require('./models');

let appliedPromoCode = null;

function roundToTwoDecimals(number) {
    return Math.round(number * 100) / 100;
}

function calculateTotal(shoppingList) {
    return shoppingList.reduce((total, item) => {
        return roundToTwoDecimals(total + (item.price * item.quantity));
    }, 0);
}

function calculateDiscountedTotal(total, promoCode) {
    if (promoCode) {
        const discount = total * (promoCode.percentage / 100);
        return roundToTwoDecimals(total - discount);
    }
    return total;
}

function getShoppingList(req, res) {
    const total = calculateTotal(shoppingList);
    const discountedTotal = calculateDiscountedTotal(total, appliedPromoCode);
    res.json({ shoppingList, total, discountedTotal, appliedPromoCode });
}

function addProductToShoppingList(req, res) {
    const productId = req.params.productId;
    const { quantity } = req.body;
    const product = products.find(product => product.id === productId);

    if (!product) {
        res.status(404).json({ error: 'Product not found' });
    } else if (product.quantityAvailable < quantity) {
        res.status(400).json({ error: 'Not enough product in stock' });
    } else {
        const existingIndex = shoppingList.findIndex(item => item.id === productId);
        if (existingIndex !== -1) {
            shoppingList[existingIndex].quantity += quantity;
        } else {
            shoppingList.push({ ...product, quantity });
        }
        product.quantityAvailable -= quantity;
        const total = calculateTotal(shoppingList);
        const discountedTotal = calculateDiscountedTotal(total, appliedPromoCode);
        res.status(201).json({ message: 'Product added to shopping list', total, discountedTotal });
    }
}

function removeProductFromShoppingList(req, res) {
    const productId = req.params.productId;
    const index = shoppingList.findIndex(product => product.id === productId);
    if (index !== -1) {
        const removedProduct = shoppingList.splice(index, 1)[0];
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            products[productIndex].quantityAvailable += removedProduct.quantity;
        }
        const total = calculateTotal(shoppingList);
        const discountedTotal = calculateDiscountedTotal(total, appliedPromoCode);
        res.json({ message: 'Product removed from shopping list', total, discountedTotal });
    } else {
        res.status(404).json({ error: 'Product not found in shopping list' });
    }
}

function applyPromoCode(req, res) {
    const promoCodeId = req.params.promoCodeId;
    const promoCode = promoCodes.find(code => code.id === promoCodeId);
    if (!promoCode) {
        return res.status(404).json({ error: 'Promo code not found' });
    }
    if (promoCode.percentage < 0 || promoCode.percentage > 100) {
        return res.status(400).json({ error: 'Invalid promo code percentage' });
    }
    appliedPromoCode = promoCode;
    const total = calculateTotal(shoppingList);
    const discountedTotal = calculateDiscountedTotal(total, appliedPromoCode);
    res.json({ message: 'Promo code applied successfully', total, discountedTotal, appliedPromoCode });
}

module.exports = {
    getShoppingList,
    addProductToShoppingList,
    removeProductFromShoppingList,
    applyPromoCode
};
