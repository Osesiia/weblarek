// Типы 8-го спринта сохранены без изменений.
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

/** Данные, отправляемые на POST /order/. У заказа оплата уже выбрана. */
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

// Новые типы слоя View, основанные на уже объявленных типах 8-го спринта.
export type ICatalogCardView = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>;
export type IPreviewView = Pick<IProduct, 'title' | 'price' | 'image' | 'category' | 'description'> & {
  selected: boolean;
  available: boolean;
};
export type IBasketCardView = Pick<IProduct, 'title' | 'price'> & { index: number };
export interface IBasketView {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}
export interface ICatalogView {
  items: HTMLElement[];
  error: string;
}
export interface IHeaderView {
  counter: number;
}
export interface IModalView {
  content: HTMLElement;
}
export interface IFormView {
  valid: boolean;
  errors: string[];
}
export interface IOrderFormView extends IFormView {
  payment: TPayment | null;
  address: string;
}
export interface IContactsFormView extends IFormView {
  email: string;
  phone: string;
}
export interface ISuccessView {
  total: number;
}
export interface TFormFieldChanged {
  field: string;
  value: string;
}
/** Статус отправки заказа, хранится в отдельной Model. */
export type TOrderStatus = {
  status: 'idle' | 'submitting' | 'error' | 'success';
  error: string;
  total: number | null;
};
export interface IOrderStatusModel {
  getData(): TOrderStatus;
  start(): void;
  fail(message: string): void;
  succeed(total: number): void;
  clear(): void;
}
