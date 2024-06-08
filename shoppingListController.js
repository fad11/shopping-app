const { products, shoppingList } = require('./models');
const { calculateTotal } = require('./utilities');

function getShoppingList(req, res) {
    const total = calculateTotal(shoppingList);
    res.json({ shoppingList, total });
}

function addProductToShoppingList(req, res) {
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
}

function removeProductFromShoppingList(req, res) {
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
}

module.exports = {
    getShoppingList,
    addProductToShoppingList,
    removeProductFromShoppingList
};
