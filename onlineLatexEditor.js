/* CodeCogs Commercial Software
   Copyright (C) 2004-2013 CodeCogs, Zyba Ltd, Broadwood, Holford, TA5 1DU, England.
   This software is licensed for commercial usage using version 2 of the CodeCogs Commercial Licence.
	 You must read this License (available at www.codecogs.com) before using this software.
   If you distribute this file it is YOUR responsibility to ensure that all
   recipients have a valid number of commercial licenses. You must retain a
   copy of this licence in all copies you make.
   This program is distributed WITHOUT ANY WARRANTY; without even the implied
   warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
   See the CodeCogs Commercial Licence for more details.
*/
var editorwindow = null;
var lasteditormode = null;

function Get_Cookie(name) {
  var start = document.cookie.indexOf(name+"=");
  var len = start+name.length+1;
  if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
  if (start == -1) return null;
  var end = document.cookie.indexOf(";",len);
  if (end == -1) end = document.cookie.length;

  return unescape(document.cookie.substring(len,end));
}

function Set_Cookie(name,value,expires) {
  var cookieString = name + "=" +escape(value) + ( (expires) ? ";expires=" + expires.toGMTString() : "");
  document.cookie = cookieString;
}

function OpenLatexEditor(target,mode,language,inline,latex, design) 
{

    const target_el = document.getElementById(target);

    //Это самое х-ое решение замены \[ \] на [m] [/m] которое только можно было придумать...
    //Однако, вставка mathjax в textaere не отслеживается никакими событиями input, paste...
    //Также у меня никак не вышло получить доступ к события закрытия окна editorwindow, что я только не пытался..
    //Собственно имеем то, что имеем...

    const timerId = setInterval(() => {   

        if(editorwindow==null || editorwindow.closed || !editorwindow.location){
            console.log('окно закрыто');

            let newtext = target_el.value;  
            newtext = newtext.split("\\[").join("[m]");
            newtext = newtext.split("\\]").join("[/m]");

            target_el.value = newtext;

            console.log(newtext);

            clearInterval(timerId);
        }else{
            //console.log('окно открыто');
        }

    }, 1000);

	var url='https://latex.codecogs.com/editor_json.php?target='+target+'&type='+mode;
	if(language!='') url+='&lang='+language;
	if(inline==true) url+='&inline';
	if(design!=undefined && design!='') url+='&design='+design;

	if(latex!=undefined && latex!='')
	{ 
		latex=latex.replace(/\+/g,'&plus;');
	  url+='&latex='+encodeURIComponent(latex);
	} else latex='';
	
  // check to see if open editor compatible with new request
  if(lasteditormode!=url)
	{
	  lasteditormode=url;
		if(editorwindow!=null) editorwindow.close();
		editorwindow=null;
	}
	
	var SID=Get_Cookie('eqeditor'); // sessionID
	var d=new Date(); 
	if (!SID)	SID=d.getTime()+Math.random();
	var expires=new Date(d.getTime()+(1000*3600*24*30)); 
	Set_Cookie('eqeditor',SID, expires);
	url+='&sid='+SID;
    

  if (editorwindow==null || editorwindow.closed || !editorwindow.location) 
	{


        editorwindow=window.open('','LaTexEditor','width=700,height=450,status=1,scrollbars=yes,resizable=1');

        if (!editorwindow.opener) editorwindow.opener = self;
		editorwindow.document.open();
        editorwindow.document.write(`
        <!DOCTYPE html>
        <html>
        <script src="${url}" type="text/javascript"></script>
        <script>


        </script>
        <body></body>
        </html>
        `);
        editorwindow.document.close();

        
	}
	else
  	if (window.focus) editorwindow.focus();
}