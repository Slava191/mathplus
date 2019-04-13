(function(){
        
    let elems = document.getElementsByTagName("mathplus");

    for(let el of elems){
        new MathPlus(el);
    }

    document.addEventListener('DOMNodeInserted', function(e) { 
        if(e.target.tagName === "MATHPLUS"){
            new MathPlus(e.target);
        }
    });

})();