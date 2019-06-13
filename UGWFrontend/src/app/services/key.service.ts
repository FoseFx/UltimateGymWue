import {Injectable} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  public static LEFT_EVENT = 0;
  public static RIGHT_EVENT = 1;

  public listener$: Observable<KeyboardEvent> = fromEvent(document, 'keydown') as Observable<KeyboardEvent>;

  public leftRightlistener$: Observable<number> = this.listener$.pipe(
    map((event: KeyboardEvent) => {

      switch (event.key) {
        case 'ArrowLeft': return KeyService.LEFT_EVENT;
        case 'a': return KeyService.LEFT_EVENT;
        case 'ArrowRight': return KeyService.RIGHT_EVENT;
        case 'd': return KeyService.RIGHT_EVENT;
        default: return  -1;
      }

    }),
    filter((event: number) => event === KeyService.LEFT_EVENT || event === KeyService.RIGHT_EVENT) // remove rest
  );

  constructor() { }
}
