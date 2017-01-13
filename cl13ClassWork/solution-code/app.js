var farm = document.querySelector('.farm');
var FarmAnimals = [];

var FarmAnimal = function(name, species, animalSound, image) {
  this.name = name
  this.talk = function() {
    alert(this.name + ' says: ' + animalSound + '!')
  }
  this.image = image
  this.type = function(){
    console.log('I am of type - ' + species);
  }
  this.action = function(){
    alert('I do nothing');
  }
};

function Cow(name) {
  FarmAnimal.call(this, name, 'cow', 'moo', 'http://cdxdemo.dprm-lab.com/wp-content/uploads/2015/07/dairy_cow.jpg')
  this.action = function(){
    alert('Cows like to eat');
  }
};

function Dog(name) {
  FarmAnimal.call(this, name, 'dog', 'bark', 'https://pixabay.com/static/uploads/photo/2014/04/05/11/38/dog-316459_960_720.jpg');
  this.action = function(){
    alert('Dogs love to run');
  }
};

function Rooster(name) {
  FarmAnimal.call(this, name, 'rooster', 'cockadoodledoo', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Brown_Leghorn_rooster_in_Australia.jpg');
};

Cow.prototype = Object.create(FarmAnimal.prototype);
Dog.prototype = Object.create(FarmAnimal.prototype);
Rooster.protype = Object.create(FarmAnimal.prototype);

var milkCow = new Cow('Bessie');
var farmDog = new Dog('Charlie');
var farmRooster = new Rooster('Ronnie');

FarmAnimals.push(milkCow);
FarmAnimals.push(farmDog);
FarmAnimals.push(farmRooster);

console.log('Is milkCow an instance of Cow?', milkCow instanceof Cow);
console.log('Is milkCow an instance of FarmAnimal?', milkCow instanceof FarmAnimal);

FarmAnimals.forEach(function(animal) {
  var animalElement = document.createElement('div')
  animalElement.style.backgroundImage = 'url(' + animal.image + ')'
  var bottom = Math.floor(Math.random() * 50);
  animalElement.style.bottom = bottom + '%';
  var left = Math.floor(Math.random() * 90)
  animalElement.style.left = left + '%';
  animalElement.classList.add('animal')
  animalElement.onclick = function() {
    animal.talk();
    animal.type();
    animal.action();
  }
  farm.appendChild(animalElement)
})
