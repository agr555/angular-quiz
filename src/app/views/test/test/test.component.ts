import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TestService} from "../../../shared/services/test.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuizType} from "../../../../types/quiz.type";
import {ActionTestType} from "../../../../types/action-test.type";
import {UserResultType} from "../../../../types/user-result.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
quiz!: QuizType;
timerSeconds = 59;
private interval: number = 0;
  currentQuestionIndex: number = 1;
  chosenAnswerId: number | null = null    ;
  readonly userResult: UserResultType [] = [];
  actionTestType =  ActionTestType;
  y: number = 0;
  constructor(private  activateRoute: ActivatedRoute, private testService: TestService,
              private _snackBar: MatSnackBar,  private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params =>{
      if (params['id']){
        this.testService.getQuiz(params['id'])
          .subscribe(result =>{
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
              this._snackBar.open('Ошибка !');
              //и перекинуть на главную стр
              this.router.navigate(['/']); //
            }
            this.quiz = result as QuizType;
            this.startQuiz();
          })
      }
    })
  }
  get activeQuestion(){
    return this.quiz.questions[this.currentQuestionIndex-1]
  }
  startQuiz():void{


    //временно уберем таймер
      this.interval = window.setInterval( () => {
      this.timerSeconds--;
       if (this.timerSeconds === 0) {
        clearInterval(this.interval);
        this.complete();
      }
    }, 1000);
  }
  complete(): void{
    console.log(this.userResult);
    const userInfo = this.authService.getUserInfo();
    if(userInfo) {
      this.testService.passQuiz(this.quiz.id,userInfo.userId, this.userResult)
        .subscribe(result =>{
          if (result) {
            if ((result as DefaultResponseType).error !== undefined) {
              throw new Error((result as DefaultResponseType).message);
            }
            this.router.navigate(['/result'], {queryParams: {id: this.quiz.id}})
            // location.href = '#/result?id=' + this.routeParams.id;
          }
        })
    }
  }

   move(action:ActionTestType): void {
     const existingResult: UserResultType | undefined = this.userResult.find(item => {
      return item.questionId === this.activeQuestion.id;
    });
    if(this.chosenAnswerId){
      if (existingResult) {
        existingResult.chosenAnswerId = this.chosenAnswerId;
      } else {
        this.userResult.push({
          questionId: this.activeQuestion.id,
          chosenAnswerId: this.chosenAnswerId
        })
      }
    }
    //   console.log(this.userResult);
    if (action === ActionTestType.next || action === ActionTestType.pass) {
      if (this.currentQuestionIndex === this.quiz.questions.length) {
        clearInterval(this.interval);
        this.complete();
        return;
      }
      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex--;
    }

    const currentResult: UserResultType | undefined = this.userResult.find(item =>{
      return item.questionId === this.activeQuestion.id;
    });
    if(currentResult){
      this.chosenAnswerId = currentResult.chosenAnswerId;

    }


  }
}
