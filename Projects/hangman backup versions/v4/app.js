
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
var randomWordUrl = 'https://accesscontrolalloworiginall.herokuapp.com/http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&excludePartOfSpeech=conjunction&minCorpusCount=10000&maxCorpusCount=0&minDictionaryCount=1&maxDictionaryCount=-1&minLength=8&maxLength=18&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5&excludePartOfSpeech=family-name&excludePartOfSpeech=proper-noun&excludePartOfSpeech=suffix&excludePartOfSpeech=proper-noun-plural&excludePartOfSpeech=proper-noun-posessive';
var wordGlobal; //answer word pulled from API
var statusGlobal; //keeps track of game status (i.e. how many players have signed in)
var numLives = 10; //number of incorrect guesses you have before you lose
var guessedLetters = []; //letters that have been guessed and have been processed
var gameStartTime;
var initialNum1 = 0; //for progress bar
var width1 = 0; //start of progress bar
var widthEnd1 = 0; //end of progress bar
var initialNum2 = 0; //for progress bar
var width2 = 0; //start of progress bar
var widthEnd2 = 0; //end of progress bar

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
      'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
      't', 'u', 'v', 'w', 'x', 'y', 'z'];

$(document).ready(function () {

  //pull game status value
  var gameStatus;
  database.ref('Game Status').on('value', function (results) {
    gameStatus = results.val();
    if(gameStatus===2){
      $('#new-game').text('New Game');
      if(playerNum===1 || playerNum===2){
        $('#messages').text('Game has started! Start guessing Player ' + playerNum );
        if(playerNum===1){
          $('#messages').css('background-color', 'aqua');
          $('header').css('background-color', 'aqua');
          $('#myCanvas').css('background-color', 'aqua');
        }
        else{
          $('#messages').css('background-color', 'darkorchid');
          $('header').css('background-color', 'darkorchid');
          $('#myCanvas').css('background-color', 'darkorchid');
        }
        database.ref('Game Status').set(3);
        gameStartTime = Math.round(new Date() / 1000);
        statusGlobal = gameStatus;
        wordGlobal = databaseWord;
        makeLetterSpaces(databaseWord);
      }
      else{
        $('#messages').text('Game is in progress! Wait for the next one.');
      }
    }
    else if(gameStatus===4){ //win status
      console.log('winner');
    }
    else if(gameStatus===0){
      $('#new-game').text('Start');
      database.ref('player1 progress').set(0);
      database.ref('player2 progress').set(0);
      database.ref('result').set('');
      $('#messages').css('background-color', 'antiquewhite');
      $('header').css('background-color', 'SaddleBrown');
      $('#myCanvas').css('background-color', 'antiquewhite');
      $('#messages').text('Press "Start" to play');
    }
    else if(gameStatus===5){
      window.location.reload(true);
      database.ref('Game Status').set(0);
    }
  })

  database.ref('result').on('value', function (results) { //response when game result is declared
    var gameResult = results.val();
    var oppositePlayer;
    if(playerNum===1){
      oppositePlayer=2;
    }
    else if(playerNum===2){
      oppositePlayer=1
    }

    if(gameStatus===3){
      if(numLives===0){
        $('#messages').css('background-color', 'red');
        $('#messages').text('You DIED! The solution was: ' + wordGlobal)
      }
      else if(gameResult===playerNum){
        $('#messages').css('background-color', 'lime');
        $('#messages').text('You WON! The solution was: ' + wordGlobal)
      }
      else if(gameResult===oppositePlayer){
        $('#messages').css('background-color', 'red');
        $('#messages').text('You LOST! The solution was: ' + wordGlobal)
      }
      else{
        $('#messages').css('background-color', 'antiquewhite');
        $('#messages').text('Game ended. Press New Game!')
      }
    }
    else{
      $('#messages').text('Press New Game to get started!');
    }

  });

  //pull word from database (only matters for second player)
  var databaseWord;
  database.ref('word').on('value', function (results) {
    databaseWord = results.val();
  });

  database.ref('player1 progress').on('value', function(result){
    move(result.val(), 1);
  })

  database.ref('player2 progress').on('value', function(result){
    move(result.val(), 2);
  })

  $('#reset').on('click', function(event){
    event.preventDefault();
    reset();
  })

  $('#new-game').on('click', function(event){
    event.preventDefault();
    if(gameStatus===0){ //if game is new and no one is playing yet
      playerNum = 1;
      database.ref('player1 progress').set(0);
      database.ref('player2 progress').set(0);

      database.ref('winner').set('');
      $('#messages').text('You are Player 1. Waiting for second player.');

      database.ref('Game Status').set(1);
      //make dom element to say "waiting for player 2"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    }
    else if(gameStatus===1){ //if player one is ready, sets player two
      if(playerNum===1){
        alert('Waiting for second player!');
      }
      else{
      playerNum = 2;
      $('#messages').text('You are Player 2');
      database.ref('Game Status').set(2);
      getWord(gameStatus); //upload random hangman word to database
      }
    }
    else if(gameStatus===3){
      if(playerNum===1 || playerNum===2){
        if (confirm('Are you sure you want to end the current game?')) {
          alert("Someone hit 'New Game' and ended the current game! Press 'New Game' to play again!");
          database.ref('Game Status').set(5);
        }
        else {
          alert('Game is in progress! Wait until the messages prompts for a new game.');
        }
      }
      else{
        alert('Game is in progress! Wait until the messages prompts for a new game.');
      }
    }
  else if(gameStatus===4){
    database.ref('Game Status').set(5);
  }
  })

  $('#instructions').on('click', function(event){
    $('.instruction-text').toggleClass('invisible');
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
          if(response.word[0] === response.word[0].toUpperCase()){ //check if returned word is uppercase (since API is stupid)
            getWord(status); //run again until no upper cases
          }
          else{
          uploadWord(response.word);
        }
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
    var $letter = $('<li id="letter-guess">' + '&nbsp;' + '</li>');
    $spaces.append($letter);
  }
  $letterContainer.append($spaces);
  playGame();
}

function makeLetters(){ //make alphabet button inputs
  var $myButtons = $('#letter-buttons');
  var $alphabet = $('<ul id="letter-input"></ul>');
  for (var i = 0; i < alphabet.length; i++) {
    var $letter = $('<li id="individual-letter">' + alphabet[i] + '</li>');
    $alphabet.append($letter);
  }
  $('#letter-buttons').append($alphabet);
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

function playGame(){ //does calculations based on input to determine winner
  var noDupes = []; //array of guessed letters without duplicates
  var correctLetters = 0;
  if(numLives===0){ //if you run out of lives
    $('#myCanvas').css('background-color', 'red');
    var finishTime = Math.round(new Date() / 1000);
    var totalTime = finishTime - gameStartTime;
    if(playerNum===1){
      database.ref('result').set(2);
    }
    else{
      database.ref('result').set(1);
    }

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
      correctLetters = correctLetters + letterIndicies.length;
      if(letterIndicies.length===0){ //if letter is not in answer word, proceed to evaluate if a life should be subtracted or not
        var badLetter = countInString(noDupes[i], guessedLetters); //returns indicies of each incorrect guess in guessedLetters array
        if(badLetter.length===0){ //if the letter hasn't been processed as incorrect already
          numLives--; //decrement life
          draw(numLives);
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
    var percentCorrect = correctLetters/wordGlobal.length*100;
    console.log(percentCorrect)
    database.ref('player' + playerNum + ' progress').set(percentCorrect);
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

function checkForWinner(array, string){ //checks if someone has won
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
    var finishTime = Math.round(new Date() / 1000);
    var totalTime = finishTime - gameStartTime;
    database.ref('result').set(playerNum);
    database.ref('Game Status').set(4);
  }
}

function draw(number){
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  switch(number){
    case 9: //platform
        ctx.fillStyle = "#8B4C39";
        ctx.fillRect(0,130,100,75);
        break;

    case 8: //post
        ctx.moveTo(10,5);
        ctx.lineTo(10,130);
        ctx.stroke();
        break;

    case 7: //overhead bar
        ctx.moveTo(10,5);
        ctx.lineTo(50,5);
        ctx.stroke();
        break;

    case 6: //rope
        ctx.moveTo(50,5);
        ctx.lineTo(50, 20);
        ctx.stroke();
        break;

    case 5: //head
        ctx.beginPath();
        ctx.arc(50,30,10,0,2*Math.PI);
        ctx.stroke();
        break;

    case 4: //body
        ctx.moveTo(50, 40);
        ctx.lineTo(50, 70);
        ctx.stroke();
        break;

    case 3: //right arm
        ctx.moveTo(50, 50);
        ctx.lineTo(65, 40);
        ctx.stroke();
        break;

    case 2: //left arm
        ctx.moveTo(50, 50);
        ctx.lineTo(35, 40);
        ctx.stroke();
        break;

    case 1: //right leg
        ctx.moveTo(50, 70);
        ctx.lineTo(65, 90);
        ctx.stroke();
        break;

    case 0: //left leg
        ctx.moveTo(50, 70);
        ctx.lineTo(35, 90);
        ctx.stroke();
        break;
  }
}

function reset(){ //resets the game if necessary
  alert("Restarting Game")
  database.ref('player1 progress').set(0);
  database.ref('player2 progress').set(0);
  database.ref('result').set('');
  database.ref('Game Status').set(5);
  window.location.reload(true);

}


function move(number, playerID) {
  if(playerID===1){
    var $elem = $("#player1-bar");
    //number = number - widthEnd1;
  //  width1 = initialNum1;
  //  widthEnd1 = width1 + number;
    $elem.css('width', number + '%');
  }
  else{
    var $elem = $("#player2-bar");
  //  number = number - widthEnd2;
  //  width2 = initialNum2;
    //widthEnd2 = width2 + number;
    $elem.css('width', number + '%');
  }

  // var id = setInterval(frame, 90);
  //
  // function frame() {
  //   if(playerID===1){
  // 		if (width1 >= widthEnd1) {
  //           clearInterval(id);
  //           initialNum1 = widthEnd1;
  //       } else {
  //           width1++;
  //           $elem.css('width', width1 + '%');
  //       }
  //   }
  //   else{
  //     if (width2 >= widthEnd2) {
  //           clearInterval(id);
  //           initialNum2 = widthEnd2;
  //       } else {
  //           width2++;
  //           $elem.css('width', width2 + '%');
  //       }
  //   }
  // }
}
