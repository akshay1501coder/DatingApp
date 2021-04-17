import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceHubService } from './presence-hub.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);//creating observable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceHubService: PresenceHubService) { }

  login(model: any) {
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presenceHubService.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presenceHubService.createHubConnection(user);
        }
        return user;// if we dont write this and try to read the response,
        //then it will be "undefined" as even though we are returning from outside
        // in http, we are not returning user from inside map
        //where we are projecting it.
      })
    )
  }

  setCurrentUser(user: User) {
    if (user) {      
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);// removing data from observable
    this.presenceHubService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
