// Generated by CoffeeScript 1.4.0
(function() {
  var Backbone, Basic, Core, ObjectMatcher, Validator, async, asyncCallbackReturnMixin, exists, helpers, simplestMatcher, v, _;

  _ = require('underscore');

  async = require('async');

  Backbone = require('backbone4000');

  Validator = require('validator2-extras');

  v = Validator.v;

  helpers = require('helpers');

  Core = exports.Core = Backbone.Model.extend4000({
    initialize: function() {
      this.counter = 0;
      return this.subscriptions = {};
    },
    subscribe: function(pattern, callback, name) {
      var _this = this;
      if (name == null) {
        name = this.counter++;
      }
      if (!callback && pattern.constructor === Function) {
        callback = pattern;
        pattern = true;
      }
      this.subscriptions[name] = {
        pattern: pattern,
        callback: callback
      };
      this.trigger('subscribe', name);
      return function() {
        delete _this.subscriptions[name];
        return _this.trigger('unsubscribe', name);
      };
    },
    event: function(value, data) {
      var _this = this;
      return async.filter(_.values(this.subscriptions), function(subscription, callback) {
        return _this.match(value, subscription.pattern, function(err, data) {
          return callback(!err);
        });
      }, function(MatchedSubscriptions) {
        return _.map(MatchedSubscriptions, function(subscription, callback) {
          return subscription.callback(data);
        });
      });
    }
  });

  asyncCallbackReturnMixin = exports.asyncCallbackReturnMixin = Backbone.Model.extend4000({
    eventAsync: function(value, data, callback) {
      var _this = this;
      return async.filter(_.values(this.subscriptions), function(subscription, callback) {
        return _this.match(value, subscription.pattern, function(err, data) {
          return callback(!err);
        });
      }, function(MatchedSubscriptions) {
        return async.mapSeries(MatchedSubscriptions, function(subscription, callback) {
          return helpers.forceCallback(subscription.callback, data, callback);
        }, callback);
      });
    }
  });

  simplestMatcher = exports.simplestMatcher = Backbone.Model.extend4000({
    match: function(value, pattern, callback) {
      if (value === pattern) {
        return callback(null, true);
      } else {
        return callback(true);
      }
    }
  });

  exists = exports.exists = new Object();

  ObjectMatcher = exports.ObjectMatcher = Backbone.Model.extend4000({
    match: function(value, pattern, callback) {
      if (pattern === exists) {
        return callback(true);
      }
      return !_.find(pattern, function(checkvalue, key) {
        if (!value[key]) {
          return callback(true);
        }
        if (checkvalue !== exists && value[key] !== checkvalue) {
          return callback(true);
        }
        return callback(false);
      });
    }
  });

  Basic = exports.Basic = Core.extend4000(simplestMatcher);

}).call(this);