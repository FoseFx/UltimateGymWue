import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';

export interface SetupState {
  name: string;
  available_stufen: string[];
  stufe: string;
}

export function createInitialState() {
  return {
    name: null,
    available_stufen: [],
    stufe: null
  };
}


@StoreConfig({name: 'SetupStore'})
@Injectable()
export class SetupStore extends Store<SetupState> {
  constructor() {
    super(createInitialState());
  }
}

