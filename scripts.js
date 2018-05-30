  var elementsArray = [],
      button = $('button'),
      number = '';

  function makeMultiplyer(x) {
    return function(y) {
      return x * y;
    };
  }

  function makeAdder(x) {
    return function(y) {
      return parseInt(x) + parseInt(y);
    };
  }

   function makeSubtractor(x) {
    return function(y) {
      return parseInt(x) - parseInt(y);
    };
  }

  function makeDivider(x) {
    return function(y) {
      return parseInt(x) / parseInt(y);
    };
  }

  function convertOperatorElementsToStrings(arr) {
    return arr.map(function(el){
      if (typeof el === 'object') {
        return el.dataset.type;
      } else if (typeof el === 'string') {
        return el;
      }
    });
  }

  // returns result, which is then added as the text for the answer
  function sortOrderOfOperations(elementsArray) {
    var result;

    while (elementsArray.length > 1) {
      console.log(elementsArray)
      while (elementsArray.includes('*') || elementsArray.includes('/')) {
        if (elementsArray.includes('*')) {
          var location = elementsArray.indexOf('*'), //location of the *
              locationFirstNum = location-1,
              firstNum = makeMultiplyer(elementsArray[location-1]); //return the inner function of the factory method
          result = firstNum(elementsArray[location+1]) //result of those 3 numbers' operation, calls the method returned above
          elementsArray.splice(locationFirstNum, 3); //removes the elements used in the operation
          elementsArray.splice(locationFirstNum, 0, result) // and replace them with the result
        } else {
            var location = elementsArray.indexOf('/'), //location of the *
                locationFirstNum = location-1,
                firstNum = makeDivider(elementsArray[location-1]); //return the inner function of the factory method
            result = firstNum(elementsArray[location+1]) //result of those 3 numbers' operation, calls the method returned above
            elementsArray.splice(location-1, 3); //removes the elements used in the operation
            elementsArray.splice(locationFirstNum, 0, result) // and replace them with the result
          }
      }

      if (elementsArray.includes('+')) {
        var firstNum = makeAdder(elementsArray[0]);
        result = firstNum(elementsArray[2]);
        elementsArray.splice(firstNum, 3); // once i have result, remove those 3 from the array
        elementsArray.splice(firstNum, 0, result) // and replace them with the result
      }

      if (elementsArray.includes('-')) {
        var firstNum = makeSubtractor(elementsArray[0]);
        result = firstNum(elementsArray[2]);
        elementsArray.splice(firstNum, 3); // once i have result, remove those 3 from the array
        elementsArray.splice(firstNum, 0, result) // and replace them with the result
      }

      return result;
      }
    }

  button.on('click', function(e) {
    var data = e.target.dataset.type;
    var el = e.target;

    // clear input when AC is clicked
    if (data === 'AC') {
      elementsArray = [];
      $('#answer').text(0);
      return;
    }

    if (elementsArray.length === 0 && !$(e.target).hasClass("number")) {
    	return; //if there's nothing in the array yet, only push the data only if it is a number
    }  

    //need to display just the last number in the array to account for double digit numbers
    if ($(el).hasClass("number")) {
      $('#answer').text(data);
    }
      
    var lastItem = elementsArray.length>0 ? elementsArray[elementsArray.length-1] : null;

    if ($(el).hasClass('operator')) {
      elementsArray.push(el);
    } 

    if (lastItem && $(lastItem).hasClass('number') && !$(lastItem).hasClass('operator') && $(el).hasClass('number')) {
      console.log(lastItem)
      var joinedNum = lastItem.dataset.type + el.dataset.type;
      // get rid of the last item and push the joinedNum
      elementsArray.pop().dataset.type;
      elementsArray.push(joinedNum);
      return; //prevents the current element from being added below
    } 

    // how to push a single digit number?
    // if theres an operator after it and the last element is only 1 digit
    if (lastItem && $(el).hasClass('operator') && $(lastItem).hasClass('number')) {
      elementsArray[elementsArray.indexOf(lastItem)] = lastItem.dataset.type;
    }

    if ($(el).hasClass('number')) {
      elementsArray.push(el);
    }

    if (data === '=') { //when = is clicked, convert array of elements to array of strings, and do the math
      elementsArray = convertOperatorElementsToStrings(elementsArray);
      var result = sortOrderOfOperations(elementsArray);
      $('#answer').text(result);
    }

    // create function to negate the number if the +/- is clicked
    if (data === 'pos-neg') {
      var num = parseInt($('#answer').text());
      if (num < 0) {
        num = 0 + num;
      } else if (num > 0) {
        num = 0 - num;
      }
      $('#answer').text(num);
    }
  })

// could also bind events to the keyboard
// improve negate number function to go both ways, pos and negative
// get a border for iphone
// try to create a function that does all the math in one function
// display just the last number in the array to account for double digit numbers
// triple digit numbers
  



