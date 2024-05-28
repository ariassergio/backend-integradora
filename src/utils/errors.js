export class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

export const ERROR_CODES = {
    PRODUCT_CREATION_ERROR: 'PRODUCT_CREATION_ERROR',
    PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
    CART_UPDATE_ERROR: 'CART_UPDATE_ERROR',
    CART_NOT_FOUND: 'CART_NOT_FOUND'
};
