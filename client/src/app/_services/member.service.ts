import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members: Member[] = [];

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  //if we already have existing users then no need to hit server and can be 
  // returned from existing members
  getMembers() {
    if (this.members.length > 0) {
      return of(this.members); //of returns an observable
    }
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {    //map operator returns value as an observable
        this.members = members;
        return members;
      })
    )
  }

  getMember(username: string) {
    const member = this.members.find(m => m.userName === username);
    if (member !== undefined) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {  //since we are not returning member data from update api we need to update this.members
        // and if not then if some edit will be done , it will take the old value only.
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }
}
