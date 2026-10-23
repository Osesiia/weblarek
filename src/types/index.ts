export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/** Товар, полученный из каталога. */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Допустимые способы оплаты. */
export type TPayment = 'card' | 'cash';

/** Данные покупателя на этапе заполнения форм. */
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

/** Для каждого неверно заполненного поля возвращается сообщение. */
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

/** Ответ API на GET /product/. */
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

/** Данные POST /order/. Поля покупателя проверяются перед отправкой заказа. */
export interface TOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

/** Ответ API на POST /order/. */
export interface IOrderResponse {
  id: string;
  total: number;
}

/** Контракт модели каталога. */
export interface IProductsModel {
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItemById(id: IProduct['id']): IProduct | undefined;
  setPreview(item: IProduct | null): void;
  getPreview(): IProduct | null;
}

/** Контракт модели корзины. */
export interface ICartModel {
  getItems(): IProduct[];
  addItem(item: IProduct): void;
  removeItem(item: IProduct): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  hasItem(id: IProduct['id']): boolean;
}

/** Контракт модели покупателя. */
export interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TBuyerErrors;
}

/** Контракт слоя коммуникации. */
export interface IWebLarekApi {
  getProducts(): Promise<IProductsResponse>;
  createOrder(order: TOrderRequest): Promise<IOrderResponse>;
}
