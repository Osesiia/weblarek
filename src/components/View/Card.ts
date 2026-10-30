import { Component } from '../base/Component';
import { ensureElement, formatPrice } from '../../utils/utils';

/** Только общие для всех трёх шаблонов карточек поля: название и цена. */
export abstract class Card<T extends object> extends Component<T> {
  private readonly titleElement: HTMLElement;
  private readonly priceElement: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }
}
