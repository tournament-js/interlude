# Interlude API
For document brevity, $ is assumed to be the require placement of
interlude, fn/f/g/h are assumed to be function names, anything ending in s
is an array, and when applicable, x is related to xs by being an element of.

## Functional Helpers
### $.id(x) :: x
The identity function f(x) = x.

````javascript
var x = "going through the identity";
$.id(x) === x; // true
````

### $.noop([..]) :: Undefined
No operation. Does nothing.

````javascript
var log = (console) ? console.log : $.noop;
log("log this if possible");
````

### $.constant(x) :: (y -> x)
Returns the constant function f(y) = x.

````javascript
[1,3,2].map($.constant(5)); // [5, 5, 5]
````

### $.has(obj, key) :: Boolean
Safe call to Object.prototype.hasOwnProperty. This is not meant to facilitate using an
[object as a hash](http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/).

````javascript
$.has({a: 1, b: 2, c: 3}, "b"); // true
var a = {};
!!a.toString; // true
$.has(a, "toString"); // false
````

### $.not(fn) :: (x -> Boolean)
Returns a function which negates `fn` results.
Sometimes useful for composing certain functions.

````javascript
[8,3,4,5,6].filter($.not($.gt(5))); // [3, 4, 5]

var partition = function (p, xs) {
  return [xs.filter(p), xs.filter($.not(p))]
};
partition($.gt(5), [8,3,4,5,6]); // [ [ 8, 6 ], [ 3, 4, 5 ] ]
````

### $.all(fn) -> (xs -> Boolean)
An accessor for Array.prototype.every, but with the function curried.

````javascript
$.all($.gt(2))([3,4,5]); // true
[[3,4,5], [1,3,5]].filter($.all($.gt(2))); // [ [3, 4, 5] ]
````

### $.any(fn) -> (xs -> Boolean)
An accessor for Array.prototype.some, but with the function curried.

````javascript
$.any($.gt(2))([1,2,3]); // true
[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [4, 5, 6] ]
````

### $.none(fn) -> (xs -> Boolean)
An accessor for the negated Array.prototype.some, but with the function curried.

### $.elem(xs) :: (x -> Boolean)
### $.notElem(xs) :: (x -> Boolean)

The membership tests are accessors for `Array.prototype.indexOf`,
but with the array curried.

