import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Kurse} from '../../../../types/Kurs';

export interface SetupState {
  name: string;
  available_stufen: string[];
  stufe: string;
  available_kurse: AvailableKurseMap;
  selected_kurse: Kurse;
}

export function createInitialState() {
  return {
    name: null,
    available_stufen: [],
    stufe: null,
    available_kurse: {},
    selected_kurse: [],
  };
}


@StoreConfig({name: 'SetupStore'})
@Injectable()
export class SetupStore extends Store<SetupState> {
  constructor() {
    super(createInitialState());
  }
}


export interface AvailableKurseMap {
  [kurs: string]: Kurse;
}
