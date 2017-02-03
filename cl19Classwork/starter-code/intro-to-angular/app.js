angular.module('myApp', [])

  .controller('ClassDemoController', function(){
    var classDemo = this
    console.log('the controller is running')
    classDemo.groceries = ['eggs', 'milk', 'cheese', 'bread']
    classDemo.myName = 'Ira'

    classDemo.buttonClicked = function(){
      classDemo.groceries.push('chocolate')
    }
  })

  .controller('SecondController', function(){
    console.log('second controller is running')

  })
