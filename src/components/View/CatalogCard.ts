import { Card } from './Card';
import type { ICatalogCardView } from '../../types';

/** Карточка в каталоге. */
export class CatalogCard extends Card<ICatalogCardView> {
  constructor(container: HTMLElement, onSelect: () => void) {
    super(container);
    container.addEventListener('click', () => onSelect());
  }
}
