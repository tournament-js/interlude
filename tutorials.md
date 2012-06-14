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
