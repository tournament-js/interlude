# Interlude API
For document brevity, the library is assumed to be
require bound to the `$` variable.

## Common
### $.id :: (x -> x)
The identity function f(x) = x.

````javascript
var x = "going through the identity";
$.id(x) === x; // true
````

### $.noop([x]) :: Undefined
No operation. Does nothing.

````javascript
var log = (console) ? console.log || $.noop
log("log this if possible");
````

### $.constant(x) :: (y -> x)
Returns the constant function f(y) = x.

````javascript
[1,3,2].map($.constant(5)); // [5, 5, 5]
````

### $.has(obj, key) :: Bool
Safe call to Object.prototype.hasOwnProperty. This is not meant to facilitate using an
[object as a hash](http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/).

````javascript
$.has({a: 1, b: 2, c: 3}, "b"); // true
var a = {};
!!a.toString; // true
$.has(a, "toString"); // false
````

### $.not(Function f) :: Function g
Returns a function `g` which negates the result of `f`.
Sometimes useful for composing certain functions.

````javascript
[8,3,4,5,6].filter($.not($.gt(5))); // [3, 4, 5]
````

### $.all (Function f) -> (xs -> xs.every(f))
An accessor for Array.prototype.every, but curried for the array.

````javascript
$.all($.gt(2))([3,4,5]); // true
[[3,4,5], [1,3,5]].filter($.all($.gt(2))); // [ [3, 4, 5] ]
````

### $.any (Function f) -> (xs -> xs.some(f))
An accessor for Array.prototype.some, but curried for the array.

````javascript
$.any($.gt(2))([1,2,3]); // true
[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [4, 5, 6] ]
````

### $.none (Function f) -> (xs -> !xs.some(f))
An accessor for the negated Array.prototype.some, but curried for the array.

## Math
### $.gcd(Int a, Int b) :: Int
Returns the greatest common divisor (aka highest common factor) of the Integers
a and b.

````javascript
$.gcd(3, 5); // 1
$.gcd(10, 15); // 5
````

### $.lcm(Int a, Int b) :: Int
Returns the least common multiple of the Integers a and b.

````javascript
$.lcm(3, 5); // 15
$.lcm(10, 15); // 30
````

### $.pow(Number exp) :: (Number x -> Number)
Returns a function which returns the input to the power of exp.

````javascript
$.pow(2)(3); // 8
[1,2,3,4].map($.pow(2)); // [1, 4, 9, 16]
````

### $.logBase(Number base) :: (Number x -> Number)
Returns a function which returns log base b of input.

````javascript
logBase(2)(8); // 3
[16,8,4,2].map($.logBase(2)); // [4, 3, 2, 1]
````

### $.even, $.odd :: Number -> Bool
Returns whether or not the number is even or odd, respectively.

````javascript
$.even(5); // false
$.odd(5); // true
````

## 2-Argument Binary Operators
These are simple two argument lambdas which are useful occasionally.
The function name ending with the number 2 is a naming convention consistently
used throughout the library. It means the function takes 2 arguments and
returns immediately.

### $.add2(x, y) :: x + y
### $.subtract2(x, y) :: x - y
### $.multiply2(x, y) :: x * y
### $.concat2(xs, ys) :: xs.concat(ys)
### $.and2(x, y) :: x && y
### $.or2(x, y) :: x || y
### $.eq2(x, y) :: x === y
### $.weq2(x, y) :: x == y
### $.gt2(x, y) :: x > y
### $.lt2(x, y) :: x < y
### $.gte2(x, y) :: x >= y
### $.lte2(x, y) :: x <= y

````javascript
$.add2(2, 3); // 5
$.or2(false, true); // true
````

### $.equality2(props...) :: ((x, y) -> x 'equality on props' y)
This is a special function that creates an equality testing function based on
properties to test on. It will return true if and only if all the properties listed
are the same for both x and y.

````javascript
var lenEquals = $.equality2('length');
lenEquals([1,3,5], [2,4,6]); // true
lenEquals([1,3,5], [2,4]); // false

var steve = {name: 'Steve', money: 30000, status: "Awesome"};
var peter = {name: 'Peter', money: 30000, status: "Depressed"};
var equallyCool = $.equality2('money', 'status');
equallyCool(steve, peter); // false
````

This can be very powerful combined with the generalized list functions further on!

### $.comparing2(prop [, ord [, ..]]) :: ((x, y) -> x 'compare props' y)
This is a special function that creates a comparison function which can be used
directly by Array.prototype.sort. It will return the difference of x[prop] and
y[prop] with the direction specified by either a '+' for ascending, or
'-' for descending (default). If multiple properties are used, then the direction
for each must be specified in alternating order.

Note that you can only sort by numeric properties with this!

````javascript
[[1,3], [2,2],[3,4]].sort($.comparing2(1)); // [ [2,2], [1,3], [3,4] ]

