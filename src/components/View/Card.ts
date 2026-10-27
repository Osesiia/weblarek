import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

const PRICE_UNIT = 'синапсов';
const CATEGORY_CLASS_PREFIX = 'card__category_';


export function formatPrice(value: number | null): string {
  if (value === null) {
    return 'Бесценно';
  }

  return `${new Intl.NumberFormat('ru-RU').format(value)} ${PRICE_UNIT}`;
}


/** Общий базовый компонент для трех видов карточек товара. */
export abstract class Card<T extends object> extends Component<T> {
  private readonly titleElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly imageElement: HTMLImageElement | null;
  private readonly categoryElement: HTMLElement | null;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image');
    this.categoryElement = container.querySelector<HTMLElement>('.card__category');
  }

  set title(value: string) {
    this.titleElement.textContent = value;
    if (this.imageElement) this.imageElement.alt = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }

  set image(value: string) {
    if (this.imageElement) this.setImage(this.imageElement, `${CDN_URL}${value}`);
  }

  set category(value: string) {
    if (!this.categoryElement) return;
    for (const categoryClass of Array.from(this.categoryElement.classList)) {
      if (categoryClass.startsWith(CATEGORY_CLASS_PREFIX)) {
        this.categoryElement.classList.remove(categoryClass);
      }
    }
    this.categoryElement.textContent = value;
    const modifier = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
    this.categoryElement.classList.add(modifier);
  }
}
