0.4.0 / TODO
==================
  * wrappers
  * move list stuff to own module
  * improve DOCS browsability and just api in general
  DONE:
  * use latest operators, 0.3 missed some extras

0.3.0 / 2012-06-15
==================
  * `operators` moved to own module (which now is bigger and better)
  * renamed `collect` to `pluck` to conserve conventions
  * $.equality, $.comparing $.compare added
  * removed awful setters
  * delete/insert/deleteBy/insertBy now all modify input (insertBy didn't)
  * delete/deleteBy now only deletes first occurrence
  * difference/differenceBy introduced (non-modifying)
  * Data.List like API now dependency free, can be factored out
  * compose redone for performance and sensibility. See: `seq`, `seq2`, `seq3`, `seq4`.
  * experimental stuff removed from module.exports while it's in the works
  * tests moved from expresso to tap

0.2.0 / 2012-06-03
==================
  * Data.List generic insert/delete/group/union/maximum/minimum/nub done

0.1.0 / 2012-06-02
==================
  * First proper version under 'interlude'
