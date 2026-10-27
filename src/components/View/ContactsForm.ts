import { Form } from './Form';
import type { IContactsFormView, TFormFieldChanged } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Шаг 2: электронная почта и телефон. */
export class ContactsForm extends Form<IContactsFormView> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onFieldChanged: (data: TFormFieldChanged) => void,
    onSubmit: () => void
  ) {
    super(container, onFieldChanged, onSubmit);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    if (this.emailInput.value !== value) this.emailInput.value = value;
  }

  set phone(value: string) {
    if (this.phoneInput.value !== value) this.phoneInput.value = value;
  }
}
