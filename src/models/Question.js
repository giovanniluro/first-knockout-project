export class Question {

  constructor(
    category = 'Select the number of questions you want to play with on the game info section and then click "Start game" button!',
    question = 'You dont have any questions yet...',
    correct_answer = '',
    answers = []
  ) {
    this.category = category;
    this.question = question;
    this.correct_answer = correct_answer;
    this.answers = answers;

    //Validar a resposta do usuário (chamada no binding click do button de resposta)
    this.isCorrect = (answer) => {
      console.log(answer, correct_answer);
       return (answer == correct_answer) ? true:false;
    };
  }

}