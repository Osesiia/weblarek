import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

const PRICE_UNIT = 'синапсов';

/** Единое форматирование цен для разных компонентов. */
export function formatPrice(value: number | null): string {
  if (value === null) return 'Бесценно';
  return `${new Intl.NumberFormat('ru-RU').format(value)} ${PRICE_UNIT}`;
}

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
