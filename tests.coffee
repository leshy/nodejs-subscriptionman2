s = require './index'

exports.basic = (test) ->
    sman = new s.Basic()

    sman.subscribe 'test', (data) ->
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
        test.done()

