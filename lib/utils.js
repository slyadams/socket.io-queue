if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([],
  function () {
    this.isInt = function(value) {
      return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
      
    }
  }
);