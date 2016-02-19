declare module React {
    // (WTF) because intellij hangs as soon as it sees React in code(must realias react to R, somewhere in the globals
    interface  domNode {}
    interface IRealDomNode extends HTMLElement,HTMLInputElement{}
    interface wrongDomNode {}
    
    interface ISynthEvent {
        keycode:number
        keyCode:number
        target:IRealDomNode
    }

    interface IRef {
        getDOMNode():IRealDomNode
    }
    interface IDom {
        div      (attrs:{},children?:any):domNode;
        h1       (attrs:{},children?:any):domNode;
        h2       (attrs:{},children?:any):domNode;
        h3       (attrs:{},children?:any):domNode;
        h4       (attrs:{},children?:any):domNode;
        h5       (attrs:{},children?:any):domNode;
        textarea (attrs:{},children?:any):domNode;
        span     (attrs:{},children?:any):domNode;
        button   (attrs:{},children?:any):domNode;
        img      (attrs:{},children?:any):domNode;
        hr       (attrs:{},children?:any):domNode;
        input    (attrs:{},children?:any):domNode;
        br       (attrs:{},children?:any):domNode;
        i        (attrs:{},children?:any):domNode;
	
        video    (attrs:{},children?:any):domNode;	
    }
    interface IAddons {
	CSSTransitionGroup (attrs:{},children?:any):domNode;
    }
    
    interface IDefaultComponent {
        render():domNode
        state?:{}
        props?:{}
        refs?: any
        getDefaultProps?:()=>any
        getInitialState?:()=>any
        componentDidMount?:()=>any
        componentWillUnmount?:()=>any
        setState?:(state?:{})=>void
        replaceState?:(state?:{})=>void
    }
    interface ICreateClass extends IDefaultComponent{
        mixins?:any[]
    }
    var DOM:IDom
    var addons: IAddons
    function createClass<ispec,iprops>(spec:ispec):{
        (attrs:iprops,children?:any):domNode
    }
    function createFactory(component:domNode):domNode
    function renderComponent(node:any,mountPoint:HTMLElement):void
    function render(node:any,mountPoint:HTMLElement):void
}

    
    


