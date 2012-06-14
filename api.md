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

### $.partition(xs, fn) :: [ys, zs]
The `partition` function takes a predicate, an array and returns
a 2-length array of arrays of elements which do and do not satisfy the
predicate, respectively; i.e.,

`$.partition(p, xs) equals [xs.filter(p), xs.filter($.not(p))]`

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
An accessor for Math.pow, but with exponent curried.

````javascript
$.pow(3)(2); // 8
$.pow(1/3)(8); // 2
[1,2,3,4].map($.pow(2)); // [1, 4, 9, 16]
````

### $.logBase(base) :: (x -> Number)
Returns a function which returns log base b of input.
`$.logBase(Math.E)` is functionally equivalent to `Math.log`.

````javascript
$.logBase(2)(8); // 3
[16,8,4,2].map($.logBase(2)); // [4, 3, 2, 1]
````

### $.even(n), $.odd(n) :: Boolean
Returns whether or not the number is even or odd, respectively.

````javascript
$.even(5); // false
$.odd(5); // true
[1,2,3,4,5,6].filter($.even); // [ 2, 4, 6 ]
````

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

## Generalized Equality
### $.equality(props..) :: (x, y -> x 'equality on props' y)
This is a special function that creates an equality testing function based on
properties to test on. It will return true if and only if all the properties listed
are the same for both x and y.

````javascript
var lenEquals = $.equality('length');
lenEquals([1,3,5], [2,4,6]); // true
lenEquals([1,3,5], [2,4]); // false

var steve = {name: 'Steve', money: 30000, status: "Awesome"};
var peter = {name: 'Peter', money: 30000, status: "Depressed"};
var equallyCool = $.equality('money', 'status');
equallyCool(steve, peter); // false
````

This can be very powerful combined with the generalized list functions further on!

## Generalized Comparison
These functions help generate
[compare functions](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort)
for `Array.prototype.sort`.

### $.compare([ord]) :: (x, y -> x `compare` y)
This creates a function which returns the numeric difference between x and y,
optionally multiplying by minus one if the ord parameter is set to '-' for
descending order. The default ord parameter '+' for ascending order may be omitted.

When passed to `Array.prototype.sort`, it will sort the array _numerically_
as opposed to the default ECMA behaviour of turning the elements into strings then
sorting them _lexicographically_. This helps avoid common sorting mistakes:

````javascript
[1,4,3,2].sort(); // [1,2,3,4] (expected)
[2, 100, 10, 4].sort(); // [10, 100, 2, 4] (wtf!)

[1,4,3,2].sort($.compare('+')); // [1,2,3,4] (expected)
[2, 100, 10, 4].sort($.compare('+')); // [2, 4, 10, 100] (expected..)
````

### $.comparing(prop [, ord [, ..]]) :: (x, y -> x 'compare props' y)
This creates a numeric compare function returning the numeric difference between
any (or: the) included property which is not zero.
If all properties are identical, it returns zero.

Pass in the name(s) of a (numeric!) property the
elements to be sorted all have, along with the direction of comparison for each
property: '+' for ascending (default), '-' for descending.
The default last ord parameter can be omitted, but it is recommended included,
as the arguments go pairwise: prop1, ord1, prop2, ord2, ...

````javascript
[[1,3], [2,2],[3,4]].sort($.comparing(1)); // [ [2,2], [1,3], [3,4] ]

var money = [{id: 1, money: 3}, {id: 2, money: 0}, {id: 3, money: 3}];
// sort by money asc. first, then id desc.
money.sort($.comparing('money', '+', 'id', '-'));
// [ { id: 2, money: 0 }, { id: 3, money: 3 }, { id: 1, money: 3 } ]
````

### Custom Comparators
While `comparing`, `compare`, and `equality` are great at creating comparison
functions and equality testers, it might still be useful to create curried
functions that compare/filter based on such properties.
Fortunately, this is quite easy to do with the tools available.

````javascript
// Check length >0
var notEmpty = $.seq2($.get('length'), $.gt(0));
[ [1], [], [2,4] ].filter(notEmpty); // [ [1], [2,4] ]

// Check absolute value <=1 on all elements
var withinUnitSquare = $.all($.seq2(Math.abs, $.lte(1)));
[ [1,-1], [1,-2], [1,1,1] ].filter(withinUnitSquare); // [ [1,-1], [1,1,1] ]

