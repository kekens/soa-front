import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SecondaryService {
  private url=`https://localhost:${environment.serviceTwoPort}/soa-back-2/bars`

  constructor(private httpClient: HttpClient) {
  }

  decreaseDifficulty(id: number, step: number) {
    return this.httpClient.get(this.url + `/labwork/${id}/difficulty/decrease/${step}`)
  }

  removeLabWorkFromDiscipline(disciplineId: number, labworkId: number) {
    return this.httpClient.delete(this.url + `/discipline/${disciplineId}/labwork/${labworkId}/remove`)
  }

}
