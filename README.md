# Интернет-магазин «Web-Larёk»

Учебный интернет-магазин товаров для веб-разработчиков. Пользователь просматривает каталог, открывает карточку, добавляет товар в корзину, выбирает способ оплаты, указывает адрес и контакты, затем оформляет заказ через сервер. Проект продолжает стартовый набор практической работы и код моделей 8-го спринта.

**Стек:** TypeScript, HTML, SCSS, Vite; архитектура MVP (Model–View–Presenter); брокер событий EventEmitter.

## Запуск

1. Установить Node.js и зависимости: `npm install`.
2. Создать файл `.env` в корне проекта со строкой `VITE_API_ORIGIN=https://larek.ffapi.ru` (или скопировать `.env.example`, если там уже указан адрес).
3. Запуск разработки: `npm run dev`.
4. Проверка перед сдачей: `npm run build`.

## Структура проекта

```text
index.html                  HTML-страница и шаблоны компонентов
src/
  main.ts                   Презентер: подписки на события, сценарии приложения
  types/index.ts            Все интерфейсы и типы приложения
  components/
    base/
      Component.ts          Базовый абстрактный компонент представления
      Events.ts             Брокер событий
      Api.ts                Универсальные HTTP-запросы
    Models/
      ProductsModel.ts      Каталог и выбранный товар
      CartModel.ts          Корзина
      BuyerModel.ts         Покупатель и проверка заполнения
      OrderStatusModel.ts   Статус асинхронной отправки заказа
      CatalogStatusModel.ts Ошибки загрузки каталога
    Communication/
      WebLarekApi.ts        Запросы каталога и оформления заказа
    View/
      Catalog.ts            Каталог товаров и сообщение об ошибке загрузки
      Header.ts             Кнопка корзины и счётчик
      Modal.ts              Универсальное модальное окно
      Card.ts               Общая для трёх карточек логика (название, цена)
      CardMedia.ts          Изображение и категория через композицию
      CatalogCard.ts        Карточка каталога
      PreviewCard.ts        Карточка подробного просмотра
      BasketCard.ts         Карточка товара корзины
      Basket.ts             Корзина
      Form.ts               Базовая форма
      OrderForm.ts          Оплата и адрес
      ContactsForm.ts       Контакты
      Success.ts            Экран успешного заказа
  utils/
    constants.ts            API_URL, CDN_URL, categoryMap
    appEvents.ts            Названия и фабрика обработчиков событий
    utils.ts                Работа с DOM и шаблонами
  scss/
    styles.scss             Стили стартового набора
    sprint9.scss            Блокировка прокрутки при открытом модальном окне
```

## Архитектура MVP

- **Model** (`ProductsModel`, `CartModel`, `BuyerModel`, `OrderStatusModel`, `CatalogStatusModel`) хранит данные и уведомляет об изменениях через EventEmitter. Состояния загрузки каталога и отправки заказа также находятся в моделях. У моделей нет DOM и HTTP-запросов.
- **View** (`Catalog`, `Header`, `Modal`, карточки, `Basket`, формы и `Success`) отображает переданные из презентера данные, не хранит данные магазина. View кэширует принадлежащие компоненту DOM-элементы в конструкторе, единожды назначает обработчики пользовательских действий. Из обработчиков вызываются переданные в конструкторе функции, генерирующие события.
- **Presenter** (`src/main.ts`) связывает слои через подписки на события: запрашивает данные у моделей, формирует объекты для View, открывает окна и вызывает WebLarekApi для отправки заказа. Презентер сам не вызывает `emit` и не содержит переменных состояния `activeView` или `isSubmitting`.
- **Communication** (`WebLarekApi`) содержит сетевую логику, использует базовый `Api` через композицию и зависимость от `IApi`. Запросы из View и моделей не выполняются.

Поток: действие пользователя → View публикует событие → Presenter обрабатывает событие и вызывает Model → Model публикует событие изменения → Presenter получает данные Model и обновляет View. При открытии окна Presenter передает компоненту данные, полученные от модели.

## Типы данных (`src/types/index.ts`)

