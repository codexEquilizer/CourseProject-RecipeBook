import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user.pipe(
        take(1),
        map(user => {
            //    return user ? true : false;
            const isAuth = !!user;
            if (isAuth)
                return true;

            return router.createUrlTree(['/auth'])
        })
    )
}