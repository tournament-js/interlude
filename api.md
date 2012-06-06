# Interlude API
For document brevity, $ is assumed to be the require placement of
interlude, fn/f/g/h are assumed to be function names, anything ending in s
is an array, and x is related to xs by being an element of.

## Common
### $.id(x) :: x
The identity function f(x) = x.

````javascript
var x = "going through the identity";
$.id(x) === x; // true
````

### $.noop([..]) :: Undefined
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

### $.not(fn) :: (x -> Bool)
Returns a function which negates `fn` results.
Sometimes useful for composing certain functions.

````javascript
[8,3,4,5,6].filter($.not($.gt(5))); // [3, 4, 5]
````

### $.all (fn) -> (xs -> Bool)
An accessor for Array.prototype.every, but curried for the array.

````javascript
$.all($.gt(2))([3,4,5]); // true
[[3,4,5], [1,3,5]].filter($.all($.gt(2))); // [ [3, 4, 5] ]
````

### $.any (fn) -> (xs -> Bool)
An accessor for Array.prototype.some, but curried for the array.

````javascript
$.any($.gt(2))([1,2,3]); // true
[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [4, 5, 6] ]
````

### $.none (fn) -> (xs -> Bool)
An accessor for the negated Array.prototype.some, but curried for the array.

## Math
All Math functions operate purely on Number instances, and gcd & lcm
in particular are only well-defined for integers.

### $.gcd(a, b) :: Int
Returns the greatest common divisor (aka highest common factor) of
two Integers.

````javascript
$.gcd(3, 5); // 1
$.gcd(10, 15); // 5
````

### $.lcm(a, b) :: Int
Returns the least common multiple of the Integers a and b.

````javascript
$.lcm(3, 5); // 15
$.lcm(10, 15); // 30
````

### $.pow(exp) :: (x -> Number)
Returns a function which returns the input to the power of exp.

````javascript
$.pow(2)(3); // 8
[1,2,3,4].map($.pow(2)); // [1, 4, 9, 16]
````

### $.logBase(base) :: (x -> Number)
Returns a function which returns log base b of input.

````javascript
logBase(2)(8); // 3
[16,8,4,2].map($.logBase(2)); // [4, 3, 2, 1]
````

### $.even(n), $.odd(n) :: Bool
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

### $.equality2(props..) :: ((x, y) -> x 'equality on props' y)
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

### $.equality(props..)(y) :: (x -> x 'equality on props' y)
This is $.equality2 curried with the first element to test against.
If equality has a more specific meaning for a set of records for instance,
then it is useful to have a curriable version around in case you
want to filter it.

````javascript
var lenEquals = $.equality2('length');
[[1,3,5], [2,3], [2,4,6]].filter(lenEquals(3)); // [ [1,3,5], [2,4,6] ]
````

## Membership

### $.elem(xs) :: (x -> Bool)
### $.notElem(xs) :: (x -> Bool)

The membership tests are accessors for Array.prototype.indexOf,
but with the array curried.

```javascript
[1,2,3,4,3].filter($.elem([1,3])); // [ 1, 3, 3 ]
[1,2,3,4,3].filter($.notElem([1,3])); // [ 2, 4 ]
````

##  Higher Order Looping
These tools allow loop like code to be written in a more declarative style.

### $.range(Int stop) :: [1 , 2 , .. , stop]
### $.range(Int start, stop) :: [start, start + 1, .. , stop]
### $.range(Int start, Int stop, Int step) :: [start, start + step, ..]
Returns an inclusive range from start to stop, where start and step defaults to 1.
The if step is >1, the range may not include the stop.

````javascript
$.range(5); // [ 1, 2, 3, 4, 5 ]
$.range(0, 4); // [ 0 , 1, 2, 3, 4 ]
$.range(1, 6, 2); // [ 1, 3, 5 ]
$.range(0, 6, 2); // [ 0, 2, 4, 6 ]
````

### $.fold (fn [, start]) :: (xs -> results)
An accessor for Array.prototype.reduce, but with the function curried.
`fn` must be a two parameter (y, x -> y) function.

````javascript
$.product = $.fold($.multiply2, 1);
var fiveFactorial = $.product($.range(1,5)); // 120

$.flatten = $.fold($.concat2, []);
$.flatten([ [1,3,2], [2,[3],2] , [1] ]); // [ 1, 3, 2, 2, [ 3 ], 2, 1 ]
````

### $.scan (fn [, start]) :: (xs -> results)
Operationally equivalent to `$.fold` but collects all the intermediate results.

````javascript
$.fold($.add2, 0)([1,1,1,1]); // 4
$.scan($.add2, 0)([1,1,1,1]); // [ 0, 1, 2, 3, 4 ]
````

### $.iterate(num, fn) :: (initial -> results)
Returns a function which iterates `num` times over a `fn` (x -> x)
by passing the result of the previous iteration into the next call
to `fn` and collecting the results.

````javascript
$.iterate(3, $.prepend("ha"))("ha!"); // [ 'ha!', 'haha!', 'hahaha!' ]
````

## Comparison
### $.comparing(prop [, ord [, ..]]) :: (x, y -> x 'compare props' y)
This is a special function that creates a comparison function which can be used
directly by Array.prototype.sort. Pass in the name(s) of a (numeric!) property the
elements to be sorted all have, and a sort compatible function will be returned.

A second parameter can be specified to set the
direction of comparison; '+' for ascending, '-' for descending (default).

It is possible to also sort by multible properties, i.e. sort by the first property
if they are different, otherwise, the next and so on. If multiple properties
are used, then the direction for each must be specified in alternating order.

````javascript
[[1,3], [2,2],[3,4]].sort($.comparing(1)); // [ [2,2], [1,3], [3,4] ]

var money = [{id: 1, money: 3}, {id: 2, money: 0}, {id: 3, money: 3}];
money.sort($.comparing('money', '+', 'id', '+'));
// [ { id: 3, money: 3 }, { id: 1, money: 3 }, { id: 2, money: 0 } ]
````


## Lifts and Unlifts
Lifting is the process of converting a variadic function into a function
acting on an Array. Unlifting is the reverse process; turn an array function
into a variadic one. These operations are used by Interlude to create synonymous
versions that normally we'd have to manually fn.apply ourselves.

### $.lift(fn [, context]) -> (xs -> fn.apply(context, xs))
An accessor for Function.prototype.apply, but curried for the array of arguments.

```javascript
$.maximum = $.lift(Math.max, Math);
$.maximum([3,6,4,2]); // 6
````

