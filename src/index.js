import ko from 'knockout';
import api from './services/api';
import './styles.less';


function modelView() {
  this.name = ko.observable('Giovanni');
  this.printName = name => console.log(this.name());
  this.characters = ko.observableArray([]);

  //comportamentos
  //função para fazer novas requisições a api
  this.setCharacters = url => {
    api.get(url).then(response => this.characters(response.data.results));
  } 

  this.setCharacters('/character');
}

ko.applyBindings(new modelView());