/* Independent Practice

Making a favorites list: DOM manipulation


- When the user clicks the submit button, take the value they've typed
  into the input box and add it to the list (remember: appendChild)

- Also, when a new item is added to the list, clear the input box.

*/

function addToList(list, newThing) {

}

window.onload = function() {
  // Attach an event listener to when the button is clicked.
  document.querySelector('#new-thing-button').onclick = function(){
    event.preventDefault();
    var boxValue = document.querySelector("#new-thing");
    if(boxValue.value === ""){
      alert("You must type in a value!");
    }
    else{
      var ul = document.querySelector("#fav-list");
      var li = document.createElement("li");
      var newFavThing = boxValue.value;
      li.setAttribute("class", "fav-thing");
      li.appendChild(document.createTextNode(newFavThing));
      ul.appendChild(li);
      boxValue.value = '';
    }
  }

};

/*

Bonus:

When they click submit without typing anything, alert the user
"you must type in a value!"
  (Hint: the `value` property of the input box, before anyone types in it,
  is the empty string.)

*/
