export class Question {

  constructor(
    category = 'You dont have any questions yet...',
    question = 'Select the number of questions you want to play with on the game info section and then click "Start game" button!',
    correct_answer = '',
    answers = []
  ) {
    this.category = category;
    this.question = question;
    this.correct_answer = correct_answer;
    this.answers = answers;

    //Validar a resposta do usuário (chamada no binding click do button de resposta)
    this.isCorrect = (answer) => {
      return (answer == correct_answer) ? true : false;
    };
  }

}