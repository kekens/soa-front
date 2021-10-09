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
  disciplines: string[];
  selectedDisciplines: string[];
  lectureHours: number;

  constructor(name: string, coordinatesXFrom: number, coordinatesXUntil: number, coordinatesYFrom: number, coordinatesYUntil: number,
              rangeDates: Date[], minimalPointFrom: number, minimalPointUntil: number, selectedDifficulties: string[], disciplines: string[],
              selectedDisciplines: string[], lectureHours: number) {
    this.name = name;
    this.coordinatesXFrom = coordinatesXFrom;
    this.coordinatesXUntil = coordinatesXUntil;
    this.coordinatesYFrom = coordinatesYFrom;
    this.coordinatesYUntil = coordinatesYUntil;
    this.rangeDates = rangeDates;
    this.minimalPointFrom = minimalPointFrom;
    this.minimalPointUntil = minimalPointUntil;
    this.selectedDifficulties = selectedDifficulties;
    this.disciplines = disciplines;
    this.selectedDisciplines = selectedDisciplines;
    this.lectureHours = lectureHours;
  }
}
