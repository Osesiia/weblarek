import { Component } from '../base/Component';
import type { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { formatPrice } from './Card';

/** Список покупок с итогом и кнопкой перехода к оформлению. */
export class Basket extends Component<IBasketView> {
  private readonly listElement: HTMLElement;
  private readonly totalElement: HTMLElement;
  private readonly checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, onCheckout: () => void) {
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.checkoutButton.addEventListener('click', () => onCheckout());
  }

  set items(cards: HTMLElement[]) {
    if (cards.length > 0) {
      this.listElement.replaceChildren(...cards);
    } else {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'Корзина пуста';
      this.listElement.replaceChildren(emptyItem);
    }
  }

  set total(value: number) {
    this.totalElement.textContent = formatPrice(value);
  }

  set count(value: number) {
    this.checkoutButton.disabled = value === 0;
  }
}
