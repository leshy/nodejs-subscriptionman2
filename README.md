backbone mixin for advanced event subscriptions
===============================================

collection of mixins to mix a subscription mixin you'd like
the idea is to specialize your subscription system in order to cut down on the execution of unnessesary code while still having great flexibility and fancy matching where you need it

### pluggable event matching systems (events can be strings, objects, or anything else)

- events are anything?
    - *SimplestMatcher* matching for equality

- events are strings?
    - *SimplestMatcher* simple string matching
    - *StringMatcher* regex matching - todo

- events are objects?
    - *ObjectMatcher* checking for key existance or specific key-value pair, support for recursion into the object
    - *Validator2Matcher* using advanced [validator2](https://github.com/leshy/nodejs-validator2/) object matching features - full boolean logic support, type matching, custom async matchers (db lookups, queries?), random matchers like min/max/length/email/regex etc

### advanced subscription functions calling

- support for parallel async calling
- return values passed to the event triggering caller
- waterfall? - todo
- look at tests.coffee for documentation


### todo

support for different event structures, not just  [ string_name, some_data ] but tags, only data, and such, and maybe pluggable different matchers for different fields?