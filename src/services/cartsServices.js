import CartsManager from '../dao/managers/cartsManager.js';

class CartService {
    constructor() {
        this.cartsManager = new CartsManager();
    }

    async getCarts() {
        try {
            return await this.cartsManager.getCarts();
        } catch (error) {
            console.error('Error fetching carts:', error.message);
            throw new Error('Error fetching carts');
        }
    }

    async getCartById(cartId) {
        try {
            return await this.cartsManager.getCartById(cartId);
        } catch (error) {
            console.error('Error fetching cart by ID:', error.message);
            throw new Error('Error fetching cart by ID');
        }
    }

    async createCart() {
        try {
            return await this.cartsManager.createCart();
        } catch (error) {
            console.error('Error creating cart:', error.message);
            throw new Error('Error creating cart');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            return await this.cartsManager.addProductToCart(cartId, productId);
        } catch (error) {
            console.error('Error adding product to cart:', error.message);
            throw new Error('Error adding product to cart');
        }
    }

    async removeProductFromCart(cartId, productId, quantityToRemove) {
        try {
        return await this.cartsManager.removeProductFromCart(cartId, productId, quantityToRemove);
    } catch (error) {
        console.error('Error removing product from cart:', error.message);
            throw new Error('Error removing product from cart');
        }
    }

    async updateCart(cartId, products) {
        try {
            return await this.cartsManager.updateCart(cartId, products);
        } catch (error) {
            console.error('Error updating cart:', error.message);
            throw new Error('Error updating cart');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await this.cartsManager.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            console.error('Error updating product quantity in cart:', error.message);
            throw new Error('Error updating product quantity in cart');
        }
    }

    async clearCart(cartId) {
        try {
            return await this.cartsManager.clearCart(cartId);
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            throw new Error('Error clearing cart');
        }
    }
    
}

export default CartService;
