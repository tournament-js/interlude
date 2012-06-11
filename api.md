# Interlude API
For document brevity, $ is assumed to be the require placement of
interlude, fn/f/g/h are assumed to be function names, anything ending in s
is an array, and when applicable, x is related to xs by being an element of.


# Operators
## Binary Operators (2-Argument Versions)
These are simple two argument lambdas which are useful occasionally.
The function name ending with the number 2 is a naming convention consistently
used throughout the library. It means the function takes 2 arguments and
returns immediately.

### $.plus2(x, y) :: x + y
### $.minus2(x, y) :: x - y
### $.times2(x, y) :: x * y
### $.divide2(x, y) :: x / y
### $.div2(x, y) :: floor(x/y)
### $.mod2(x, y) :: x % y
### $.append2(xs, ys) :: xs.concat(ys)
### $.prepend2(xs, ys) :: ys.concat(xs)
### $.and2(x, y) :: x && y
### $.or2(x, y) :: x || y
### $.eq2(x, y) :: x === y
### $.neq2(x, y) :: x !== y
### $.gt2(x, y) :: x > y
### $.lt2(x, y) :: x < y
### $.gte2(x, y) :: x >= y
### $.lte2(x, y) :: x <= y

````javascript
$.plus2(2, 3); // 5
$.or2(false, true); // true
````

## Curried Binary operators
This section is useful for maps, as one of their arguments are curried,
cutting down the amount of very basic closured lambdas you make.

### $.plus(y) :: (x -> x + y)
### $.minus(y) :: (x -> x - y)
### $.times(y) :: (x -> x * y)
### $.divide(y) :: (x -> x / y)
### $.div(y) :: (x -> floor(x/y))
### $.mod(y) :: (x -> x % y)
### $.append(ys) :: (xs -> xs.concat(ys))
### $.prepend(ys) :: (xs -> ys.concat(xs))

````javascript
[1,2,3,4,5].map($.plus(1)); // [2, 3, 4, 5, 6]
[1,2,3,4,5].map($.minus(1)); // [0, 1, 2, 3, 4]
[1,2,3,4,5].map($.times(2)); // [2, 4, 6, 8, 10]
[2,4,6,8].map($.divide(2)); // [1, 2, 3, 4]
[1,2,3,4].map($.div(2)); // [0, 1, 1, 2]
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
### $.neq(y) :: (x -> x !== y)
### $.gte(y) :: (x -> x >= y)
### $.lte(y) :: (x -> x <= y)

Curried comparison is useful for filters and combinations with $.any / $.all.

````javascript
[1,4,2,5,2,3].filter($.gt(3)); // [4,5]
[[1,3,5], [2,3,1]].filter($.any($.gte(5))); // [ [ 1, 3, 5 ] ]
````

# Interlude
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
var log = (console) ? console.log || $.noop
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
An accessor for Array.prototype.every, but curried for the array.

````javascript
$.all($.gt(2))([3,4,5]); // true
[[3,4,5], [1,3,5]].filter($.all($.gt(2))); // [ [3, 4, 5] ]
````

### $.any(fn) -> (xs -> Boolean)
An accessor for Array.prototype.some, but curried for the array.

````javascript
$.any($.gt(2))([1,2,3]); // true
[[3,4,5], [4,5,6]].filter($.any($.elem([6, 7]))); // [ [4, 5, 6] ]
````

### $.none(fn) -> (xs -> Boolean)
An accessor for the negated Array.prototype.some, but curried for the array.

### $.elem(xs) :: (x -> Boolean)
### $.notElem(xs) :: (x -> Boolean)

The membership tests are accessors for Array.prototype.indexOf,
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

### Custom Basic Comparators
While `comparing` and `compare` create comparison functions, may still be useful
to create curried comparison functions that compare properties. Fortunately, this
is quite easy to do with the tools available.

````javascript
var notNull = $.compose($.gt(0), $.get('length'));
notNull([1,3]); // true

