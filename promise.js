(function(){
  var async, Model, p, _, promiseEventMixin, out$ = typeof exports != 'undefined' && exports || this;
  async = require('async');
  Model = require('backbone4000').Model;
  p = require('bluebird');
  _ = require('underscore');
  out$.promiseEventMixin = promiseEventMixin = {
    eventPromise: function(value, data){
      var this$ = this;
      return new p(function(resolve, reject){
        return async.filter(_.values(this$.subscriptions), function(subscription, callback){
          return this$.match(value, subscription.pattern, function(err, data){
            return callback(!err);
          });
        }, function(MatchedSubscriptions){
          return p.props(_.mapObject(MatchedSubscriptions, function(it){
            return it.callback(value, data);
          })).then(function(it){
            return resolve(it);
          });
        });
      });
    }
  };
}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2xlc2gvY29kaW5nL2JpdGNvaW4vYm9tYmVyL25vZGVfbW9kdWxlcy9jb2xsZWN0aW9ucy9ub2RlX21vZHVsZXMvc3Vic2NyaXB0aW9ubWFuMi9wcm9taXNlLmxzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0VBR0UsS0FBQSxDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQTtFQUNnQixLQUFoQixDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsY0FBQSxDQUFBLENBQWdCO0VBQ04sQ0FBVixDQUFBLENBQUEsQ0FBQSxPQUFBLENBQUEsVUFBQTtFQUNZLENBQVosQ0FBQSxDQUFBLENBQUEsT0FBQSxDQUFBLFlBQUE7MkJBR0ssaUJBQWtCLENBQUEsQ0FBQSxDQUN2QjtJQUFBLGNBQWMsUUFBQSxDQUFBLEtBQUEsRUFBQSxJQUFBOztpQkFBcUIsRUFBRSxRQUFBLENBQUEsT0FBQSxFQUFBLE1BQUE7ZUFDbkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sS0FBQyxDQUFBLGFBQUYsR0FDbkIsUUFBQSxDQUFBLFlBQUEsRUFBQSxRQUFBO2lCQUEyQixLQUFDLENBQUEsTUFBTSxPQUFPLFlBQVksQ0FBQyxTQUFTLFFBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQTttQkFBYyxTQUFTLENBQUksR0FBTDtXQUFuRDtXQUNsQyxRQUFBLENBQUEsb0JBQUE7aUJBQ0UsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsc0JBQXNCLFFBQUEsQ0FBQSxFQUFBO21CQUFHLEVBQUUsQ0FBQyxTQUFTLE9BQU8sSUFBUDtXQUF0QyxDQUFYLENBQ1IsQ0FBQyxLQUFLLFFBQUEsQ0FBQSxFQUFBO21CQUFHLFFBQVEsRUFBQTtXQUFYO1NBSkc7T0FEc0I7O0VBQXJDIiwic291cmNlc0NvbnRlbnQiOlsiI2F1dG9jb21waWxlXG5cbnJlcXVpcmUhIHtcbiAgYXN5bmNcbiAgYmFja2JvbmU0MDAwOiB7IE1vZGVsIH1cbiAgYmx1ZWJpcmQ6IHBcbiAgdW5kZXJzY29yZTogX1xufVxuXG5leHBvcnQgcHJvbWlzZUV2ZW50TWl4aW4gPSBkb1xuICBldmVudFByb21pc2U6ICh2YWx1ZSwgZGF0YSkgLT4gbmV3IHAgKHJlc29sdmUscmVqZWN0KSB+PlxuICAgIGFzeW5jLmZpbHRlciBfLnZhbHVlcyhAc3Vic2NyaXB0aW9ucyksXG4gICAgICAoc3Vic2NyaXB0aW9uLGNhbGxiYWNrKSB+PiBAbWF0Y2ggdmFsdWUsIHN1YnNjcmlwdGlvbi5wYXR0ZXJuLCAoZXJyLGRhdGEpIC0+IGNhbGxiYWNrKG5vdCBlcnIpXG4gICAgICAoTWF0Y2hlZFN1YnNjcmlwdGlvbnMpIH4+XG4gICAgICAgIHAucHJvcHMgXy5tYXBPYmplY3QoTWF0Y2hlZFN1YnNjcmlwdGlvbnMsIC0+IGl0LmNhbGxiYWNrIHZhbHVlLCBkYXRhKVxuICAgICAgICAudGhlbiB+PiByZXNvbHZlIGl0XG5cblxuIl19
