import { Component } from '@angular/core';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  loading: boolean = true;
  constructor(router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }
  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    } else if (routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }
}


