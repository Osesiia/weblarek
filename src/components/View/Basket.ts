import { Component } from '../base/Component';
import type { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { formatPrice } from '../../utils/utils';

/** Список товаров и кнопка перехода к оформлению. */
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

  /** Сеттер получает готовую валидность, не вычисляет её по числу товаров. */
  set valid(value: boolean) {
    this.checkoutButton.disabled = !value;
  }
}
