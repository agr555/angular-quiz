import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {LoginResponseType} from "../../../types/login-response.type";
import {Observable, pipe, Subject, tap} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import {LogoutResponseType} from "../../../types/logout-response.type";
import {SignupResponseType} from "../../../types/signup-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  private userInfoKey: string = 'userInfo';
  private userEmail: string = 'userEmail';/////

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string): Observable<LoginResponseType> {

    return this.http.post<LoginResponseType>(environment.apiHost + 'login', {
      email,
      password: password
    })
      .pipe(
      tap((data: LoginResponseType) => {
        if (data.fullName && data.userId && data.accessToken && data.refreshToken) {
          this.setUserInfo({
            fullName: data.fullName,
            userId: data.userId
          });
          this.setTokens(data.accessToken, data.refreshToken);
        }
      })
    );
  }

  signup(name: string, lastName: string, email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<SignupResponseType>(environment.apiHost + 'signup', {
      name,
      lastName,
      email,
      password: password
    });
  }

  logout(): Observable<LogoutResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    console.log(environment.apiHost + 'logout');
    console.log({refreshToken});
    console.log(this.http.post<LogoutResponseType>(environment.apiHost + 'logout', {refreshToken}));
    return this.http.post<LogoutResponseType>(environment.apiHost + 'logout', {refreshToken});
  };

  public getLoggedIn(): boolean {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  public setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    console.log(info);
  }

  public setUserEmail(userEmail: string): void {
    localStorage.setItem(this.userEmail, userEmail);
  }

  public getUserEmail() {
    const email: string | null = localStorage.getItem(this.userEmail);
    if (email) {
      return email;
    }
    return null;
  }

  public getUserInfo(): UserInfoType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfoKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
}


