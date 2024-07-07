const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let products = [];
let shoppingList = [];
let promoCodes = [];

// Products Routes
app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.name || !newProduct.quantityAvailable || !newProduct.price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    newProduct.id = generateUniqueId();
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const updatedProduct = req.body;
    if (!updatedProduct.name && !updatedProduct.quantityAvailable && !updatedProduct.price) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        updateShoppingList(productId, updatedProduct); // Update shopping list if product details change
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    products.splice(productIndex, 1);
    shoppingList = shoppingList.filter(product => product.id !== productId); // Remove product from shopping list if deleted
    res.sendStatus(204);
});

// Shopping List Routes
app.get('/shopping-list', (req, res) => {
    const total = calculateTotal(shoppingList);
    res.json({ shoppingList, total });
});

app.post('/shopping-list/:productId', (req, res) => {
    const productId = req.params.productId;
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.status(404).json({ error: 'Product not found' });
    } else if (product.quantityAvailable === 0) {
        res.status(400).json({ error: 'Product out of stock' });
    } else {
        const existingIndex = shoppingList.findIndex(item => item.id === productId);
        if (existingIndex !== -1) {
            res.status(400).json({ error: 'Product already in shopping list' });
        } else {
            shoppingList.push(product);
            product.quantityAvailable--;
            const total = calculateTotal(shoppingList);
            res.status(201).json({ message: 'Product added to shopping list', total });
        }
    }
});

app.delete('/shopping-list/:productId', (req, res) => {
    const productId = req.params.productId;
    const index = shoppingList.findIndex(product => product.id === productId);
    if (index !== -1) {
        const removedProduct = shoppingList.splice(index, 1)[0];
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            products[productIndex].quantityAvailable++; // Increase the quantity of the product
        }
        const total = calculateTotal(shoppingList);
        res.json({ message: 'Product removed from shopping list', total });
    } else {
        res.status(404).json({ error: 'Product not found in shopping list' });
    }
});

// Promo Codes Routes (Bonus)
app.get('/promo-codes', (req, res) => {
    res.json(promoCodes);
});

app.post('/promo-codes', (req, res) => {
    const newPromoCode = req.body;
    if (!newPromoCode.name || !newPromoCode.percentage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    newPromoCode.id = generateUniqueId();
    promoCodes.push(newPromoCode);
    res.status(201).json(newPromoCode);
});

app.delete('/promo-codes/:promoCodeId', (req, res) => {
    const promoCodeId = req.params.promoCodeId;
    promoCodes = promoCodes.filter(promoCode => promoCode.id !== promoCodeId);
    res.sendStatus(204);
});

// Apply Promo Code to Shopping List
app.post('/apply-promo/:promoCodeId', (req, res) => {
    const promoCodeId = req.params.promoCodeId;
    const promoCode = promoCodes.find(code => code.id === promoCodeId);
    if (!promoCode) {
        return res.status(404).json({ error: 'Promo code not found' });
    }
    const total = calculateTotal(shoppingList);
    const discount = total * (promoCode.percentage / 100);
    const discountedTotal = total - discount;
    res.json({ message: 'Promo code applied successfully', total: discountedTotal });
});

// Helper functions
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function calculateTotal(shoppingList) {
    return shoppingList.reduce((total, product) => total + product.price, 0);
}

function updateShoppingList(productId, updatedProduct) {
    const index = shoppingList.findIndex(product => product.id === productId);
    if (index !== -1) {
        shoppingList[index] = { ...updatedProduct }; // Replace the existing product with the updated one
    }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
