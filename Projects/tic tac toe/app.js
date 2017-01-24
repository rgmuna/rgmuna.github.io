
//configuring firebase
var config = {
  apiKey: "AIzaSyBq3j6BZvlk_aCl40pBjqiFYTu_yGNveCU",
  authDomain: "roque-ttt.firebaseapp.com",
  databaseURL: "https://roque-ttt.firebaseio.com",
  storageBucket: "roque-ttt.appspot.com",
  messagingSenderId: "734318643293"
};
firebase.initializeApp(config);

var xPositions = [];
var yPositions = [];
var playerNum ;

var database = firebase.database();

$(document).ready(function () {

  $('#new-game').on('click', function(event){
    event.preventDefault()
    console.log('new game');

    // create a section for positions data in your db
    var positionReference = database.ref('position');

  })

  getPosition();
})




function getPosition(){

  $('#board tr td').on('click', function(event) {
    event.preventDefault()

    var position = $(this)[0].id;
    positionReference.push({
      position: position,
      player: 0
    })
  });

  database.ref('position').on('value', function (results) {

    })


};
