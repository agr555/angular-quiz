import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TestService} from "../../../shared/services/test.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuizType} from "../../../../types/quiz.type";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
quiz!: QuizType;
timerSeconds = 59;
private interval: number = 0;
  constructor(private  activateRoute: ActivatedRoute, private testService: TestService,
              private _snackBar: MatSnackBar,  private router: Router) { }

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
  startQuiz():void{
    //progress bar
    //show questions

    this.interval = window.setInterval( () => {
      this.timerSeconds--;
       if (this.timerSeconds === 0) {
        clearInterval(this.interval);
        this.complete();
      }
    }, 1000);
  }
  complete(): void{

  }
}
