_ = require 'underscore'
async = require 'async'
Backbone = require 'backbone4000'
Validator = require 'validator2-extras'; v = Validator.v
helpers = require 'helpers'

# core ------------------------------------------------------------

Core = exports.Core = Backbone.Model.extend4000
    initialize: ->
        @counter = 0
        @subscriptions = {}

    subscribe: (pattern,callback,name=@counter++) ->
        if not callback and pattern.constructor is Function
            callback = pattern
            pattern = true

        @subscriptions[name] = pattern: pattern, callback: callback

        @trigger 'subscribe',name
        
        =>
            delete @subscriptions[name]
            @trigger 'unsubscribe', name
    
    event: (value, data) ->
        async.filter _.values(@subscriptions),
            (subscription,callback) => @match value, subscription.pattern, (err,data) -> callback(not err)
            (MatchedSubscriptions) ->
                _.map MatchedSubscriptions,
                    (subscription, callback) ->
                        subscription.callback data


# core mixins ------------------------------------------------------------

asyncCallbackReturnMixin = exports.asyncCallbackReturnMixin = Backbone.Model.extend4000
    eventAsync: (value, data, callback) ->
        async.filter _.values(@subscriptions),
            (subscription,callback) => @match value, subscription.pattern, (err,data) -> callback(not err)
            (MatchedSubscriptions) ->

                async.mapSeries MatchedSubscriptions,
                    (subscription, callback) ->
                        helpers.forceCallback subscription.callback, data, callback
                    callback


# matchers ------------------------------------------------------------
 
simplestMatcher = exports.simplestMatcher = Backbone.Model.extend4000
    match: (value,pattern,callback) -> if value is pattern then callback null, true else callback true

exists = exports.exists = new Object()

ObjectMatcher = exports.ObjectMatcher = Backbone.Model.extend4000
    match: (value,pattern,callback) ->
        if pattern is exists then return callback true
        not _.find pattern, (checkvalue,key) ->
            if not value[key] then return callback true
            if checkvalue isnt exists and value[key] isnt checkvalue then return callback true
            callback false


# sample subscriptionmen ------------------------------------------------------------

Basic = exports.Basic = Core.extend4000 simplestMatcher
