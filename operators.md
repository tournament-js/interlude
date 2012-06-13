# Operators
Operators export quick lamdas and certain generalizations for binary operators.

## Associative Operators
These operators satisfy the communtative and associative identities (resp.):

- `a * b == b * c`
- `a * (b * c) == (a * b) * c`

and as such are often used to slam together a few elements with this operator.
We provide quick lambdas for up to `4` arguments.

### $.plus2(x, y) :: x + y
### $.plus3(x, y, z) :: x + y + z
### $.plus4(x, y, z, w) :: x + y + z + w

### $.times2(x, y) :: x * y
### $.times3(x, y, z) :: x * y * z
### $.times4(x, y, z, w) :: x * y * z * w

### $.or2(x, y) :: x || y
### $.or3(x, y, z) :: x || y || z
### $.or4(x, y, z, w) :: x || y || z || w

### $.and2(x, y) :: x && y
### $.and3(x, y, z) :: x && y && z
### $.and4(x, y, z, w) :: x && y && z && w

These last two are non-commutative, but it makes sense of them to provide a 3 and 4
parameter version for at least one of them.
### $.append2(xs, ys) :: xs.concat(ys)
### $.append3(xs, ys, zs) :: xs.concat(ys, zs)
### $.append4(xs, ys, zs, ws) :: xs.concat(ys, zs, ws)

### $.prepend2(xs, ys) :: ys.concat(xs)

## Non-Associative Operators
These operators do not satisfy the commutative or the associative identity, and
are generally most useful in either in a two argument lambda, or a 1-1 curried
lambda. First the 2-argument versions:

### $.minus2(x, y) :: x - y
### $.divide2(x, y) :: x / y
### $.div2(x, y) :: floor(x/y)
### $.mod2(x, y) :: x % y
### $.eq2(x, y) :: x === y
### $.neq2(x, y) :: x !== y
### $.gt2(x, y) :: x > y
### $.lt2(x, y) :: x < y
### $.gte2(x, y) :: x >= y
### $.lte2(x, y) :: x <= y
Whose usage are all as expected:

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

## Lifted Operators
The three basic associative operators have been lifted to variadic and array space.
The _variadic versions_ are named as follows:
### $.add(x [, y [, ..]])
### $.multiply(x [, y [, ..]])
### $.concat(xs [, ys [, ..]])
````javascript
$.add(1,2,3); // 6
$.multiply(1,2,3,4,5); // 120
$.concat([1,2], [3,4], [5,6]); // [ 1, 2, 3, 4, 5, 6 ]
````

and the array versions:
### $.sum(xs) :: Number
### $.product(xs) :: Number
````javascript
$.sum([1,2,3]); // 6
$.product([1,2,3,4,5]); // 120
````

### $.flatten(xs) :: Array
Interestingly, as `flatten` by construction takes an array of arrays,
it ends up reducing the array to one less level of nesting.
Equivalent to reducing the array with `$.append2`, but faster.

````javascript
$.flatten([ [1,3,2], [2,[3],2] , [1] ]); // [ 1, 3, 2, 2, [ 3 ], 2, 1 ]
````
