import { Card } from './Card';
import { CardMedia } from './CardMedia';
import { ensureElement } from '../../utils/utils';
import type { IPreviewView } from '../../types';

/** Один переиспользуемый экземпляр подробной карточки товара. */
export class PreviewCard extends Card<IPreviewView> {
  private readonly media: CardMedia;
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, onToggle: () => void) {
    super(container);
    this.media = new CardMedia(container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);
    this.actionButton.addEventListener('click', () => onToggle());
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set selected(value: boolean) {
    this.actionButton.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  set available(value: boolean) {
    this.actionButton.disabled = !value;
    if (!value) this.actionButton.textContent = 'Недоступно';
  }
}
