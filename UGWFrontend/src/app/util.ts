import {Query} from '@datorama/akita';
import {HttpErrorResponse} from '@angular/common/http';
import {MakesRequests} from 'src/types/MakesRequests';

export function serviceInCypress(service) {
  const name = service.constructor.name;
  // @ts-ignore
  if (window.Cypress) {
    console.log('testing environment detected adding ' + name);
    // @ts-ignore
    window[name] = service;
  } else {
    delete window[name];
  }
}

export function queryInCypress(query: Query<any>) {
  const name = query.constructor.name;
  // @ts-ignore
  if (window.Cypress) {
    console.log('testing environment detected adding ' + name);
    query.select().subscribe((_) => {
      // @ts-ignore
      window[name] = query.getValue();
    });
  } else {
    delete window[name];
  }
}


export function handleError(component: MakesRequests, error: HttpErrorResponse) {
  console.error(error);

  if (error.statusText === 'Unknown Error') {
    component.error = 'Netzwerkfehler';
  } else if (!error.error) {
    component.error = error.message;
  } else if (!!error.error.msg) {
    component.error = error.error.msg;
  } else {
    component.error = error.message;
  }

  component.loading = false;
}
