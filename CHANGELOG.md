1.1.1 / 2015-11-15
==================
  * Added `.npmignore`

1.1.0 / 2014-09-30
==================
  * Bump autonomy to 1.0.0:
    - adds `copy`
    - `replicate` is now object safe

1.0.3 / 2014-07-25
==================
  * Documentation and coverage release

1.0.2 / 2012-11-12
==================
  * extend a blank copy of `seq` rather than require result of `autonomy`.
  (Was overwriting the cached require results of autonomy in linked installs)

1.0.1 / 2012-11-11
==================
  * `$()` now a shortcut for deprecated `$.seq`

1.0.0 / 2012-10-24
==================
  * retroactive inclusion of an overloaded version `$.compare` from subset

1.0.0 / 2012-10-20
==================
  * interlude is now a stable front for autonomy, subset and operators
  * `has`, `seq2`, `seq3`, `seq4`, `getDeep` removed from autonomy
  * `replicate` is now array safe
  * `get` is now variadic and assumes the role of `getDeep`
  * `wrappers` excluded from exports because:
    - less stable API
    - less likelihood of use
  * `subset` includes `isSubsetOf` (retroactively available to previous versions)

0.7.0 / 2012-07-04
==================
  * autonomy updated to 0.3.0 changing `scan` argument order
  * allow use on any node version

0.6.0 / 2012-07-03
==================
  * wrappers updated to 0.2.0 removing `either` and `guard`

0.5.1 / 2012-06-30
==================
  * include new (v0.2.0) autonomy which comes without operators + pow/log but with extend
  * operators included directly (now comes with pow/log + pow2/log2)
  * improve DOCS browsability and just api in general

0.5.0 / 2012-06-22
==================
  * update wrappers to 0.1.0 (now close to done, has a lot more)

0.4.0 / 2012-06-17
==================
  * use latest operators, 0.3 missed some extras
  * comparing/compare direction parameter is now the factor +1/-1 with +1 omittable
  * set operations + comparison/equality generalizations moved to `subset` module
  * everything else (must haves) moved into `origin` module, which re-exports operators.
  * trace/traceBy/wrap/once/memoize initial wrappers included via `wrappers` module
  * module basically just a re-export


0.3.0 / 2012-06-15
==================
  * `operators` moved to own module (which now is bigger and better)
  * renamed `collect` to `pluck` to conserve (at least some) conventions
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
