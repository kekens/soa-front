// @ts-nocheck
import {CoordinatesModel} from "./coordinates.model";
import {DisciplineModel} from "./discipline.model";
export class LabWorkModel {
  id: number;
  name: string;
  coordinates: CoordinatesModel;
  creationDate: string;
  minimalPoint: number;
  difficulty: string;
  discipline: DisciplineModel;
}
