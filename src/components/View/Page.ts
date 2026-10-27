import { Component } from '../base/Component';
import type { IPageView } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Главная страница: галерея и счетчик корзины. */
export class Page extends Component<IPageView> {
  private readonly gallery: HTMLElement;
  private readonly basketCounter: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, onBasketOpen: () => void) {
    super(container);
    this.gallery = ensureElement<HTMLElement>('.gallery', container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this.basketButton.addEventListener('click', () => onBasketOpen());
  }

  set error(message: string) {
    this.gallery.textContent = message;
  }

  set catalog(cards: HTMLElement[]) {
    this.gallery.replaceChildren(...cards);
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
