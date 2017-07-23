require! {
  assert
  '../promise.ls': { promiseEventMixin }
  '../index.ls': { Core, Validator2Matcher, objectMatcher, asyncCallbackReturnMixin }
  leshdash: { wait }
  bluebird: p
}


describe 'root', -> 
  specify 'promise event', -> new p (resolve,reject) ~> 
    Cls = Core.extend4000 Validator2Matcher, promiseEventMixin
    instance = new Cls()
    
    instance.subscribe { bla: true }, -> new p (resolve,reject) ~>
      wait 100, -> resolve { x: 3 }

    instance.subscribe { blu: true }, -> new p (resolve,reject) ~> 
      wait 200, -> resolve { z: 6 }

    instance.eventPromise bla: 1, blu: 2
    .then ~>
      assert.deepEqual { '0': { x: 3 }, '1': { z: 6 } } , it
      resolve!

          
