import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unhtml'
})
export class UnhtmlPipe implements PipeTransform {

  domParser = new DOMParser();
  transform(value: string, args?: any): string {
    if (value.indexOf('<') !== -1) {
      return this.domParser.parseFromString(value, 'text/html').getElementsByTagName('html')[0].textContent.trim();
    } else {
      return value;
    }
  }

}
