import { Component } from '../base/Component';
import type { IModalView } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Универсальный контейнер модального окна (без наследников). */
export class Modal extends Component<IModalView> {
  private readonly modalContent: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    const handleClose = (): void => {
      this.close();
      onClose(); // Уведомляем презентер только для сброса выбранного товара в Model.
    };
    this.closeButton.addEventListener('click', handleClose);
    container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === container) handleClose();
    });
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.modalContent.replaceChildren();
  }
}
