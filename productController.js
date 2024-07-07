const { products, shoppingList } = require('./models');
const { generateUniqueId, updateShoppingList } = require('./utilities');

// Helper function to validate product fields
function isValidProduct(product) {
    if (typeof product.name !== 'string' || product.name.trim() === '') {
        return { valid: false, error: 'Invalid or missing name' };
    }
    if (typeof product.quantityAvailable !== 'number' || product.quantityAvailable < 0) {
        return { valid: false, error: 'Invalid or missing quantityAvailable' };
    }
    if (typeof product.price !== 'number' || product.price < 0) {
        return { valid: false, error: 'Invalid or missing price' };
    }
    return { valid: true };
}

function getProducts(req, res) {
    res.json(products);
}

function createProduct(req, res) {
    const newProduct = req.body;
    const validation = isValidProduct(newProduct);

    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    newProduct.id = generateUniqueId();
    products.push(newProduct);
    res.status(201).json(newProduct);
}

function updateProduct(req, res) {
    const productId = req.params.productId;
    const updatedProduct = req.body;
    const existingProduct = products.find(product => product.id === productId);

    if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProductData = { ...existingProduct, ...updatedProduct };

    const validation = isValidProduct(updatedProductData);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const index = products.findIndex(product => product.id === productId);
    products[index] = updatedProductData;

    // Update shopping list if product details change
    const shoppingListIndex = shoppingList.findIndex(item => item.id === productId);
    if (shoppingListIndex !== -1) {
        shoppingList[shoppingListIndex] = { ...shoppingList[shoppingListIndex], ...updatedProduct };
    }

    res.json(products[index]);
}

function deleteProduct(req, res) {
    const productId = req.params.productId;
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);

    // Remove product from shopping list if deleted
    const updatedShoppingList = shoppingList.filter(product => product.id !== productId);
    shoppingList.length = 0; // Clear the existing array
    shoppingList.push(...updatedShoppingList); // Push the updated products into the array

    res.sendStatus(204);
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
