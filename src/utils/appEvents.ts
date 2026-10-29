import type { IEvents } from '../components/base/Events';

/** Единый словарь названий событий MVP. */
export const appEvents = {
  catalogChanged: 'catalog:changed',
  catalogStatusChanged: 'catalog-status:changed',
  orderStatusChanged: 'order-status:changed',
  previewChanged: 'preview:changed',
  cartChanged: 'cart:changed',
  buyerChanged: 'buyer:changed',
  cardSelected: 'card:selected',
  previewToggle: 'preview:toggle',
  basketOpen: 'basket:open',
  basketRemove: 'basket:remove',
  basketCheckout: 'basket:checkout',
  orderPayment: 'order:payment',
  orderInput: 'order:input',
  orderNext: 'order:next',
  contactsInput: 'contacts:input',
  contactsSubmit: 'contacts:submit',
  modalClose: 'modal:close',
  successClose: 'success:close',
} as const;

/** Генератор событий для передачи в конструкторы View. Presenter сам не вызывает emit. */
export function makeEventHandler<T extends object = Record<string, never>>(
  events: IEvents,
  eventName: string,
  context?: Partial<T>
): (data?: T) => void {
  return (data?: T) => events.emit(eventName, { ...data, ...context });
}
