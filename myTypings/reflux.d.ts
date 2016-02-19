

declare module Reflux {
    interface Store {
        init(any):void;
        listen?(listenTo:(data:any)=>any):()=>any
    }
    function connect(store:Store,localName:string):void
    function createActions(actions:Array<string>):any
    function createStore<T>(spec:T):T
}