### $.unlift(fn [, context]) -> (args.. -> fn.apply(context, [args]))
Take a lifted function (one that take a single array argument) and turn it into a
variadic one; the inverse operation of lift. Variadic/unlifted functions work with
$.zipWith for any number of lists.

````javascript
$.multiply = $.unlift($.product);
$.multiply(1,2,3,4,5); // 120
````

## Array Functions
These take an array `xs` and does the semantically named operation.

### $.maximum(xs) :: Number
### $.minimum(xs) :: Number
### $.maximumBy(fn, xs) :: xs[maxidx]
### $.minimumBy(fn, xs) :: xs[minidx]

If you need to do some computation on each element before taking the max,
then `$.maximumBy` is appropriate, it will also return the element for which
`fn` return the max rather than the maximum return. To simply get the
maximum return value consider collecting up the values first.

````javascript
$.maximum([1,3,2,5]); // 5
$.maximumBy($.get('length'), [ [1,3,2], [2], [2,3] ]); // [ 1, 3, 2 ]
$.maximum($.collect('length', [ [1,3,2], [2], [2,3] ])); // 3
````

### $.sum(xs) :: Number
### $.product(xs) :: Number
### $.flatten(xs) :: Array
### $.and(xs) :: Bool
### $.or(xs) :: Bool

## Variadic Functions
These act on several arguments, and can be used with `$.zipWith` for any number
of lists.

### $.add(x [, y [, z [, ..]]])
### $.multiply(x [, y [, z [, ..]]])
### $.concat(xs [, ys [, zs [, ..]]])


## Functional Composition
### $.compose(f [, g [, ..]]) :: (x -> f(g(..(x))))
### $.sequence(f [, g [, ..]]) :: (x -> ..(g(f(x))))
### $.composition(fns) :: (x -> $.compose(fn1, ..)(x))
### $.pipeline(fns) :: (x -> $.sequence(fn1, ..)(x))

## Functional Getters/Setters
### $.get(prop) :: (el -> el[prop])
### $.set(prop) :: ((el, value) -> el)
This sets `el[prop] = value` before returning, so it will modify objects passed in.
This can be used with $.zipWith with an element list and a value list.

### $.collect(prop, xs) :: ys
Behaviourally equivalent to `xs.map($.get(prop))`.

### $.inject(prop, fn) :: (xs -> xs)
Updates `xs[i][prop] = fn(xs[i])` for all i and returns the modified array.

## zip && zipWith
A veritable corner stone of Functional Programming made dynamic, and
now work for any number of lists!

### $.zip(xs, ys [, zs [, ..]]) :: ls
Returns an array of arrays extracted from the input arrays, by joining them on
array index. The shortest array will limit the length of the return.

````javascript
$.zip([1,2,3], [2,2,2]); // [ [1,2], [2,2], [3,2] ]
$.zip($.range(5), [1,2], [3,2,5]); // [ [1,1,3], [2,2,2] ]
````

### $.zipWith(fn, xs, ys [, zs [, ..]]) :: ls
Same as `$.zip`, but applies each result array to `fn`,
and collects these results rather.


````javascript
$.zipWith($.multiply, [2,2,2], [1,0,1], [1,2,3]); // [ 2, 0, 6 ]
$.zipWith($.plus2, [1,1,1], $.range(5)); // [2, 3, 4]
````
