import './scss/styles.scss';
import './scss/sprint9.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsModel } from './components/Models/ProductsModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import type { IProduct, TActiveView, TFormFieldChanged, TOrderRequest, TPayment } from './types';
import { API_URL } from './utils/constants';
import { appEvents, makeEventHandler } from './utils/appEvents';
import { cloneTemplate, ensureElement } from './utils/utils';

// Presenter: связывает события моделей и представлений. Сам не генерирует события.
const events = new EventEmitter();
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);
const webLarekApi = new WebLarekApi(new Api(API_URL));

const page = new Page(
  ensureElement<HTMLElement>('.page__wrapper'),
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
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  makeEventHandler<TFormFieldChanged>(events, appEvents.orderInput),
  makeEventHandler(events, appEvents.orderNext),
  makeEventHandler<{ payment: Exclude<TPayment, null> }>(events, appEvents.orderPayment)
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

let activeView: TActiveView = null;
let isSubmitting = false;

function openView(name: Exclude<TActiveView, null>, content: HTMLElement): void {
  activeView = name;
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
  page.catalog = cards;
}

function createPreview(item: IProduct): HTMLElement {
  const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>('#card-preview'),
    makeEventHandler(events, appEvents.previewToggle)
  );
  return previewCard.render({
    title: item.title,
    image: item.image,
    category: item.category,
    price: item.price,
    description: item.description,
    selected: cartModel.hasItem(item.id),
    available: item.price !== null,
  });
}

function renderBasket(): void {
  const cards = cartModel.getItems().map((item, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>('#card-basket'),
      makeEventHandler<{ id: string }>(events, appEvents.basketRemove, { id: item.id })
    );
    return card.render({ title: item.title, price: item.price, index: index + 1 });
  });
  basket.render({ items: cards, total: cartModel.getTotal(), count: cartModel.getCount() });
}

function renderForms(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const orderErrors = [errors.payment, errors.address].filter((message): message is string => Boolean(message));
  const contactsErrors = [errors.email, errors.phone].filter((message): message is string => Boolean(message));

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors: orderErrors,
    valid: orderErrors.length === 0,
  });
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    errors: contactsErrors,
    valid: contactsErrors.length === 0 && !isSubmitting,
  });
}

// Изменения в моделях — единственный источник обновлений интерфейса.
events.on(appEvents.catalogChanged, renderCatalog);
events.on(appEvents.previewChanged, () => {
  const item = productsModel.getPreview();
  if (item) openView('preview', createPreview(item));
});
events.on(appEvents.cartChanged, () => {
  page.counter = cartModel.getCount();
  if (activeView === 'basket') renderBasket();
  if (activeView === 'preview') {
    const item = productsModel.getPreview();
    if (item) modal.content = createPreview(item);
  }
});
events.on(appEvents.buyerChanged, renderForms);

// Действия пользователя: Presenter обращается только к публичным методам Model и View.
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
  activeView = null;
});
events.on(appEvents.basketOpen, () => {
  renderBasket();
  openView('basket', basket.render());
});
events.on<{ id: string }>(appEvents.basketRemove, ({ id }) => {
  const item = productsModel.getItemById(id);
  if (item) cartModel.removeItem(item);
});
events.on(appEvents.basketCheckout, () => {
  if (cartModel.getCount() === 0) return;
  renderForms();
  openView('order', orderForm.render());
});
events.on<{ payment: Exclude<TPayment, null> }>(appEvents.orderPayment, ({ payment }) => {
  buyerModel.setData({ payment });
});
events.on<TFormFieldChanged>(appEvents.orderInput, ({ field, value }) => {
  if (field === 'address') buyerModel.setData({ address: value });
});
events.on(appEvents.orderNext, () => {
  const errors = buyerModel.validate();
  if (errors.payment || errors.address) return;
  renderForms();
  openView('contacts', contactsForm.render());
});
events.on<TFormFieldChanged>(appEvents.contactsInput, ({ field, value }) => {
  if (field === 'email') buyerModel.setData({ email: value });
  if (field === 'phone') buyerModel.setData({ phone: value });
});
events.on(appEvents.contactsSubmit, () => {
  if (isSubmitting || cartModel.getCount() === 0) return;
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

  isSubmitting = true;
  contactsForm.valid = false;
  webLarekApi.createOrder(order)
    .then((response) => {
      cartModel.clear();
      buyerModel.clear();
      openView('success', success.render({ total: response.total }));
    })
    .catch(() => {
      contactsForm.errors = ['Не удалось оформить заказ. Попробуйте ещё раз.'];
    })
    .finally(() => {
      isSubmitting = false;
      if (activeView === 'contacts') renderForms();
    });
});
events.on(appEvents.modalClose, () => {
  modal.close();
  activeView = null;
  productsModel.setPreview(null);
  // Закрытие окна не изменяет данные корзины и покупателя.
});
events.on(appEvents.successClose, () => {
  modal.close();
  activeView = null;
});

page.counter = cartModel.getCount();
webLarekApi.getProducts()
  .then((response) => productsModel.setItems(response.items))
  .catch(() => {
    page.error = 'Не удалось загрузить каталог товаров';
  });
