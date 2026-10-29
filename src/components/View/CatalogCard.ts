import { Card } from './Card';
import { CardMedia } from './CardMedia';
import type { ICatalogCardView } from '../../types';

/** Карточка из каталога: название/цена плюс изображение и категория. */
export class CatalogCard extends Card<ICatalogCardView> {
  private readonly media: CardMedia;

  constructor(container: HTMLElement, onSelect: () => void) {
    super(container);
    this.media = new CardMedia(container);
    container.addEventListener('click', () => onSelect());
  }

  set title(value: string) {
    super.title = value;
    this.media.setAlt(value);
  }

  set image(value: string) {
    this.media.setImage(value);
  }

  set category(value: string) {
    this.media.setCategory(value);
  }
}
