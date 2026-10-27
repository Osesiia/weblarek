import type { IProduct, IProductsModel } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/appEvents';

/** Хранит каталог товаров и товар, выбранный для подробного просмотра. */
export class ProductsModel implements IProductsModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit(appEvents.catalogChanged);
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItemById(id: IProduct['id']): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(item: IProduct | null): void {
    this.preview = item;
    this.events.emit(appEvents.previewChanged);
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