| Тип | Значение |
| --- | --- |
| `IProduct` | `id`, `description`, `image`, `title`, `category`: `string`, `price: number \| null`. |
| `TPayment` | `'card' \| 'cash'` — допустимые способы оплаты. |
| `IBuyer` | `payment: TPayment \| null`, `address`, `email`, `phone`: `string`. `null` означает отсутствие выбранной оплаты. |
| `TBuyerErrors` | `Partial<Record<keyof IBuyer, string>>` — ошибки валидации. |
| `IProductsResponse` | `{ total: number; items: IProduct[] }`. |
| `TOrderRequest` | Расширяет `IBuyer`: `total: number`, `items: string[]` — ID товаров. Поле `payment` типизируется как `TPayment \| null`; презентер перед запросом проверяет, что оплата выбрана. |
| `IOrderResponse` | `{ id: string; total: number }`. |
| `IApi`, `IProductsModel`, `ICartModel`, `IBuyerModel`, `IWebLarekApi` | Публичные контракты сетевого слоя и моделей. |
| `ICatalogCardView` | `Pick<IProduct, 'title' \| 'price' \| 'image' \| 'category'>`. |
| `IPreviewView` | Поля каталожной карточки и `description: string`, `selected: boolean`, `available: boolean`. |
| `IBasketCardView` | `title: string`, `price: number \| null`, `index: number`. |
| `ICatalogView` | `items: HTMLElement[]` — DOM-карточки каталога. |
| `IHeaderView` | `counter: number` — счётчик корзины. |
| `IModalView` | `content: HTMLElement`. |
| `IBasketView` | `items: HTMLElement[]`, `total: number`, `valid: boolean`. |
| `IFormView` | `valid: boolean`, `errors: string[]`. |
| `IOrderFormView` | Поля `IFormView`, `payment: TPayment \| null`, `address: string`. |
| `IContactsFormView` | Поля `IFormView`, `email: string`, `phone: string`. |
| `ISuccessView` | `total: number`. |
| `TFormFieldChanged` | `{ field: string; value: string }`, событие текстового поля. |
| `TOrderStatus` | `{ status: 'idle' \| 'submitting' \| 'error' \| 'success'; error: string; total: number \| null }`. |
| `IOrderStatusModel` | Публичный контракт состояния отправки заказа. |
| `ApiPostMethods` | `'POST' \| 'PUT' \| 'DELETE'`. |

**Важно:** Типы и контракты 8-го спринта сохранены. Для View добавлены производные типы, основа моделей не подстраивается под интерфейс.

## Базовый код

### `Component<T>`

Назначение: общий предок компонентов отображения, абстрактный класс. Конструктор `protected constructor(container: HTMLElement)` сохраняет `protected readonly container: HTMLElement`. Метод `render(data?: Partial<T>): HTMLElement` присваивает переданные значения свойствам-сеттерам и возвращает корневой элемент. `protected setImage(element: HTMLImageElement, src: string, alt?: string): void` устанавливает изображение и его alt.

### `Api`

Назначение: универсальный HTTP-клиент. Конструктор `constructor(baseUrl: string, options: RequestInit = {})`, поля `readonly baseUrl: string`, `protected options: RequestInit`. Методы `get<T extends object>(uri: string): Promise<T>`, `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>`, `protected handleResponse<T>(response: Response): Promise<T>`.

### `EventEmitter implements IEvents`

Назначение: брокер событий. Конструктор без параметров. Поле `_events: Map<string | RegExp, Set<Function>>` хранит подписки. Методы `on<T extends object>(event: string | RegExp, callback: (data:T)=>void): void`, `off(event, callback): void`, `emit<T extends object>(event: string, data?: T): void`, `trigger<T extends object>(event: string, context?: Partial<T>): (data:T)=>void`, `onAll(callback):void`, `offAll():void`.

### `WebLarekApi implements IWebLarekApi`

Назначение: запросы к серверу магазина. Конструктор `constructor(api: IApi)`, приватное поле `readonly api: IApi`. `getProducts(): Promise<IProductsResponse>` вызывает `GET /product/`; `createOrder(order: TOrderRequest): Promise<IOrderResponse>` отправляет `POST /order/`.

## Модели данных

### `ProductsModel implements IProductsModel`

Назначение: хранение каталога и выбранной для просмотра карточки. Конструктор `constructor(events: IEvents)`; приватные поля `items: IProduct[]`, `preview: IProduct | null`, `events: IEvents`.

