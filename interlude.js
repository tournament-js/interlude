var $ = require('autonomy');

module.exports = function () {
  var fns = arguments;
  return function () {
    var res = fns[0].apply(this, arguments);
    for (var i = 1, len = fns.length; i < len; i += 1) {
      res = fns[i](res);
    }
    return res;
  };
};

$.extend(module.exports, $);
$.extend(module.exports, require('operators'));
$.extend(module.exports, require('subset'));
