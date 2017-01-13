function FarmAnimal(name, image, sound){
  this.name = name;
  this.image = image;
  this.talk = function(sound){
    alert(name + " says: " + sound);
  };
}

var cow = new FarmAnimal('Betty', 'image', 'mooo');
var dog = new FarmAnimal('Rover', 'image', 'woof');
var mouse = new FarmAnimal('Jerry', 'image', 'squeak')

function Bird(name, image, sound){
  FarmAnimal.call(this, name, image, sound);
}

Bird.prototype = new FarmAnimal();

var rooster = new Bird('John', 'http://animal-dream.com/data_images/rooster/rooster4.jpg', 'Cock-a-doodle-do');
var chicken = new Bird('Chick', 'http://tophdimgs.com/data_images/wallpapers/9/354461-chick.jpg', 'peep');

var $animalContainer = $('.container-fluid farm');


$animalContainer.append()
