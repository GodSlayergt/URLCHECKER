/**
dependencies
***/

var httpserver=require("http");
var url=require("url");
var string=require("string_decoder");
var file=require("./lib/data");
var handler=require("./lib/handler");
var helper=require("./helper/helper");

var index={};
/*bulding server*/
index.serverInit=function(){var server=httpserver.createServer(function(req,res){
//parse url
var parseurl=url.parse(req.url,true);
//parse url pathname
var path=parseurl.pathname;
//trimed path
var trimmedPath = path.replace(/^\/+|\/+$/g, '');
//geting method eg.post,get
var method=req.method.toLowerCase();
//geting quries eg.?a=v
var queries= parseurl.query;
//headers eg.browser,os,etc
var header=req.headers;
//object of string class for converting the binary data stream into utf-8
var decode=new string.StringDecoder('utf-8');
var internalbuffer="";
//geting req data in the form of binary data
req.on("data",function(data){
  internalbuffer +=decode.write(data);
});
//end of req
req.on("end",function(data){
  internalbuffer +=decode.end();
  //data object
   var data={
   "trimmedPath":trimmedPath,
   "method":method,
   "payload":helper.buffer(internalbuffer),
   "headers":header,
   "query":queries
  };
  //selecting handler
  var selecthandler=typeof(router[trimmedPath])!="undefined"?router[trimmedPath]:handler.notfound;
  if(trimmedPath.indexOf("public/")>-1)
  {
    selecthandler=router.public;
  }
  selecthandler(data,function(status,data,content){
    var payload;
      if(content=="html")
      {
          contentype="text/html";
          payload=data;

      }
      else if(content=="css") {
        contentype="text/css";
        payload=data;

      }
      else if(content=="img") {
        contentype="image/png";
        payload=data;

      }
      else if(content=="js") {
        contentype="type/javascript";
        payload=data;

      }
      else
      {
        contentype="application /json";
        payload=JSON.stringify(data);
      }



    res.writeHead(status,{"Content-Type":contentype});
    res.end(payload);
  });
});
});

//staring server
server.listen(8080,"localhost",()=>{
  console.log("server is listening");
});

//selecting rout
var router={
  "ping":handler.ping,
  "user":handler.user,
  "tokens":handler.tokens,
  "checks":handler.checks,
  "public":handler.public,
  "":handler.universalTemplate,
  "signin":handler.universalTemplate,
  "login":handler.universalTemplate,
  "dashboard":handler.universalTemplate,
  "settings":handler.universalTemplate,
  "home":handler.universalTemplate,
  "getdetails":handler.universalTemplate,
  "update":handler.universalTemplate,
  "deleteuser":handler.universalTemplate

};
}
//exports
module.exports=index;
