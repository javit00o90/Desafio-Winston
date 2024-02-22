import { cartsModel } from "../models/carts.model.js";
import mongoose from 'mongoose';



class CartsManager {
    async createCart() {
        try {
            const newCart = await cartsModel.create({ products: [] });
            console.log('Cart created successfully:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error.message);
            return null;
        }
    }

    async getCartById(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return "Cart ID not valid."
            }
            const cart = await cartsModel.findById(cartId)
                .populate('products._id', 'title description price thumbnails code stock category')
                .lean();

            return cart ? cart : "Cart not found.";
        } catch (error) {
            console.error('Error fetching cart by ID:', error.message);
            return "Error obtaining Cart.";
        }
    }

    async getCarts() {
        try {
            const carts = await cartsModel.find().populate('products._id', 'title price stock category');
            return carts;
        } catch (error) {
            console.error('Error fetching carts:', error.message);
            return [];
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "Cart or Product ID are not valid.", status: 400 };
            }

            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return { error: "Cart not found.", status: 404 };
            }

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "Product ID not valid.", status: 400 };
            }

            const product = cart.products.find(p => p._id.equals(productId));

            if (product && product.status === false) {
                return { error: "Product eliminated.", status: 400 };
            }

            if (!product) {
                cart.products.push({ _id: productId, quantity: 1 });
            } else {
                product.quantity++;
            }

            await cart.save();
            return { message: "Product added to Cart correctly.", status: 200 };
        } catch (error) {
            console.error('Error adding product to cart:', error.message);
            return { error: "Error adding Product to Cart.", status: 500 };
        }
    }

    async removeProductFromCart(cartId, productId, quantityToRemove) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "Cart or Product ID are not valid.", status: 400 };
            }

            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return { error: "Cart not found.", status: 404 };
            }

            const productIndex = cart.products.findIndex(product => product._id.equals(productId));

            if (productIndex === -1) {
                return { error: "Product not found in Cart.", status: 404 };
            }

            if (!quantityToRemove || quantityToRemove >= cart.products[productIndex].quantity) {
                cart.products.splice(productIndex, 1);
            } else {
                cart.products[productIndex].quantity -= quantityToRemove;
            }

            await cart.save();

            return { message: "Product removed from cart successfully.", status: 200 };
        } catch (error) {
            console.error('Error removing product from cart:', error.message);
            return { error: "Error removing product from cart.", status: 500 };
        }
    }


    async updateCart(cartId, newProducts) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return { error: "Cart ID not valid.", status: 400 };
            }
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return { error: "Cart not found.", status: 404 };
            }

            newProducts.forEach(newProduct => {
                const existingProduct = cart.products.find(p => p._id.equals(newProduct._id));

                if (existingProduct && existingProduct.status === false) {
                    return { error: "One of the products was removed.", status: 400 };
                }

                if (existingProduct) {
                    existingProduct.quantity += newProduct.quantity || 1;
                } else {
                    cart.products.push({
                        _id: newProduct._id,
                        quantity: newProduct.quantity || 1
                    });
                }
            });

            await cart.save();

            return { message: "Carrito actualizado correctamente.", status: 200 };
        } catch (error) {
            console.error('Error updating cart:', error.message);
            return { error: "Error al actualizar el carrito.", status: 500 };
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "Cart or Product ID are not valid.", status: 400 };
            }
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return { error: "Cart not found.", status: 404 };
            }

            const product = cart.products.find(p => p._id.equals(productId));

            if (product && product.status === false) {
                return { error: "Product is deleted from DB.", status: 400 };
            }

            if (!Number.isInteger(quantity) || quantity < 0) {
                return { error: "The quantity must be a non-negative integer.", status: 400 };
            }

            if (product) {
                product.quantity += quantity || 1;
            } else {
                return { error: "Product not found in Cart.", status: 404 };
            }

            await cart.save();

            return { message: "Product quantity updated.", status: 200 };
        } catch (error) {
            console.error('Error updating product quantity:', error.message);
            return { error: "Error updating product quantity.", status: 500 };
        }
    }

    async clearCart(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return { error: "Cart ID not valid.", status: 400 };
            }
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                return { error: "Cart not found.", status: 404 };
            }

            cart.products = [];
            await cart.save();

            return { message: "Cart cleared correctly.", status: 200 };
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            return { error: "Error clearing cart:", status: 500 };
        }
    }
}

export default CartsManager;