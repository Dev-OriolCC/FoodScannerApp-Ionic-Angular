import { Product } from './product';

export interface CustomHttpResponse<T> {
    timestamp: Date;
    statusCode: number;
    reason?: string;
    message?: string;
    developerMessage?: string;
    data?: T;
}

export interface ProductState {
    product: Product;
}