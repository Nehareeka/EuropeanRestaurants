import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}
    private _movieUrl = '../../assets/restaurantList.csv'; 
   
    getAllRestaurants() {
        return this.http.get(this._movieUrl, {'responseType': 'text'})
            .pipe(map((data) => {
                return data;
            }));
    }
}
