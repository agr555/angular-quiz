import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SignupResponseType} from "../../../../types/signup-response.type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({

    name: new FormControl( '', [Validators.pattern('^[A-ZА-Я][a-zа-я]+\\s*$'), Validators.required]),
    lastName: new FormControl( '', [Validators.pattern('^[A-ZА-Я][a-zа-я]+\\s*$'), Validators.required]),
    email: new FormControl( '', [Validators.email, Validators.required]),
    password: new FormControl( '', [Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'), Validators.required]),
    agree: new FormControl( false, [ Validators.required]),
    // password: new FormControl( '', [Validators.email, Validators.required]),
  })
  constructor(private  authService: AuthService, private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  signup():void{
      // <button class="button" id = "process" [disabled]="loginForm.invalid" (click)="login">Перейти к выбору теста</button>
      if (this.signupForm.valid &&
        this.signupForm.value.email && this.signupForm.value.password &&
        this.signupForm.value.name && this.signupForm.value.lastName
      ) {//этого достаточно,не надо custom-http  и проверки каждого поля и какая стр, в отл от пред
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.lastName,this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: SignupResponseType) => {
            if (data.error || !data.user) {
              this._snackBar.open('Ошибка при регистрации!')
              throw new Error(data.message? data.message: 'Error with data on signup' );
            }
            ////
  ///этот блок взят из login() из login.component.ts
            if( this.signupForm.value.email && this.signupForm.value.password) {


              this.authService.login(this.signupForm.value.email, this.signupForm.value.password)
                .subscribe({
                  next: (data: LoginResponseType) => {
                    if (data.error || !data.accessToken || !data.refreshToken
                      || !data.fullName || !data.userId) {
                      this._snackBar.open('Ошибка при авторизации!')
                      throw new Error(data.message ? data.message : 'Error with data on login');
                    }
                    //последовательность важна
/*                  //вынесено в pipe.tap v auth.service.ts
                    this.authService.setUserInfo({
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
            ///этот блок взят из login() из login.component.ts
            // this.router.navigate(['/choice']);//уже внутри блока выше
          },
          error: (error: HttpErrorResponse) => {
            // this.router.navigate(['/']);
            console.log(error);
            this._snackBar.open('Ошибка при  регистрации!')
            throw new Error(error.error.message);
            // this._snackBar.open(error.error.message ? error.error.message :'Ошибка при авторизации!'  );
          }
        })
    }
  }

}
