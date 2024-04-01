import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { ChoiceComponent } from './choice/choice.component';
import { TestComponent } from './test/test.component';
import { ResultComponent } from './result/result.component';
import { AnswerComponent } from './answer/answer.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ChoiceComponent,
    TestComponent,
    ResultComponent,
    AnswerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TestRoutingModule
  ]
})
export class TestModule { }
