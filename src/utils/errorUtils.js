export class CustomError extends Error{
    constructor(name, message, statusCode, description){
        super(message)
        this.name=name
        this.code=statusCode
        this.description=description
    }
}

export class ErrorCodes {
    static USER_NOT_FOUND = {
        code: 404,
        name: 'Not Found',
        message: 'User not found.',
    };
    
    static USER_ALREADY_EXISTS = {
        code: 409,
        name: 'Conflict',
        message: 'User already exists.',
    };
    
    static CART_NOT_FOUND = {
        code: 404,
        name: 'Not Found',
        message: 'Cart not found.',
    };

    static PRODUCT_NOT_FOUND = {
        code: 404,
        name: 'Not Found',
        message: 'Product not found.',
    };

    static INVALID_PRODUCT_ID = {
        code: 400,
        name: 'Bad Request',
        message: 'Invalid product ID.',
    };

    static CART_ITEM_NOT_FOUND = {
        code: 404,
        name: 'Not Found',
        message: 'Item not found in the cart.',
    };

    static INVALID_USER_INPUT = {
        code: 400,
        name: 'Bad Request',
        message: 'Invalid user input.',
    }; 

    static INVALID_USER_ID = {
        code: 400,
        name: 'Bad Request',
        message: 'Invalid user ID.',
    };

    static INVALID_CART_ID = {
        code: 400,
        name: 'Bad Request',
        message: 'Invalid cart ID.',
    };
    
    
    static NOT_AUTHORIZED = {
        code: 401,
        name: 'Unauthorized',
        message: 'Not authorized.',
    };
    
    static NOT_FOUND = {
        code: 404,
        name: 'Not Found',
        message: 'Not found.',
    };
    
    static INTERNAL_SERVER_ERROR = {
        code: 500,
        name: 'Internal Server Error',
        message: 'Internal server error.',
    };
    
    static NOT_IMPLEMENTED = {
        code: 501,
        name: 'Not Implemented',
        message: 'Not implemented.',
    };
    
    static BAD_GATEWAY = {
        code: 502,
        name: 'Bad Gateway',
        message: 'Bad gateway.',
    };
    
    static SERVICE_UNAVAILABLE = {
        code: 503,
        name: 'Service Unavailable',
        message: 'Service unavailable.',
    };
    
    static GATEWAY_TIMEOUT = {
        code: 504,
        name: 'Gateway Timeout',
        message: 'Gateway timeout.',
    };
}