import { Component } from '../base/Component';
import type { ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { formatPrice } from './Card';

/** Информация об успешно оформленном заказе. */
export class Success extends Component<ISuccessView> {
  private readonly totalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.closeButton.addEventListener('click', () => onClose());
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${formatPrice(value)}`;
  }
}
