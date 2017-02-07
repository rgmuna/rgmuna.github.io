

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCyQ79o7N9x3Cz_Yuagly5RLH0HMOBUcPA",
    authDomain: "roque-chat.firebaseapp.com",
    databaseURL: "https://roque-chat.firebaseio.com",
    storageBucket: "roque-chat.appspot.com",
    messagingSenderId: "72325765871"
  };
  firebase.initializeApp(config);

var messageAppReference = firebase.database(); //loads up database and puts in variable


$(document).ready(function() {

  $('#message-form').submit(function(event) {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
      event.preventDefault()

      // grab user message input
      var message = $('#message').val()

      // clear message input (for UX purposes)
      $('#message').val('')

      // create a section for messages data in your db
      var messagesReference = messageAppReference.ref('messages');

      // use the set method to save data to the messages
      messagesReference.push({
        message: message,
        votes: 0
    })
  })
    messageClass.getFanMessages();
})

// var messageClass =

var messageClass = (function(){
  function getFanMessages() {
    // use reference to app database to listen for changes in messages data
    var $messageBoard = $('.message-board');
    var messages = []
    var $listElement = $('<li></li>')

    $('.message-board').append('<p>Test2</p>')
    $('.message-board').addClass('test');

    messageAppReference.ref('messages').on('value', function(results) {

      // put all the userIds, messages and votes into allMessages
      var allMessages = results.val();

      //iterate through all the userIds
      for (var userId in allMessages){
        var message = allMessages[userId].message;
        var votes = allMessages[userId].votes;

        // make the listings for each message
        $listElement.attr('database-id', userId);
        $listElement.html(message); //attach actual message to list element

        $messageBoard.append($listElement);





      }
      $messageBoard.append("<p>Test</p>");

  });
  }
  return {
    getFanMessages: getFanMessages
  }
})();

//getFanMessages();
