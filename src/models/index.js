export class Character {
  constructor(name, status, species, type = '', origin, image) {
    this.name = name;
    this.status = status;
    this.species = species;
    this.type = type;
    this.origin = origin;
    this.image = image;
  }
}