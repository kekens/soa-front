// @ts-nocheck
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LabWorkModel} from "../model/labwork.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ParamsModel} from "../model/params.model";
import {formatDate} from "@angular/common";
import {FormGroup} from "@angular/forms";
import {CoordinatesModel} from "../model/coordinates.model";
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class LabWorkService {
  private url=`http://localhost:${environment.serviceOnePort}/soa-back/labworks`

  constructor(private httpClient: HttpClient) {
  }

  // CRUD

  addLabWork(labWorkModel: LabWorkModel){
    return this.httpClient.post(this.url, labWorkModel);
  }

  getLabWork(id: number): Observable<LabWorkModel> {
    return this.httpClient.get<LabWorkModel>(this.url + '/' + id);
  }

  deleteLabWork(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  updateLabWork(labWorkModel: LabWorkModel) {
    return this.httpClient.put(this.url, labWorkModel);
  }

  // Extra methods

  getAllLabWorks(paramsModel?: ParamsModel): Observable<Array<LabWorkModel>> {
    if (paramsModel != null) {
      console.log(paramsModel)
      let params = this.getParams(paramsModel)
      return this.httpClient.get<Array<LabWorkModel>>(this.url, { params });
    } else {
      return this.httpClient.get<Array<LabWorkModel>>(this.url);
    }
  }

  deleteRandomLabWork(difficulty: string): Observable<string> {
    return this.httpClient.delete<string>(this.url+'/difficulty?difficulty=' + difficulty);
  }

  getCountLabWork(difficulty: string): Observable<string> {
    return this.httpClient.get<string>(this.url+'/difficulty/count?difficulty=' + difficulty);
  }

  // Get params for filtering

  getParams(paramsModel: ParamsModel): HttpParams {
    let params = new HttpParams()

    // Paging
    if (paramsModel.page != null) {
      params = params.append('page', paramsModel.page)
    }

    if (paramsModel.count != null) {
      params = params.append('count', paramsModel.count)
    }

    // Sort
    if (paramsModel.sort != null) {
      params = params.append('sort', paramsModel.sort)
    }

    // Name
    if (paramsModel.name != null) {
      params = params.append('name', paramsModel.name)
    }

    // Coordinates
    if (paramsModel.coordinatesXFrom != null) {
      params = params.append('coordinates_x', ">=:" + paramsModel.coordinatesXFrom);
    }

    if (paramsModel.coordinatesXUntil != null) {
      params = params.append('coordinates_x', "<=:" + paramsModel.coordinatesXUntil);
    }

    if (paramsModel.coordinatesYFrom != null) {
      params = params.append('coordinates_y', ">=:" + paramsModel.coordinatesYFrom);
    }

    if (paramsModel.coordinatesYUntil != null) {
      params = params.append('coordinates_y', "<=:" + paramsModel.coordinatesYUntil);
    }

    // Date
    if (paramsModel.rangeDates != null) {
      console.log(paramsModel.rangeDates.length)
      console.log(paramsModel.rangeDates)
      if (paramsModel.rangeDates[0] != null) {
        params = params.append('creationDate', ">=:" + formatDate(paramsModel.rangeDates[0], 'yyyy-MM-dd', 'en'));
      }

      if (paramsModel.rangeDates[1] != null) {
        params = params.append('creationDate', "<=:" + formatDate(paramsModel.rangeDates[1], 'yyyy-MM-dd', 'en'));
      }
    }

    // Minimal point
    if (paramsModel.minimalPointFrom != null) {
      params = params.append('minimalPoint', ">=:" + paramsModel.minimalPointFrom);
    }

    if (paramsModel.minimalPointUntil != null) {
      params = params.append('minimalPoint', "<=:" + paramsModel.minimalPointUntil);
    }

    // Difficulty
    if (paramsModel.selectedDifficulties != null) {
      for (let diff of paramsModel.selectedDifficulties) {
        params = params.append('difficulty', diff);
      }
    }

    // Discipline
    if (paramsModel.selectedDisciplines != null) {
      for (let disc of paramsModel.selectedDisciplines) {
        params = params.append('disciplineName', disc);
      }
    }

    return params;
  }

  getLabWorkFromForm(form: FormGroup): LabWorkModel {
    return {
      name: form.get('labName').value,
      coordinates: new CoordinatesModel(form.get('labX').value, form.get('labY').value),
      minimalPoint: form.get('labMinimalPoint').value,
      difficulty: form.get('labDifficulty').value,
      discipline: form.get('labDiscipline').value,
    };
  }

}
