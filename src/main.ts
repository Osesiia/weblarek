import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { ProductsModel } from './components/Models/ProductsModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { WebLarekApi } from './components/Communication/WebLarekApi';

const productsModel = new ProductsModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const webLarekApi = new WebLarekApi(new Api(API_URL));

// 1. Проверяем сохранение и чтение каталога.
productsModel.setItems(apiProducts.items);
console.log('Каталог: все товары', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
if (firstProduct) {
  console.log('Каталог: поиск товара по id', productsModel.getItemById(firstProduct.id));
  productsModel.setPreview(firstProduct);
  console.log('Каталог: товар для подробного просмотра', productsModel.getPreview());
  productsModel.setPreview(null);
  console.log('Каталог: просмотр сброшен', productsModel.getPreview());
}
console.log('Каталог: несуществующий товар', productsModel.getItemById('not-found'));

// 2. Проверяем методы корзины на доступных для покупки товарах.
const availableProducts = productsModel.getItems().filter((item) => item.price !== null);
const firstAvailableProduct = availableProducts[0];
const secondAvailableProduct = availableProducts[1];

if (firstAvailableProduct) {
  cartModel.addItem(firstAvailableProduct);
  cartModel.addItem(firstAvailableProduct); // Проверка отсутствия дублей.
  console.log('Корзина: товары после добавления', cartModel.getItems());
  console.log('Корзина: товар есть?', cartModel.hasItem(firstAvailableProduct.id));
  console.log('Корзина: количество товаров', cartModel.getCount());
  console.log('Корзина: сумма покупки', cartModel.getTotal());

  if (secondAvailableProduct) {
    cartModel.addItem(secondAvailableProduct);
    console.log('Корзина: сумма после второго товара', cartModel.getTotal());
  }

  cartModel.removeItem(firstAvailableProduct);
  console.log('Корзина: товары после удаления', cartModel.getItems());
  console.log('Корзина: удалённый товар отсутствует?', !cartModel.hasItem(firstAvailableProduct.id));
}
cartModel.clear();
console.log('Корзина: после очистки', cartModel.getItems());
console.log('Корзина: количество после очистки', cartModel.getCount());
console.log('Корзина: сумма после очистки', cartModel.getTotal());

// 3. Проверяем частичное обновление и валидацию данных покупателя.
console.log('Покупатель: ошибки до ввода данных', buyerModel.validate());
buyerModel.setData({ payment: 'card', address: 'Краснодар, ул. Примерная, 1' });
console.log('Покупатель: данные после первого шага', buyerModel.getData());
console.log('Покупатель: ошибки после первого шага', buyerModel.validate());
buyerModel.setData({ email: 'buyer@example.com', phone: '+79990000000' });
console.log('Покупатель: полностью заполненные данные', buyerModel.getData());
console.log('Покупатель: ошибки после заполнения', buyerModel.validate());
buyerModel.clear();
console.log('Покупатель: после очистки', buyerModel.getData());
console.log('Покупатель: ошибки после очистки', buyerModel.validate());

// 4. Получаем настоящий каталог с сервера и сохраняем его в модель.
webLarekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log('API: каталог с сервера сохранён в модели', productsModel.getItems());
  })
  .catch((error: unknown) => {
    console.error('API: ошибка загрузки каталога', error);
  });

// POST /order/ намеренно не вызываем: тестовый заказ не должен создавать
// реальную покупку. Метод есть в классе и будет использован в следующем спринте.
