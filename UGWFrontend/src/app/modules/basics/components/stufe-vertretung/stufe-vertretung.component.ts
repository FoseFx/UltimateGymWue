import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {VertretungsDatum, VertretungsPlanSeite} from '../../../../state/app.store';

@Component({
  selector: 'app-stufe-vertretung',
  templateUrl: './stufe-vertretung.component.html',
  styleUrls: ['./stufe-vertretung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StufeVertretungComponent {

  @Input() stufe: string;
  Svertretungsdaten: VertretungsPlanSeite = {infos: [], vp: []};

  @Input() set vertretungsdaten(value: VertretungsPlanSeite) {
    this.Svertretungsdaten = {
      infos: Array.from(value.infos),
      vp: []
    };

    this.Svertretungsdaten.infos.shift(); // dont display day (first item)

    value.vp.forEach((vd: VertretungsDatum) => {
      if (vd.nd === 1) {
        this.Svertretungsdaten.vp.push(vd);
      }
    });
    console.log(this.Svertretungsdaten);
  }

  constructor() { }
}
