//street number, street name, city name, state name and zip code

//Address Arrays
var streetNumber = [123, 456, 789, 101];
var streetName = ["Hope", "Olive", "Main", "Flower"];
var cityName = ["Omaha", "Claremont", "Pomona", "Upland"];
var stateName = ["NM", "NY", "CA", "WY"];
var zipCode = [90015, 87108, 10012, 70612];

//Random number Generators for each address item
var ranStreetNum = Math.floor(Math.random() * streetNumber.length);
var ranStreetName = Math.floor(Math.random() * streetName.length);
var ranCityName = Math.floor(Math.random() * cityName.length);
var ranStateName = Math.floor(Math.random() * stateName.length);
var ranZipCode = Math.floor(Math.random() * zipCode.length);

//print random address
console.log(streetNumber[ranStreetNum] + " " + streetName[ranStreetName] + ", " +
cityName[ranCityName] + " " + stateName[ranStateName] + ", " + zipCode[ranZipCode]);
