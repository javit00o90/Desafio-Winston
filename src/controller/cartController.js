import CartService from '../services/cartsServices.js';
import TicketsService from '../services/ticketsService.js';
import ProductService from '../services/productsServices.js';
import { CustomError, ErrorCodes } from '../utils/errorUtils.js';

class CartController {
    constructor() {
        this.cartService = new CartService();
        this.ticketService = new TicketsService();
        this.productService = new ProductService();
    }

    getCarts = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts();
            res.status(200).json(carts);
        } catch (error) {
            console.error('Error fetching carts:', error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    getCartById = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCartById(cartId);
            if (cart && cart !== "Cart not found." && cart !== "Cart ID not valid.") {
                res.status(200).json(cart);
                
            } else if(cart === "Cart ID not valid."){
                throw new CustomError(
                    ErrorCodes.INVALID_CART_ID.name,
                    ErrorCodes.INVALID_CART_ID.message,
                    ErrorCodes.INVALID_CART_ID.code,
                    'Cart ID not valid'
                );
            }
            else {
                throw new CustomError(
                    ErrorCodes.CART_NOT_FOUND.name,
                    ErrorCodes.CART_NOT_FOUND.message,
                    ErrorCodes.CART_NOT_FOUND.code,
                    'Cart not found in the database'
                );
            }
        } catch (error) {
            console.error('Error fetching cart by ID:', error.message);
            return res.status(error.code || 500).json({ name: error.name, code: error.code, message: error.message });
        }
    }

    createCart = async (req, res) => {

        try {
            const cart = await this.cartService.createCart();
            if (cart) {
                res.status(201).json({ message: "Cart created", cartId: cart._id });
            } else {
                throw new CustomError(
                    ErrorCodes.INTERNAL_SERVER_ERROR.name,
                    ErrorCodes.INTERNAL_SERVER_ERROR.message,
                    ErrorCodes.INTERNAL_SERVER_ERROR.code,
                    'Error creating cart'
                );
            }
        } catch (error) {
            console.error('Error creating cart:', error.message);
            return res.status(error.code || 500).json({ name: error.name, code: error.code, message: error.message });
        }
    }

    addProductToCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const result = await this.cartService.addProductToCart(cartId, productId);

            if (result.status === 200) {
                res.status(200).json({ message: result.message });
            } else if (result.status === 404) {
                res.status(404).json({ error: result.error });
            } else {
                res.status(500).json({ error: result.error });
            }
        } catch (error) {
            console.error('Error adding product to cart:', error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    removeProductFromCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const result = await this.cartService.removeProductFromCart(cartId, productId);

            if (result.status === 200) {
                res.status(200).json({ message: result.message });
            } else if (result.status === 404) {
                res.status(404).json({ error: result.error });
            } else {
                res.status(500).json({ error: result.error });
            }
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const products = req.body;
            const result = await this.cartService.updateCart(cartId, products);

            if (result.status === 200) {
                res.status(200).json({ message: result.message });
            } else if (result.status === 404) {
                res.status(404).json({ error: result.error });
            } else {
                res.status(500).json({ error: result.error });
            }
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }


    updateProductQuantity = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
            const result = await this.cartService.updateProductQuantity(cartId, productId, quantity);

            if (result.status === 200) {
                res.status(200).json({ message: result.message });
            } else if (result.status === 404) {
                res.status(404).json({ error: result.error });
            } else {
                res.status(500).json({ error: result.error });
            }
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }

    clearCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const result = await this.cartService.clearCart(cartId);

            if (result.status === 200) {
                res.status(200).json({ message: result.message });
            } else if (result.status === 404) {
                res.status(404).json({ error: result.error });
            } else {
                res.status(500).json({ error: result.error });
            }
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }

    cartRender = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCartById(cartId);

            if (cart && cart !== "Cart not found.") {
                const user = req.user;
                res.render('cart', { session: { user }, cart });
            } else {
                throw new CustomError(
                    ErrorCodes.CART_NOT_FOUND.name,
                    ErrorCodes.CART_NOT_FOUND.message,
                    ErrorCodes.CART_NOT_FOUND.code,
                    'Cart not found in the database'
                );
            }
        } catch (error) {
            return res.status(error.code || 500).json({ name: error.name, code: error.code, message: error.message });
        }
    }
    
    purchaseCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCartById(cartId);
            
    
            if (!cart || cart === "Cart not found.") {
                return res.status(404).json({ error: "Cart not found." });
            }
    
            const productsWithInsufficientStock = [];
            let allProductsOutOfStock = true;
    
            for (const product of cart.products) {
                const productDetails = await this.productService.getProductById(product._id);
    
                if (!productDetails || productDetails === "Product not found.") {
                    continue;
                }
    
                const productId = productDetails._id.toString();
                const productTitle = productDetails.title;
                const requestedQuantity = product.quantity;
                const availableStock = productDetails.stock;
    
                if (availableStock >= requestedQuantity) {
                    const newStock = availableStock - requestedQuantity;
                    await this.productService.updateProduct(productId, { stock: newStock });
                    await this.cartService.removeProductFromCart(cartId, productId);
    
                    product.quantity = requestedQuantity;
                    allProductsOutOfStock = false;
                } else {
                    productsWithInsufficientStock.push({
                        productTitle,
                        requestedQuantity,
                        availableStock
                    });
                }
            }
    
            if (productsWithInsufficientStock.length === cart.products.length) {
                const user = req.user;
                return res.render('purchase', {
                    error: "All products are out of stock.",
                    productsWithInsufficientStock,
                    session: { user }
                });
            }
            const ticketCode = Math.random().toString(36).substring(2, 10);
            const ticketData = {
                code: ticketCode,
                amount: cart.products.reduce((total, product) => total + (product._id.price * product.quantity), 0),
                purchaser: req.user.email
            };
    
            const ticket = await this.ticketService.generateTicket(ticketData);
    
            const user = req.user;
            res.render('purchase', {
                message: "Purchase completed!",
                productsWithInsufficientStock,
                ticket,
                session: { user }
            });
        } catch (error) {
            console.error('Error purchasing cart:', error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

}


export default new CartController();