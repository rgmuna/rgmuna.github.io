# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Advanced APIs

NOTE: To view slides, install [reveal-md](https://github.com/webpro/reveal-md) and run
`reveal-md --theme white`

---

###Roadmap:
* Attendance and Exit Ticket Questions
* [Opening](#opening) | Introduction to Advanced APIs
* [Introduction](#introduction) | OAuth
* [Set Up](#setup) | LocalLandscapes: Let's Get to Building!
* [Demo](#demo) | Starter Code Review
* [Codealong](#codealong1)  | 500px OAuth
* [Lab (Part 1)](#lab1) | Conditional Views: Independent Practice 
* [Codealong](#codealong2) | Get User's Location
* [Codealong](#codealong3) | Call 500px Endpoint
* [Lab (Part 2)](#lab2) | Handle Response: Independent Practice
* [Lab (Part 3)](#lab3) | API Exploration: Independent Practice
* Review
* Homework & Exit Tickets

---


### Learning Objectives
*After this lesson, students will be able to:*

- Generate API specific events and request data from a web service.
- Implement a geolocation API to request a location.
- Process a third-party API response and share location data on your website.
- Make a request and ask another program or script to do something.
- Search documentation needed to make and customize third-party API requests.

---

### Preparation
*Before this lesson, students should already be able to:*

- Have a solid grasp on HTTP fundamentals.
- Know how to manipulate the DOM with jQuery.
- Understand what callback functions are and why they're useful.

---

<a name = "opening"></a>
## Introduction to Advanced APIs

Now that we have a background in consuming an API's data, let's go over what to do when an API requires you to make authenticated requests. 

* Often times when dealing with third-party API's (Google, Twitter, etc.) access to certain endpoints require authentication
* Every time we ping the API it wants to know who we are, and more specifically, that we have the authority to GET/POST/PATCH/DELETE their endpoints. 
* OAuth (Open Authorization) is a common protocol for authenticating with an API

---

<a name = "introduction"></a>
## OAuth

* OAuth is an open standard for authorization.
* It provides client applications a 'secure delegated access' to server resources on behalf of a resource owner. 
* It specifies a process for resource owners to authorize third-party access to their server resources without sharing their credentials.

---

For any company that wants to track the usage of their API on a user level, they will implement OAuth. So how exactly does it work? Let's breakdown the following diagram:

![OAuth flow](https://s3.amazonaws.com/f.cl.ly/items/382N1b0b0j3a3t1n0G0J/Image%202015-11-08%20at%2012.01.35%20PM.png)

---

OAuth Flow:

- User is redirected from our application to the third-party API we wish to authenticate with (let's go with [500px](https://500px.com)).
- User logs into 500px.
- 500px redirects user back to our application with an **access token**.
- User can now make requests for resources from the third-party API with the provided access token. The access token is used by the 500px server to verify a user's authentication and authority to make requests.
- User receives resources from 500px.

---

Having an access token does not mean you can perform any HTTP method on the resource provider's API, nor does it mean your request for any type of data will be granted. 

>Each access token is accompanied with a "scope" of authority. 

* This scope varies per API and user consent. 

**Example:** if you have ever logged into an app using OAuth (maybe you've logged into Spotify with Facebook) you are asked whether or not it is okay for the application to obtain certain information from the third-party API (profile picture, friends list, etc.).

---

<a name = "setup"></a>
## LocalLandscapes: Let's Get to Building!

We will be making an app called LocalLandscapes.

The app will show our user an aggregate of the most popular 500px landscape pictures based off their location.

---

Here are the steps we'll take in this endeavor:

- Get our 500px developer credentials
- Create our initial view which will have a way for our user to perform OAuth
- Get User's location
- Ping the 500px endpoint with User's location and access token
- Parse through API response for images and put them into view

---

#### Which 500px Endpoint Do We Hit?

The first part of creating an app is coming up with the idea. The second part is to find out whether or not the idea is even feasible.

* Google "500px api" 
	* you should be able to find 500px's [documentation on endpoints](https://github.com/500px/api-documentation). 
	* Take a second to explore the possibilities! 

-

####Can you find the endpoint we need for the app we're building today?

---

You should find this:

![500px Photos Search endpoint](https://cloud.githubusercontent.com/assets/204420/15404830/fa9a65e0-1dc4-11e6-8e6a-16fefcd02eb4.png)

As we inspect the 500px endpoint, we can see that as long as we pass certain query values (latitude, longitude, radius and category) we will be given a response containing the landscape photos we want. 

Awesome! Now that we know our app idea is doable, let's start setting it up.

---

#### REVIEW: Get 500px Credentials

> You should have already signed up for the 500px API credentials as homework. We will now quickly review the sign up process, to ensure you understand what all the information entered in is and why it is needed.

* We need to register our application with the API...

---

First and foremost, you must have a 500px account. If you don't already have one, please [sign up](https://500px.com/signup). Once you are signed in, visit 500px's [settings page](https://500px.com/settings/applications). Register your application by clicking on _Applications_ in the left hand menu and then the _Register your application_ button. 

![Register application button](https://cloud.githubusercontent.com/assets/204420/15404835/fe793fce-1dc4-11e6-8270-bf05c1b1d2c4.png)

---

You should see the following:

![Register application](https://cloud.githubusercontent.com/assets/204420/15399945/4115496a-1daf-11e6-9c8c-7054b5983fa0.png)

---

After you fill out the form you'll have:

![Register complete](https://cloud.githubusercontent.com/assets/204420/15404845/02a48ed2-1dc5-11e6-92cb-40be14a0c459.png)

---

**Q: What is _JavaScript SDK Callback URL_?**

A: After our user leaves our app to log in to 500px, 500px redirects them back to our app with the access token. 

How does 500px know where to send the authenticated user? 

_JavaScript SDK Callback URL_

It's the URI that our app will be connected to and so it is the URI we want 500px to redirect back to.

---

You should now see the application you created on your dashboard. Click on _See application details_.

![Click application details](https://cloud.githubusercontent.com/assets/204420/15404851/05ea900a-1dc5-11e6-9452-662d27edbad8.png)

---

![See application details](https://cloud.githubusercontent.com/assets/204420/15399977/67f5719a-1daf-11e6-8f48-ec61fa9d5b59.png)

---

<a name = "demo"></a>
## Starter Code Review

Now that all our app configuration is set up, let's take a look at our starter code.

* HTML file with Bootstrap and jQuery
* CSS and JS files connected
* `app.js` file doesn't contain any code...yet. 

More often than not, the providers of API's will also develop SDK's and client libraries to simplify the process of authenticating with OAuth and making requests to their API for other developers. 

---

In our case, the client library we'll be using is in the file named `500px.js`. 

You'll also notice in your starter code a file named `callback.html` that will facilitate cross domain communication with their API. Don't worry, there's no need to modify either of these files. 

---

We will be breaking up the two parent div nodes, showing them conditionally. 

* Initially, only the top div, `.sign-in-view`, will show and be used for our user to perform OAuth and upon redirect
* Only the bottom parent div, `.image-results-view`, will show with a whole bunch of 500px images appended to `.images` (this syntax denotes a div with a class "images").

---

<a name = "codealong1"></a>
## 500px OAuth

First things first, in order for our app to run on the http://localhost:3000 URI, we need to start a server. For help with this we will globally install the `http-server` node package on our machine:

`npm i -g http-server`

---

Now in our terminal, from the path of our app (i.e. /JS_Materials/curriculum/lesson-plans/11-advanced-apis/starter-code) we can run the command `http-server -p 3000`. 

---

Go ahead and visit http://localhost:3000 in your browser. You should see:

![app](https://cloud.githubusercontent.com/assets/204420/15410888/f5e9764a-1de1-11e6-8806-2133aaebc27c.png)

---

Follow along with the rest of the steps in the *500px OAuth* section in the class curriculum.

---

<a name = "lab"></a>
## Conditional Views - Independent Practice

Before we start using our access token to make requests to 500px, let's first take care of our view. We know that once the user logs in and our app has the access token, we no longer need to prompt the user to log in. Try to use jQuery if possible.

Follow along with the rest of the steps in the *500px OAuth* section in the class curriculum.

---

<a name = "codealong2"></a>
## Get User's Location

Remember, our prompt is to find posted landscape photos based off our user's location. To do so we are going to use the endpoint, [photos search](https://github.com/500px/api-documentation/blob/master/endpoints/photo/GET_photos_search.md). 

Follow along with the rest of the steps in the 500px OAuth section in the class curriculum.



---

<a name = "codealong3"></a>
## Call 500px Endpoint

Now that we have all the pieces of the puzzle needed to ping our 500px endpoint (lat, long and access token), let's make an API request for our photos!

---


```js
...
  var lat = position.coords.latitude;
  var long = position.coords.longitude;

  console.log('lat: ', lat);
  console.log('long: ', long);
  
  // Feel free to adjust the search radius as you see fit
  var radius = '25mi';

  var searchOptions = {
    geo: lat + ',' + long + ',' + radius,
    only: 'Landscapes', // We only want landscape photos
    image_size: 3 // This isn't neccessary but by default the images are thumbnail sized
  };

  _500px.api('/photos/search', searchOptions, function(response) {
    if (response.data.photos.length == 0) {
      alert('No photos found!');
    } else {
      // Handle the successful response here
      
    }
  });
...
```

---

<a name = "lab2"></a>
## Handle Response: Independent Practice

Now that we can successfully call upon the 500px API for resources, it is up to you to define the `handleResponseSuccess` function. Your function should iterate through your response data (which will consist of an array of post data), creating an image element each time with the given image url from the API. Add a class `image` to the image and append it to `.images` which already exists in the HTML. Once again, use as much jQuery as possible.

Please see the class curriculum for lab instructions.

---

<a name = "lab3"></a>
## API Exploration: Independent Practice

Let's get some more practice with reading API documentation and customizing our search results. 

Please see the class curriculum for lab instructions.

---

<a name = "conclusion"></a>
## Review

- What is the OAuth flow?
- Why do some third-party APIs require authentication?
- Go ahead and refactor your code as much as possible. Make it DRY!

