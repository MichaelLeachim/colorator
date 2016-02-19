///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/lodash/lodash.d.ts' />
///<reference path='./const.ts' />
///<reference path='../myTypings/etc.d.ts' />

module State {
    var content_selector = $("#frame").contents().find("#content")
    
    export interface ICollectible {
	selector:   string
	data:       string
	prop_type:  string
        type:       string
        coords: {x:number;
                 y:number}
    }
    export interface IDatum {[Tag:string]:ICollectible[]}
    
    export interface IState {
        UndoStack:  string[][]
	Datum: {[Tag:string]:ICollectible[]}
    }
    
    var _subscribers:{[index:string]:(data:IState)=>void} =  {}
    
    export var State:IState = {
        Datum: {},
        UndoStack: []
        
    }
    // ======================== Model working elements ==========================
    export function onContentChange():void{
        State.Datum =  Lib.collect_data(content_selector)
        flush_for_undo()
        pub()
    }
    export function onImageUploaded(input:HTMLInputElement):void{
        //  translate input to image element
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var imgObj = new Image()
                imgObj.src = e.target["result"]
                var colorThief = new ColorThief();
                import_palette(
                    _.map(colorThief.getPalette(imgObj,_.keys(State.Datum).length),function(el){
                        return Lib.parsedRgbToHex(el[0],el[1],el[2])
                    }))

            }
        }
        try{
            reader.readAsDataURL(input.files[0]);
        }catch(e){
            console.log(e)
        }
    }
    export function onColorsChange (color_sign:string,new_color_sign:string):void{
        Lib.modify_prop(State.Datum,color_sign,new_color_sign)
        flush_for_undo()
        pub()
    }
    export function getMyCss():string {
        return Lib.gencss(State.Datum)
    }
    export function export_palette():string[]{
        return _.map(Lib.sort_datum(State.Datum),function(v,k){
            return State.Datum[v][0].data
        })
    }
    
    export function import_palette(palette:string[]):void{
        Lib.rebuild_palette(palette,State.Datum)
        flush_for_undo()
        pub()
    }
    export function undo(){
        if(State.UndoStack.length > 0){
            Lib.rebuild_palette(State.UndoStack.pop(),State.Datum)
        }
        pub()
    }

    // ============ Preloaded palettes ================
    export function like_facebook(){
        import_palette(Const.like_facebook)
    }
    export function like_google(){
        import_palette(Const.like_google)
    }
    export function like_ebay(){
        import_palette(Const.like_ebay)
    }
    export function like_reddit(){
        import_palette(Const.like_reddit)
    }
    export function like_bootstrap_3(){
        import_palette(Const.like_bootstrap_3)
    }
    export function like_amazon(){
        import_palette(Const.like_amazon)
    }
    // ============= Undo Redo ========================
    function flush_for_undo(){
        State.UndoStack.push(export_palette())
    }
    // ======================== PUB SUB =================
    
    export function pub(){
        _.map(_subscribers,function(v,k){
            v(State)
        })
    } 
    export function sub(cb:(data:IState)=>void):string{
        var id  = Lib.gensym()
        _subscribers[id] = cb
        return id
    }
    export function unsub(id:string):void{
        delete _subscribers[id]
    }
}
module Lib {
    var content_selector = Const.content_selector

