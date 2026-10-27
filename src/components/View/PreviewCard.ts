import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import type { IPreviewView } from '../../types';

/** Подробная карточка товара: информация и добавление/удаление из корзины. */
export class PreviewCard extends Card<IPreviewView> {
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, onToggle: () => void) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);
    this.actionButton.addEventListener('click', () => onToggle());
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  /** Получает готовые флаги от Презентера, не знает о модели корзины. */
  set selected(value: IPreviewView['selected']) {
    this.actionButton.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  set available(value: IPreviewView['available']) {
    this.actionButton.disabled = !value;
    if (!value) this.actionButton.textContent = 'Недоступно';
  }
}
