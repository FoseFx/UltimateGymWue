import {Query} from '@datorama/akita';

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
