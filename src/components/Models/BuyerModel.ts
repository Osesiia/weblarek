import type { IBuyer, IBuyerModel, TBuyerErrors } from '../../types';

const EMPTY_BUYER: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: '',
};

/** Хранит сведения о покупателе и проверяет заполнение полей. */
export class BuyerModel implements IBuyerModel {
  private data: IBuyer = { ...EMPTY_BUYER };

  /** Обновляет лишь переданные поля, сохраняя остальные значения. */
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  /** Возвращает копию всех данных покупателя. */
  getData(): IBuyer {
    return { ...this.data };
  }

  /** Сбрасывает все данные покупателя. */
  clear(): void {
    this.data = { ...EMPTY_BUYER };
  }

  /** Возвращает сообщения только для незаполненных полей. */
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
