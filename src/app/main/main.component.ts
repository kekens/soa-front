// @ts-nocheck
import { Component } from '@angular/core';
import {LabWorkService} from "../service/labwork.service";
import {LabWorkModel} from "../model/labwork.model";
import {ParamsModel} from "../model/params.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent  implements ngOnInit {

  labWorks: LabWorkModel[];

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

  constructor(private labWorkService: LabWorkService) {
    this.disciplines = ["СОА"]
  }

  ngOnInit() {
    this.labWorkService.getAllLabWorks().subscribe(labWorkArray => {
      this.labWorks = labWorkArray;
      console.log(this.labWorks);
    })
  }

  filterList() {
    let paramsModel = new ParamsModel(
      this.name, this.coordinatesXFrom, this.coordinatesXUntil,
      this.coordinatesYFrom, this.coordinatesYUntil, this.rangeDates, this.minimalPointFrom, this.minimalPointUntil,
      this.selectedDifficulties, this.selectedDifficulties, this.lectureHours)

    this.labWorkService.getAllLabWorks(paramsModel).subscribe(labWorkArray => {
      this.labWorks = labWorkArray;
      console.log(labWorkArray);
    })
  }

  isCoordinatesFiltered(): boolean {
    return this.coordinatesXFrom != null || this.coordinatesXUntil != null || this.coordinatesYUntil != null || this.coordinatesYFrom != null;
  }

  isMinimalPointFiltered(): boolean {
    return this.minimalPointFrom != null || this.minimalPointUntil != null;
  }

  isDisciplineFiltered(): boolean {
    return (this.selectedDisciplines != '' && this.selectedDisciplines != null) || this.lectureHours != null;
  }

}
