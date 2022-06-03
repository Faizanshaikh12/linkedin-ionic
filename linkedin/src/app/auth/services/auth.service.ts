import {Injectable} from '@angular/core';
import {NewUser} from '../models/newUser.model';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {Role, User} from '../models/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Storage} from '@capacitor/storage';
import {UserResponse} from '../models/userResponse.model';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  constructor(private http: HttpClient, private router: Router) {
  }


  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => of(user.role))
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => of(user.id))
    );
  }

  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseUrl}/auth/register`, newUser, this.httpOptions
    ).pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseUrl}/auth/login`, {email, password}, this.httpOptions
    ).pipe(take(1),
      tap((response: { token: string }) => {
        Storage.set({
          key: 'token',
          value: response.token
        });
        const decodeToken: UserResponse = jwtDecode(response.token);
        this.user$.next(decodeToken.user);
      })
    );
  }

  isTokenInStorage(): Observable<boolean> {
    return from(
      Storage.get({
        key: 'token'
      })).pipe(
      map((data: { value: string; }) => {
        if (!data || !data.value) {
          return null;
        }

        const decodeToken: UserResponse = jwtDecode(data.value);
        const jwtExpInUnix = decodeToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpInUnix);

        if (isExpired) {
          return null;
        }
        if (decodeToken.user) {
          this.user$.next(decodeToken.user);
          return true;
        }
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({key: 'token'});
    this.router.navigateByUrl('/auth');
  }

}
