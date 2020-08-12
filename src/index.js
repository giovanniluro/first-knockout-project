import ko from 'knockout';
import api from './services/api';
import './styles.less';
import { Question } from './models/Question';
import $ from 'jquery';
import shuffleArray from './services/shuffleArray';

function modelView() {

  this.numberOfQuestions = ko.observable(5);
  this.questions = ko.observableArray([new Question()]);
  this.questionIndex = ko.observable(0);
  this.gameStarted = ko.observable(false);
  this.enableNextQuestionButton = ko.observable(false);

  /*Começando um novo jogo - busca-se na api as novas questões e então cria-se novos objetos
  Question para cada uma das respostas, que então são jogados no array observável this.questions */
  this.buttonStart = () => {
    api.get(`/api.php?amount=${this.numberOfQuestions()}`).then(response => {
      const newQuestions = [];
      this.gameStarted(true);

      response.data.results.map(question => {
        var answers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(answers);
        const q = new Question(question.category, question.question, question.correct_answer, answers);
        newQuestions.push(q);
      });
      this.questions(newQuestions);
    });
  }

  //Pegar a questão atual
  this.currentQuestion = ko.computed(() => {
    return this.questions()[this.questionIndex()]
  }, this);

  //Validando a resposta
  this.isCorrect = (answer) => {
    //A resposta escolhida, foi a correta?
    var rightAnswer = this.currentQuestion().isCorrect(answer);

    //mudando a cor do container de perguntas de acordo com a resposta
    rightAnswer ?
      $('.game-questions__question')[0].classList.add('game-questions__question--right') : $('.game-questions__question')[0].classList.add('game-questions__question--wrong');

    this.evaluate(this.currentQuestion().answers, this.currentQuestion().correct_answer);
  };

  //Animando os botões pela resposta
  this.evaluate = (answers, correct) => {
    answers.map(answer => {
      answer !== correct ? $(`button:contains(${answer})`)[0].classList.add('wrong') : $(`button:contains(${answer})`)[0].classList.add('right');
    });

    this.enableNextQuestionButton(true);
  }

  //Transicionando as páginas das questões
  this.nextQuestion = () => {
    console.log(this.questionIndex(), this.numberOfQuestions() - 1);
    if (this.questionIndex() === this.numberOfQuestions() - 1) {
      this.questionIndex(-1);
      this.questions([new Question('if you want to play a new game, just press start again!', 'You are out of questions, the game is over! :D')]);
      this.gameStarted(false);
    }
    this.questionIndex(this.questionIndex() + 1);
    this.enableNextQuestionButton(false);
  };

}

ko.applyBindings(new modelView());