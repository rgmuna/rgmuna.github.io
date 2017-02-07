/*

- Refactor the codealong to work with user interaction. In the index.html file
there is a "Get Consumer Finance Data" button. When the user clicks the button,
pull data from the provided link above (http://data.consumerfinance.gov/api/views.json).
Handle the link success and error responses accordingly, displaying results in
console.log() if successful.

- Separate your logic so that you can use your functions for another user button
click of "Get Custom Data". Interact with an API of your choice and handle both
success and error scenarios.
*/

'use strict';
(function() {
  var httpRequest = new XMLHttpRequest(); //create an instance of XMLHttpRequest

  //create event handler for get data button
  document.getElementById("getDataButton").onclick = function(){
    makeRequest('http://data.consumerfinance.gov/api/views.json');
  }

  document.getElementById("getCustomDataButton").onclick = function(){
    var getURL = prompt('What URL would you like to get JSON data from?');
    makeRequest(getURL);
  };

//checks if JSON is correct

//this function will first check if the httpRequest goes thro
  function makeRequest(url){
    console.log(url);
    httpRequest.onreadystatechange = responseMethod; //
    httpRequest.open('GET', url);
    httpRequest.send();
  };

//this is a function to check if request goes thru
  function responseMethod() {
     // Check if our state is "DONE"
     if (httpRequest.readyState === XMLHttpRequest.DONE) {
       // If our request was successful we get a return code/status of 200
       if (httpRequest.status === 200) {
         // This is where we update our UI accordingly. Our data is available to us through the responseText parameter
         var jsonResponse = JSON.parse(httpRequest.responseText)
         console.log(httpRequest.responseText);
       } else {
         // This is the scenario that there was an error with our request
         console.log('There was a problem with the request.');
       }
     }
   }

})();
