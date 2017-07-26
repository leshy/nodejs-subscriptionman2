(function(){
  var _, async, Backbone, Validator, v, helpers, Core, asyncCallbackReturnMixin, simplestMatcher, exists, objectMatcher, Validator2Matcher, def, basic, fancy, slice$ = [].slice;
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
        var data;
        data = slice$.call(arguments);
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
        var data;
        data = slice$.call(arguments);
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
      var data, eventType, this$ = this;
      data = slice$.call(arguments);
      eventType = _.first(data);
      async.filter(_.values(this.subscriptions), function(subscription, callback){
        return this$.match(eventType, subscription.pattern, function(err, data){
          return callback(!err);
        });
      }, function(MatchedSubscriptions){
        var next;
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
      var attr;
      attr = slice$.call(arguments);
      attr[0] = v(attr[0]);
      return Core.prototype.subscribe.apply(this, attr);
    }
  };
  def = exports.def = Core.extend4000(simplestMatcher);
  basic = exports.basic = Core.extend4000(objectMatcher);
  fancy = exports.fancy = Core.extend4000(Validator2Matcher, asyncCallbackReturnMixin);
}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL2JpdGNvaW4vYm9tYmVyL25vZGVfbW9kdWxlcy9jb2xsZWN0aW9ucy9ub2RlX21vZHVsZXMvc3Vic2NyaXB0aW9ubWFuMi9pbmRleC5scyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztFQUNBLENBQUUsQ0FBQSxDQUFBLENBQUUsUUFBUSxZQUFBO0VBQ1osS0FBTSxDQUFBLENBQUEsQ0FBRSxRQUFRLE9BQUE7RUFDaEIsUUFBUyxDQUFBLENBQUEsQ0FBRSxRQUFRLGNBQUE7RUFDbkIsU0FBVSxDQUFBLENBQUEsQ0FBRSxRQUFRLG1CQUFBO0VBQXFCLENBQUUsQ0FBQSxDQUFBLENBQUUsU0FBUyxDQUFDO0VBQ3ZELE9BQVEsQ0FBQSxDQUFBLENBQUUsUUFBUSxTQUFBO0VBSWxCLElBQUssQ0FBQSxDQUFBLENBQUUsT0FBTyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUNuQztJQUFBLFlBQVksUUFBQSxDQUFBO01BQ1YsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQUU7YUFDWCxJQUFDLENBQUEsYUFBYyxDQUFBLENBQUEsQ0FBRTs7SUFFbkIsZUFBZSxRQUFBLENBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsYUFBQSxFQUFBLElBQUE7O01BQ2IsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsUUFBQSxDQUFBOztRQUFJO1FBQ3BCLG1CQUFrQjtlQUNsQixRQUFRLENBQUMsTUFBTSxNQUFHLElBQUg7O01BRWpCLEtBQU0sQ0FBQSxDQUFBLENBQUUsSUFBQyxDQUFBLGNBQWMsU0FBUyxpQkFBaUIsSUFBMUI7YUFFdkIsa0JBQW1CLENBQUEsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxLQUFLLFNBQVMsUUFBQSxDQUFBO1FBQ3pDLE1BQUs7ZUFDTCxPQUFPLENBQUMsSUFBSSxtQkFBbUIsTUFBTSxTQUFBLENBQXpCO09BRm9COztJQUlwQyxlQUFlLFFBQUEsQ0FBQSxPQUFBLEVBQUEs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RmhFO0FBQUEsU0FBQTtBQUFBLFFBQUEsTUFBQSxDQUdFLFFBSEYsQ0FHVyxJQUFBLENBSFgsQ0FBQTtBQUFBLE1BQUEsQ0FBVzs7RUFGYjtFQVFGLGlCQUFrQixDQUFBLENBQUEsQ0FBRSxPQUFPLENBQUMsaUJBQWtCLENBQUEsQ0FBQSxDQUM1QztJQUFBLE9BQU8sUUFBQSxDQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQTthQUE0QixPQUFPLENBQUMsS0FBSyxPQUFPLFFBQVA7O0lBQ2hELFdBQVcsUUFBQSxDQUFBOztNQUFJO01BQ2IsSUFBSSxDQUFDLENBQUQsQ0FBSSxDQUFBLENBQUEsQ0FBRSxFQUFFLElBQUksQ0FBQyxDQUFELENBQUw7YUFDWCxJQUFJLENBQUEsU0FBRSxDQUFBLFNBQVMsQ0FBQyxNQUFNLE1BQUcsSUFBSDs7RUFIeEI7RUFNRixHQUFJLENBQUEsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxHQUFJLENBQUEsQ0FBQSxDQUFFLElBQUksQ0FBQyxXQUFXLGVBQUE7RUFDcEMsS0FBTSxDQUFBLENBQUEsQ0FBRSxPQUFPLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxJQUFJLENBQUMsV0FBVyxhQUFBO0VBQ3hDLEtBQU0sQ0FBQSxDQUFBLENBQUUsT0FBTyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsSUFBSSxDQUFDLFdBQVcsbUJBQW1CLHdCQUFuQiIsInNvdXJjZXNDb250ZW50IjpbIiMgYXV0b2NvbXBpbGVcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xuYXN5bmMgPSByZXF1aXJlICdhc3luYydcbkJhY2tib25lID0gcmVxdWlyZSAnYmFja2JvbmU0MDAwJ1xuVmFsaWRhdG9yID0gcmVxdWlyZSAndmFsaWRhdG9yMi1leHRyYXMnOyB2ID0gVmFsaWRhdG9yLnZcbmhlbHBlcnMgPSByZXF1aXJlICdoZWxwZXJzJ1xuXG4jIGNvcmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbkNvcmUgPSBleHBvcnRzLkNvcmUgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQ0MDAwIGRvXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGNvdW50ZXIgPSAwXG4gICAgQHN1YnNjcmlwdGlvbnMgPSB7fVxuXG4gIHN1YnNjcmliZVdhaXQ6ICh0aW1lb3V0LCBwYXR0ZXJuLCBjYWxsYmFjaywgY2FsbGJhY2tFcnJvciwgbmFtZSkgLT5cbiAgICB3cmFwcGVkQ2FsbGJhY2sgPSAoLi4uZGF0YSkgLT5cbiAgICAgIGNhbmNlbEVycm9yVGltZW91dCgpXG4gICAgICBjYWxsYmFjay5hcHBseSBALCBkYXRhXG5cbiAgICB1bnN1YiA9IEBzdWJzY3JpYmVPbmNlIHBhdHRlcm4sIHdyYXBwZWRDYWxsYmFjaywgbmFtZVxuXG4gICAgY2FuY2VsRXJyb3JUaW1lb3V0ID0gaGVscGVycy53YWl0IHRpbWVvdXQsIC0+XG4gICAgICB1bnN1YigpXG4gICAgICBoZWxwZXJzLmNiYyBjYWxsYmFja0Vycm9yLCBuZXcgRXJyb3IgJ3RpbWVvdXQnXG5cbiAgc3Vic2NyaWJlT25jZTogKHBhdHRlcm4sIGNhbGxiYWNrLCBuYW1lKSAtPlxuICAgIHVuc3ViID0gdW5kZWZpbmVkXG4gICAgd3JhcHBlZENhbGxiYWNrID0gKC4uLmRhdGEpIC0+IHVuc3ViKCk7IGNhbGxiYWNrLmFwcGx5IEAsIGRhdGFcbiAgICB1bnN1YiA9IEBzdWJzY3JpYmUgcGF0dGVybiwgd3JhcHBlZENhbGxiYWNrLCBuYW1lXG5cbiAgc3Vic2NyaWJlOiAocGF0dGVybiwgY2FsbGJhY2ssIG5hbWU9QGNvdW50ZXIrKyApIC0+XG4gICAgaWYgbm90IGNhbGxiYWNrIGFuZCBwYXR0ZXJuLmNvbnN0cnVjdG9yIGlzIEZ1bmN0aW9uXG4gICAgICBjYWxsYmFjayA9IHBhdHRlcm5cbiAgICAgIHBhdHRlcm4gPSB0cnVlXG5cbiAgICBAc3Vic2NyaXB0aW9uc1tuYW1lXSA9IHBhdHRlcm46IHBhdHRlcm4sIGNhbGxiYWNrOiBjYWxsYmFja1xuXG4gICAgQHRyaWdnZXIgJ3N1YnNjcmliZScsbmFtZVxuXG4gICAgfj5cbiAgICAgIGRlbGV0ZSBAc3Vic2NyaXB0aW9uc1tuYW1lXVxuICAgICAgQHRyaWdnZXIgJ3Vuc3Vic2NyaWJlJywgbmFtZVxuXG4gIGV2ZW50OiAoLi4uZGF0YSkgLT5cbiAgICBldmVudFR5cGUgPSBfLmZpcnN0IGRhdGFcbiAgICBhc3luYy5maWx0ZXIgXy52YWx1ZXMoQHN1YnNjcmlwdGlvbnMpLFxuICAgICAgKHN1YnNjcmlwdGlvbixjYWxsYmFjaykgfj4gQG1hdGNoIGV2ZW50VHlwZSwgc3Vic2NyaXB0aW9uLnBhdHRlcm4sIChlcnIsZGF0YSkgLT4gY2FsbGJhY2sobm90IGVycilcbiAgICAgIChNYXRjaGVkU3Vic2NyaXB0aW9ucykgfj5cbiAgICAgICAgaWYgQG1hdGNoQWxsXG4gICAgICAgICAgXy5tYXAgTWF0Y2hlZFN1YnNjcmlwdGlvbnMsXG4gICAgICAgICAgICAoc3Vic2NyaXB0aW9uLCBjYWxsYmFjaykgLT4gc3Vic2NyaXB0aW9uLmNhbGxiYWNrLmFwcGx5IEAsIGRhdGFcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5leHQgPSAtPlxuICAgICAgICAgICAgaWYgTWF0Y2hlZFN1YnNjcmlwdGlvbnMubGVuZ3RoXG4gICAgICAgICAgICAgIHN1YiA9IE1hdGNoZWRTdWJzY3JpcHRpb25zLnBvcCgpXG4gICAgICAgICAgICAgIHN1Yi5jYWxsYmFjay5hcHBseSBALCBkYXRhLmNvbmNhdChuZXh0KVxuICAgICAgICAgIG5leHQoKVxuICAgIGlmIGRhdGEubGVuZ3RoIGlzIDEgdGhlbiBfLmZpcnN0IGRhdGEgZWxzZSBkYXRhXG5cbiMgY29yZSBtaXhpbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmFzeW5jQ2FsbGJhY2tSZXR1cm5NaXhpbiA9IGV4cG9ydHMuYXN5bmNDYWxsYmFja1JldHVybk1peGluID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kNDAwMCBkb1xuICBldmVudEFzeW5jOiAodmFsdWUsIGRhdGEsIGNhbGxiYWNrKSAtPlxuICAgIGlmIG5vdCBjYWxsYmFjayBhbmQgZGF0YS5jb25zdHJ1Y3RvciBpcyBGdW5jdGlvbiB0aGVuIGNhbGxiYWNrID0gZGF0YTsgZGF0YSA9IHZhbHVlXG4gICAgYXN5bmMuZmlsdGVyIF8udmFsdWVzKEBzdWJzY3JpcHRpb25zKSxcbiAgICAgIChzdWJzY3JpcHRpb24sY2FsbGJhY2spIH4+IEBtYXRjaCB2YWx1ZSwgc3Vic2NyaXB0aW9uLnBhdHRlcm4sIChlcnIsZGF0YSkgLT4gY2FsbGJhY2sobm90IGVycilcbiAgICAgIChNYXRjaGVkU3Vic2NyaXB0aW9ucykgfj5cbiAgICAgICAgYXN5bmMubWFwU2VyaWVzIE1hdGNoZWRTdWJzY3JpcHRpb25zLFxuICAgICAgICAgIChzdWJzY3JpcHRpb24sIGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgaGVscGVycy5mb3JjZUNhbGxiYWNrIHN1YnNjcmlwdGlvbi5jYWxsYmFjaywgZGF0YSwgY2FsbGJhY2tcbiAgICAgICAgICBoZWxwZXJzLmNiIGNhbGxiYWNrXG4gICAgICAgICAgXG4jIG1hdGNoZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jID09IG1hdGNoZXJcbnNpbXBsZXN0TWF0Y2hlciA9IGV4cG9ydHMuc2ltcGxlc3RNYXRjaGVyID0gZXhwb3J0cy5lcXVhbGl0eU1hdGNoZXIgPSBleHBvcnRzLnNpbXBsZU1hdGNoZXIgPSBkb1xuICBtYXRjaDogKHZhbHVlLHBhdHRlcm4sY2FsbGJhY2spIC0+IGlmIHZhbHVlIGlzIHBhdHRlcm4gdGhlbiBjYWxsYmFjayBudWxsLCB0cnVlIGVsc2UgY2FsbGJhY2sgdHJ1ZVxuXG4jIHNpbXBsZSBub25yZWN1cnNpdmUgb2JqZWN0IG1hdGNoZXJcbmV4aXN0cyA9IGV4cG9ydHMuZXhpc3RzID0gdHJ1ZVxuXG5vYmplY3RNYXRjaGVyID0gZXhwb3J0cy5vYmplY3RNYXRjaGVyID1cbiAgbWF0Y2g6ICh2YWx1ZSxwYXR0ZXJuLGNhbGxiYWNrKSAtPlxuICAgIGlmIHBhdHRlcm4gaXMgZXhpc3RzIHRoZW4gcmV0dXJuIGNhbGxiYWNrIHVuZGVmaW5lZCwgdHJ1ZVxuICAgIG5vdCBfLmZpbmQgcGF0dGVybiwgKGNoZWNrdmFsdWUsa2V5KSAtPlxuICAgICAgaWYgbm90IHZhbHVlW2tleV0gdGhlbiByZXR1cm4gY2FsbGJhY2sgdW5kZWZpbmVkLCB0cnVlXG4gICAgICBpZiBjaGVja3ZhbHVlIGlzbnQgZXhpc3RzIGFuZCB2YWx1ZVtrZXldIGlzbnQgY2hlY2t2YWx1ZSB0aGVuIHJldHVybiBjYWxsYmFjayB1bmRlZmluZWQsIHRydWVcbiAgICAgIGNhbGxiYWNrIHRydWVcblxuIyBtYXRjaGVyIGJhc2VkIG9uIHZhbGlkYXRvcjJcblZhbGlkYXRvcjJNYXRjaGVyID0gZXhwb3J0cy5WYWxpZGF0b3IyTWF0Y2hlciA9XG4gIG1hdGNoOiAodmFsdWUscGF0dGVybixjYWxsYmFjaykgLT4gcGF0dGVybi5mZWVkIHZhbHVlLCBjYWxsYmFja1xuICBzdWJzY3JpYmU6ICguLi5hdHRyKSAtPlxuICAgIGF0dHJbMF0gPSB2KGF0dHJbMF0pICMgcHJlY29tcGlsZSB0aGUgdmFsaWRhdG9yXG4gICAgQ29yZTo6c3Vic2NyaWJlLmFwcGx5IEAsIGF0dHJcblxuIyBzYW1wbGUgc3Vic2NyaXB0aW9ubWVuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGVmID0gZXhwb3J0cy5kZWYgPSBDb3JlLmV4dGVuZDQwMDAgc2ltcGxlc3RNYXRjaGVyXG5iYXNpYyA9IGV4cG9ydHMuYmFzaWMgPSBDb3JlLmV4dGVuZDQwMDAgb2JqZWN0TWF0Y2hlclxuZmFuY3kgPSBleHBvcnRzLmZhbmN5ID0gQ29yZS5leHRlbmQ0MDAwIFZhbGlkYXRvcjJNYXRjaGVyLCBhc3luY0NhbGxiYWNrUmV0dXJuTWl4aW5cblxuIl19
