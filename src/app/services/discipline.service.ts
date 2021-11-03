import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DisciplineModel} from "../models/discipline.model";

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  private url=`http://localhost:${environment.serviceOnePort}/soa-back-1/disciplines`

  constructor(private httpClient: HttpClient) {
  }

  getAllDisciplines(): Observable<Array<DisciplineModel>> {
    return this.httpClient.get<Array<DisciplineModel>>(this.url)
  }

}
