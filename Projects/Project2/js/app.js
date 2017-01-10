

//initialize object array for handlebars
var pulledData = {};
var $popUp = $("#popUp");

var bbcUrl = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=f3a927224af947e290a444fdae7242ca";
var mashUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json"
var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?id=5368361&APPID=60a9e19468acc3046f659f9bc175f8a8&units=imperial"

//compile handlebars -----------------------------
pulledData.compileMainItems = function(item){
  var source = $('#article-template').html(); //get source from HTML on what complie should look like
  var template = Handlebars.compile(source); //complie using Handlebars
  return template(item); //for the item that needs compiling, return using the template
};

//function that pulls JSON data-----------------------------
function jsonData(jsonLink, source) {
  $.ajax({
      url: jsonLink,
      data: {
          // q: "select title,abstract,url from search.news where query=\"cat\"",
          format: "json"
      },
      // Work with the response
      success: function( response ) {
          popUpToggle("off");
          if(source === "Mashable"){
            MashableAssignments(response);
          }
          else if(source === "BBC"){
            bbcAssignments(response);
          }
          else if(source === "weather"){
            weatherAssignments(response);
          }
      },
      error: function() {
        alert('Error: Cannot load page');
      }
  });
}


$(document).ready(function() {

  popUpToggle("on"); //loading pop up

  jsonData(mashUrl, "Mashable"); //initalize first source

  var $mashableButton = $("#mashable-button");
  var $bbcButton = $("#bbc-button");
  var $weatherButton = $("#weather-button");

  $mashableButton.on("click", function(event){
    event.preventDefault();
    popUpToggle("on");
    $('#main').empty();
    jsonData(mashUrl, "Mashable");
  })

  $bbcButton.on("click", function(event){
    event.preventDefault();
    popUpToggle("on");
    $('#main').empty();
    jsonData(bbcUrl, "BBC");
  })

  $weatherButton.on("click", function(event){
    event.preventDefault();
    popUpToggle("on");
    $('#main').empty();
    jsonData(weatherUrl, "weather");
  })

  $(document).on('keyup',function(evt) { //use escape key to remove popup
    if (evt.keyCode == 27) {
       if(!$popUp.hasClass("hidden")){
         $popUp.addClass("hidden");
       };
    }
  });

});

//function for appending the main feed to the main-----------------------------
function appendMainFeed(handlebarArray){
  var $main = $("#main"); //place to put all the articles

  for(var i=0; i<handlebarArray.length; i++){
    var itemCompiled = pulledData.compileMainItems(handlebarArray[i]); //compile each item from initial array
    $main.append(itemCompiled); //append each compiled item to the correct list in the DOM

  }

  //attach event listeners to each title link
  $("h3").each(function(index){
    //console.log(pulledData.content[index].title);
    var popUpTitle = pulledData.content[index].title;
    var popUpContent = pulledData.content[index].content;
    var popUpLink = pulledData.content[index].link;
    var $closer = $(".closePopUp");

    $(this).on("click", function(event){ //event listeners
      $closer.text("X");
      $popUp.removeClass("hidden");
      $popUp.removeClass("loader");
      $('#popUp h1').text(popUpTitle);
      $('#popUp p').text(popUpContent);
      $('#popUp #article-link').attr('href', popUpLink);
      $closer.on("click", function(){ //event listner for X
        $popUp.addClass("hidden");

      });
    });
  });
}

//function that toggles popUp------------------------
function popUpToggle(state){
  $(".closePopUp").text("");
  if(state==="off"){
    $popUp.addClass("hidden");
    $popUp.removeClass("loader");
  }
  else if (state==="on"){
    $popUp.removeClass("hidden");
    $popUp.addClass("loader");
  }
}

//Create pulledData object for MASHABLE -----------------
function MashableAssignments(JSONresp){
  pulledData.content = []; //array with all the objects for handlebars
  var $sourceName = $("#source-name");
  $sourceName.text("Mashable");
//create each article object and push into array
  for (var element in JSONresp.new){
    var jtitle = JSONresp.new[element].title;
    var jshares = JSONresp.new[element].shares.total;
    var jimage = JSONresp.new[element].image;
    var jexcerpt = JSONresp.new[element].excerpt;
    var jlink = JSONresp.new[element].link;
    var jcontent = JSONresp.new[element].content.plain;
//define each object and load into the array
    pulledData.content.push(
      {title: jtitle,
      shares: jshares,
      image: jimage,
      excerpt: jexcerpt,
      link: jlink,
      content: jcontent
      }
    );
  }
//compile the data and load into DOM
  appendMainFeed(pulledData.content);
}

function bbcAssignments(JSONresp){
  pulledData.content = []; //array with all the objects for handlebars
  var $sourceName = $("#source-name");
  $sourceName.text("bbc");
//create each article object and push into array
  for (var element in JSONresp.articles){
    var jtitle = JSONresp.articles[element].title;
    var jshares = '';
    var jimage = JSONresp.articles[element].urlToImage;
    var jexcerpt = JSONresp.articles[element].description;
    var jlink = JSONresp.articles[element].url;
    var jcontent = '';
//define each object and load into the array
    pulledData.content.push(
      {title: jtitle,
      shares: jshares,
      image: jimage,
      excerpt: jexcerpt,
      link: jlink,
      content: jcontent
      }
    );
  }
//compile the data and load into DOM
  appendMainFeed(pulledData.content);
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year ;
  return time;
}

function weatherAssignments(JSONresp){
  pulledData.content = []; //array with all the objects for handlebars
  var $sourceName = $("#source-name");
  $sourceName.text("Los Angeles Weather");

//create each article object and push into array
  for (var element in JSONresp.list){
    var unixDate = JSONresp.list[element].dt; //in place of title
    var jdate = timeConverter(unixDate); //convert unix date to readable date
    var jweather = JSONresp.list[element].weather[0].description; //in place of in place of excerpt
    var imageID = JSONresp.list[element].weather[0].id; //image stuff
    var imageCode = returnWeatherCode(imageID);
    var jimage = 'http://openweathermap.org/img/w/' + imageCode + '.png';
    var jmin =  JSONresp.list[element].temp.min;
    var jmax =  JSONresp.list[element].temp.max;
    var jMinMax = 'Max Temp: ' + jmax + '\xB0F  Min Temp: ' + jmin + '\xB0F'; //in place of shares
    var jpressure = 'Pressure: ' + JSONresp.list[element].pressure + 'hPa';
    var jhumidity = 'Humidity: ' + JSONresp.list[element].humidity + '%';
    var jcloudiness = 'Cloudiness: ' + JSONresp.list[element].clouds + '%';
    var jcontent = jMinMax + '\n' + jpressure + '\n' + jhumidity + '\n' + jcloudiness;

//define each object and load into the array
    pulledData.content.push(
      {title: jdate,
      shares: jweather,
      image: jimage,
      excerpt: jMinMax,
      link: 'http://openweathermap.org/city/5368361',
      content: jcontent
      }
    );
  }
//compile the data and load into DOM
  appendMainFeed(pulledData.content);
}

function returnWeatherCode(id){
    if(id<299){
      return '11d';
    }
    else if(id<399){
      return '09d';
    }
    else if(id<=504){
      return '10d';
    }
    else if(id===511){
      return '13d';
    }
    else if(id<532){
      return '09d';
    }
    else if(id<699){
      return '13d';
    }
    else if(id<799){
      return '50d';
    }
    else if(id===800){
      return '01d';
    }
    else if(id<899){
      return '04d';
    }
}