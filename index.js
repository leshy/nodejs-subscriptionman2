(function(){
  var _, async, Backbone, Validator, v, helpers, Core, asyncCallbackReturnMixin, simplestMatcher, exists, objectMatcher, Validator2Matcher, def, basic, fancy;
  _ = require('underscore');
  async = require('async');
  Backbone = require('backbone4000');
  Validator = require('validator2-extras');
  v = Validator.v;
  helpers = require('helpers');
  Core = exports.Core = Backbone.Model.extend4000({
    initialize: function(){
      this.counter = 0;
      return this.subscriptions = {};
    },
    subscribeWait: function(timeout, pattern, callback, callbackError, name){
      var wrappedCallback, unsub, cancelErrorTimeout;
      wrappedCallback = function(){
        var data, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        data = res$;
        cancelErrorTimeout();
        return callback.apply(this, data);
      };
      unsub = this.subscribeOnce(pattern, wrappedCallback, name);
      return cancelErrorTimeout = helpers.wait(timeout, function(){
        unsub();
        return helpers.cbc(callbackError, new Error('timeout'));
      });
    },
    subscribeOnce: function(pattern, callback, name){
      var unsub, wrappedCallback;
      unsub = undefined;
      wrappedCallback = function(){
        var data, res$, i$, to$;
        res$ = [];
        for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        data = res$;
        unsub();
        return callback.apply(this, data);
      };
      return unsub = this.subscribe(pattern, wrappedCallback, name);
    },
    subscribe: function(pattern, callback, name){
      var this$ = this;
      name == null && (name = this.counter++);
      if (!callback && pattern.constructor === Function) {
        callback = pattern;
        pattern = true;
      }
      this.subscriptions[name] = {
        pattern: pattern,
        callback: callback
      };
      this.trigger('subscribe', name);
      return function(){
        delete this$.subscriptions[name];
        return this$.trigger('unsubscribe', name);
      };
    },
    event: function(){
      var data, res$, i$, to$, eventType, this$ = this;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      data = res$;
      eventType = _.first(data);
      async.filter(_.values(this.subscriptions), function(subscription, callback){
        return this$.match(eventType, subscription.pattern, function(err, data){
          return callback(subscription);
        });
      }, function(MatchedSubscriptions){
        var next;
        if (MatchedSubscriptions.constructor !== Array) {
          MatchedSubscriptions = [MatchedSubscriptions];
        }
        if (this$.matchAll) {
          return _.map(MatchedSubscriptions, function(subscription, callback){
            return subscription.callback.apply(this, data);
          });
        } else {
          next = function(){
            var sub;
            if (MatchedSubscriptions.length) {
              sub = MatchedSubscriptions.pop();
              return sub.callback.apply(this, data.concat(next));
            }
          };
          return next();
        }
      });
      if (data.length === 1) {
        return _.first(data);
      } else {
        return data;
      }
    }
  });
  asyncCallbackReturnMixin = exports.asyncCallbackReturnMixin = Backbone.Model.extend4000({
    eventAsync: function(value, data, callback){
      var this$ = this;
      if (!callback && data.constructor === Function) {
        callback = data;
        data = value;
      }
      return async.filter(_.values(this.subscriptions), function(subscription, callback){
        return this$.match(value, subscription.pattern, function(err, data){
          return callback(!err);
        });
      }, function(MatchedSubscriptions){
        return async.mapSeries(MatchedSubscriptions, function(subscription, callback){
          return helpers.forceCallback(subscription.callback, data, callback);
        }, helpers.cb(callback));
      });
    }
  });
  simplestMatcher = exports.simplestMatcher = exports.equalityMatcher = exports.simpleMatcher = {
    match: function(value, pattern, callback){
      if (value === pattern) {
        return callback(null, true);
      } else {
        return callback(true);
      }
    }
  };
  exists = exports.exists = true;
  objectMatcher = exports.objectMatcher = {
    match: function(value, pattern, callback){
      if (pattern === exists) {
        return callback(undefined, true);
      }
      return !_.find(pattern, function(checkvalue, key){
        if (!value[key]) {
          return callback(undefined, true);
        }
        if (checkvalue !== exists && value[key] !== checkvalue) {
          return callback(undefined, true);
        }
        return callback(true);
      });
    }
  };
  Validator2Matcher = exports.Validator2Matcher = {
    match: function(value, pattern, callback){
      return pattern.feed(value, callback);
    },
    subscribe: function(){
      var attr, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      attr = res$;
      attr[0] = v(attr[0]);
      return Core.prototype.subscribe.apply(this, attr);
    }
  };
  def = exports.def = Core.extend4000(simplestMatcher);
  basic = exports.basic = Core.extend4000(objectMatcher);
  fancy = exports.fancy = Core.extend4000(Validator2Matcher, asyncCallbackReturnMixin);
}).call(this);