    export function gensym():string{
        // generate unique id
        function s4():string{
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    }
    export function rgb2hex(rgb){
       rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
       return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }
    export function parsedRgbToHex(r:number, g:number, b:number):string {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    function isSelectorTag(data:string):boolean {
        if(data[0] == "#" || data[0] == "."){
            return false
        }
        return true
    }
    export function gencss(d:State.IDatum):string{
        return _.map(d,function(v:State.ICollectible[],k){
            var color = v[0].data
            var properties:{[index:string]:string[]} = {}
            _.map(v,function(v2:State.ICollectible,k2){
                try{
                    properties[v2.prop_type].push(v2.selector)
                }catch(e){
                    properties[v2.prop_type] = [v2.selector]
                }
            })
            // debugger
            return _.map(properties,function(v2,k2){
                return   `${v2.join(", ")}{\n` +
                         `    ${k2}:${color} !important;\n}`
            }).join("\n")
        }).join("\n")
    }
    function tree_walker(node:Node, func:(el:Node)=>void) {
        func(node);
        var node = node.firstChild
        while (node) {
            tree_walker(node, func);
            var node = node.nextSibling;
        }
    }
    export function rebuild_palette(palette:string[],data: State.IDatum):State.IDatum{
        var datum = sort_datum(data)
        // hack to ensure filling all data
        var palette = palette.concat(palette)
                             .concat(palette).concat(palette)
        for (var k in palette){
            modify_prop(data,datum[k],palette[k])
        }
        return data
    }
    export function sort_datum (data:State.IDatum):string[]{
        return Lazy(data).keys().sort(function(a,b){
            var a_el = data[a]
            var b_el = data[b]
            var r = popularity_rang(a_el) < popularity_rang(b_el) ? 1: 0
            return r
        }).toArray()
    }
    export function make_selector(el:JQuery,use_class:boolean = true, use_id:boolean = true,use_name:boolean=true):string{
        // the logic behind is simple:
        // if element contains class or id
        // it would probably has a  reference in styles
        try{
            var css_class = _.compact($(el).attr("class").split(/[\s\n]+/))
            var css_id    = $(el).attr("id")
            var css_name  = $(el).prop("tagName")
            if(css_id && use_id){
    	        return "#" + css_id.trim() 
       	    }
            if(css_class.length && use_class){
    	        return "." + css_class.join(".")
    	    }
            if(css_name && use_name){
                return css_name + ":not([class]):not([id])"
            }
        }catch(e){
            // console.log(e)
            return ""
        }
    }
    export function popularity_rang(data:State.ICollectible[]):number{
        // we calculate popularity of color
        // by summing and then multiplying el's coordinates
        var result:number = 0
        for(var k in data){
            result += data[k].coords.x * data[k].coords.y
        }
        return result
    }
    function truncate_color_garbage(data:string):string {
        // We assume, that there is only one true representation
        var result = rgb2hex(data.match(/rgba?\([0-9,\s]+\)/)[0])
        return result
    }
    function make_component(el:JQuery,prop:string = "color"):State.ICollectible {
        try{
            var css_prop  = truncate_color_garbage($(el).css(prop))
        }catch(e){
            var css_prop = ""
        }
        try{
            var el_X  = el.width()
            var el_Y  = el.height()
        }catch(e){
            var el_X  = 0
            var el_Y  = 0
        }
        // we are not interested in invisible elements
        // if((el_X * el_Y) == 0){
        //     return null
        // }
        var selector = make_selector($(el))
        // we are not interested in not selectable items
        if(selector == "" || selector == undefined){
            return null
        }
        // we are not interested in white(default) colors, or empty styles
        if(css_prop == "#000000" || css_prop == ""){
            return null
        }
        // if(css_prop == ""){
        //     return null
        // }
        // determine element type
        // debugger
        var prop_type = isSelectorTag(selector) ? "color_generale" : "color_minor"
        // if(prop == "color"){
        //     prop_type = "color_front"
        // }
        var element_object:State.ICollectible = {
            selector:   selector,
            data:       css_prop,
            type:       prop_type,
            prop_type:  prop,
            coords:     {x:el_X,y:el_Y}
        }
        return element_object
    }
    
    export function modify_prop(Datum:State.IDatum,old_prop:string,new_prop:string):State.IDatum{
        // Important! Keys continue to act like a keys.
        // They are immutable in changing colors. Because it would impose clashes
        for (var k in Datum[old_prop]) {
            var el = Datum[old_prop][k]
            el.data = new_prop
            // console.log(new_prop)
            try{
                $(Const.content_selector).find(el.selector).css(el.prop_type,new_prop)
            }catch(e){
                ""
            }
        }
        return Datum
    }
    function append_data(context:State.IDatum,
                         dublicates:{[index:string]:boolean},
                         component:JQuery,prop:string){
        var el = make_component($(component),prop)
        
        if(el && el.selector){
            if(dublicates[el.prop_type + el.selector]){
                return context
            }
            if(context[el.data] == undefined){
                context[el.data] = [el]
            }else{
                context[el.data].push(el)
            }
            dublicates[el.prop_type + el.selector] = true
        }
        return context
    }

    export function collect_data(selector:JQuery):{[Tag:string]:State.ICollectible[]}{
	var result:{[Tag:string]:State.ICollectible[]}  = {}
        var isRepeated:{[index:string]:boolean} = {}
	tree_walker(selector.get(0),function(el:HTMLElement){
	    // right now working only with class names and id's  colors and backgrounds
            append_data(result,isRepeated,$(el),"color")
            append_data(result,isRepeated,$(el),"background")
            append_data(result,isRepeated,$(el),"background-color")
            // append color
	})
        // we are not interested in no color components
        delete result[""]
        
        return result
    }
    // apply css rules  to visible template
    export function apply_rules(data:{[Tag:string]:State.ICollectible[]},selector:string="#content") {
	_.map(data,function(v,k){
            _.map(v,function(v2:State.ICollectible,k2){
                $(selector).find(v2.selector).css(v2.prop_type,v2.data)
            })
	})
    }
}
