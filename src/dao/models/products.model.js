import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number,
    category: String,
    status: {
        type: Boolean,
        default: true,
    },
});

mongoosePaginate.paginate.options = {
    page: 1,
    limit: 10,
    customLabels: {
        totalDocs: 'totalItems',
        docs: 'payload',
        page: 'page',
        nextPage: 'nextPage',
        prevPage: 'prevPage',
        totalPages: 'totalPages',
        hasPrevPage: 'hasPrevPage',
        hasNextPage: 'hasNextPage',
        prevLink: 'prevLink',
        nextLink: 'nextLink',
    },
};

productSchema.plugin(mongoosePaginate);


export const productModel=mongoose.model(
    "products",
    productSchema
)