```javascript
[1,2,3,4,3].filter($.elem([1,3])); // [ 1, 3, 3 ]
[1,2,3,4,3].filter($.notElem([1,3])); // [ 2, 4 ]
````

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

### $.even(n), $.odd(n) :: Boolean
Returns whether or not the number is even or odd, respectively.

````javascript
$.even(5); // false
$.odd(5); // true
[1,2,3,4,5,6].filter($.even); // [ 2, 4, 6 ]
````

### $.pow(exp) :: (x -> Number)
An accessor for `Math.pow`, but with exponent curried.

````javascript
[1,2,3,4].map($.pow(2)); // [ 1, 4, 9, 16 ]
````

### $.logBase(base) :: (x -> Number)
An accessor for `Math.log`, but currying the base converted to
(dividing with `Math.log(base)`). `$.logBase(Math.E)` is equivalent to `Math.log`.

````javascript
[16,8,4,2].map($.logBase(2)); // [ 4, 3, 2, 1 ]
````

### $.log2 :: (x -> Number)
Shortcut for `$.logBase(2)`.

## Functional Composition
Functional composition is done in sequential (rather than algebraic) order
in interlude. The reasoning for this is there is no real benefit of listing
the functions in the reverse order of execution in JavaScript. The difference is
still highlighted by naming it `seq` for _sequence_, rather than the perhaps
more traditional _compose_.

### $.seq(f [, g [, ..]]) :: (args.. -> ..(g(f(args..))))
Returns a function which will apply the passed in functions in sequential order.

````javascript
var isPair = $.seq($.get('length'), $.eq(2)); // (xs -> Boolean)
[[1,3,2], [2], [], [2,1], [1,2]].filter(isPair); // [ [2,1], [1,2] ]
````

This is a general, doubly variadic version of the more common use case versions
below.

### $.seq2(f, g) :: (x, y, z, w) -> g(f(x, y, z, w))
### $.seq3(f, g, h) :: (x, y, z, w) -> h(g(f(x, y, z, w)))
### $.seq4(f, g, h, k) :: (x, y, z, w) -> k(h(g(f(x, y, z, w))))
These specific shortcut functions are there to speed up the most common use cases
of functional composition; a few functions with a few initial arguments.

The speed of composing functions is in general not significant, but avoiding
the variadic slice penalty can speed up such code
[slightly](http://jsperf.com/crazyfunctional8).

## Property Accessors
These are shortcut functions for extracting a property of an element.
Since this is easier natuarlly to do for one element by using the dot operator,
the use of these functions are primarily for mass extraction via
`Array.prototype.map`.

### $.get(prop) :: (el -> el[prop])
Allows simple property extraction on an element:

````javascript
var objs = [{id: 1, s: "h"}, {id: 2, s: "e"}, {id: 3, s: "y"}];
objs.map($.get('id')); // [ 1, 2, 3 ]
objs.map($.get('s')).join(''); // 'hey'
````

### $.getDeep(props) :: (el -> el[p1][..][pN])
Allows property extraction from more than one level down, via a `.` delimited
string of property names:

````javascript
var objs = [
  {id: 1, s: "h", obj: {ary: [1,2]} }
, {id: 2, s: "e", obj: {ary: [3,4]} }
, {id: 3, s: "y", obj: {ary: [5,6]} }
];
objs.map($.get('obj.ary.1')); // [ 2, 4, 6 ]
````

### $.pluck(prop, xs) :: ys
Shorthand for of a common use-case for `Array.prototype.map`:
extracting simple (not deeply nested) property values.

Behaviourally equivalent to `xs.map($.get(prop))`, but skipping the
extra function call per element.

````javascript
$.collect('length', [ [1,3,2],  [2], [1,2] ]); // [ 3, 1, 2 ]
````

### $.first(xs) :: x
Finds the first element of `xs`.

### $.last(xs) :: x
Finds the last element of `xs`.

### $.firstBy(fn, xs) :: x
Finds the first element `x` in `xs` for which `fn(x)` is true.

### $.lastBy(fn, xs) :: x
Finds the last element `x` in `xs` for which `fn(x)` is true.

````javascript
var ary = [{a:2}, {a:2, b:1}, {a:3}];
var aEq2 = $.seq2($.get('a'), $.eq(2));
$.firstBy(ary, aEq2); // {a:2}
$.lastBy(ary, aEq2); // {a:2, b:1}
````

#### Accessors Note
For all accessors; if a property is undefined on an element, undefined is returned.
This also applies for `first`, `firstBy`, `last` and `lastBy` if the array is
empty or no matches were found.

To only get the defined values from a map of this style; filter by `$.neq()` -
or `$.neq(/*undefined*/)` to be explicit about the inequality test.

````javascript
[{a:5}, {}].map($.get('a')); // [ 5, undefined ]
[{a:5}, {}].map($.get('a')).filter($.neq()); // [ 5 ]
````

##  Looping Constructs
These tools allow loop like code to be written in a more declarative style.

### $.range(stop) :: [1 , 2 , .. , stop]
### $.range(start, stop) :: [start, start + 1, .. , stop]
### $.range(start, stop, step) :: [start, start + step, ..]
Returns an inclusive range from start to stop, where start and step defaults to 1.
The if step is >1, the range may not include the stop.

````javascript
$.range(5); // [ 1, 2, 3, 4, 5 ]
$.range(0, 4); // [ 0 , 1, 2, 3, 4 ]
$.range(1, 6, 2); // [ 1, 3, 5 ]
$.range(0, 6, 2); // [ 0, 2, 4, 6 ]
````

### $.replicate(n, x)
Returns an `n` length Array with the element `x` at every position.

````javascript
$.replicate(5, 2); // [ 2, 2, 2, 2, 2 ]
````

### $.zip(xs, ys [, zs [, ..]]) :: ls
zip takes n arrays and returns an array of n length arrays by
joining the input arrays on index.
If any input array is short, excess elements of the longer arrays are discarded.

````javascript
$.zip([1,2,3], [2,2,2]); // [ [1,2], [2,2], [3,2] ]
$.zip($.range(5), [1,2], [3,2,5]); // [ [1,1,3], [2,2,2] ]
````

### $.zipWith(fn, xs, ys [, zs [, ..]]) :: ls
Same as `$.zip`, but applies each result array to `fn`,
and collects these results rather.

zipWith generalises zip by zipping with the function given as the first argument,
instead of a collecting the elements.
For example, $.zipWith($.plus2, xs, ys) is applied to two arrays to produce
the array of corresponding sums.

````javascript
$.zipWith($.multiply, [2,2,2], [1,0,1], [1,2,3]); // [ 2, 0, 6 ]
$.zipWith($.plus2, [1,1,1], $.range(5)); // [ 2, 3, 4 ]
````

zipWith can also be used for fusing two lists:

````
var vals = ["Peter", "Bam", "Jo"];
var items = [{id:1}, {id:2}, {id:3}];
var nameSetter = function (el, value) {
  el.name = value;
};
$.zipWith(nameSetter, items, vals);
items;
// [ { id: 1, name: 'Peter' },
//   { id: 2, name: 'Bam' },
//   { id: 3, name: 'Jo' } ]
````

### $.iterate(len, x, fn) :: results
Returns a size `len` array of repeated applications of `fn` to `x`:

`$.iterate(len, x, f) equals [x, f(x), f(f(x)), ...]`

````javascript
$.iterate(3, "ha!", $.prepend("ha")); // [ 'ha!', 'haha!', 'hahaha!' ]

// Fibonacci numbers
var fibPairs = $.iterate(8, [0,1], function (x) {
  return [x[1], x[0] + x[1]];
});
$.collect(0, fibPairs);
// [ 0, 1, 1, 2, 3, 5, 8, 13 ]
````

### $.scan(xs, fn, start) :: results
Operationally equivalent to `xs.reduce(fn, start)`,
but additionally collects all the intermediate results. Thus:

`scan(fn, z, [x1, x2, ...]) == [z, f(z, x1), f(f(z, x1), x2), ...]`

This does not use `Array.prototype.reduce` under the covers,
so 3rd and 4th arguments will always be undefined inside `fn`.

````javascript
[1,1,1,1].reduce($.plus2, 0); // 4
$.scan([1,1,1,1], $.plus2, 0); // [ 0, 1, 2, 3, 4 ]
````

## Curried Prototype Method Accessors

### $.map(fn) :: (xs -> results)
An accessor for `Array.prototype.map`, but with the function curried.

### $.filter(fn) :: (xs -> results)
An accessor for `Array.prototype.filter`, but with the function curried.

### $.reduce(fn [, start]) :: (xs -> results)
An accessor for `Array.prototype.reduce`, but with the function curried.

````javascript
// alternative implementations of $.product and $.flatten :
var product = $.reduce($.times2, 1);
var flatten = $.reduce($.append2, []);
````

### $.invoke(method [, args..]) :: (x -> result)
An accessor for any method on the prototype of the type of `x`.

````javascript
[[1,2], [3,4]].map($.invoke('join','w')); // [ '1w2', '3w4']
````


## Functional Extras
To come. Needs some more thought.

## TODO:
how to split everything:

- operators
- comparison/equality + everything using them (set ops/max)
- common + math + accessors(incl. first/last) + looping(zip/range/iterate/map/invoke..)
- wrappers + seq

conclusions:
- keep compare/eq dependent functions in one libraray
- zip/zipWith goes out of the haskell place with the HO loop stuff with range/replicate
- last/first/lastBy/firstBy classified as accessors



