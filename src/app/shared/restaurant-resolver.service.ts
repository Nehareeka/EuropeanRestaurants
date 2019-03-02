import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class RestaurantResolver implements Resolve<any> {
    constructor(private _dataService: DataService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._dataService.getAllRestaurants();
    }

}
