import type { ICartModel, IProduct } from '../../types';

/** Хранит товары, которые пользователь выбрал для покупки. */
export class CartModel implements ICartModel {
  private items: IProduct[] = [];

  /** Возвращает копию списка товаров в корзине. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Добавляет только доступный товар и не допускает повторного добавления. */
  addItem(item: IProduct): void {
    if (item.price === null || this.hasItem(item.id)) {
      return;
    }

    this.items.push(item);
  }

  /** Удаляет товар из корзины по id переданного товара. */
  removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
  }

  /** Полностью очищает корзину. */
  clear(): void {
    this.items = [];
  }

  /** Считает сумму в корзине, учитывая отсутствие цены у товара. */
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /** Возвращает количество товаров. */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет наличие товара по его id. */
  hasItem(id: IProduct['id']): boolean {
    return this.items.some((item) => item.id === id);
  }
}
