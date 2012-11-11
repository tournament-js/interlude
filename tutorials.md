# Tutorials

## Tips and Tricks
## Using Interlude Efficiently
JavaScript is not lazy, so writing code in a purely lazy style is not beneficial.
First see an example where we start out thinking about it purely functionally:

### Sum of all odd squares less than 10000
First thought implementation:

```javascript
$.sum($.range(1, 10000).map($.pow(2)).filter($.odd).filter($.lt(10000)));
// 166650
```

But noticing that odd squares are odd if and only if the original number was odd
we can skip squaring and filtering out half the list.

```javascript
$.sum($.range(1, 10000, 2).map($.pow(2)).filter($.lt(10000)));
// 166650
```

Finally, we notice that a square is less than 10000 if and only its factor
was less than the sqrt(10000) = 100.

```javascript
$.sum($.range(1, 100, 2).map($.pow(2)));
// 166650
```

This final code is more efficient, but may need more explanation about what it does.

It will not beat the imperative solution:

```javascript
var sum = 0;
for (let i = 1; i <= 100; i += 2) sum += i*i;
// sum === 166650
```

But it will come close, and depending on use case, code temperature, readibility, the shorthands will be invaluable for at least prototyping things functionally and usually be completely fine to leave as is in production.

## Generalized Operators
A simple way to make operators on existing or computable properties:

```javascript
// Check length >0
var lengthOne = $($.get('length'), $.eq(1));
[ [1], [], [2,4] ].filter(lengthOne); // [ [1] ]

// Check absolute value <=1 on all elements
var withinUnitSquare = $.all($(Math.abs, $.lte(1)));
[ [1,-1], [1,-2], [1,1,1] ].filter(withinUnitSquare); // [ [1,-1], [1,1,1] ]

// Check euclidean distance of point <=1
var withinUnitCircle = $($.map($.pow(2)), $.sum, Math.sqrt, $.lte(1));
[ [1,-1], [0,0], [1], [1.1], [0,0.5,0.5], [0,0,0,1] ].filter(withinUnitCircle);
// [ [0,0], [1], [0,0.5,0.5], [0,0,0,1] ]
```

While these examples are a bit contrieved and the efficiency of these functions could be improved by knowing the dimension of the space being worked on (typical case) to help inlining a smaller specific function, it shows that very flexible higher order functions can be expressed very simply. Compared to a general (any dimension) imperative solution, they are very similar in terms of efficency!
