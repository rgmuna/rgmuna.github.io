//test test test

//local server in terminal: http-server -p 3000

//initialize object array for handlebars
var pulledData = {};
var $popUp = $("#popUp");
var nasaIndicator = 0; //used to indicate how to attach to DOM

var bbcUrl = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=f3a927224af947e290a444fdae7242ca";
var mashUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json"
var weatherUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast/daily?id=5368361&APPID=60a9e19468acc3046f659f9bc175f8a8&units=imperial"
var nasaUrl = 'https://api.nasa.gov/planetary/apod?api_key=H0RnwzmfBVSEpcfmVnUf9aGc8dh74vDGVNxuxrY5&date=' //add date to end YYYY-MM-DD

//compile handlebars
pulledData.compileMainItems = function(item){
  var source = $('#article-template').html(); //get source from HTML on what complie should look like
  var template = Handlebars.compile(source); //complie using Handlebars
  return template(item); //for the item that needs compiling, return using the template
};

//function that pulls JSON data
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
            mashableAssignments(response);
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

//function that creates all the nasa urls for different days and performs the ajax request to make one JSON array
function getNasaData(){
  var numDays = prompt('How many days of pictures would you like?'); //if u want to prompt for number of days
  while(isNaN(numDays)){ //make sure input is a number
    var numDays = prompt('Please enter a value for how many days worth of pictures:');
  }
  //create array of dates for the past 10 days
  var todayDate = moment().format('YYYY-MM-DD');
  var dateArray = [];
  for(i=0; i<numDays; i++){ //create urls for number of days
    var ddate = moment().subtract(i, 'days').format('YYYY-MM-DD');
    dateArray.push(ddate);
  }
  var JSONarray = {};
  for (i=0; i < numDays; i++){
    (function(i){
        $.ajax(
          {
            type: "GET",
            url: nasaUrl + dateArray[i],
            data: {format: JSON},
            success: function(request) {
                        JSONarray[i] = request;
                        if(i===(numDays-1)){
                          nasaAssignments(JSONarray);
                        }
                    }
            //error: function() {alert('Error: Cannot load page')};
          });
      })(i);
  }
  popUpToggle("off");
}


$(document).ready(function() {

  popUpToggle("on"); //loading pop up
  jsonData(mashUrl, "Mashable"); //initalize first source

  var $mashableButton = $("#mashable-button");
  var $bbcButton = $("#bbc-button");
  var $weatherButton = $("#weather-button");
  var $nasaButton = $("#nasa-button");
  var $search = $('#search');

  $mashableButton.on("click", function(event){
    event.preventDefault();
    nasaIndicator = 0;
    popUpToggle("on");
    $('#main').empty();
    jsonData(mashUrl, "Mashable");
  })

  $bbcButton.on("click", function(event){
    event.preventDefault();
    nasaIndicator = 0;
    popUpToggle("on");
    $('#main').empty();
    jsonData(bbcUrl, "BBC");
  })

  $weatherButton.on("click", function(event){
    event.preventDefault();
    nasaIndicator = 0;
    popUpToggle("on");
    $('#main').empty();
    jsonData(weatherUrl, "weather");
  })

  $nasaButton.on("click", function(event){
    event.preventDefault();
    nasaIndicator = 1;
    popUpToggle("on");
    $('#main').empty();
    getNasaData();
  })

  $(document).on('keyup',function(evt) { //use escape key to remove popup
    event.preventDefault();
    if (evt.keyCode == 27) {
       if(!$popUp.hasClass("hidden")){
         $popUp.addClass("hidden");
       };
    }
  });

  $search.on('keyup',function(evt) { //use enter key to remove search
    event.preventDefault();
    if (evt.keyCode == 13) {
      $('input').val('');
      $search.removeClass('active');
    }
  });

  $search.on('click', function(event){ //press search and focus on search box
    event.preventDefault();
    $search.toggleClass('active');
    setTimeout(function(){
      $('input').focus();
    }, 100)
  });

  $('input').keyup(function(e){ //takes in search input and runs filter function
    event.preventDefault();
    if( e.which == 8 || e.which == 46 ){
      $('h3').parent('a').parent('section').parent('article').removeClass('hidden');
      searchFilter($('input').val())
    };
    searchFilter($('input').val());
  });

});

