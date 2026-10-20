import type {
  IApi,
  IOrderResponse,
  IProductsResponse,
  IWebLarekApi,
  TOrderRequest,
} from '../../types';

const PRODUCTS_ENDPOINT = '/product/';
const ORDER_ENDPOINT = '/order/';

/** Адаптирует универсальный клиент IApi под сервер интернет-магазина. */
export class WebLarekApi implements IWebLarekApi {
  constructor(private readonly api: IApi) {}

  /** GET /product/ — получает объект с массивом товаров. */
  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>(PRODUCTS_ENDPOINT);
  }

  /** POST /order/ — отправляет заказ и получает подтверждение. */
  createOrder(order: TOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(ORDER_ENDPOINT, order);
  }
}
