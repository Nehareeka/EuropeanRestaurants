import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}
    private _csvFilePath = '../../assets/restaurantList.csv'; 
   
    getAllRestaurants() {
        return this.http.get(this._csvFilePath, {'responseType': 'text'})
            .pipe(map((data) => {
                return data;
            }));
    }
}
