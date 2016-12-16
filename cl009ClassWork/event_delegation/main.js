/* Independent Practice

Making a favorites list: event delegation


Refactor the code below.

The difference will be: use event delegation so that you only have
to set one event listener for all the items once, when the
code first runs, and you don't have to add any others whenever
someone adds an item.

Bonus: When the user mouses over each item, the item should turn grey. Don't use CSS hovering for this.

*/

function addToList($list, thing) {
  var $thingLi = $('<li>').html(thing);
  addLink($thingLi);
  $list.append($thingLi);
}

function addLink($li) {
  var $completedLink = $('<span>').html(' complete task').addClass('complete-task');
  var $deleteLink = $('<span>').html(' delete').addClass('complete-task');
  $li.append($completedLink);
  $li.append($deleteLink);
  $completedLink.on('click', function(event) {
    $li.addClass('completed');
    $completedLink.html('');
  });
  $deleteLink.on('click', function(event) {
    $li.remove();
  });
}



$(document).ready(function() { //onload equivalent
  var $thingList = $('#fav-list');
  var $things = $('.fav-thing');
  var $button = $('#new-thing-button');
  var $newThingInput = $('#new-thing');

  $things.toArray().forEach(function(li) {
    addLink($(li));
  });

  $button.on('click', function(event) {
    event.preventDefault();
    var newThing = $newThingInput.val();
    if (newThing === '') {
      alert('You must type in a value!');
    } else {
      addToList($thingList, newThing);
      $newThingInput.val('');
    }
  });

  var $thingListItems = $('#fav-list');

  $thingList.find('li').each(function() {
     $(this).prepend(' - ');
   });

 $thingListItems.on('mouseenter mouseleave', 'li', function(e) {
   if(e.type === 'mouseenter'){
     $(this).removeClass('inactive');
     $(this).siblings().addClass('inactive');
     $(this).addClass('active')
   } else if(e.type === 'mouseleave'){
     $(this).siblings().removeClass('inactive');
     $(this).removeClass('active')
   }
 });


});
