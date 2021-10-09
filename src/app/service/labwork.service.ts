import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LabWorkModel} from "../model/labwork.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ParamsModel} from "../model/params.model";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LabWorkService {
  private url="/soa-1/lab-work"

  constructor(private httpClient: HttpClient) {
  }

  getAllLabWorks(paramsModel?: ParamsModel): Observable<Array<LabWorkModel>> {
    if (paramsModel != null) {
      let params = this.getParams(paramsModel)
      return this.httpClient.get<Array<LabWorkModel>>(this.url, { params });
    } else {
      return this.httpClient.get<Array<LabWorkModel>>(this.url);
    }
  }

  getParams(paramsModel: ParamsModel): HttpParams {
    let params = new HttpParams()

    console.log(paramsModel)

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
    return params;
  }

}
