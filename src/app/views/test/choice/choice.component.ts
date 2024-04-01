import { Component, OnInit } from '@angular/core';
import {TestService} from "../../../shared/services/test.service";
import {QuizListType} from "../../../../types/quiz-list.type";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {TestResultType} from "../../../../types/test-result.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit {
  quizzes:QuizListType[] = [];
  private testResult:TestResultType[] | null = null;
  constructor(private testService: TestService, private authService: AuthService,  private _snackBar: MatSnackBar,  private router: Router) { }

  ngOnInit(): void {
    //блок список тестов
    this.testService.getTests()
      .subscribe((result:QuizListType[]) => {
        this.quizzes =  result;

        //блок результаты
        const userInfo = this.authService.getUserInfo();
        if(userInfo){
          this.testService.getUserResults(userInfo.userId)
            .subscribe((result: DefaultResponseType|TestResultType[]) =>{
              if (result) {
                if ((result as DefaultResponseType).error != undefined) {
                  throw new Error((result as DefaultResponseType).message);

                  this._snackBar.open('Ошибка при выходе из системы!');
                  //и перекинуть на главную стр
                  this.router.navigate(['/']);
                }
                // this.testResult = result as TestResultType[];
                const testResult = result as TestResultType[];
                if(testResult){
                  this.quizzes = this.quizzes.map(quiz => {
                    const foundItem: TestResultType | undefined = testResult.find(item => item.testId === quiz.id)
                    if(foundItem){
                      quiz.result =  foundItem.score + '/' + foundItem.total;
                    }
                    return quiz;
                  })
                }
              }
            })
        }

      })

  }

   chooseQuiz(id:number):void {
    this.router.navigate(['/test', id])
  }
}