var money = [{id: 1, money: 3}, {id: 2, money: 0}, {id: 3, money: 3}];
money.sort($.comparing2('money', '+', 'id', '+'));
// [ { id: 3, money: 3 }, { id: 1, money: 3 }, { id: 2, money: 0 } ]
````

## Curried Binary operators
This section is useful for maps, as one of their arguments are curried,
cutting down the amount of very basic closured lambdas you make.

### $.plus(x) :: (y -> x + y)
### $.subtract(x) :: (y -> y - x)
### $.times(x) :: (y -> y * x)
### $.divide(x) :: (y -> y / x)
### $.append(xs) :: (ys -> ys.concat(xs))
### $.prepend(xs) :: (ys -> xs.concat(ys))

````javascript
[1,2,3,4,5].map($.plus(1)); // [2, 3, 4, 5, 6]
[1,2,3,4,5].map($.subtract(1)); // [0, 1, 2, 3, 4]
[1,2,3,4,5].map($.times(2)); // [2, 4, 6, 8, 10]
[2,4,6,8].map($.divide(2)); // [1, 2, 3, 4]
[[1,2], [2,3]].map($.append([-1, 0])); // [ [1,2,-1,0], [2,3,-1,0] ]
[[1,2], [2,3]].map($.prepend([-1, 0])); // [ [-1,0,1,2], [-1,0,2,3] ]
````

Due to the dynamic nature of JavaScript operators, a lot of these also work on
strings.

````javascript
["hello", "hi"].map($.plus("world")); // ["helloworld", "hiworld"]
["hello", "hi"].map($.append("world")); // ["helloworld", "hiworld"]
["hello", "hi"].map($.prepend("world")); // ["worldhello", "worldhi"]
````

### $.gt(y) :: (x -> x > y)
### $.lt(y) :: (x -> x < y)
### $.eq(y) :: (x -> x === y)
### $.weq(y) :: (x -> x == y)
### $.gte(y) :: (x -> x >= y)
### $.lte(y) :: (x -> x <= y)

Curried comparison is useful for filters and combinations with $.any / $.all.

````javascript
[1,4,2,5,2,3].filter($.gt(3)); // [4,5]
[[1,3,5], [2,3,1]].filter($.any($.gte(5))); // [ [ 1, 3, 5 ] ]
````

### $.equality(props...)(y) :: (x -> x 'equality on props' y)
This is $.equality2 curried with the element to test against.
If equality has a more specific meaning for a set of records for instance,
then it is useful to have a curriable version around in case you want to filter it.

````javascript
var lenEquals = $.equality2('length');
[[1,3,5], [2,3], [2,4,6]].filter(lenEquals(3)); // [ [1,3,5], [2,4,6] ]
````

### $.comparing(prop [, ord [, ..]])(y) :: (x -> x 'compare props' y)
This is $.comparing2 curried with the element to compare against.


##  Higher Order Looping
These tools allow loop like code to be written in a more declarative style.

### $.range(Int stop) :: [1 , 2 , ... , stop]
### $.range(Int start, stop) :: [start, start + 1, ... , stop]
### $.range(Int start, Int stop, Int step) :: [start, start + step, ...]
Returns an inclusive range from start to stop, where start and step defaults to 1.
The if step is >1, the range may not include the stop.

````javascript
$.range(5); // [ 1, 2, 3, 4, 5 ]
$.range(0, 4); // [ 0 , 1, 2, 3, 4 ]
$.range(1, 6, 2); // [ 1, 3, 5 ]
$.range(0, 6, 2); // [ 0, 2, 4, 6 ]
````

### $.iterate(Int times, Function f) :: (initial -> [result])
Returns a function which iterates `times` times over `f` and passing the result
of the previous iteration into the next call to `f` and collecting the results.

````javascript
$.iterate(3, $.prepend("ha"))("ha!"); // [ 'ha!', 'haha!', 'hahaha!' ]
````

### $.fold (Function f [, start]) :: (xs -> xs.reduce(f, start))
An accessor for Array.prototype.reduce, but curried for the array.

````javascript
$.product = $.fold($.multiply2, 1);
var fiveFactorial = $.product($.range(1,5)); // 120
````

### $.scan (Function f [, start]) :: (xs -> [result])
Does the same as `$.fold` but collects all the intermediate results.

````javascript
$.scan($.add2, 0)([1,1,1,1]); // [ 0, 1, 2, 3, 4 ]
````


## Lifts and Unlifts
Lifting is the process of converting a variadic function into a function
acting on an Array. Unlifting is the reverse process; turn an array function
into a variadic one. These operations are used by Interlude to create synonymous
versions that normally we'd have to manually fn.apply ourselves.

### $.lift (Function f [, context]) -> (xs -> f.apply(context, xs))
An accessor for Function.prototype.apply, but curried for the arguments array.

```javascript
$.maximum = $.lift(Math.max, Math);
$.maximum([3,6,4]); // 6
````
