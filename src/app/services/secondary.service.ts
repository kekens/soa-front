import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SecondaryService {
  private url=`http://localhost:${environment.serviceTwoPort}/soa-back-2/bars`

}