- `setItems(items: IProduct[]): void` сохраняет каталог, событие `catalog:changed`.
- `getItems(): IProduct[]` возвращает копию списка.
- `getItemById(id: string): IProduct | undefined` ищет товар.
- `setPreview(item: IProduct | null): void` выбирает/сбрасывает карточку, событие `preview:changed`.
- `getPreview(): IProduct | null` возвращает выбор.

### `CartModel implements ICartModel`

Назначение: хранение выбранных товаров и расчёт итогов. Конструктор `constructor(events: IEvents)`; приватные поля `items: IProduct[]`, `events: IEvents`.

- `getItems(): IProduct[]` копия корзины.
- `addItem(item: IProduct): void` добавляет товар и генерирует `cart:changed`. Решение о допустимости товара и проверку дублей выполняет презентер.
- `removeItem(item: IProduct): void` удаляет по ID; при удалении — `cart:changed`.
- `clear(): void` очищает непустую корзину, `cart:changed`.
- `getTotal(): number` общая цена.
- `getCount(): number` количество.
- `hasItem(id: string): boolean` проверка наличия по ID.

### `BuyerModel implements IBuyerModel`

Назначение: хранение покупателя и валидация. Конструктор `constructor(events: IEvents)`; поля `data: IBuyer` (приватное), `events: IEvents` (приватное).

- `setData(data: Partial<IBuyer>): void` частичное обновление, `buyer:changed`.
- `getData(): IBuyer` копия покупателя.
- `clear(): void` сброс, `buyer:changed`.
- `validate(): TBuyerErrors` проверка непустого адреса, способа оплаты, email и телефона. Формат email/телефона не проверяется, так как задание требует проверку заполнения.

### `OrderStatusModel implements IOrderStatusModel`

Назначение: хранение статуса отправки заказа вне презентера. Конструктор `constructor(events: IEvents)`; приватные поля `data: TOrderStatus`, `events: IEvents`. Методы `getData(): TOrderStatus` (копия), `start(): void` (отправка началась), `fail(message: string): void` (ошибка), `succeed(total: number): void` (успех), `clear(): void` (сброс). Каждый переход генерирует `order-status:changed`, если `start` не был повторно вызван во время отправки.

### `CatalogStatusModel`

Назначение: хранит ошибку сетевой загрузки каталога отдельно от View. Конструктор `constructor(events: IEvents)`; приватные поля `error: string`, `events: IEvents`. Методы `getError(): string`, `setError(value: string): void` (генерирует `catalog-status:changed`).

## Классы представления (View)

Сеттеры ниже реализуют программный интерфейс компонентов. Отдельные виды страницы (`Header` и `Catalog`) не управляют DOM друг друга. Все элементы разметки, с которыми работает класс, ищутся в его конструкторе и сохраняются; слушатели устанавливаются один раз. Все компоненты наследуют `render(data?: Partial<T>): HTMLElement` от `Component<T>`; он также работает без аргумента и возвращает DOM-элемент.

### `Catalog extends Component<ICatalogView>`

Назначение: только галерея каталога. Конструктор `constructor(container: HTMLElement)` (корень `.gallery`); наследуемое поле `container: HTMLElement`. Сеттер `items: HTMLElement[]` заменяет карточки, сеттер `error: string` показывает ошибку загрузки.

### `Header extends Component<IHeaderView>`

Назначение: только шапка с корзиной. Конструктор `constructor(container: HTMLElement, onBasketOpen: () => void)` (корень `.header`); поля `basketCounter: HTMLElement`, `basketButton: HTMLButtonElement`. Сеттер `counter: number`; нажатие кнопки вызывает `onBasketOpen`.

### `Modal extends Component<IModalView>`

Назначение: универсальная оболочка для любого компонента, не имеет дочерних классов. Конструктор `constructor(container: HTMLElement, onClose: () => void)`; поля `modalContent: HTMLElement`, `closeButton: HTMLButtonElement`. Сеттер `content: HTMLElement` меняет содержимое. Методы `open(): void` и `close(): void` добавляют/снимают `modal_active`; `close` очищает содержимое. Клик по крестику и по фону вызывает `onClose`. Прокрутка блокируется стилем `sprint9.scss`.

### `Card<T> extends Component<T>` (абстрактный класс)

