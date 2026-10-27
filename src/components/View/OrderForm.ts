
import { Form } from './Form';
import type {
  IOrderFormView,
  TFormFieldChanged,
  TPayment
} from '../../types';
import { ensureElement } from '../../utils/utils';

/** Шаг 1: способ оплаты и адрес. */
export class OrderForm extends Form<IOrderFormView> {
  private readonly addressInput: HTMLInputElement;
  private readonly paymentButtons: HTMLButtonElement[];

  constructor(
    container: HTMLFormElement,
    onFieldChanged: (data: TFormFieldChanged) => void,
    onSubmit: () => void,
    onPayment: (data: { payment: TPayment }) => void
  ) {
    super(container, onFieldChanged, onSubmit);

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    this.paymentButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        '.order__buttons button'
      )
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment: TPayment =
          button.name === 'card' ? 'card' : 'cash';

        onPayment({ payment });
      });
    });
  }

  set address(value: string) {
    if (this.addressInput.value !== value) {
      this.addressInput.value = value;
    }
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        'button_alt-active',
        button.name === value
      );
    });
  }
}
