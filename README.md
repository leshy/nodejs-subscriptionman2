backbone mixin for advanced event subscriptions
===============================================

collection of mixins to mix a subscription mixin you'd like.

### pluggable event matching systems (events can be strings, objects, or anything else)

- events are anything
    - *SimplestMatcher* matching for equality

- events are strings 
    - *SimplestMatcher* simple string matching
    - *StringMatcher* regex matching

- events are objects 
    - *ObjectMatcher* checking for key existance or specific key-value pair, support for recursion into the object
    - *Validator2Matcher* using advanced [validator2](https://github.com/leshy/nodejs-validator2/) object matching features - full boolean logic support, type matching, custom async matchers (db lookups, queries?), random matchers like min/max/length/email/regex etc

### advanced subscription functions calling

- support for parallel async calling
- return values passed to the event triggering caller


