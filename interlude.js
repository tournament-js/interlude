var $ = require('autonomy');


//TODO: clone, extend, deepEqual? 
//in own module? using xtend for now..

$.extend = require('xtend');
$.extend($, require('wrappers'), require('subset'));

module.exports = $;
