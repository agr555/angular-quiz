import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {QuizListType} from "../../../types/quiz-list.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {TestResultType} from "../../../types/test-result.type";
import {QuizType} from "../../../types/quiz.type";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }
  getTests(): Observable<QuizListType[]> {
    return this.http.get<QuizListType[]>( environment.apiHost + 'tests');
  }

  getUserResults(userId: number): Observable<DefaultResponseType|TestResultType[]> {
    return this.http.get<DefaultResponseType|TestResultType[]>( environment.apiHost + 'tests/results?userId=' + userId);
  }
   getQuiz(id: number): Observable<DefaultResponseType|QuizType> {
    return this.http.get<DefaultResponseType|QuizType>( environment.apiHost + 'tests/' + id);
  }
}

