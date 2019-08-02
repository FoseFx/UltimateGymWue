export class SchoolEvent {
  name: string;
  typ: 'ferien'|'klausur'|'ferientag'|'sonder';
  format: 'ferien'|'schule'|'fullday'|'time';
  votes: number;
  by: EventBy;
  beginSchulStunde?: number;
  begin: number; // if type = schule: first one/two digits represent the schulstunde, rest is the date it begins
  end?: number; // Not for typ = Feiertag
  stufe?: string; // only for typ = Klausur or Note
  kurs?: string; // only for typ = Klausur or Note
}
export class EventBy {
  name: string;
  uid: string;
}
