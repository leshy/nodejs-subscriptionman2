#autocompile

require! {
  async
  backbone4000: { Model }
  bluebird: p
  underscore: _
}

export promiseEventMixin = do
  eventPromise: (value, ...data) -> new p (resolve,reject) ~>
    async.filter _.values(@subscriptions),
      (subscription,callback) ~> @match value, subscription.pattern, (err,data) -> callback(not err)
      (MatchedSubscriptions) ~>
        p.props _.mapObject(MatchedSubscriptions, -> it.callback value, ...data)
        .then ~> resolve it


