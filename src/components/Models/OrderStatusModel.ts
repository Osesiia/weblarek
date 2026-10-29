import type { IOrderStatusModel, TOrderStatus } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/appEvents';

/** Состояние асинхронного оформления принадлежит Model, не Presenter. */
export class OrderStatusModel implements IOrderStatusModel {
  private data: TOrderStatus = { status: 'idle', error: '', total: null };

  constructor(private readonly events: IEvents) {}

  getData(): TOrderStatus {
    return { ...this.data };
  }

  start(): void {
    if (this.data.status === 'submitting') return;
    this.data = { status: 'submitting', error: '', total: null };
    this.events.emit(appEvents.orderStatusChanged);
  }

  fail(message: string): void {
    this.data = { status: 'error', error: message, total: null };
    this.events.emit(appEvents.orderStatusChanged);
  }

  succeed(total: number): void {
    this.data = { status: 'success', error: '', total };
    this.events.emit(appEvents.orderStatusChanged);
  }

  clear(): void {
    this.data = { status: 'idle', error: '', total: null };
    this.events.emit(appEvents.orderStatusChanged);
  }
}
