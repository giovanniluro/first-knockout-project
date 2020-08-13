import ko from 'knockout';
import api from './services/api';
import './styles.less';
import { Question } from './models/Question';
import $ from 'jquery';
import shuffleArray from './services/shuffleArray';
import he from 'he'; //biblioteca pra fazer decode de htmlentities --api é em php, vem com as entidades zoadas--

function modelView() {

  this.numberOfQuestions = ko.observable(5);
  this.questions = ko.observableArray([new Question()]);
  this.questionIndex = ko.observable(0);
  this.gameStarted = ko.observable(false);
  this.enableNextQuestionButton = ko.observable(false);
  this.wrongQuestions = ko.observable(0);
  this.rightQuestions = ko.observable(0);
  this.loading = ko.observable('Start game');
  this.preventClick = true;  //variável para prevenir míltiplos cliques nas opções de resposta das questões do jogo

  /*Começando um novo jogo - busca-se na api as novas questões e então cria-se novos objetos
  Question para cada uma das respostas, que então são jogados no array observável this.questions */
  this.buttonStart = () => {
    //zerando os contadores de pontuação
    this.rightQuestions(0);
    this.wrongQuestions(0);
    this.loading('<div></div>');

    //fazendo a requisição a api
    api.get(`/api.php?amount=${this.numberOfQuestions()}`).then(response => {
      const newQuestions = [];
      //declarando que o jogo começou
      this.gameStarted(true);
      this.preventClick = false;

      //manipulando os dados da api
      response.data.results.map(question => {
        var answers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(answers);
        const q = new Question(question.category, he.decode(question.question), question.correct_answer, answers);
        newQuestions.push(q);
      });

      //setando as questões do jogo
      this.questions(newQuestions);
      this.loading('Start game');
    });
  }

  //Seleciona uma das questões do array (determinado pelo questionIndex)
  this.currentQuestion = ko.computed(() => {
    return this.questions()[this.questionIndex()]
  }, this);

  //Validando a resposta
  this.isCorrect = (answer) => {
    if (this.preventClick) return;
    this.preventClick = true;
    //A resposta escolhida, foi a correta?
    var rightAnswer = this.currentQuestion().isCorrect(answer);

    //mudando a cor do container de perguntas de acordo com a resposta e adicionando pontuações
    if (rightAnswer) {
      $('.game-questions__question')[0].classList.add('game-questions__question--right');
      this.rightQuestions(this.rightQuestions() + 1);
    } else {
      $('.game-questions__question')[0].classList.add('game-questions__question--wrong');
      this.wrongQuestions(this.wrongQuestions() + 1);
    }

    //Verificando a resposta dos botões não escolhidos
    this.evaluate(this.currentQuestion().answers, this.currentQuestion().correct_answer);
  };

  //Animando os botões de acordo com seus valores de verdade/mentira
  this.evaluate = (answers, correct) => {
    answers.map(answer => {
      answer !== he.decode(correct) ? $(`button:contains(${he.decode(answer)})`)[0].classList.add('wrong') : $(`button:contains(${he.decode(answer)})`)[0].classList.add('right');
    });

    this.enableNextQuestionButton(true);
  }

  //Transicionando as páginas das questões
  this.nextQuestion = () => {
    this.preventClick = false;
    if (this.questionIndex() === this.numberOfQuestions() - 1) {
      this.preventClick = true;
      this.questionIndex(-1);
      this.questions([new Question('if you want to play a new game, just press start again!', 'You are out of questions, the game is over! :D', '', [`${this.rightQuestions()} ${this.rightQuestions() === 1 ? 'right answer' : 'right answers'}`, `${this.wrongQuestions()} ${this.wrongQuestions() === 1 ? 'wrong answer' : 'wrong answers'}`])]);
      this.gameStarted(false);
    }
    this.questionIndex(this.questionIndex() + 1);
    this.enableNextQuestionButton(false);
  };

}

ko.applyBindings(new modelView());