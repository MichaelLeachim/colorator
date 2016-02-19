declare module context {
    interface IOptions {
        fadeSpeed?:number
        filter?:(any)=>any
        above?:string|boolean
        preventDoubleContext?:boolean
        compress?:boolean
    }
    export function init(data:IOptions):void
    export function attach(selector:string|HTMLElement,menu:any):void
    export function destroy(selector:string|HTMLElement):void

}