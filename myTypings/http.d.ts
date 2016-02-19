interface httpResponse {
    pipe:(any)=>void

}
declare module http {
    function get(url:string,cb:(response:httpResponse)=>void)
}