var withinUnitSquare = $.all($.compose($.lte(1), Math.abs));
[ [1,-1], [1,-2] ].filter(withinUnitSquare); // [ [1,-1] ]

var withinUnitCircle = $.compose($.lte(1), $.pow(1/2), $.sum, $.map($.pow(2)));
[ [0,0], [-1,0], [1,1], [0,0,1] ].filter(withinUnitCircle);
// [ [0,0], [-1,0], [0,0,1] ]
````

#### Performance Note
Going too much overboard with functional composition for relatively simple
functions like the last example come with a performance tax.
[Inlining is generally faster](http://jsperf.com/crazyfunctional2).

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

### $.fold(fn [, start]) :: (xs -> results)
An accessor for `Array.prototype.reduce`, but with the function curried.
`fn` *should* be a two parameter (y, x -> y) function. I.e. variadic functions
will fail spectacularly, but functions made for `Array.prototype.reduce`
will work.

````javascript
var product = $.fold($.times2, 1);
var flatten = $.fold($.append2, []);
````

### $.scan(fn, start) :: (xs -> results)
Operationally equivalent to `$.fold` but collects all the intermediate results.
Does not use `Array.prototype.reduce` under the covers, so 3rd and 4th argumets
will always be undefined.

````javascript
$.fold($.plus2, 0)([1,1,1,1]); // 4
$.scan($.plus2, 0)([1,1,1,1]); // [ 0, 1, 2, 3, 4 ]
````

### $.iterate(num, fn) :: (initial -> results)
Returns a function which iterates `num` times over a `fn` (x -> x)
by passing the result of the previous iteration into the next call
to `fn` and collecting the results.

````javascript
$.iterate(3, $.prepend("ha"))("ha!"); // [ 'ha!', 'haha!', 'hahaha!' ]
````

### $.map(fn) :: (xs -> results)
An accessor for `Array.prototype.map`, but with the function curried.

### $.filter(fn) :: (xs -> results)
An accessor for `Array.prototype.filter`, but with the function curried.


## Functional Composition

### $.compose(f [, g [, ..]]) :: (x -> f(g(..(x))))
Returns a function which will apply the passed in functions in algebraic order;
i.e. the last function first. The last function can have multiple arguments,
but all others are simply passed the result of the previous functions.

````javascript
var isPair = $.compose($.eq(2), $.get('length')); // (xs -> Boolean)
[[1,3,2], [2], [], [2,1], [1,2]].filter(isPair); // [ [2,1], [1,2] ]
````

### $.sequence(f [, g [, ..]]) :: (x -> ..(g(f(x))))
Same as `$.compose`, but the functions are called in sequential order.

````javascript
var isPair = $.sequence($.get('length'), $.eq(2)); // (xs -> Boolean)
````

## Functional Accessors
### $.get(prop) :: (el -> el[prop])
Allows simple property extraction on an element. Useful for mapping

````javascript
var objs = [{id: 1, s: "h"}, {id: 2, s: "e"}, {id: 3, s: "y"}];
objs.map($.get('id')); // [ 1, 2, 3 ]
objs.map($.get('s')).join(''); // 'hey'
````

Properties can also be extracted from more than one level down:

````javascript
var objs = [
  {id: 1, s: "h", obj: {ary: [1,2]} }
, {id: 2, s: "e", obj: {ary: [3,4]} }
, {id: 3, s: "y", obj: {ary: [5,6]} }
];
objs.map($.get('obj.ary.1')); // [ 2, 4, 6 ]
````

If a property is undefined on an element (or something is, in the middle
of a deep property search), undefined is returned.
To only get the defined values from a map of this style; filter by `$.neq()` -
or `$.neq(/*undefined*/)` to be explicit about the inequality test.

````javascript
[{a:5}, {}].map($.get('a')); // [ 5, undefined ]
[{a:5}, {}].map($.get('a')).filter($.neq()); // [ 5 ]
````

### $.pluck(prop, xs) :: ys
Shorthand for of a common use-case for `Array.prototype.map`:
extracting property values.

Behaviourally equivalent to `xs.map($.get(prop))`, but `$.get` can
scan deeply wheras this is does a quick iteration without extra function calls.

````javascript
$.collect('length', [ [1,3,2],  [2], [1,2] ]); // [3,1,2]
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
Reduces the level of nesting in an array by one.

````javascript
$.flatten([ [1,3,2], [2,[3],2] , [1] ]); // [ 1, 3, 2, 2, [ 3 ], 2, 1 ]
````

## Variadic Functions
These act on several arguments, and can be used with `$.zipWith` for any number
of lists.

### $.add(x [, y [, ..]])
### $.multiply(x [, y [, ..]])
### $.concat(xs [, ys [, ..]])

````javascript
$.add(1,2,3); // 6
$.multiply(1,2,3,4,5); // 120
$.concat([1,2], [3,4], [5,6]); // [ 1, 2, 3, 4, 5, 6 ]
````

## List Operations
Dynamic Data.List. Many of these functions (somewhat remarkably) work on strings
as arrays.

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
$.zipWith($.plus2, [1,1,1], $.range(5)); // [2, 3, 4]
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


### $.partition(fn, xs) :: [ys, zs]
The `partition` function takes a predicate, an array and returns
the pair of arrays of elements which do and do not satisfy the
predicate, respectively; i.e.,

`$.partition(p, xs) equals [xs.filter(p), xs.filter($.not(p))]`

### $.intersect(xs, ys) :: zs
The 'intersect' function takes the intersection of two arrays.
For example,

````javascript
$.intersect([1,2,3,4], [2,4,6,8]); // [2,4]
````

If the first array contains duplicates, so will the result.

````javascript
$.intersect([1,2,2,3,4], [6,4,4,2]); // [2,2,4]
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
version `nubBy` with `$.eq2` as the supplied equality test, but
this special case implementation uses `Array.prototype.indexOf` and is faster.

### $.nubBy(fn, xs) :: ys
The generalized version of `nub`.

### $.group(xs) :: ys
The group function takes an array and returns an array of arrays such that
the flattened result is equal to the argument.
Moreover, each subarray in the result contains only equal elements. For example,

````javascript
$.group([1,2,2,3,5,5,7]); // [ [1], [2,2], [3], [5,5], [7] ]
````

It is a special case of groupBy, which allows the programmer to supply
their own equality test.

### $.groupBy(fn, xs) :: ys
The non-overloaded version of `group`.

````javascript
$.groupBy($.equality('a'), [{a:1}, {a:4, b:1}, {a:4, b:0}, {a:2}]);
// [ [ { a: 1 } ],
//   [ { a: 4, b: 1 }, { a: 4, b: 0 } ],
//   [ { a: 2 } ] ]
````

### $.union(xs, ys) :: zs
The union function returns the array union of the two arrays.

````javascript
$.union([1,3,5], [4,5,6]); // [ 1, 3, 5, 4, 6]
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



---

TODO: $.copy for shallow copy?
TODO: $.extend?
TODO: $.clone for deep copy?
TODO: use xtend?


# Tutorials
TODO: move to new .md
## Writing Efficient Functional Code
JavaScript is not lazy, so writing code in a purely lazy style is not beneficial.
First see an example where we start out thinking about it purely functionally:

### Sum of all odd squares less than 10000
First thought implementation:

````javascript
$.sum($.range(1, 10000).map($.pow(2)).filter($.odd).filter($.lt(10000)));
// 166650
````

But noticing that odd square are odd if and only if the original number was odd
we can skip squaring and filtering out half the list.

````javascript
$.sum($.range(1, 10000, 2).map($.pow(2)).filter($.lt(10000)));
// 166650
````

Finally, we notice that a square is less than 10000 if and only the original
number was less than the sqrt(10000) = 100.

````javascript
$.sum($.range(1, 100, 2).map($.pow(2)));
// 166650
````

This final code is more efficient, but needs more explanation of what it does.