//function for filtering feeds based on search value
function searchFilter(searchValue){
  var data = pulledData.content;
  var options = {tokenize: true, matchAllTokens: true, minMatchCharLength: 2, keys: ['title'], id: 'title'};
  var fuse = new Fuse(data, options);
  var searchResult = fuse.search(searchValue);

  if(searchResult.length === 0){
    $('h3').parent('a').parent('section').parent('article').removeClass('hidden');
  }
  else{
    data.forEach(function(num, index){
      if(searchResult.indexOf(num.title) === -1){ //if an element in the original array isn't found in the filter
        $('h3')[index].parentNode.parentNode.parentNode.classList.add("hidden")
      }
    })
  }
}

//compiles output of each function and appends to the DOM
function appendMainFeed(handlebarArray){
  var $main = $("#main"); //place to put all the articles
  for(var i=0; i<handlebarArray.length; i++){
    var itemCompiled = pulledData.compileMainItems(handlebarArray[i]); //compile each item from initial array
    $main.append(itemCompiled); //append each compiled item to the correct list in the DOM
  }
  //attach event listeners to each title link
  $("h3").each(function(index){
    var popUpTitle = pulledData.content[index].title;
    var popUpContent = pulledData.content[index].content;
    var popUpLink = pulledData.content[index].link;
    var popUpImage = pulledData.content[index].image;
    var $closer = $(".closePopUp");

    $(this).on("click", function(event){ //event listeners
      $closer.text("X");
      $popUp.removeClass("hidden");
      $popUp.removeClass("loader");
      $('#popUp h1').text(popUpTitle);
      if(nasaIndicator===1){ //special layout for NASA source for appending image to content
        $('#popUp p').html(popUpContent);
        var img = $('<img>');
        img.attr('src', popUpImage);
        img.appendTo('#popUp p');
        $('#popUp #article-link').addClass("hidden");
      }
      else if(nasaIndicator===0){ //for all non-nasa sources
        $('#popUp p').html(popUpContent);
        $('#popUp #article-link').removeClass("hidden");
        $('#popUp #article-link').attr('href', popUpLink);
      }
      $closer.on("click", function(){ //event listner for X to exit
        $popUp.addClass("hidden");

      });
    });
  });
}

//function that toggles popUp
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

//Create pulledData object for MASHABLE
function mashableAssignments(JSONresp){
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
  appendMainFeed(pulledData.content);
}

//Create pulledData object for bbc
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
  appendMainFeed(pulledData.content);
}

//converts UNIX timestamp to an actual date
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year ;
  return time;
}

//Create pulledData object for openWeather
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
    var jcontent = 'Max Temp: ' + jmax + '\xB0F' + '<br />' + 'Min Temp: ' + jmin + '\xB0F' + '<br />' + jpressure + '<br />' + jhumidity + '<br />' + jcloudiness;

    var jdate = moment(jdate).format('dddd MM/DD/YYYY');
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
  appendMainFeed(pulledData.content);
}

//creates weather codes for returning the correct image
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

//Create pulledData object for NASA
function nasaAssignments(JSONresp){
  pulledData.content = []; //array with all the objects for handlebars
  var $sourceName = $("#source-name");
  $sourceName.text("NASA Pics");

//create each article object and push into array
  for (var element in JSONresp){
    var jtitle = JSONresp[element].title;
    var jshares = JSONresp[element].date;
    var jimage = JSONresp[element].url;
    var jcontent = JSONresp[element].explanation;
//define each object and load into the array

    var jshares = moment(jshares).format('dddd MM/DD/YYYY');

    pulledData.content.push(
      {title: jtitle,
      shares: jshares,
      image: jimage,
      content: jcontent
      }
    );
  }
  appendMainFeed(pulledData.content);
}
