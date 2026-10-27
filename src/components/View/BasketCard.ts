import { Card } from './Card';
import type { IBasketCardView } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Отдельная позиция корзины. */
export class BasketCard extends Card<IBasketCardView> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    this.deleteButton.addEventListener('click', () => onDelete());
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
