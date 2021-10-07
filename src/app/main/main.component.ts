// @ts-nocheck
import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  name: string = null;

  coordinatesXFrom: number = null;
  coordinatesXUntil: number = null;
  coordinatesYFrom: number = null;
  coordinatesYUntil: number = null;

  rangeDates: Date[] = null;

  minimalPointFrom: number = null;
  minimalPointUntil: number = null;

  selectedDifficulties: string[] = null;

  disciplines: string[] = null;

  selectedDisciplines: string[] = null;
  lectureHours: number = null;

  constructor() {
    this.disciplines = ["СОА"]
  }

  logForm() {
    console.log(this.coordinatesXFrom > this.coordinatesXUntil)
    console.log(this.coordinatesXUntil)
    console.log(this.coordinatesYFrom)
    console.log(this.coordinatesYUntil)
  }

  isCoordinatesFiltered(): boolean {
    return this.coordinatesXFrom != null || this.coordinatesXUntil != null || this.coordinatesYUntil != null || this.coordinatesYFrom != null;
  }

  isMinimalPointFiltered(): boolean {
    return this.minimalPointFrom != null || this.minimalPointUntil != null;
  }

  isDisciplineFiltered(): boolean {
    return this.selectedDisciplines != null || this.lectureHours != null;
  }

}
