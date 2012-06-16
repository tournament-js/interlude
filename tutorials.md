# Tutorials

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

Finally, we notice that a square is less than 10000 if and only its factor
was less than the sqrt(10000) = 100.

````javascript
$.sum($.range(1, 100, 2).map($.pow(2)));
// 166650
````

This final code is more efficient, but needs more explanation of what it does.

## Tips and Tricks
### Custom Comparators
While `comparing`, `compare`, and `equality` are great at creating comparison functions and equality testers, it might still be useful to create curried functions that compare/filter based on such properties. Fortunately, this is quite easy to do with the tools available.

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
