# Interlude API

## Common

- id `$.id(x)`

The identity function f(x) = x.

````javascript
var x = "going through the identity";
$.id(x) === x; // true
````

-  noop `$.noop([x])`

No operation. Does nothing.

````javascript
var log = (console) ? console.log || $.noop
log("log this if possible");
````

- constant `$.constant(x)`

Returns the constant function f(z) = x.

````javascript
[1,3,2].map($.constant(5)); // [5, 5, 5]
````

- has `$.has(obj, key)`

Safe call to Object.prototype.hasOwnProperty. This is not meant to facilitate using an
[object as a hash](http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/).

````javascript
$.has({a: 1, b: 2, c: 3}, "b"); // true
var a = {};
!!a.toString; // true
$.has(a, "toString"); // false
````

- not `$.not(fn)`

Returns a function which returns the result of `fn` negated.
Sometimes useful for composing certain functions.

````javascript
[8,3,4,5,6].filter($.not($.gt(5))); // [3, 4, 5]
````

## Math

- gcd `$.gcd(a, b)`

Returns the greatest common divisor (aka highest common factor) of the Integers
a and b.

````javascript
$.gcd(3, 5); // 1
$.gcd(10, 15); // 5
````

- lcm `$.lcm(a, b)`

Returns the least common multiple of the Integers a and b.

````javascript
$.lcm(3, 5); // 15
$.lcm(10, 15); // 30
````

- pow `$.pow(x)`

Returns a function which takes the input to the power of x.

````javascript
$.pow(2)(3); // 8
[1,2,3,4].map($.pow(2)); // [1, 4, 9, 16]
````

- logBase `$.logBase(b)`

Returns a function which takes the input to the log base b.

````javascript
logBase(2)(8); // 3
[16,8,4,2].map($.logBase(2)); // [4, 3, 2, 1]
````

- even `$.even(n)`
- odd `$.odd(n)`

````javascript
$.even(5); // false
$.odd(5); // true
````



