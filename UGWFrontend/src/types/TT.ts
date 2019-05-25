import {VertretungsDatum} from '../app/state/app.store';

export type TimeTable = [TimeTableWeek, TimeTableWeek];
export type TimeTableWeek = [TimeTableDay, TimeTableDay, TimeTableDay, TimeTableDay, TimeTableDay];
export type TimeTableDay = TimeTableField[];
export class TimeTableField {
  typ?: string;
  fach?: string;
  raum?: string;
  lehrer?: string;
  name?: string;
  vd?: VertretungsDatum; // vertretungsdaten
}
