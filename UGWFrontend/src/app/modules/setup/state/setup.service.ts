import {Injectable} from '@angular/core';
import {SetupStore} from './setup.store';

@Injectable()
export class SetupService {
  constructor(private store: SetupStore) {
  }
  lockName(name: string) {
    this.store.update({name});
  }
  setAvailStufen(stufen: string[]) {
    this.store.update({available_stufen: stufen});
  }
  setStufe(stufe: string){
    this.store.update({stufe});
  }
}
