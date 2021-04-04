import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:5001/api/";
  private currentUserSource = new ReplaySubject<User>(1);//creating observable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);//adding data to observable using next
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;// if we dont write this and try to read the response,
        //then it will be "undefined" as even though we are returning from outside
        // in http, we are not returning user from inside map
        //where we are projecting it.
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);// removing data from observable
  }
}
