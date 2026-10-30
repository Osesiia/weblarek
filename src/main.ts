import './scss/styles.scss';
import './scss/sprint9.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { OrderStatusModel } from './components/Models/OrderStatusModel';
import { CatalogStatusModel } from './components/Models/CatalogStatusModel';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Catalog } from './components/View/Catalog';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import type { IPreviewView, IProduct, TFormFieldChanged, TOrderRequest, TPayment } from './types';
import { API_URL } from './utils/constants';
import { appEvents, makeEventHandler } from './utils/appEvents';
import { cloneTemplate, ensureElement } from './utils/utils';

// Presenter не хранит состояние приложения: только зависимости и обработчики.
const events = new EventEmitter();
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);
const orderStatusModel = new OrderStatusModel(events);
const catalogStatusModel = new CatalogStatusModel(events);
const webLarekApi = new WebLarekApi(new Api(API_URL));

const catalog = new Catalog(ensureElement<HTMLElement>('.gallery'));
const header = new Header(
  ensureElement<HTMLElement>('.header'),
  makeEventHandler(events, appEvents.basketOpen)
);
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  makeEventHandler(events, appEvents.modalClose)
);
const basket = new Basket(
  cloneTemplate<HTMLElement>('#basket'),
  makeEventHandler(events, appEvents.basketCheckout)
);
// Одна карточка превью, переиспользуемая для разных товаров.
const previewCard = new PreviewCard(
  cloneTemplate<HTMLElement>('#card-preview'),
  makeEventHandler(events, appEvents.previewToggle)
);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  makeEventHandler<TFormFieldChanged>(events, appEvents.orderInput),
  makeEventHandler(events, appEvents.orderNext),
  makeEventHandler<{ payment: TPayment }>(events, appEvents.orderPayment)
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  makeEventHandler<TFormFieldChanged>(events, appEvents.contactsInput),
  makeEventHandler(events, appEvents.contactsSubmit)
);
const success = new Success(
  cloneTemplate<HTMLElement>('#success'),
  makeEventHandler(events, appEvents.successClose)
);

// Открытие модального окна — предусмотренное заданием исключение из
// правила перерисовки View только по событию изменения модели.
function showModal(content: HTMLElement): void {
  modal.content = content;
  modal.open();
}

function renderCatalog(): void {
  const cards = productsModel.getItems().map((item) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>('#card-catalog'),
      makeEventHandler<{ id: string }>(events, appEvents.cardSelected, { id: item.id })
    );
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
  catalog.items = cards;
}

function renderBasket(): void {
  const cards = cartModel.getItems().map((item, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>('#card-basket'),
      makeEventHandler<{ id: string }>(events, appEvents.basketRemove, { id: item.id })
    );
    return card.render({ title: item.title, price: item.price, index: index + 1 });
  });
  basket.render({
    items: cards,
    total: cartModel.getTotal(),
    valid: cartModel.getCount() > 0,
  });
  header.counter = cartModel.getCount();
}

/** Выбирает текст и доступность кнопки по данным моделей, а не во View. */
function getPreviewButtonData(item: IProduct): Pick<IPreviewView, 'buttonText' | 'buttonDisabled'> {
  if (item.price === null) {
    return { buttonText: 'Недоступно', buttonDisabled: true };
  }
  return {
    buttonText: cartModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: false,
  };
}

function renderForms(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const orderStatus = orderStatusModel.getData();
  const orderErrors = [errors.payment, errors.address].filter((message): message is string => Boolean(message));
  const contactsErrors = [errors.email, errors.phone].filter((message): message is string => Boolean(message));
  const visibleContactsErrors = orderStatus.error
    ? [...contactsErrors, orderStatus.error]
    : contactsErrors;

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors: orderErrors,
    valid: orderErrors.length === 0,
  });
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    errors: visibleContactsErrors,
    valid: contactsErrors.length === 0 && orderStatus.status !== 'submitting',
  });
}

