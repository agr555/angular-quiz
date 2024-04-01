export type Quiz2 = {
    "test": QuizType
}
export type QuizType = {
    "id": number,
    "name": string,
    questions: Array<QuizQuestionType>
}
export type QuizQuestionType = {
    id:number,
    question: string,
    answers: Array<QuizAnswerType>
}
export type QuizAnswerType = {
    id:number,
    answer:string,
    correct?: boolean
}
 /*
    "id": 1,
    "name": "Тест №1. \"JavaScript: Начальный уровень\"",
    "questions": [
      {
        "id": 1,
        "question": "Где верно указан запуск всплывающего окна?",
        "answers": [
          {
            "id": 1,
            "answer": "info (\"Hi\")"
          } ] } ] }
   */


