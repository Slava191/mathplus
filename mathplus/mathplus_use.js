(function(){
    
	//Преобразовываем все элементы обернутые mathplus
    
    let elems = document.getElementsByTagName("mathplus");

    for(let el of elems){
        new MathPlus(el);
    }
	
	//Ставим прослушку на все динаимически появишиеся элементы mathplus
	
    document.addEventListener('DOMNodeInserted', function(e) {

		if(e.target.childNodes.length){
			
			let dyn_elems = e.target.getElementsByTagName("mathplus");
			
			for(let el of dyn_elems){
				new MathPlus(el);
			}
		
		}else if(e.target.tagName === "MATHPLUS"){
			
			new MathPlus(e.target);
			
		}

    });

})();
