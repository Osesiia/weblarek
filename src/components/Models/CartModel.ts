import type { ICartModel, IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/appEvents';

/** Хранит выбранные товары без дублирования позиций. */
export class CartModel implements ICartModel {
  private items: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    if (item.price === null || this.hasItem(item.id)) return;
    this.items.push(item);
    this.events.emit(appEvents.cartChanged);
  }

  removeItem(item: IProduct): void {
    if (!this.hasItem(item.id)) return;
    this.items = this.items.filter((product) => product.id !== item.id);
    this.events.emit(appEvents.cartChanged);
  }

  clear(): void {
    if (this.items.length === 0) return;
    this.items = [];
    this.events.emit(appEvents.cartChanged);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: IProduct['id']): boolean {
    return this.items.some((item) => item.id === id);
  }
}
