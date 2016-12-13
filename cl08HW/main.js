var $button = $('#sing-button');
var $bottlesBeer = $('#bottles-beer');

function addToList($list, thing) {
  var $thingLi = $('<li>');
  $thingLi.text(thing);
  $list.append($thingLi);
}

$button.on('click', function() {
  event.preventDefault();
  $bottlesBeer.empty();
  var numBeers = prompt('How many beers are on the wall?');
  if(isNaN(numBeers)){
    alert("Please enter a number!");
  }
  else{
    for(var i = numBeers; i >0; i--){
      var oneLess = i-1;
      if(i===1){
        var oneBeer = (i + " bottle of beer on the wall, " + i + " bottle of beer." + "\n" + "Take one down and pass it around, " + oneLess + " bottles of beer on the wall. :( \n");
      addToList($bottlesBeer, oneBeer);
      }
      else if(i===2){
        var twoBeer = (i + " bottles of beer on the wall, " + i + " bottles of beer." + "\n" + "Take one down and pass it around, " + oneLess + " bottle of beer on the wall. \n");
        addToList($bottlesBeer, twoBeer);
      }
      else{
        var allBeer = (i + " bottles of beer on the wall, " + i + " bottles of beer." + "\n" + "Take one down and pass it around, " + oneLess + " bottles of beer on the wall. \n");
        addToList($bottlesBeer, allBeer);
      }
    }
  }

});
