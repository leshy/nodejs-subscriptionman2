s = require './index'

exports.basic = (test) ->
    sman = new s.Basic()

    sman.subscribe 'test', (data) ->
        test.deepEqual data, { some: 'data' }
        test.done()

    sman.event 'test_fail', {some: 'otherdata'}
        
    sman.event 'test', {some: 'data'}

