export const validateProducts = (productsData) => {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
    const invalidFields = [];

    for (const productData of productsData) {
        const missingFields = requiredFields.filter(field => !(field in productData));

        if (missingFields.length > 0) {
            invalidFields.push(`Required fields are missing in a product: ${missingFields.join(', ')}`);
        }

        const typeValidation = {
            title: 'string',
            description: 'string',
            price: 'number',
            code: 'string',
            stock: 'number',
            category: 'string',
            status: 'boolean'
        };

        const productInvalidFields = Object.entries(typeValidation).reduce((acc, [field, type]) => {
            if (productData[field] !== undefined) {
                if (type === 'array' && !Array.isArray(productData[field])) {
                    acc.push(field);
                } else if (typeof productData[field] !== type) {
                    acc.push(field);
                }
            }
            return acc;
        }, []);

        if (!Array.isArray(productData.thumbnails)) {
            invalidFields.push('Invalid format for thumbnails field in a product');
        }

        if (productInvalidFields.length > 0) {
            invalidFields.push(`Invalid data types in product fields: ${productInvalidFields.join(', ')}`);
        }
    }

    return { error: invalidFields.join('\n') };
}

export const formatResponse = (result) => {
    return {
        status: 'success',
        payload: result.payload,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
    };
}

