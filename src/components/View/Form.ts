import { Component } from '../base/Component';
import type { IFormView, TFormFieldChanged } from '../../types';
import { ensureElement } from '../../utils/utils';

/** База для двух форм: общая валидация, отображение ошибок и события. */
export abstract class Form<T extends IFormView> extends Component<T> {
  private readonly submitButton: HTMLButtonElement;
  private readonly errorElement: HTMLElement;

  protected constructor(
    container: HTMLFormElement,
    onFieldChanged: (data: TFormFieldChanged) => void,
    onSubmit: () => void
  ) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

    container.addEventListener('input', (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && container.contains(target)) {
        onFieldChanged({ field: target.name, value: target.value });
      }
    });
    container.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      if (!this.submitButton.disabled) onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorElement.textContent = value.join('; ');
  }
}
