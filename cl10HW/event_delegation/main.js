//tempate variables
var FavApp = {}; //initialize object with things on list

//create todo object array
FavApp.todo = [{todo: 'Water Plants'}, {todo: 'Walk Dog'}, {todo: 'Vaccuum rug'}];

//compile all objects
FavApp.compileItems = function(item){
  var source = $('#things').html(); //get source from HTML on what complie should look like
  var template = Handlebars.compile(source); //complie using Handlebars
  return template(item); //for the item that needs compiling, return using the template
};

//adds new input item to list. Takes in the name of the list and the value typed in
FavApp.addToList = function(list, thing) {
  var newTodo = {todo: thing}; //create new todo object
  FavApp.todo.push(newTodo); //attach to todo list
  var compiledTemplate = FavApp.compileItems(newTodo); //compiles the todos
  list.append(compiledTemplate); //append the compiled items to the lists
}

FavApp.populateFirst = function(list){
  for(var i=0; i<FavApp.todo.length; i++){
    var itemCompiled = FavApp.compileItems(FavApp.todo[i]); //compile each item from initial array
    list.append(itemCompiled); //append each compiled item to the correct list in the DOM
  }
}

FavApp.removeListItem = function($item){
  var itemRemove = $item.index; //get index of item in array

  $item.remove();
}

$(document).ready(function() { //onload equivalent
  var $thingList = $('#fav-list');
  var $things = $('.fav-thing'); //not sure this does anything 
  var $button = $('#new-thing-button');
  var $newThingInput = $('#new-thing');

  FavApp.populateFirst($thingList); //populate list w/ inital items

//---Event handlers-------------------------------

//click button to add new item to list
  $button.on('click', function(event) {
    event.preventDefault();
    var newThing = $newThingInput.val(); //get value from input
    if (newThing === '') {
      alert('You must type in a value!');
    } else {
      FavApp.addToList($thingList, newThing);
      $newThingInput.val('');
    }
  });

//handles hovering over items
  $thingList.on('mouseenter mouseleave', 'li', function(e) {
   if(e.type === 'mouseenter'){
     $(this).removeClass('inactive');
     $(this).siblings().addClass('inactive');
     $(this).addClass('active')
   } else if(e.type === 'mouseleave'){
     $(this).siblings().removeClass('inactive');
     $(this).removeClass('active')
   }
  });

//event handler for delete link
  $thingList.on('click', 'a.delete', function(event) {
    event.preventDefault();
    var listItem = $(this).parent('li'); //selects the entire list item
    FavApp.removeListItem(listItem);
  });

//event handler for complete link
  $thingList.on('click', 'a.complete', function(event) {
    event.preventDefault();
    var listItem = $(this).parent('li');
    listItem.toggleClass('completed');
  });

});
