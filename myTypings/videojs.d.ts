
interface videoAcross {
    dispose():void
    dimensions(width:number, height:number )
    currentType():string
    currentTime():number
    currentTime(seconds:number):videoAcross
    currentSrc():string
    load():void
    src(url:string):void
    on(eventName:string,callback:()=>void)
    rangeslider?(options:IGrangeSliderOnLoadOptions):void
    ready?(callback:()=>void)
    play():void
    pause():void
    duration():number
}

interface IGrangeSliderOnLoadOptions {
    locked:boolean
    hidden:boolean
    panel:boolean
    controlTime:boolean
}


// TODO annotate this library
declare module videoTyped {

    interface IvideoNode extends videoAcross {}
    interface IrangeSliderOnLoadOptions extends IGrangeSliderOnLoadOptions {}    
    
    // events: "loadedRangeSlider"
    //         "sliderchange"
    interface IrangeSlider extends IvideoNode {
	showSlider():void
	// Show the Slider Bar Component
	hideSlider():void
	// Hide the Slider Bar Component
	showSliderPanel():void
	// Show the Panel above the arrow with the current position
	hideSliderPanel():void
	// Hide the Panel above the arrow with the current position
	showControlTime():void
	// Show the panel to edit the time for the start and end arrows
	hideControlTime():void
	// Hide the panel to edit the time for the start and end arrows
	lockSlider():void
	// Lock the Slider bar and it will not be possible to change the arrow positions
	unlockSlider():void
	// Unlock the Slider bar and it will be possible to change the arrow positions
	setValueSlider(start:number,end:number):void
	// Set a values in seconds for the position of the arrows.
        playBetween(start:number,end:number):void
	// The video will be played in a selected section. It is necessary to enter the start and end second.
	loopBetween(start:number,end:number):void
	// The video will be looped in a selected section. It is necessary to enter the start and end second.
	getValueSlider():{start:number;end:number}
	// Get the Values of the arrows in second.
    }
}
declare module "videojs" {
    export = videojs
}

declare var videojs: (selector:any)=>videoAcross




