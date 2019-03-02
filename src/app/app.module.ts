import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { SortDirective } from './directives/sort.directive';
import { FilterDirective } from './directives/filter.directive';

import { AppComponent } from './app.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { DataService } from 'src/app/shared/data.service';
import { PagerService } from 'src/app/shared/pager.service';
import { HttpClientModule } from '@angular/common/http';
import { StarComponent } from './restaurant/star.component';
import { RestaurantResolver } from 'src/app/shared/restaurant-resolver.service';

@NgModule({
  declarations: [AppComponent,
    RestaurantComponent,
    StarComponent,
    SortDirective,
    FilterDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'home', component: RestaurantComponent, resolve: { initData: RestaurantResolver } },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ])
  ],
  providers: [ DataService,
    PagerService,
    RestaurantResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
