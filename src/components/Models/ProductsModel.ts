import type { IProduct, IProductsModel } from '../../types';

/** Хранит каталог товаров и товар, открытый для подробного просмотра. */
export class ProductsModel implements IProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  /** Сохраняет каталог. */
  setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  /** Возвращает копию массива товаров, чтобы нельзя было изменить его снаружи. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Возвращает товар по id, либо undefined, если он не найден. */
  getItemById(id: IProduct['id']): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Устанавливает товар для подробного просмотра, null — закрыть просмотр. */
  setPreview(item: IProduct | null): void {
    this.preview = item;
  }

  /** Возвращает выбранный товар или null. */
  getPreview(): IProduct | null {
    return this.preview;
  }
}
