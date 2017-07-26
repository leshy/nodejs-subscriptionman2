# autocompile
_ = require 'underscore'
async = require 'async'
Backbone = require 'backbone4000'
Validator = require 'validator2-extras'; v = Validator.v
helpers = require 'helpers'

# core ------------------------------------------------------------

Core = exports.Core = Backbone.Model.extend4000 do
  initialize: ->
    @counter = 0
    @subscriptions = {}

  subscribeWait: (timeout, pattern, callback, callbackError, name) ->
    wrappedCallback = (...data) ->
      cancelErrorTimeout()
      callback.apply @, data

    unsub = @subscribeOnce pattern, wrappedCallback, name

    cancelErrorTimeout = helpers.wait timeout, ->
      unsub()
      helpers.cbc callbackError, new Error 'timeout'

  subscribeOnce: (pattern, callback, name) ->
    unsub = undefined
    wrappedCallback = (...data) -> unsub(); callback.apply @, data
    unsub = @subscribe pattern, wrappedCallback, name

  subscribe: (pattern, callback, name=@counter++ ) ->
    if not callback and pattern.constructor is Function
      callback = pattern
      pattern = true

    @subscriptions[name] = pattern: pattern, callback: callback

    @trigger 'subscribe',name

    ~>
      delete @subscriptions[name]
      @trigger 'unsubscribe', name

  event: (...data) ->
    eventType = _.first data
    async.filter _.values(@subscriptions),
      (subscription,callback) ~> @match eventType, subscription.pattern, (err,data) -> callback(not err)
      (MatchedSubscriptions) ~>
        if @matchAll
          _.map MatchedSubscriptions,
            (subscription, callback) -> subscription.callback.apply @, data
        else
          next = ->
            if MatchedSubscriptions.length
              sub = MatchedSubscriptions.pop()
              sub.callback.apply @, data.concat(next)
          next()
    if data.length is 1 then _.first data else data

# core mixins ------------------------------------------------------------

asyncCallbackReturnMixin = exports.asyncCallbackReturnMixin = Backbone.Model.extend4000 do
  eventAsync: (value, data, callback) ->
    if not callback and data.constructor is Function then callback = data; data = value
    async.filter _.values(@subscriptions),
      (subscription,callback) ~> @match value, subscription.pattern, (err,data) -> callback(not err)
      (MatchedSubscriptions) ~>
        async.mapSeries MatchedSubscriptions,
          (subscription, callback) ->
            helpers.forceCallback subscription.callback, data, callback
          helpers.cb callback
          
# matchers ------------------------------------------------------------

# == matcher
simplestMatcher = exports.simplestMatcher = exports.equalityMatcher = exports.simpleMatcher = do
  match: (value,pattern,callback) -> if value is pattern then callback null, true else callback true

# simple nonrecursive object matcher
exists = exports.exists = true

objectMatcher = exports.objectMatcher =
  match: (value,pattern,callback) ->
    if pattern is exists then return callback undefined, true
    not _.find pattern, (checkvalue,key) ->
      if not value[key] then return callback undefined, true
      if checkvalue isnt exists and value[key] isnt checkvalue then return callback undefined, true
      callback true

# matcher based on validator2
Validator2Matcher = exports.Validator2Matcher =
  match: (value,pattern,callback) -> pattern.feed value, callback
  subscribe: (...attr) ->
    attr[0] = v(attr[0]) # precompile the validator
    Core::subscribe.apply @, attr

# sample subscriptionmen ------------------------------------------------------------
def = exports.def = Core.extend4000 simplestMatcher
basic = exports.basic = Core.extend4000 objectMatcher
fancy = exports.fancy = Core.extend4000 Validator2Matcher, asyncCallbackReturnMixin

