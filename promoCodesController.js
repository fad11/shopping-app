const { promoCodes, shoppingList } = require('./models');
const { generateUniqueId, calculateTotal } = require('./utilities');

function getPromoCodes(req, res) {
    res.json(promoCodes);
}

function createPromoCode(req, res) {
    const newPromoCode = req.body;
    if (!newPromoCode.name || !newPromoCode.percentage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    newPromoCode.id = generateUniqueId();
    promoCodes.push(newPromoCode);
    res.status(201).json(newPromoCode);
}

function deletePromoCode(req, res) {
    const promoCodeId = req.params.promoCodeId;
    promoCodes = promoCodes.filter(promoCode => promoCode.id !== promoCodeId);
    res.sendStatus(204);
}

function applyPromoCode(req, res) {
    const promoCodeId = req.params.promoCodeId;
    const promoCode = promoCodes.find(code => code.id === promoCodeId);
    if (!promoCode) {
        return res.status(404).json({ error: 'Promo code not found' });
    }
    const total = calculateTotal(shoppingList);
    const discount = total * (promoCode.percentage / 100);
    const discountedTotal = total - discount;
    res.json({ message: 'Promo code applied successfully', total: discountedTotal });
}

module.exports = {
    getPromoCodes,
    createPromoCode,
    deletePromoCode,
    applyPromoCode
};
