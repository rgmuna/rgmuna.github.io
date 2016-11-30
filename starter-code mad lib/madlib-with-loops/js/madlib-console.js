var startupX = ['Uber', 'Google', 'Amazon', 'Apple', 'Facebook', 'Twitter'];
var startupY = ['Slack', 'Trello', 'Tesla', 'Hyperloop', 'Harvest'];


var favoriteList = [];

document.getElementById("create").onclick = function() {newStartup()};
document.getElementById("save").onclick = function() {saveStartup()};
document.getElementById("print").onclick = function() {printStartup()};

function newStartup() {
  var random1 = Math.floor((Math.random() * startupX.length));
  var random2 = Math.floor((Math.random() * startupY.length));
  var madLibOutput = 'A startup that is ' + startupX[random1] + ', but for ' + startupY[random2];
  document.getElementById("xForY").innerHTML = madLibOutput;
}

function saveStartup(){
  var favoritedMadLib = document.getElementById("xForY").innerHTML;
  favoriteList.push(favoritedMadLib);
}


function printStartup(){

  document.getElementById("favorites").innerHTML = "";


  var ul = document.createElement("ul"); //create unordered list

  for(var i=0; i<favoriteList.length; i++){
    var li = document.createElement("li");
    var ti = document.createTextNode(favoriteList[i]);
    li.appendChild(ti);
    ul.appendChild(li);
  }
  document.getElementById("favorites").appendChild(ul);
}
