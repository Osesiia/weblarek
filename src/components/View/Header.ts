import { Component } from '../base/Component';
import type { IHeaderView } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Только шапка: кнопка корзины и счётчик. */
export class Header extends Component<IHeaderView> {
  private readonly basketCounter: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, onBasketOpen: () => void) {
    super(container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this.basketButton.addEventListener('click', () => onBasketOpen());
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
