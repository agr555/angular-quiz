import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
// import {error} from "@angular/compiler-cli/src/transformers/util";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'), Validators.required]),
    // password: new FormControl( '', [Validators.email, Validators.required]),
  })

  constructor(private  authService: AuthService, private router: Router,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login(): void {//по кнопке перейти к выбору теста +:   (click)="login"
    // <button class="button" id = "process" [disabled]="loginForm.invalid" (click)="login">Перейти к выбору теста</button>
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {//этого достаточно,не надо custom-http  и проверки каждого поля и какая стр, в отл от пред
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (data: LoginResponseType) => {
            if (data.error || !data.accessToken || !data.refreshToken
              || !data.fullName || !data.userId) {
              this._snackBar.open('Ошибка при авторизации!')
              throw new Error(data.message? data.message: 'Error with data on login' );
            }
           //последовательность важна
/*            this.authService.setUserInfo({
              fullName: data.fullName,
              userId: data.userId
            });

            this.authService.setTokens(data.accessToken, data.refreshToken);*/
            // this.authService.setUserEmail(data.email);//!!!! это тоже нужно реализовать!!!
  /*          if (email) {
              Auth.setUserEmail(email);
              // console.log(localStorage);
              location.href = '#/choice';
            }*/
            this.router.navigate(['/choice']);
          },
          error: (error: HttpErrorResponse) => {
            // this.router.navigate(['/']);
            console.log(error);
            this._snackBar.open('Ошибка при авторизации!')
            throw new Error(error.error.message);
            // this._snackBar.open(error.error.message ? error.error.message :'Ошибка при авторизации!'  );
          }
        })
    }
  }
}