Назначение: общие поля трёх шаблонов карточек. Конструктор `protected constructor(container: HTMLElement)`; поля `titleElement: HTMLElement` и `priceElement: HTMLElement`. Сеттеры `title: string`, `price: number | null`. В базовом классе нет элементов изображения и категории: они отсутствуют у карточки корзины. Экспортируемая функция `formatPrice(value: number | null): string` форматирует цену.

### `CardMedia` (вспомогательный класс композиции)

Назначение: общий для `CatalogCard` и `PreviewCard` блок изображения и категории (в корзине этих блоков нет). Конструктор `constructor(container: HTMLElement)`; поля `imageElement: HTMLImageElement`, `categoryElement: HTMLElement`. Методы `setImage(value: string): void` (CDN_URL), `setAlt(title: string): void`, `setCategory(value: string): void` (categoryMap и модификаторы `card__category_*`).

### `CatalogCard extends Card<ICatalogCardView>`

Назначение: карточка в галерее. Конструктор `constructor(container: HTMLElement, onSelect: () => void)`. Слушатель клика вызывает `onSelect`; поле `media: CardMedia`. Сеттеры `title: string` (с вызовом родителя и обновлением alt), `image: string`, `category: string`; `price: number | null` унаследован.

### `PreviewCard extends Card<IPreviewView>`

Назначение: подробности товара. Конструктор `constructor(container: HTMLElement, onToggle: () => void)`; поля `media: CardMedia`, `descriptionElement: HTMLElement`, `actionButton: HTMLButtonElement`. Дополнительные сеттеры `title: string`, `image: string`, `category: string`, `description: string`, `selected: boolean` (Купить/Удалить из корзины), `available: boolean` (блокирует и пишет «Недоступно» для товара без цены). Клик вызывает `onToggle`.

### `BasketCard extends Card<IBasketCardView>`

Назначение: строка товара в корзине. Конструктор `constructor(container: HTMLElement, onDelete: () => void)`; поля `indexElement: HTMLElement`, `deleteButton: HTMLButtonElement`. Сеттер `index: number`, унаследованы `title`, `price`. Клик на удаление вызывает `onDelete`.

### `Basket extends Component<IBasketView>`

Назначение: список покупок, сумма и оформление. Конструктор `constructor(container: HTMLElement, onCheckout: () => void)`; поля `listElement: HTMLElement`, `totalElement: HTMLElement`, `checkoutButton: HTMLButtonElement`. Сеттеры: `items: HTMLElement[]` (при отсутствии выводит «Корзина пуста»), `total: number` (сумма), `valid: boolean` (кнопка доступна, когда презентер передаёт true). Клик вызывает `onCheckout`.

### `Form<T extends IFormView> extends Component<T>` (абстрактный класс)

Назначение: общая логика отображения двух форм. Конструктор `protected constructor(container: HTMLFormElement, onFieldChanged: (data: TFormFieldChanged) => void, onSubmit: () => void)`; поля `submitButton: HTMLButtonElement`, `errorElement: HTMLElement`. Сеттеры: `valid: boolean` (активность кнопки), `errors: string[]` (тексты ошибок). Слушатели `input` и `submit` регистрируются единожды и передают действия в колбэки.

### `OrderForm extends Form<IOrderFormView>`

Назначение: выбор оплаты, адрес. Конструктор `constructor(container: HTMLFormElement, onFieldChanged: (data: TFormFieldChanged)=>void, onSubmit: ()=>void, onPayment: (data:{payment: 'card'|'cash'})=>void)`; поля `addressInput: HTMLInputElement`, `paymentButtons: HTMLButtonElement[]`. Сеттеры `address: string`, `payment: TPayment | null` (класс `button_alt-active`), унаследованные `valid`, `errors`. Колбэки сообщают о выборе оплаты, изменении адреса и переходе далее.

### `ContactsForm extends Form<IContactsFormView>`

Назначение: второй шаг заказа. Конструктор `constructor(container: HTMLFormElement, onFieldChanged: (data:TFormFieldChanged)=>void, onSubmit: ()=>void)`; поля `emailInput: HTMLInputElement`, `phoneInput: HTMLInputElement`. Сеттеры `email: string`, `phone: string`, `valid: boolean`, `errors: string[]`.

