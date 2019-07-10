import { Injectable } from '@angular/core';


export class SnackbarRef {
  id: number;
  type: SnackbarType;
  msg: string;
  actions: SnackbarActions;
  setTimeout: any;
  ttl: number;
  startedAt: number;
  queue: SnackbarRef[];
  close() {
    this.ttl = 0;
    this.queue.splice(0, 1);
  }

  constructor(queue: SnackbarRef[], type: SnackbarType, msg: string, ttl: number, actions: SnackbarActions) {
    this.id = Math.floor(Math.random() * 1000);
    this.type = type;
    this.msg = msg;
    this.actions = actions;
    this.ttl = ttl;
    this.startedAt = -1;
    this.queue = queue;
  }
}

/**
 * Key: visible message,
 * value: function to call
 * {'Do something': () => console.log('test'), '...': () => {...}}
 **/
export interface SnackbarActions {
  [key: string]: (ref: SnackbarRef) => void;
}

export type SnackbarType = 'note'|'alert'|'warning';

const defaultActions: SnackbarActions = {
  'Schließen': ref => { clearTimeout(ref.setTimeout); ref.close(); }
};
@Injectable()
export class SnackbarService {
  public snackQueue: SnackbarRef[] = [];
  constructor() { }

  addSnackbar(msg: string, ttl: number = 1000, type: SnackbarType = 'note', actions: SnackbarActions = defaultActions) {
    const ref: SnackbarRef = new SnackbarRef(this.snackQueue, type, msg, ttl, actions);
    this.snackQueue.push(ref);
  }

  getNewSnackbar(): SnackbarRef {
    if (this.snackQueue[0].startedAt !== -1) {
      return this.snackQueue[0];
    }
    const id = this.snackQueue[0].id;
    this.snackQueue[0].startedAt = +new Date();
    this.snackQueue[0].setTimeout = setTimeout(() => {
      if (this.snackQueue[0].id === id) {
        this.snackQueue[0].close();
      }
    }, this.snackQueue[0].ttl);
    return this.snackQueue[0];
  }
}
