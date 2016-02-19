declare module Jcrop {
    export interface IJCrop {
        destroy():void
    }
    export interface Coords {
        x:number
        y:number
        x2:number
        y2:number
        w:number
        h:number
    }

    export function destroy():void
}