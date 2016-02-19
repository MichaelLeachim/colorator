// Type definitions for complete.ly
// Project: http://complete-ly.appspot.com/
// Definitions by: VbifRkbvjd <https://github.com/VbifRkbvjd>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare module completelyInterfaces {
    interface ICompletely {
        (el:HTMLElement,style?:any):IcompletelyInstance
    }
    interface IcompletelyInstance {
        options:string[]
        startFrom:number
        setText(data:string):void
        getText():string
        onChange:(data:string)=>void
        repaint():void
        hideDropDown():void
        wrapper:HTMLElement
        prompt:HTMLElement
        input:HTMLInputElement
        hint:HTMLInputElement
        dropDown:HTMLElement
    }
}
declare var completely: completelyInterfaces.ICompletely