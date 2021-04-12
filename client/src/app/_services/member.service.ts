import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members: Member[] = [];
  baseUrl = environment.apiUrl;
  memberCache = new Map(); // to store key value pair same as dictionary in .net
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((Currentuser) => {
      this.user = Currentuser;
      this.userParams = new UserParams(this.user);
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  //if we already have existing users then no need to hit server and can be 
  // returned from existing members
  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(UserParams).join('-'));
    if (response) {
      return of(response);
    }

    let params = this.getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + "users", params)
      .pipe(map((response) => {
        this.memberCache.set(Object.values(UserParams).join('-'), response);
        return response;
      }))

    /* Before pagination with caching START
    // if (this.members.length > 0) {
    //   return of(this.members); //of returns an observable
    // }
    // return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
    //   map(members => {    //map operator returns value as an observable
    //     this.members = members;
    //     return members;
    //   })
    // )
    Before pagination with caching END */
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);

    if (member) {
      return of(member);
    }

    /* Before pagination with caching START
    const member = this.members.find(m => m.userName === username);
    if (member !== undefined) {
      return of(member);
    }
    Before pagination with caching END */
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

  setMainPhoto(photoId: number) {
    //since its a put request we have to pass something in body so we are passing {}
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber, pageSize) {
    var likeParams = this.getPaginationHeader(pageNumber, pageSize);
    likeParams = likeParams.append('predicate', predicate);
    return this.getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', likeParams);
    //return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate);
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeader(pageNumber, pageSize) {
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());
    return params;
  }

}
