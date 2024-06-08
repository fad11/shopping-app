const { products, shoppingList } = require('./models');
const { generateUniqueId, updateShoppingList } = require('./utilities');

function getProducts(req, res) {
    res.json(products);
}

function createProduct(req, res) {
    const newProduct = req.body;
    if (!newProduct.name || !newProduct.quantityAvailable || !newProduct.price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    newProduct.id = generateUniqueId();
    products.push(newProduct);
    res.status(201).json(newProduct);
}

function updateProduct(req, res) {
    const productId = req.params.productId;
    const updatedProduct = req.body;
    if (!updatedProduct.name && !updatedProduct.quantityAvailable && !updatedProduct.price) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        updateShoppingList(shoppingList, productId, updatedProduct); // Update shopping list if product details change
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
}

function deleteProduct(req, res) {
    const productId = req.params.productId;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    products.splice(productIndex, 1);
    shoppingList = shoppingList.filter(product => product.id !== productId); // Remove product from shopping list if deleted
    res.sendStatus(204);
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
