declare module path {
    function join(path1:string,path2:string,...restOfName: string[]):string
    function basename(p1:string,p2?:string):string
    function parse(fPath:string):{root:string;dir:string;base:string;ext:string;name:string}
}




