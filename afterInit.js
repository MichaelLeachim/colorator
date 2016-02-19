
// make iframe contenteditable
$("#frame")
    .contents()
    .find("body")
    .attr("contenteditable","true")
    .attr("id","content")

// make animations

setTimeout(function(){
    $(".left-ease")
      .removeClass("left-ease")
},300)
setTimeout(function(){
    $(".right-ease")
      .removeClass("right-ease")
},100)

// setup modal
$.modal({
    closeOnESC: true,
    onClose:function(){
        $(".anyModal").remove()
    },
    onOpen:function(){
        // must focus on editables
        $(".anyModal input").first().focus()
        $(".anyModal textarea").first().focus()        
    },
    
})

