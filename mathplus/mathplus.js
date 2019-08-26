class MathPlus{

    //Текущий баг-лист

    //2) MathJax будет работать также и вне <mathplus>

    constructor(el){

            let text = el.innerHTML;

            if(MathPlus.isMathjax && text.indexOf('[m]')!==-1 && text.indexOf('[/m]')!==-1){
                //По непонятное мне причине для динамечески подгружаемых элементов может потребоваться
                //2 раза вызывать Queue
                
                
                console.log('Динамическое преобразование', el);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
            }

            //Единожды подключаем Mathjax если им тут что-то обрабатывается.
            if(!MathPlus.isMathjax && text.indexOf('[m]')!==-1 && text.indexOf('[/m]')!==-1){
                MathPlus.isMathjax = true;
                MathPlus.include_mathjax("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=default");
            }



            let characters_for_action = {
                "/" : this.fraction.bind(this), //Красивыя дробь
                "^" : this.exponentiation.bind(this), //Возведение в степень
                "log" : this.log_base.bind(this), //Основание логарифма
                "sqrt" : this.square_root.bind(this), //Квадратный корень
                "_" : this.subscript.bind(this), //Нижний индекс
                "[b]" : this.replacingMyTags.bind(this, "[b]", "[/b]", "<b>", "</b>"), //Жирный текст
                "[i]" : this.replacingMyTags.bind(this, "[i]", "[/i]", "<i>", "</i>"),
                "[u]" : this.replacingMyTags.bind(this, "[u]", "[/u]", "<u>", "</u>"),
                "[blue]" : this.replacingMyTags.bind(this, "[blue]", "[/blue]", "<span style='color:#6672B3'>", "</span>"),
                "[green]" : this.replacingMyTags.bind(this, "[green]", "[/green]", "<span style='color:#70E0AC'>", "</span>"),
                "[red]" : this.replacingMyTags.bind(this, "[red]", "[/red]", "<span style='color:#C65555'>", "</span>"),
                "[r]" : this.replacingMyTags.bind(this, "[r]", "[/r]", "<div class=ramka>", "</div>"), //Рамка
                "[m]" : this.replacingMyTags.bind(this, "[m]", "[/m]", "[nomath][m]", "[/m][/nomath]"), //Преобразования с помощью MathJax.js (хак всего-лишь отключает действия нашего скрипта в этой области)
                "[link=" : this.replacingMyTags.bind(this, "[link=", "]", "<a href=", ">ссылка</a>"), //Ссылка
                //"[img=" : this.replacingMyTags.bind(this, "[img=", "]", "<img src='", "'>"), //Изображение
                "vector{" : this.replacingMyTags.bind(this, "vector{", "}", "<span class=vector>", "</span>"), //Вектор
                "system{" : this.replacingMyTags.bind(this, "system{", "}", "", ""), //Система уравнений
                "[youtube=" : this.replacingMyTags.bind(this, "[youtube=", "]", "<iframe src='", "'>"), //Видео на ютуб
                "[nomath]" : this.replacingMyTags.bind(this, "[nomath]", "[/nomath]", "", ""), //Без математики
                "-": this.replaceMySubsting.bind(this, "-", "&ndash;"),
                "Pi": this.replaceMySubsting.bind(this, "Pi", "&pi;"),
                "больше или равно": this.replaceMySubsting.bind(this, "больше или равно", "&ge;"),
                "меньше или равно": this.replaceMySubsting.bind(this, "меньше или равно", "&le;"),
                "smaller": this.replaceMySubsting.bind(this, "smaller", "&lt;"),
                "*": this.replaceMySubsting.bind(this, "*", "&middot;"),
            };

            //Получаем массив ключей characters_for_action
            let keys = Object.keys(characters_for_action);

            //Создаем массив длин ключей и делаем его уникальным
            let keys_length = keys.map((v, i, a) => v.length)
                                  .filter((v, i, a) => a.indexOf(v) === i);


            //Прокручиваем строку посимвольно и ищем вхождения из characters_for_action
            //Если находим выполняем соответсвующую функцию
            for (let i = 0; i <= text.length; i++) {

                for(let len of keys_length){

                    let substring_to_check = text.substring(i-len, i);

                    //console.log('Ищу в: ', '['+substring_to_check+']');
                    
                    if(substring_to_check in characters_for_action){

                        // console.log('//////////////'); 

                        // console.log('Текст до замены: ', '['+text+']');
                        // console.log('Длина до замены: ', text.length);
                        // console.log('Номер просматриваемого символа: ', i);
                        // console.log('Символ до: ', text[i-1]);
                        // console.log('Символ текущий: ', text[i]);
                        // console.log('Символ после: ', text[i+1]);

                        let res = characters_for_action[substring_to_check](text, i);

                        if(typeof(res) === "string"){
                            text = res; 
                        }else if(typeof(res) === "object"){ 

                        // В случае если нужно отмотать корретку, дабы больше не 
                        // применять математику к этому участку

                            text = res.text;
                            i = res.i;

                        }

                        // console.log('_______'); 
                        
                        // console.log('Текст после замены: ', '['+text+']');
                        // console.log('Длина после замены: ', text.length);
                        // console.log('Номер просматриваемого символа: ', i);
                        // console.log('Символ до: ', text[i-1]);
                        // console.log('Символ текущий: ', text[i]);
                        // console.log('Символ после: ', text[i+1]);
                        
                        
                    }

                }   
            }

            /* ВАЖНО!!! */

            //split - преобразует Все встречаемое в текста автоматически, не взирая на [nomath]
            //поэтому, если такая замена может повредить работоспособности - её необходимо перенести
            //в replaceMySubsting

            //Взято из старой версии mathscr без изменений

            //text = text.split("-").join("&ndash;"); //Может повредить ссылкам
            text = text.split("плюс/минус").join("&plusmn;");
            //text = text.split("больше или равно").join("&ge;");
            //text = text.split("меньше или равно").join("&le;");
            //text = text.split("smaller").join("<");
            text = text.split("бесконечность").join("&infin;");
            text = text.split("градусов").join("&deg;");
            //text = text.split("градус").join("&deg;");
            text = text.split("Цельсия").join("C");
            //text = text.split("Pi").join("&pi;");
            text = text.split("альфа").join("&alpha;");
            text = text.split("бета").join("&beta;");
            text = text.split("гамма").join("&gamma;");
            //text = text.split("*").join("&middot;");
            //text = text.split("phi").join("&phi;");
            text = text.split("лямбда").join("&lambda;");
            text = text.split("ТЕТА").join("&theta;");
            //text = text.split("epsilon").join("&epsilon;");

            text = text.split("[block]").join("");
            text = text.split("[/block]").join("");

            el.innerHTML = text

                        



    }

    static include_mathjax() {
        let script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=default";
        document.getElementsByTagName('head')[0].appendChild(script);
        let script_config = document.createElement('script');
        script_config.type = "text/x-mathjax-config";
        script_config.innerText = "MathJax.Hub.Config({tex2jax: {inlineMath: [['[m]','[/m]']],displayMath: []}});"
        document.getElementsByTagName('head')[0].appendChild(script_config);
    }

    static include_css(){
        let style = document.createElement('style');
        style.type = "text/css";
        //link.href = "mathplus/mathplus.css";
        style.innerText = "mathplus .numerator, mathplus .denominator {padding: 0 5px; }mathplus .fraction { margin:0 5px; float:left; text-align:center;}mathplus .near_fraction{ float:left; margin-top:14px;}mathplus .numerator{ display: block; padding-bottom:4px;}mathplus .denominator{ border-top: 1px solid #000; display: block; padding-top:4px;}mathplus .radic{ border-top:solid 1px black;}mathplus .ramka{background-color:white;box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);padding:10px; border-radius:5px;margin:5px;}mathplus .vector{ border-top: 1px solid #000;}mathplus .systemtable{ font-size:16pt;}mathplus .systembkt{ font-size:50pt;}mathplus sub, mathplus sup{ font-size:80%;}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    //Красивое деление
    fraction(text, i){

            i = i-1;
         

            let devidend_bkt = {
                flag:false,
                open_bkt_pos:0,
                close_bkt_pos:0
            };

            // Ищем открывающую и закрывающую скобку делимого
            if(text[i-1] === ")"){

                let bkt_counter = 0;
                
                for(let k = i-1; k >= 0; k--){

                    if(text[k] == ")") bkt_counter++;
                    if(text[k] == "(") bkt_counter--;

                    if(text[k] == "(" && bkt_counter==0){
                        devidend_bkt.flag = true;
                        devidend_bkt.close_bkt_pos = i-1;
                        devidend_bkt.open_bkt_pos = k;
                        break;
                    }

                } 

            }

            // Ищем открывающую и закрывающую скобку делителя
            let divider_bkt = this.bkt(text, i);

        
            let left_block = {
                flag:false,
                tag:"[block]",
                pos:0
            };

            let right_block = {
                flag:false,
                tag:"[/block]",
                pos:0
            };

            // Ищем [block] и [/block], которым необходимо оборачивать любую строку с делением
            if(devidend_bkt.flag === true && divider_bkt.flag === true){

                //Запускаем цикл назад на поиск [block]
                for(let k = i-1; k >= 0; k--){

                    if(text.substring(k-left_block.tag.length, k) === left_block.tag){
                        left_block.flag = true;
                        left_block.pos = k;

                        break;
                    }

                }

                //Запускаем цикл вперед на поиск [/block]
                for(let k = i+1; k <= text.length; k++){

                    if(text.substring(k-right_block.tag.length, k) === right_block.tag){
                        right_block.flag = true;
                        right_block.pos = k;

                        break;
                    }

                }

            }


            //Все, что между [block] и [/block]оборачивается в <div><div style=clear:both;></div></div> 
            //Если [block] не найден - красивое деление НЕ ОФОРМЛЯЕТСЯ

            if(left_block.flag === true && right_block.flag === true){
                text =   text.substring(0, left_block.pos) //text.substring(0, left_block.pos-left_block.tag.length)
                        +"<div>"
                            +"<div class='near_fraction'>"
                            + text.substring(left_block.pos, devidend_bkt.open_bkt_pos) 
                            +"</div>"
                                + "<div class='fraction'>"
                                    + "<span class='numerator'>" //ЧИСЛИТЕЛЬ
                                    + text.substring(devidend_bkt.open_bkt_pos+1, devidend_bkt.close_bkt_pos) 
                                    + "</span>" 
                                    + "<span class='denominator'>" //ЗНАМЕНАТЕЛЬ
                                    + text.substring(divider_bkt.open_bkt_pos+1, divider_bkt.close_bkt_pos)
                                    + "</span>"
                                + "</div>"
                            +"<div class='near_fraction'>"
                            + text.substring(divider_bkt.close_bkt_pos+1, right_block.pos) //text.substring(divider_bkt.close_bkt_pos+1, right_block.pos-right_block.tag.length)
                            +"</div>"
                            +"<div style='clear:both;'></div>"
                        +"</div>"
                        + text.substring(right_block.pos, text.length);
            }


            return text;
    }

    //Возведение в степень
    exponentiation(text, i){

        i = i-1; //Делаем text[i] == ^

        let bkt_obj = this.bkt(text, i);

        if(bkt_obj.flag === true){

            text =  text.substring(0, bkt_obj.open_bkt_pos-1) 
                    + "<sup>" 
                    + text.substring(bkt_obj.open_bkt_pos+1, bkt_obj.close_bkt_pos)
                    + "</sup>"
                    + text.substring(bkt_obj.close_bkt_pos+1, text.length);

        }else if(this.isIndex(text[i+1])){

            //console.log(text[i]);

            text =  text.substring(0, i) 
                    + "<sup>" 
                    + text.substring(i+1, i+2)
                    + "</sup>"
                    + text.substring(i+2, text.length);

        }

        //text = text.substring(0, i) + " возвести в степень " + text.substring(i+1, text.length);

        return text;
    }

    //Основание логарифма
    log_base(text, i){

        i = i-1;

        let bkt_obj = this.bkt(text, i);

        if(bkt_obj.flag === true){

            text = this.HTMLTagWrapping(text, bkt_obj.open_bkt_pos, '<sub>', bkt_obj.open_bkt_pos+1, bkt_obj.close_bkt_pos, '</sub>', bkt_obj.close_bkt_pos+1);

        }else if(this.isIndex(text[i+1])){

            text = this.HTMLTagWrapping(text, i+1, '<sub>', i+1, i+2, '</sub>', i+2);

        }


        return text;
    }


    
    subscript(text, i){

        i = i-1;
        
        let bkt_obj = this.bkt(text, i);

        if(bkt_obj.flag === true){

            text = this.HTMLTagWrapping(text, bkt_obj.open_bkt_pos-1, '<sub>', bkt_obj.open_bkt_pos+1, bkt_obj.close_bkt_pos, '</sub>', bkt_obj.close_bkt_pos+1);

        }else if(this.isIndex(text[i+1])){

            text = this.HTMLTagWrapping(text, i, '<sub>', i+1, i+2, '</sub>', i+2);

        }
       

        return text;
    }

    replaceMySubsting(from, to, text, i){

        text = text.substring(0, i-from.length)+to+text.substring(i, text.length);

        return {text:text, i:i-from.length+to.length};

    }

    
    replacingMyTags(open_sym, close_sym, open_tag, close_tag, text, i){
        

        let end = 0;


        for(let k = i; k <= text.length; k++){

            if(text.substring(k-close_sym.length, k) === close_sym){
                end = k;

                if(open_sym==="[link="){
                    
                    text = text.substring(0, i-open_sym.length) 
                        + "<a href='"
                        + "[nomath]" 
                        + text.substring(i, end-close_sym.length) 
                        + "' rel='nofollow' target='_blank'>" 
                        + text.substring(i, end-close_sym.length) 
                        + "[/nomath]" 
                        + "</a>"
                        + text.substring(end, text.length);

                        //let sdvig = end + (end-close_sym.length-i) + 8;
                        //return {text:text, i:sdvig};  
                        
                        return text;

                }else if(open_sym==="[nomath]"){

                    text = this.HTMLTagWrapping(text, i-open_sym.length, open_tag, i, end-close_sym.length, close_tag, end);

                    return {text:text, i:end-open_sym.length-close_sym.length};

                }else if(open_sym==="[img="){

                    text = this.HTMLTagWrapping(text, i-open_sym.length, open_tag+"[nomath]", i, end-close_sym.length, "[/nomath]"+close_tag, end);
                
                }else if(open_sym==="[youtube="){
                    
                    
                    let link = text.substring(i, end-close_sym.length)

                    let link_obj = new URL(link);

                    //console.log(link_obj.pathname.replace(/\//g, ''));
                    //console.log(link_obj.searchParams.get('v'))

                    let embed_link = "https://www.youtube.com/embed/";

                    embed_link += link_obj.searchParams.get('v')!==null ? link_obj.searchParams.get('v') : link_obj.pathname.replace(/\//g, '');


                    text = text.substring(0, i-open_sym.length) 
                        + "<iframe width='560' height='315' src='" 
                        + "[nomath]" 
                        + embed_link
                        + "[/nomath]" 
                        + "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
                        + text.substring(end, text.length);


                }else if(open_sym==="system{"){

                    let end_top = 0;
                    for(let j = i; j<=text.length; j++){
                        if(text[j]===";"){
                            end_top = j;
                        }
                    }


                    text = text.substring(0, i-open_sym.length) 
                        + "<table class='systemtable'>"
                        + "<tr>"
                        + "<td rowspan='2' class='systembkt'>{</td>" 
                        + "<td>" + text.substring(i, end_top) + "</td>" 
                        + "</tr>"
                        + "<tr>"
                        + "<td>" + text.substring(end_top+1, end-close_sym.length) + "</td>" 
                        + "</tr>" 
                        + "</table>" 
                        + text.substring(end, text.length);

                    
                }else{

                    text = this.HTMLTagWrapping(text, i-open_sym.length, open_tag, i, end-close_sym.length, close_tag, end);
               
                }

                break;
            }

        }

        

        return text;

    }


    //Квадратный корень
    square_root(text, i){

        i = i-1;

        let bkt_obj = this.bkt(text, i);

        if(bkt_obj.flag === true){
            text =  text.substring(0, bkt_obj.open_bkt_pos-4) 
                    + "√<span class=radic>" 
                    + text.substring(bkt_obj.open_bkt_pos+1, bkt_obj.close_bkt_pos)
                    + "</span>"
                    + text.substring(bkt_obj.close_bkt_pos+1, text.length);
        }

        return text;
    }

    //Позиция открывающейся и закрывающейся скобки
    bkt(text, i){

        let bkt_obj = {
            flag:false,
            open_bkt_pos:0,
            close_bkt_pos:0
        };


        if(text[i+1] === "("){

            
           

            let bkt_counter = 0;

            for(let k = i+1; k <= text.length; k++){

                if(text[k] == "(") bkt_counter++;
                if(text[k] == ")") bkt_counter--;


                if(text[k] == ")" && bkt_counter==0){
                    bkt_obj.flag = true;
                    bkt_obj.open_bkt_pos = i+1;
                    bkt_obj.close_bkt_pos = k;
                    //console.log("позиция закрывающей скобки: "+k);
                    break;
                }

            }

        }

        return bkt_obj;


        }

        isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        // То, что моментально уйдет в степень или индекс, даже если скобок не стоит
        isIndex(n){
            const arr = ["x", "t", "х"];
            return (this.isNumeric(n) || arr.indexOf(n)!=-1);
        }

        HTMLTagWrapping(text, before_tag_pos, open_tag, start_wrapping, end_wrapping, close_tag, after_tag_pos){

             return  text.substring(0, before_tag_pos) 
                    + open_tag
                    + text.substring(start_wrapping, end_wrapping)
                    + close_tag
                    + text.substring(after_tag_pos, text.length);

        }


}

MathPlus.include_css();

MathPlus.isMathjax = false;


window.onload  = function(){
 
	//Преобразовываем все элементы обернутые mathplus
	[...document.getElementsByTagName("mathplus")].forEach((el) => new MathPlus(el));
	
	//Ставим прослушку на все динаимически появишиеся элементы mathplus
    document.addEventListener('DOMNodeInserted', function(e) {
		//Если появляется только mathplus
		if(e.target.tagName === "MATHPLUS") new MathPlus(e.target); 
		//Если появляется элемент содержащий в себе дочерние
		if(e.target.childNodes.length) [...e.target.getElementsByTagName("mathplus")].forEach((el) => new MathPlus(el)); 
    });

}