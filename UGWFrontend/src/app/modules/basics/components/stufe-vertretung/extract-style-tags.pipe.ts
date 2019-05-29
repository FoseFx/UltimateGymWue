import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractStyleTags'
})
export class ExtractStyleTagsPipe implements PipeTransform {

  domParser = new DOMParser();

  transform(value: string, args?: any): string {
    const o = this.domParser.parseFromString(value, 'text/html');
    const hasBTags = o.getElementsByTagName('b').length > 0;
    const hasITags = o.getElementsByTagName('i').length > 0;
    let s = '';
    if (hasBTags) {
      s += 'bold ';
    }
    if (hasITags) {
      s += 'italic ';
    }

    return s;
  }

}
