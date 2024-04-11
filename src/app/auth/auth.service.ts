import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "./auth.interface";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {

    // user = new Subject<User>();
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    signup(emailEl: string, passwordEl: string) {
        return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=` + environment.firebaseAPIKey, {
            email: emailEl,
            password: passwordEl,
            returnSecureToken: true
        }).pipe(
            catchError(this.errorHandling),
            tap(resData => {
                localStorage.setItem('idToken', JSON.stringify(resData.idToken));
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })

        );
    }

    // auto login funtion
    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);        //triggering the timer for autologout
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    login(emailEl: string, passwordEl: string) {
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
            email: emailEl,
            password: passwordEl,
            returnSecureToken: true
        }).pipe(
            catchError(this.errorHandling),
            tap(resData => {
                console.log(new Date(new Date().getTime() + +resData.expiresIn * 1000));
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
        );
    }

    private errorHandling(errorRes: HttpErrorResponse) {
        let errMsg: string = 'An unknown error occured!'
        console.log(errorRes.error.error.message);
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errMsg);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errMsg = 'This email already exist';
                break;
            case 'EMAIL_NOT_FOUND':
                errMsg = 'This email does not exist';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errMsg = 'Password is invalid';
                break;
        }
        return throwError(errMsg);
    }

    private handleAuthentication(email, id, token, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const newUser = new User(email, id, token, expirationDate);
        this.user.next(newUser);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(newUser));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.clear();
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
}