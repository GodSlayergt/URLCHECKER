var client={};
client.session={
    status:false,
}
client.request=function(method,path,header,payload,queryobject,callback){
 var methodarray=["get","post","delete","put"];
  var _path=typeof(path)=="string"?path:null;
  var _method=methodarray.indexOf(method)>-1?method:null;
  var _header=typeof(header)=="object"?header:null;
  var _payload=typeof(payload)=="object"?payload:"";
  var _queryobject=typeof(queryobject)=="object"?queryobject:null;
  var _callback=typeof(callback)=="function"?callback:null;


    var requrl=_path;
    var count=0;
    for (var key in _queryobject) {
      if (_queryobject.hasOwnProperty(key)) {
  count++;
  if(count>1){
  requrl=requrl+"&"+key+"="+_queryobject[key];
  }
  requrl=requrl+"?"+key+"="+_queryobject[key];

          }

    }
    var xhr=  new XMLHttpRequest();
    xhr.open(_method,requrl,true);
    xhr.setRequestHeader("contentype","appliction/json");
    for (var key in _header) {
      if (_header.hasOwnProperty(key)) {
        xhr.setRequestHeader(key,_header[key]);
      }
    }
    xhr.onreadystatechange=function(){
      if(xhr.readyState==4)
      {
        var response=xhr.responseText;
        if(_callback){
        try
          {
          callback(xhr.status,JSON.parse(response));
        }
        catch(e) {
          callback(xhr.status,"");
        }
        }

      }
    }

    var stringpayload=JSON.stringify(_payload);
    xhr.send(stringpayload);
};
client.formbind=function(){
  var form =document.querySelector(".form").children[0];
  
                                        
    form.addEventListener("submit",function(e){
        
        e.preventDefault();
        var method=form.getAttribute("method");
        var path=form.getAttribute("action");
        var header=undefined;
        var queryobject={"phone":form[2].value};
        console.log(method,path);
        var payload={};
           if(window.localStorage.getItem(form[2].value))
                    {
                        header={
                            "token":window.localStorage.getItem(form[2].value),
                        }
                        console.log(header);
                        
                    }
                else{
                    console.log("no token");
                }
         if(path=="user"){
         payload={
            "name":form[0].value,
            "last":form[1].value,
            "phone":form[2].value,
            "password":form[3].value
        };
            client.request(method,path,header,payload,queryobject,function(st,res){console.log(st,res);});
        }
        else if(path=="tokens")
            {
                payload={
            "phone":form[0].value,
            "password":form[1].value   
            };
             client.request(method,path,header,payload,queryobject,function(st,res){
         console.log(st,res);
          if(st==200){
          client.session.status=true;    
          window.localStorage.setItem(res.phone,res.id);
          }
         });
            }
        else if(path=="checks")
            {
                payload={
                    "protocol":form[0].value,
                    "method":form[1].value,
                    "phone":form[2].value,
                    "url":form[3].value,
                    "timeout":form[4].value,
                    "sucesscode":form[5].value.split(",")
                }
           
                  client.request(method,path,header,payload,queryobject,function(st,res){console.log(st,res);});
                
            }
        
                            
        console.log(payload);

                                                                                
        
    })
}
window.onload=function(){
    client.formbind();
   
}
