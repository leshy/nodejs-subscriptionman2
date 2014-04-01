_ = require 'underscore'
async = require 'async'
Backbone = require 'backbone4000'

SimplestMatcher = Backbone.Model.extend4000
    match: (value,pattern) -> value is pattern

exists = exports.exists = new Object()

ObjectMatcher = Backbone.Model.extend4000
    match: (value,pattern) ->
        if pattern is exists then return true
        not _.find pattern, (checkvalue,key) ->
            if not value[key] then return true
            if checkvalue isnt exists and value[key] isnt checkvalue then return true
            false

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
    
    event: (values...) ->
        value = _.first values
        MatchedSubscriptions = _.filter _.values(@subscriptions), (subscription) =>
            @match value, subscription.pattern
            
        _.map MatchedSubscriptions, (subscription) ->
            subscription.callback.apply @, values