// Check euclidean distance of point <=1
var withinUnitCircle = $.seq4($.map($.pow(2)), $.sum, Math.sqrt, $.lte(1));
[ [1,-1], [0,0], [1], [1.1], [0,0.5,0.5], [0,0,0,1] ].filter(withinUnitCircle);
// [ [0,0], [1], [0,0.5,0.5], [0,0,0,1] ]
````

While these examples are contrieved and the efficiency of these
functions could be improved by knowing the dimension of the space
being worked on (typical case) to help inlining a smaller specific function,
it shows that very flexible higher order functions can be expressed very simply.

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
var product = $.reduce($.times2, 1);
var flatten = $.reduce($.append2, []);
````

### $.invoke(method [, args..]) :: (x -> result)
An accessor for any method on the prototype of the type of `x`.

````javascript
[[1,2], [3,4]].map($.invoke('join','w')); // [ '1w2', '3w4']
````

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

#### Accessors Note
If a property is undefined on an element (or something is, in the middle
of a deep property search), undefined is returned (as if you had written the lambda
yourself).
To only get the defined values from a map of this style; filter by `$.neq()` -
or `$.neq(/*undefined*/)` to be explicit about the inequality test.

````javascript
[{a:5}, {}].map($.get('a')); // [ 5, undefined ]
[{a:5}, {}].map($.get('a')).filter($.neq()); // [ 5 ]
````

## Array
Many of these functions (somewhat remarkably) work on strings.

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

### $.maximum(xs) :: Number
### $.minimum(xs) :: Number
### $.maximumBy(fn, xs) :: xs[maxidx]
### $.minimumBy(fn, xs) :: xs[minidx]

If ordering is not based on a single numeric property, or you want the element
containing this property, then `$.maximumBy` is appropriate: Pass in a comparison
function and it will return the element which compares favorably against all
elements in `xs`.

To simply get the maximum return value of a property,
consider collecting up the values first then applying the faster `maximum` function.
Collecting first is going to be faster, but this implies loosing the association
between the original element.

````javascript
$.maximum([1,3,2,5]); // 5

var nested = [[1,3,2], [2], [2,3]];
$.maximum($.collect('length', nested)); // 3
$.maximumBy($.comparing('length'), nested); // [ 1, 3, 2 ]
````

Note that unlike `$.maximum` which returns `-Infinity` in the case of an empty
Array, `$.maximumBy` returns `undefined` as this is the only thing possible
without knowing the structure of the elements in the array.
Similarly for `$.minimum` and `$.minimumBy`.

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

### $.intersect(xs, ys) :: zs
The 'intersect' function takes the intersection of two arrays.
For example,

````javascript
$.intersect([1,2,3,4], [2,4,6,8]); // [ 2, 4 ]
````

If the first array contains duplicates, so will the result.

````javascript
$.intersect([1,2,2,3,4], [6,4,4,2]); //  [ 2, 2, 4 ]
````

It is a special case of 'intersectBy', which allows the programmer to
supply their own equality test.

### $.intersectBy(fn, xs, ys) :: zs
The non-overloaded version of `intersect`.

````javascript
$.intersectBy($.equality('a'), [{a:1}, {a:4, b:0}], [{a:2}, {a:4, b:1}]);
// [ { a: 4, b: 0 } ]
````

### $.nub(xs) :: ys
The nub function removes duplicate elements from an array.
In particular, it keeps only the first occurrence of each element.
(The name nub means _essence_.) Behaviourally equivalent to the generalized
version `nubBy` (which allows the programmer to supply their own equality test)
with `$.eq2` as the supplied equality test, but `nub` exploits the performance
of `Array.prototype.indexOf` to speed up this special case.

````javascript
$.nub([1,3,2,4,1,2]); // [ 1, 3, 2, 4 ]
````

### $.nubBy(fn, xs) :: ys
The generalized version of `nub`.

````javascript
var notCoprime = $.seq2($.gcd, $.gt(1));
var primes = $.nubBy(notCoprime, $.range(2, 11)); // [ 2, 3, 5, 7, 11 ]
````

### $.group(xs) :: ys
The group function takes an array and returns an array of arrays such that
the flattened result is equal to `xs`.
Moreover, each subarray is constructed by grouping the _consecutive_ equal elements
in `xs`. For example,

