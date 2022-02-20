import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {switchMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isUserLoggedIn.pipe(
      take(1),
      switchMap((isUserLogged: boolean) => {
        if(isUserLogged){
          return of(isUserLogged);
        }
        return this.authService.isTokenInStorage();
      }),
      tap((isUserLoggedIn: boolean) => {
        if(!isUserLoggedIn){
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

}
