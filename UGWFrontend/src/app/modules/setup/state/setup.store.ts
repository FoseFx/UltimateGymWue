import {Store, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Kurse} from '../../../../types/Kurs';

export interface SetupState {
  name: string;
  available_stufen: string[];
  stufe: string;
  available_kurse: AvailableKurseMap;
  selected_kurse: Kurse;
  selected_kurse_indexes: SelectedKurseIndexMap;
}

export function createInitialState() {
  return {
    name: null,
    available_stufen: [],
    stufe: null,
    available_kurse: {},
    selected_kurse: [],
    selected_kurse_indexes: {}
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

export interface SelectedKurseIndexMap {
  [kurs: string]: number;
}