### `Success extends Component<ISuccessView>`

Назначение: успешное оформление. Конструктор `constructor(container: HTMLElement, onClose: () => void)`; поля `totalElement: HTMLElement`, `closeButton: HTMLButtonElement`. Сеттер `total: number` выводит списанную сумму. Кнопка вызывает `onClose`.

## События приложения

События задаются в `src/utils/appEvents.ts`; `makeEventHandler<T>(events: IEvents, eventName: string, context?: Partial<T>): (data?: T)=>void` создаёт обработчик для передачи View и объединяет переданные поля с контекстом.

| Событие | Источник | Данные | Действие презентера |
| --- | --- | --- | --- |
| `catalog:changed` | ProductsModel | — | Получает товары и показывает каталог. |
| `catalog-status:changed` | CatalogStatusModel | — | Показывает ошибку загрузки каталога. |
| `order-status:changed` | OrderStatusModel | — | Обновляет форму при отправке/ошибке и показывает Success после ответа сервера. |
| `preview:changed` | ProductsModel | — | Открывает выбранный товар. |
| `cart:changed` | CartModel | — | Обновляет счётчик, корзину и состояние кнопки существующего превью. |
| `buyer:changed` | BuyerModel | — | Обновляет формы, ошибки и состояние кнопок. |
| `card:selected` | CatalogCard | `{id: string}` | Сохраняет выбранный товар в модели. |
| `preview:toggle` | PreviewCard | — | Добавляет/удаляет товар, закрывает окно. |
| `basket:open` | Header | — | Показывает корзину. |
| `basket:remove` | BasketCard | `{id: string}` | Удаляет товар через CartModel. |
| `basket:checkout` | Basket | — | Открывает OrderForm при непустой корзине. |
| `order:payment` | OrderForm | `{payment: 'card'|'cash'}` | Обновляет оплату в BuyerModel. |
| `order:input` | OrderForm | `{field: string, value: string}` | Обновляет адрес. |
| `order:next` | OrderForm | — | При валидном шаге открывает ContactsForm. |
| `contacts:input` | ContactsForm | `{field: string, value: string}` | Обновляет email или телефон. |
| `contacts:submit` | ContactsForm | — | Проверяет заказ и отправляет POST, после успеха очищает модели и открывает Success. |
| `modal:close` | Modal | — | Закрывает модальное окно. |
| `success:close` | Success | — | Закрывает успешное оформление. |

Все генерируемые события обрабатываются в `main.ts`.

## Презентер (`src/main.ts`)

Использован один презентер **без отдельного класса**, потому что приложение одностраничное. Он создаёт `EventEmitter`, модели данных (в том числе состояния сетевых запросов), HTTP-клиент и экземпляры View, затем регистрирует обработчики событий и запрашивает каталог через API. Каталог, счётчик корзины, корзина и формы обновляются **при обработке событий моделей**. При открытии модального окна презентер передаёт подготовленный компонент. `PreviewCard` создаётся один раз и повторно используется для каждого выбранного товара; остальные карточки создаются из исходных HTML-шаблонов. В презентере нет локального `activeView` или `isSubmitting`.

Покупка: открыть карточку → добавить товар → открыть корзину → выбрать способ оплаты и ввести адрес → перейти в контакты → заполнить email/телефон → `POST /order/`. Только **после успешного ответа** очищаются CartModel и BuyerModel и показывается сумма из ответа сервера. При ошибке сети данные не теряются, сообщение об ошибке остаётся видимым, можно повторить попытку. Повторный запрос блокируется статусом `submitting` из `OrderStatusModel`; при неудаче статус сменяется на `error` и кнопка повторной отправки становится доступна, если поля заполнены.

## Проверка перед ревью

1. Выполнить `npm run build`, убедиться в отсутствии ошибок.
2. Проверить каталог, просмотр, покупку и удаление, товар без цены, счётчик корзины.
3. Проверить пустую корзину, сумму, блокировку «Оформить».
4. Проверить ошибки и кнопки на обоих шагах заказа, правильную отправку заказа, очистку данных после успеха.
5. Проверить закрытие окон по крестику и фону, отсутствие прокрутки страницы при открытом окне.
6. Проверить сетевое соединение с API, что `.env` задаёт `VITE_API_ORIGIN`.
