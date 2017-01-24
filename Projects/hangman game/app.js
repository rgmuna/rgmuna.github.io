
//configuring firebase
var config = {
  apiKey: "AIzaSyB-tRYC2Qvuxt1E3Mc8_ljNVtpH6b3gwLE",
  authDomain: "hangman-game-eaec8.firebaseapp.com",
  databaseURL: "https://hangman-game-eaec8.firebaseio.com",
  storageBucket: "hangman-game-eaec8.appspot.com",
  messagingSenderId: "70821732411"
};
firebase.initializeApp(config);
//-------------------------------------------------------------

var database = firebase.database();

var playerNum; //local variable stored for each player playing
var playerGuesses = []; //letters the player has guessed
var randomWordUrl = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&excludePartOfSpeech=proper-noun&minCorpusCount=5&maxCorpusCount=0&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
var wordGlobal; //answer word pulled from API
var statusGlobal; //keeps track of game status (i.e. how many players have signed in)
var numLives = 10; //number of incorrect guesses you have before you lose
var guessedLetters = []; //letters that have been guessed and have been processed
var gameStartTime;

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
      'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
      't', 'u', 'v', 'w', 'x', 'y', 'z'];

$(document).ready(function () {

  //pull game status value
  var gameStatus;
  database.ref('Game Status').on('value', function (results) {
    gameStatus = results.val();
    if(gameStatus===2){
      console.log('Ready to play? Here we go!');
      database.ref('Game Status').set(3);
      gameStartTime = Math.round(new Date() / 1000);
      statusGlobal = gameStatus;
      wordGlobal = databaseWord;
      makeLetterSpaces(databaseWord);
    }
    else if(gameStatus===4){ //when game is over
      database.ref('Game Status').set(0);
      database.ref('result').set('');
      window.location.reload(true);
    }
  })

  database.ref('result').on('value', function (results) { //response when game result is declared
    var gameResult = results.val();
    if(gameStatus===3){
      $('#mylives').text(gameResult);
    //  gadatabase.ref('Game Status').set(0);
    }
    else{
      $('#mylives').text(numLives);
    }

  });


  //pull word from database (only matters for second player)
  var databaseWord;
  database.ref('word').on('value', function (results) {
    databaseWord = results.val();
  });

  $('#new-game').on('click', function(event){
    event.preventDefault()

    if(gameStatus===0){ //if game is new and no one is playing yet
      playerNum = 1;
      database.ref('winner').set('');
      $('#player').text('You are Player 1');
      console.log("Player " + playerNum + " is ready");
      getWord(gameStatus); //upload random hangman word to database
      database.ref('Game Status').set(1);
      //make dom element to say "waiting for player 2"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    }
    else if(gameStatus===1){ //if player one is ready, sets player two
      playerNum = 2;
      $('#player').text('You are Player 2');
      console.log("Player " + playerNum + " is ready with word" + databaseWord);
      database.ref('Game Status').set(2);
    }
    else if(gameStatus===3){
      alert("Someone hit 'New Game' and ended the current game! Press 'New Game' to play again!");
      database.ref('Game Status').set(4);
    }
  })
  makeLetters(); //attach letter inputs to DOM
})

function getWord(status) { //gets word from API
  $.ajax({
      url: randomWordUrl,
      data: {
          format: "json"
      },
      // Work with the response
      success: function( response ) {
        uploadWord(response.word);
      },
      error: function() {
        alert('Error: Cannot load page');
      }
  });
}

function uploadWord(word){ //uploads word to database
  database.ref('word').set(word);
}

function makeLetterSpaces(word){ //makes blank spaces for each letter of guess word
  $('#individual-letter').parent().find('li').removeClass('used');
  var $letterContainer = $('#letter-container');
  var $spaces = $('<ul id="letter-blanks"></ul>');
  for(var i=0; i<word.length; i++){
    var $letter = $('<li id="letter-guess"></li>');
    $spaces.append($letter);
  }
  $letterContainer.append($spaces);
  playGame();
}



function makeLetters(){
  //make alphabet button inputs
  var $myButtons = $('#letter-buttons');
  var $alphabet = $('<ul id="letter-input"></ul>');
  for (var i = 0; i < alphabet.length; i++) {
    var $letter = $('<li id="individual-letter">' + alphabet[i] + '</li>');
    $alphabet.append($letter);
  }
  $('#letter-buttons').append($alphabet);
  $('#mylives').text(numLives);
  //attach event listeners
  $('#letter-input').on('click', function (event) {
    if ( $(event.target).is( "li" ) ) { // prevent clicking of UL and changing class
      if(statusGlobal===3){
        var guess = $(event.target).text();
        $(event.target).addClass("used");
        $(event.target).removeAttr('id');
        playerGuesses.push(guess);
        playGame();
      }
      else{
        console.log('game hasnt started');
      }
    }
  })
}

function playGame(){
  var noDupes = []; //array of guessed letters without duplicates

  if(numLives===0){ //if you run out of lives
    console.log('you lose');
    var finishTime = Math.round(new Date() / 1000);
    var totalTime = finishTime - gameStartTime;
    database.ref('result').set('player '+ playerNum + " ran out of lives");

  }
  else if(statusGlobal!==3){ //if all players aren't in the game yet
    console.log('game hasnt started');

  }
  else{
    console.log(wordGlobal) //answer
    noDupes = playerGuesses.filter(function (el, i, arr) { //gets rid of duplicate guesses from player and returns array
	    return arr.indexOf(el) === i;
      });

    for(var i=0; i<noDupes.length; i++){ //compares array of guessed letters with answer word
      var letterIndicies = countInString(noDupes[i], wordGlobal); //returns indicies of letter in answer word
      if(letterIndicies.length===0){ //if letter is not in answer word, proceed to evaluate if a life should be subtracted or not
        var badLetter = countInString(noDupes[i], guessedLetters); //returns indicies of each incorrect guess in guessedLetters array
        if(badLetter.length===0){ //if the letter hasn't been processed as incorrect already
          numLives--; //decrement life
          $('#mylives').text(numLives); //update DOM
          guessedLetters.push(noDupes[i]); //push incorrect guess to incorrect array
        }
      }
      else{ //if letter is in answer word
        for(var j=0; j<letterIndicies.length; j++){ //append to dom for each instance that letter is in word
          $('li#letter-guess').eq(letterIndicies[j]).text(noDupes[i]);
          checkForWinner(noDupes, wordGlobal);
        }
      }
    }
  }
}


function countInString(searchFor,searchIn){ //return indicies of all elements in a string
  var results=[];
  for(var i=0; i<searchIn.length; i++){
    if(searchFor===searchIn[i]){
      results.push(i);
    }
  }
  return results;
}

function checkForWinner(array, string){
  var result = 0;
  string = string.split('');
  var noDupes = string.filter(function (el, i, arr) { //gets rid of duplicate letters in answer word
    return arr.indexOf(el) === i;
    });

  for(var i=0; i<array.length; i++){ //checks how many unique letters have been found in array
    if(string.indexOf(array[i])>-1){
      result++;
    }
  }

  if(result===noDupes.length){ //if win scenario
    console.log('win!')
    var finishTime = Math.round(new Date() / 1000);
    var totalTime = finishTime - gameStartTime;
    database.ref('result').set('player '+ playerNum + "won");
  }
}
