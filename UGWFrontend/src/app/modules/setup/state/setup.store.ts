import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from "@angular/core";

export interface SetupState {
  name: string;
}

export function createInitialState() {
  return {
    name: null
  };
}


@StoreConfig({name: 'SetupStore'})
@Injectable()
export class SetupStore extends Store<SetupState> {
  constructor() {
    super(createInitialState());
  }
}

