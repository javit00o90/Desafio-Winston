import mongoose from 'mongoose';

export const cartsModel=mongoose.model(
    "carts",
    new mongoose.Schema({
            products: [{
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
                quantity: Number
            }]
        }
    )
)