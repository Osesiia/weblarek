import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

const CATEGORY_CLASS_PREFIX = 'card__category_';

/** Общая для карточек каталога и превью работа с изображением и категорией.
 * В корзине этих элементов нет, поэтому базовому Card они не принадлежат.
 */
export class CardMedia {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
  }

  setImage(value: string): void {
    this.imageElement.src = `${CDN_URL}${value}`;
  }

  setAlt(title: string): void {
    this.imageElement.alt = title;
  }

  setCategory(value: string): void {
    for (const className of Array.from(this.categoryElement.classList)) {
      if (className.startsWith(CATEGORY_CLASS_PREFIX)) {
        this.categoryElement.classList.remove(className);
      }
    }
    this.categoryElement.textContent = value;
    this.categoryElement.classList.add(
      categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое']
    );
  }
}
