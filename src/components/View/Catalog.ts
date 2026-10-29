import { Component } from '../base/Component';
import type { ICatalogView } from '../../types';

/** Только список товаров; DOM этого компонента — <main class="gallery">. */
export class Catalog extends Component<ICatalogView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards);
  }

  set error(message: string) {
    this.container.textContent = message;
  }
}
