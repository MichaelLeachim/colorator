///<reference path='../myTypings/react.d.ts' />
///<reference path='../typings/lazy.js/lazy.js.d.ts' />
///<reference path='../typings/mousetrap/mousetrap.d.ts' />
///<reference path='./main.ts' />

var div      = React.DOM.div

var h1 = React.DOM.h1 
var h2 = React.DOM.h2 
var h3 = React.DOM.h3 
var h4 = React.DOM.h4 
var h5 = React.DOM.h5 
var textarea = React.DOM.textarea 
var span     = React.DOM.span     
var button   = React.DOM.button   
var img      = React.DOM.img      
var hr       = React.DOM.hr
var input    = React.DOM.input    
var br       = React.DOM.br       
var i        = React.DOM.i        
var video    = React.DOM.video    

module Content {
    var CONTENT = $("#frame").contents().find("#content")

    $(CONTENT).on('paste', function () {
        // Remove background placeholder
        $("#content-background").remove()
        var element = this;
            // Javascript quirks. Yaikes
            setTimeout(function () {
                State.onContentChange()
            }, 100);
        });
}

module Modal {
    export function makeModal(data:string):void{
        var el:JQuery = $("<div class='anyModal'></div>")
        $("body").append(el)
        el.html(data)
        $(el)["modal"]().open()
    }
}

module ColorEditor {
    interface IColorEditor extends React.ICreateClass{
        props: {colorType:string;State:State.IState}
    }
    interface ILeftMenuPanel extends React.ICreateClass{
        fuid:  string
        state: State.IState
    }
    interface IGetMyCss extends React.ICreateClass{
        state: State.IState
    }
    function getMyCss(){
        Modal.makeModal(
         `<textarea class='modalBody'>${State.getMyCss()}</textarea>`)
    }
    
    var ColorEditor = React.createClass<React.ICreateClass,any>({
        render: function () {
            var _this:IColorEditor = this
            var result = Lazy(_this.props.State.Datum)
                .keys()
                .sort(function(a:string,b:string){
                    var a_el = _this.props.State.Datum[a]
                    var b_el = _this.props.State.Datum[b]
                    var r = Lib.popularity_rang(a_el) < Lib.popularity_rang(b_el) ? 1: 0
                    return r
                })
                .filter(function(el){
                    var full_el = _this.props.State.Datum[el]
                    if(Lib.popularity_rang(full_el) == 0){
                        return false
                    }
                    return true
                    // no need for colorType testing
                    // if(full_el[0].type == _this.props.colorType){
                    //     return true
                    // }
                    // return false
                })
                .map(function(el){
                    var color = _this.props.State.Datum[el][0].data
                    return input(
                        {type:"color",
                         value:color,
                         onChange:function(e:React.ISynthEvent){
                             State.onColorsChange(el,e.target.value)
                         }
                        },[])
                })
                .toArray()
            return div({}, [result])
        }
    })
    interface IImageDropper extends React.ICreateClass {
        props?: {addedFile:(f)=>void}
        onNewFile: (e)=>void
    }
    // make undo 
    Mousetrap.bindGlobal("ctrl+z",function(e){
        e.preventDefault()
        console.log("now undo")
        State.undo()
    })
    
    var ImageDropper = React.createClass<React.ICreateClass,any>({
        onNewFile: function(e){
            State.onImageUploaded(e.nativeEvent.target)
        },
        render: function(){
            var _this:IImageDropper = this            
            return input({
                type:"file",
                className: "file-dropper",
                onChange: _this.onNewFile,
                ref: "dropzone-ref"})
        }
    })
    
    var LeftMenuPanel = React.createClass<React.ICreateClass,any>({
        fuid:"",
        getInitialState: function(){
            return {Datum:{}}
        },
        componentDidMount: function() {
            var _this:ILeftMenuPanel = this
            _this.fuid = State.sub(function(data:State.IState){
                _this.setState(data)
            })
        },
        componentDidUpdate:function(){
        },
        componentWillUnmount: function() {
            var _this:ILeftMenuPanel = this
            // unsubscribe from
            State.unsub(_this.fuid)
        },
        render: function(){
            var _this:ILeftMenuPanel = this
            if(_.keys(_this.state.Datum).length == 0){
                var innerHtml = `
                    <hr>
                    <h2 class="" >Modify color styles of any page</h2>
                    <hr>
                    <div class="description ">
                    This is <b>the Colorator</b>. 
                    It's main purpose is to select the best pallitre possible.<p><p>
                     <hr>
                     Open any site<p>
                     Select and copy it to the left<p>
                     Modify it's color scheme<p>
                    <hr>
                    The best color tool for designers with deadlines.<P>
                </div>`
                return div({dangerouslySetInnerHTML:{__html:innerHtml}})
            }
            var general_colors = ColorEditor({State:_this.state,colorType:"color_generale"})
            var minor_colors   = ColorEditor({State:_this.state,colorType:"color_minor"})
            return div({},[
                hr({}),                
                h2({className:"inset-darktext"},"You can change any color"),
                minor_colors,
                hr({}),
                h2({},"Or you could use an image as a source"),
                // button({onClick:State.like_amazon},"Like amazon"),
                // button({onClick:State.like_facebook},"Like facebook"),
                // button({onClick:State.like_bootstrap_3},"Like bootstrap 3"),
                // button({onClick:State.like_ebay},"Like ebay"),
                // button({onClick:State.like_google},"Material design like"),
                // button({onClick:State.like_reddit},"Like reddit"),
                ImageDropper({addedFile:console.log}),
                hr({}),                
                button({className:"getMyCss",onClick:getMyCss},"Get My CSS!")
            ])
        }
    })    
    // if(_.values(_this.state.Datum).length == 0){
    // }
    React.render(LeftMenuPanel({}),$("#color-content").get(0))
    
    
}