// Перерисовка существующих представлений — только по событиям моделей.
events.on(appEvents.catalogChanged, renderCatalog);
events.on(appEvents.catalogStatusChanged, () => {
  catalog.error = catalogStatusModel.getError();
});
events.on(appEvents.previewChanged, () => {
  const item = productsModel.getPreview();
  if (!item) return;
  showModal(previewCard.render({
    title: item.title,
    image: item.image,
    category: item.category,
    price: item.price,
    description: item.description,
    ...getPreviewButtonData(item),
  }));
});
events.on(appEvents.cartChanged, () => {
  renderBasket();
  const item = productsModel.getPreview();
  if (item) {
    const { buttonText, buttonDisabled } = getPreviewButtonData(item);
    previewCard.buttonText = buttonText;
    previewCard.buttonDisabled = buttonDisabled;
  }
});
events.on(appEvents.buyerChanged, renderForms);
events.on(appEvents.orderStatusChanged, () => {
  renderForms();
  const orderStatus = orderStatusModel.getData();
  if (orderStatus.status === 'success' && orderStatus.total !== null) {
    showModal(success.render({ total: orderStatus.total }));
  }
});

// Обработчики пользовательских действий меняют Model, а не перерисовывают View.
events.on<{ id: string }>(appEvents.cardSelected, ({ id }) => {
  const item = productsModel.getItemById(id);
  if (item) productsModel.setPreview(item);
});
events.on(appEvents.previewToggle, () => {
  const item = productsModel.getPreview();
  if (!item || item.price === null) return;
  if (cartModel.hasItem(item.id)) {
    cartModel.removeItem(item);
  } else {
    cartModel.addItem(item);
  }
  modal.close();
  productsModel.setPreview(null);
});
events.on(appEvents.basketOpen, () => {
  showModal(basket.render());
});
events.on<{ id: string }>(appEvents.basketRemove, ({ id }) => {
  const item = productsModel.getItemById(id);
  if (item) cartModel.removeItem(item);
});
events.on(appEvents.basketCheckout, () => {
  if (cartModel.getCount() === 0) return;
  showModal(orderForm.render());
});
events.on<{ payment: TPayment }>(appEvents.orderPayment, ({ payment }) => {
  buyerModel.setData({ payment });
});
events.on<TFormFieldChanged>(appEvents.orderInput, ({ field, value }) => {
  if (field === 'address') buyerModel.setData({ address: value });
});
events.on(appEvents.orderNext, () => {
  const errors = buyerModel.validate();
  if (errors.payment || errors.address) return;
  showModal(contactsForm.render());
});
events.on<TFormFieldChanged>(appEvents.contactsInput, ({ field, value }) => {
  if (field === 'email') buyerModel.setData({ email: value });
  if (field === 'phone') buyerModel.setData({ phone: value });
});
events.on(appEvents.contactsSubmit, () => {
  if (orderStatusModel.getData().status === 'submitting' || cartModel.getCount() === 0) return;
  const errors = buyerModel.validate();
  if (Object.keys(errors).length > 0) return;
  const buyer = buyerModel.getData();
  if (buyer.payment === null) return;

  const order: TOrderRequest = {
    payment: buyer.payment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((item) => item.id),
  };

  orderStatusModel.start();
  webLarekApi.createOrder(order)
    .then((response) => {
      cartModel.clear();
      buyerModel.clear();
      orderStatusModel.succeed(response.total);
    })
    .catch(() => {
      orderStatusModel.fail('Не удалось оформить заказ. Попробуйте ещё раз.');
    });
});
events.on(appEvents.modalClose, () => {
  // Само окно закрывает Modal; здесь сбрасываем только состояние модели.
  productsModel.setPreview(null);
});
events.on(appEvents.successClose, () => {
  modal.close();
  orderStatusModel.clear();
});

webLarekApi.getProducts()
  .then((response) => productsModel.setItems(response.items))
  .catch(() => catalogStatusModel.setError('Не удалось загрузить каталог товаров'));
