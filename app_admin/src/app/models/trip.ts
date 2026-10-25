// Shape of a trip, matching the Mongoose trip schema in app_api/models/travlr.js
export interface Trip {
  _id?: string;
  code: string;
  name: string;
  length: string;
  start: Date | string;
  resort: string;
  perPerson: string;
  image: string;
  description: string;
}
