import mongoose from 'mongoose';
import { productModel } from '../models/products.model.js';
import { formatResponse } from '../../utils/utils.js';

class ProductManager {
    async addProductRawJSON(productData) {
        try {
            const existingProduct = await productModel.findOne({ code: productData.code });
            if (existingProduct) {
                return "Product with that code already exist. Not added";
            }

            const newProduct = new productModel({
                ...productData,
            });

            await newProduct.save();
            return "Product added successfully.";
        } catch (error) {
            console.error('Error adding product:', error.message);
            return "Error adding product.";
        }
    }

    async getProducts(queryParams) {
        try {
            const { page = 1, limit = 10, category, available, sortByPrice } = queryParams;
            const options = {
                page,
                limit,
                sort: {},
                lean: true,
            };

            const query = { status: true };

            if (category) {
                query.category = category;
            }

            if (available) {
                query.stock = { $gt: 0 };
            }

            if (sortByPrice) {
                options.sort.price = sortByPrice === 'asc' ? 1 : -1;
            }

            const result = await productModel.paginate(query, options);

            return formatResponse(result);
        } catch (error) {
            console.error('Error reading products from MongoDB:', error.message);
            throw error;
        }
    }

    async getProductById(pid) {
        try {
            const product = await productModel.findOne({ _id: pid });
            return product ? product : undefined;
        } catch (error) {
            console.error('Error obtaining product by ID from MongoDB:', error.message);
            return undefined;
        }
    }

    async updateProduct(id, updates) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return { error: "Product ID not valid", status: 400 };
            }

            const product = await productModel.findOne({ _id: id, status: true });
            if (!product) {
                return { error: "Product not found or eliminated.", status: 404 };
            }

            for (const key in updates) {
                if (key in product) {
                    product[key] = updates[key];
                }
            }

            await product.save();
            return { message: "Product updated successfully", status: 200 };
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const product = await productModel.findOne({ _id: pid });
            if (!product) {
                return "Product not found";
            }

            product.status = false;
            await product.save();

            return "Product removed correctly";
        } catch (error) {
            console.error('Error setting product as unavailable in MongoDB:', error.message);
            return "Error setting product as unavailable.";
        }
    }
}

export default ProductManager;