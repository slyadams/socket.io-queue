var Utils = {

    isInt: function(value) {
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));

    }
}

module.exports = Utils;