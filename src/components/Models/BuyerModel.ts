import type { IBuyer, IBuyerModel, TBuyerErrors } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/appEvents';

const EMPTY_BUYER: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: '',
};

/** Хранит сведения о покупателе и возвращает ошибки заполнения. */
export class BuyerModel implements IBuyerModel {
  private data: IBuyer = { ...EMPTY_BUYER };

  constructor(private readonly events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit(appEvents.buyerChanged);
  }

  getData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
    this.data = { ...EMPTY_BUYER };
    this.events.emit(appEvents.buyerChanged);
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (this.data.payment === null) {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this.data.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.data.email.trim()) {
      errors.email = 'Укажите электронную почту';
    }
    if (!this.data.phone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }
    return errors;
  }
}
