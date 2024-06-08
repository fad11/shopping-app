const express = require('express');
const productController = require('./productController');
const shoppingListController = require('./shoppingListController');
const promoCodesController = require('./promoCodesController');

const router = express.Router();

// Products Routes
router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

// Shopping List Routes
router.get('/shopping-list', shoppingListController.getShoppingList);
router.post('/shopping-list/:productId', shoppingListController.addProductToShoppingList);
router.delete('/shopping-list/:productId', shoppingListController.removeProductFromShoppingList);

// Promo Codes Routes
router.get('/promo-codes', promoCodesController.getPromoCodes);
router.post('/promo-codes', promoCodesController.createPromoCode);
router.delete('/promo-codes/:promoCodeId', promoCodesController.deletePromoCode);
router.post('/apply-promo/:promoCodeId', promoCodesController.applyPromoCode);

module.exports = router;
