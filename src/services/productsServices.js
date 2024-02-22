import ProductManager from '../dao/managers/productsManager.js';

class ProductService {
    constructor() {
        this.productManager = new ProductManager();
    }

    async getProducts(queryParams) {
        // Apaño temporal para renderizar todos los objetos en realtimeproducts
        if(!queryParams){
            queryParams = {
                page: 1,
                limit: 200,
            };
            return await this.productManager.getProducts(queryParams);
        }
        return await this.productManager.getProducts(queryParams);
    }

    async getProductById(productId) {
        return await this.productManager.getProductById(productId);
    }

    async deleteProduct(productId) {
        return await this.productManager.deleteProduct(productId);
    }

    async addProduct(productsData) {
        return await this.productManager.addProductRawJSON(productsData);
    }

    async updateProduct(productId, updates) {
        return await this.productManager.updateProduct(productId, updates);
    }
}

export default ProductService;