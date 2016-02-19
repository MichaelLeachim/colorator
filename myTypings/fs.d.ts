interface writeStream {
    on(e:string,cb:()=>void):void
}

declare module fs {
    function existsSync(path:string):boolean
    function mkdirp(path:string,cb?:(err:any)=>void):void
    function mkdirpSync(path:string):void
    function readdirSync(path:string):string[]
    function writeFileSync(path:string,data:string):void
    function writeFileSync(path:string,data:Buffer):void
    function writeFile(path:string,data:string):void
    function writeFile(path:string,data:Buffer,cb:()=>void):void
    function unlinkSync(path:string):void
    function readFileSync(path:string,encoding:string):string
    function createWriteStream(path:string):writeStream
}