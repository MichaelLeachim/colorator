declare module NWGUI_old {
    export interface IMenuItemOption {
        label?:string
        type?:string
        enabled?:boolean
        icon?:string
        submenu?: IMenuItemOption[]
        tooltip?:string
    }
    export interface IApp {
        unregisterGlobalHotKey(shortcut:IShortcut):void;
        registerGlobalHotKey(shortcut:IShortcut):void;
    }
    export interface IShortCutOption {
        key: string
        active: ()=>void
        failed: (err:string)=>void
    }
    export interface IShortcut {
        new(option:IShortCutOption);
    }
    interface ICliboardInstance {
        get(type:string):string;
    }
    interface IClipboard {
        get():ICliboardInstance
    }
    var Clipboard:IClipboard
    export class IWIN {
        minimize():void;
        removeAllListeners(what:string):void;
        enterKioskMode():void;
        leaveKioskMode():void;
        open(url:string):void;
        on(e:string,cb:()=>void);
        close(el:boolean):void;
        //Clipboard:IClipboard

    }
    export interface IWindow {
        get:()=>IWIN
    }



    //declare var MenuItem function()
    //export interface MenuItem
    //export class MenuItem(data:IMenuItemOption):IMenuItemOption

    export class MenuItem {
        constructor(config?:IMenuItemOption);
        click:Function;
        label:string
        type:string
        enabled:boolean
        icon:string
        submenu: IMenuItemOption[]
        tooltip:string
    }
    export class Menu {
        constructor();
        append(item:IMenuItemOption):void;
        removeAt(index:number):void;
        remove(item:IMenuItemOption):void;
        popup(x?:number,y?:number):void;
    }
    var Window:IWindow
    var Shortcut:IShortcut
    var App:IApp
    //class Menu     implements IMenu {}
}




