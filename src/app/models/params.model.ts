export class ParamsModel {
  name: string;
  coordinatesXFrom: number;
  coordinatesXUntil: number;
  coordinatesYFrom: number;
  coordinatesYUntil: number;
  rangeDates: Date[];
  minimalPointFrom: number;
  minimalPointUntil: number;
  selectedDifficulties: string[];
  selectedDisciplines: string[];
  sort: string;
  page: number;
  count: number;

  constructor(name: string, coordinatesXFrom: number, coordinatesXUntil: number, coordinatesYFrom: number, coordinatesYUntil: number,
              rangeDates: Date[], minimalPointFrom: number, minimalPointUntil: number, selectedDifficulties: string[],
              selectedDisciplines: string[], sort: string, page: number, count: number) {
    this.name = name;
    this.coordinatesXFrom = coordinatesXFrom;
    this.coordinatesXUntil = coordinatesXUntil;
    this.coordinatesYFrom = coordinatesYFrom;
    this.coordinatesYUntil = coordinatesYUntil;
    this.rangeDates = rangeDates;
    this.minimalPointFrom = minimalPointFrom;
    this.minimalPointUntil = minimalPointUntil;
    this.selectedDifficulties = selectedDifficulties;
    this.selectedDisciplines = selectedDisciplines;
    this.sort = sort;
    this.page = page;
    this.count = count;
  }
}
