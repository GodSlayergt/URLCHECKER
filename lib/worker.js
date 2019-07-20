var file=require("./data");
var url=require("url");
var https=require("https");
var http=require("http");
var date=new Date();




var worker={};
worker.check=function()
{
  file.list("checks",function(err,checklist){
    if(err=="ok")
    {
      checklist.forEach(function(filename){
        file.read("checks",filename,(e,origindata)=>{
          if(e=="ok")
          {
            var object=JSON.parse(origindata);
            object.state=object.state!=undefined?object.state:"down";
            object.check=object.check!=undefined?object.check:false;
            object.checktime=object.checktime!=undefined?object.checktime:null;
            worker.sendrequest(object,function(newobject){
              file.write("checks",filename,newobject,(err)=>{
                if(err=="ok")
                {
                  // console.log("update the check"+filename);
                }
                else {
                  console.log("cant update check");
                }
              })
            });

          }
          else {
            console.log("cannot read file",e);
          }
        })
      })
    }
    else {
      console.log(err);
    }
  })
}

worker.sendrequest=function(object,callback){
  var parse=url.parse(object.protocol+"://"+object.url,true);
  var hostname=parse.hostname;
  var path=parse.path;
  var req_details={
    "protocol":object.protocol+":",
    "hostname":hostname,
    "path":path,
    "timeout":object.timeout*1000,
    "method":object.method.toUpperCase()
  }
  var method=object.method=="http"?http:https;
  var req=method.request(req_details,function(res){
    var status=res.statusCode;
    object.check=true;
    object.checktime=date.getTime();
    if(object.sucesscode.indexOf(status)>-1||object.sucesscode.indexOf(String(status))>-1)
    {
      if(object.state=="down")
      {
      console.log("state is up");
    }
    object.state="up";
    callback(object);
    }
    else{
      object.state="down";
      console.log("state is down");
      callback(object);
    }
  })
  req.on("error",(err)=>{
    object.state="down";
    console.log("state is down");
    callback(object);
  })
  req.on("timeout",(err)=>{
    console.log("timeout");
    callback(object);
  })
  req.end();

}
worker.Init=function(){setInterval(worker.check,60*1000);}
//export
module.exports=worker;
