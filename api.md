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

### $.elem(xs) :: (x -> Boolean)
### $.notElem(xs) :: (x -> Boolean)

The membership tests are accessors for Array.prototype.indexOf,
but with the array curried.

```javascript
[1,2,3,4,3].filter($.elem([1,3])); // [ 1, 3, 3 ]
[1,2,3,4,3].filter($.notElem([1,3])); // [ 2, 4 ]
````

## Binary Operators (2-Argument Versions)
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
### $.neq2(x, y) :: x !== y
### $.gt2(x, y) :: x > y
### $.lt2(x, y) :: x < y
### $.gte2(x, y) :: x >= y
### $.lte2(x, y) :: x <= y

````javascript
$.add2(2, 3); // 5
$.or2(false, true); // true
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
### $.neq(y) :: (x -> x !== y)
### $.gte(y) :: (x -> x >= y)
### $.lte(y) :: (x -> x <= y)

Curried comparison is useful for filters and combinations with $.any / $.all.

````javascript
[1,4,2,5,2,3].filter($.gt(3)); // [4,5]
[[1,3,5], [2,3,1]].filter($.any($.gte(5))); // [ [ 1, 3, 5 ] ]
````

## Generalized Equality and Comparison
### $.equality2(props..) :: (x, y -> x 'equality on props' y)
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

### $.equality(props..)(y) :: (x -> x 'equality on props' y)
This is $.equality2 curried with the first element to test against.
If equality has a more specific meaning for a set of records for instance,
then it is useful to have a curriable version around in case you
want to filter it.

````javascript
var lenEquals = $.equality('length');
[[1,3,5], [2,3], [2,4,6]].filter(lenEquals(3)); // [ [1,3,5], [2,4,6] ]
````

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
An accessor for `Array.prototype.reduce`, but with the function curried.
`fn` *should* be a two parameter (y, x -> y) function. I.e. variadic functions
will fail spectacularly, but functions catered for `Array.prototype.reduce`
will work.

````javascript
$.sun = $.fold($.add2, 0);
$.product = $.fold($.multiply2, 1);
$.flatten = $.fold($.concat2, []);
````

### $.scan (fn [, start]) :: (xs -> results)
Operationally equivalent to `$.fold` but collects all the intermediate results.
Does not use `Array.prototype.reduce` under the covers, so 3rd and 4th argumets
will always be undefined.

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

## Lifts and Unlifts
Lifting is the process of converting a variadic function into a function
acting on an Array. Unlifting is the reverse process; turn an array function
into a variadic one. These operations are used by Interlude to create synonymous
versions that normally we'd have to manually fn.apply ourselves.

### $.lift(fn [, context]) -> (xs -> Function)
An accessor for Function.prototype.apply, but curried for the array of arguments.

```javascript
$.maximum = $.lift(Math.max, Math);
$.maximum([3,6,4,2]); // 6
````

### $.unlift(fn [, context]) -> (args.. -> Function)
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
Reduces the level of nesting in an array by one.

````javascript
$.flatten([ [1,3,2], [2,[3],2] , [1] ]); // [ 1, 3, 2, 2, [ 3 ], 2, 1 ]
````

### $.and(xs) :: Boolean
Like `$.any`, but takes an array of boolean-like elements
to be chained together with `&&`.


### $.or(xs) :: Boolean
Like `$.or`, but takes an array of boolean-like elements
to be chained together with `||`.


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

### $.composition(fns) :: (x -> $.compose(fn1, ..)(x))
A lifted version of `$.compose`. Takes an array of functions and composes
them in algebraic order.

### $.pipeline(fns) :: (x -> $.sequence(fn1, ..)(x))
A lifted version of `$.sequence`. Takes an array of functions and composes
them in sequential order.

````javascript
var stringProcessing = [
  trimString
, decodeBbCode
, replaceEntities
];

// assuming the 3 functions above exist and are (str -> str)
var sanitizeStr = $.pipeline(stringProcessing); // (str -> str)
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

## Zipping
A veritable corner stone of Functional Programming made dynamic, and
now work for any number of arrays!

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

zipWith can also be used for updating information on arrays of objects:

````
$.extend = function (def, upd) {
  Object.keys(upd).map(function (key) {
    def[key] = upd[key];
  });
}

var vals = ["Peter", "Bam", "Jo"];
var items = [{id:1}, {id:2}, {id:3}];
var nameSetter = function (el, value) {
  el.name = value;
};
$.zipWith(nameSetter, items, vals);
// [ { id: 1, name: 'Peter' },
//   { id: 2, name: 'Bam' },
//   { id: 3, name: 'Jo' } ]
````

## List Operations
Dynamic Data.List. Many of these functions (somewhat remarkably) work on strings
as arrays.

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
$.intersectBy($.equality2('a'), [{a:1}, {a:4, b:0}], [{a:2}, {a:4, b:1}]);
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
$.groupBy($.equality2('a'), [{a:1}, {a:4, b:1}, {a:4, b:0}, {a:2}]);
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
$.unionBy($.equality2('a'), [{a:1},{a:3}], [{a:2},{a:3}]);
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
$.differenceBy($.equality2('a'), [{a:1}, {a:2}], [{a:2}, {a:3}]);
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
$.deleteBy($.equality2('a'), [{a:1},{a:2},{a:3},{a:2}], {a:2})
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

#


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
