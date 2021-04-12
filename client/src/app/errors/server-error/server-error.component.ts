import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {
  appstate$: any

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.appstate$ = this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      map(() => {
        const currentState = this.router.getCurrentNavigation();
        console.log(currentState.extras.state);
        return currentState.extras.state;
      })
    )
  }

}
