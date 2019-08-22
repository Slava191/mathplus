(function(){
    
	//Преобразовываем все элементы обернутые mathplus
	[...document.getElementsByTagName("mathplus")].forEach((el) => new MathPlus(el));
	
	//Ставим прослушку на все динаимически появишиеся элементы mathplus
    document.addEventListener('DOMNodeInserted', function(e) {
		//Если появляется только mathplus
		if(e.target.tagName === "MATHPLUS") new MathPlus(e.target); 
		//Если появляется элемент содержащий в себе дочерние
		if(e.target.childNodes.length) [...e.target.getElementsByTagName("mathplus")].forEach((el) => new MathPlus(el)); 
    });

})();
