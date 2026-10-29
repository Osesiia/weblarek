import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/appEvents';

/** Состояние ошибки загрузки каталога, отделённое от View. */
export class CatalogStatusModel {
  private error = '';

  constructor(private readonly events: IEvents) {}

  getError(): string {
    return this.error;
  }

  setError(value: string): void {
    this.error = value;
    this.events.emit(appEvents.catalogStatusChanged);
  }
}
