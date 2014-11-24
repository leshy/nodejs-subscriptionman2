s = require './index'

exports.def = (test) ->
    sman = new s.def()

    sman.subscribe 'test', (event,data) ->
        test.deepEqual data, { some: 'data' }
        test.done()

    sman.event 'test_fail', {some: 'otherdata'}
        
    sman.event 'test', {some: 'data'}


exports.asyncCallback = (test) ->
    smanC = s.Core.extend4000 s.asyncCallbackReturnMixin, s.simplestMatcher
    sman = new smanC()

    sman.subscribe 'test', (data,callback) ->
        callback null, { bla: 3 }
        undefined
        
    sman.subscribe 'test', (data,callback) ->
        callback null, { bla: 8 }
        undefined

    sman.subscribe 'somethingelse', (data,callback) ->
        test.fail()
        callback null, { bla: 4 }
        undefined
        
    sman.eventAsync 'test', {some: 'data2'}, (err,data) ->
        test.deepEqual data, [ { bla: 3} , { bla: 8 } ]
        test.equals err,null
        sman.eventAsync 'nosub', {some: 'data3'}, (err,data) ->
            test.equals err, null
            test.deepEqual data, []
            test.done()

exports.fancy = (test) ->
    sman = new s.fancy()
    Validator = require 'validator2-extras'; v = Validator.v

    sman.subscribe { x: v("Number").Length({maximum: 8}), y:"String" }, (data,callback) ->
        callback null, 666

    cnt = 0
    
    sman.eventAsync 'test', (err,data) ->
        cnt++
        test.equal err,null
        test.deepEqual data, []
    sman.eventAsync { x: 3, y: 'bla' }, (err,data) ->
        cnt++
        test.equal err,null
        test.deepEqual data, [ 666 ]
        
    test.equal cnt, 2        
    test.done()