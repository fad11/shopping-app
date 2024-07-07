function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

function calculateTotal(shoppingList) {
    return shoppingList.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateShoppingList(shoppingList, productId, updatedProduct) {
    const index = shoppingList.findIndex(product => product.id === productId);
    if (index !== -1) {
        shoppingList[index] = { ...updatedProduct }; // Replace the existing product with the updated one
    }
}

module.exports = {
    generateUniqueId,
    calculateTotal,
    updateShoppingList
};