````javascript
$.group([1,2,2,3,5,5,2]); // [ [1], [2,2], [3], [5,5], [2] ]
````

In particular, if `xs` is sorted, then the result is sorted
when comparing on the first sub element, i.e. `$.comparing(0)`.
It is a special case of groupBy, which allows the programmer to supply
their own equality test.

### $.groupBy(fn, xs) :: ys
The non-overloaded version of `group`.

````javascript
$.groupBy($.equality('a'), [{a:1}, {a:4, b:1}, {a:4, b:0}, {a:1}]);
// [ [ { a: 1 } ],
//   [ { a: 4, b: 1 }, { a: 4, b: 0 } ],
//   [ { a: 1 } ] ]
````

### $.union(xs, ys) :: zs
The union function returns the array union of the two arrays.

````javascript
$.union([1,3,5], [4,5,6]); // [ 1, 3, 5, 4, 6 ]
````

Duplicates, and elements of the first array, are removed from the the second array,
but if the first array contains duplicates, so will the result.
It is a special case of unionBy, which allows the programmer to supply
their own equality test.

### $.unionBy(fn, xs, ys) :: zs
The non-overloaded version of `union`.

````javascript
$.unionBy($.equality('a'), [{a:1},{a:3}], [{a:2},{a:3}]);
// [ { a: 1 }, { a: 3 }, { a: 2 } ]
````

### $.difference(xs, ys) :: zs
Returns the difference between xs and ys; xs \ ys.
The first occurrence of each element of ys in turn (if any) has been
removed from xs. Thus `$.difference(ys.concat(xs), ys) equals xs`.

It is a special case of differenceBy, which allows the programmer to supply
their own equality test.

````javascript
$.difference([1,2,2,3], [2,3,4]); // [ 1, 2 ]
````

### $.differenceBy(fn, xs, ys) :: zs
The non-overloaded version of `difference`.

````javascript
$.differenceBy($.equality('a'), [{a:1}, {a:2}], [{a:2}, {a:3}]);
// [ { a: 1 } ]
````

### $.insert(xs, x) :: xs
The insert function takes an element and an array and inserts the element
into the array at the last position where it is still less than or equal
to the next element. In particular, if the array is sorted before the call,
the result will also be sorted.

It is a special case of `insertBy`,
which allows the programmer to supply their own comparison function.

````
$.insert([1,2,3,4], 3)
[ 1, 2, 3, 3, 4 ]
````

### $.insertBy(fn, xs, x) :: xs
The non-overloaded version of `insert`.

````javascript
$.insertBy($.comparing('a'), [{a:1}, {a:2}, {a:3}], {a:3, n:1})
// [ { a: 1 },
//   { a: 2 },
//   { a: 3, n: 1 },
//   { a: 3 } ]
````

### $.delete(xs, x) :: xs
Removes the first occurrence of `x` from its array argument `xs`.

````javascript
$.delete([1,2,3,2,3], 2); // [ 1, 3, 2, 3 ]
````

Behaviourally equivalent to the generalized
version `deleteBy` with `$.eq2` as the supplied equality test, but
this special case implementation uses `Array.prototype.indexOf` and is faster.

### $.deleteBy(fn, xs, x) :: xs
The generalized version of `delete`.

````javascript
$.deleteBy($.equality('a'), [{a:1},{a:2},{a:3},{a:2}], {a:2})
// [ { a: 1 }, { a: 3 }, { a: 2 } ]
````

#### Warning: delete/insert modifies
For efficiency; `delete`, `insert`, `deleteBy`, `insertBy` all modify the
passed in array. To return an independent result, modify a shallow copy instead:

````javascript
var xs = [1,2,3,4];
$.insert(xs, 2); // [1,2,2,3,4]
xs; // [1,2,2,3,4]

xs = [1,2,3,4]; // reset
$.insert(xs.slice(), 2); // [1,2,2,3,4]
xs; // [1,2,3,4]
````

#### NB2: delete deletes only the first
The delete functions only remove the first instance.
To delete all, `Array.prototype.filter` is best suited:

````javascript
[1,2,2,3,4].filter($.neq(2)); // [1,3,4]
$.delete([1,2,2,3,4], 2); // [1,2,3,4]
````

## Functional Extras
To come. Needs some more thought.
