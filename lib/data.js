/**
dependencies
**/
var file=require("fs");
var path=require("path");

//to get path
 var path=path.join(__dirname,"..","/data");
 //data object
 var data={};
//writeFile
 data.write=function(filepath,filename,data,callback)
 {
   data=JSON.stringify(data)
   file.writeFile(path+"/"+filepath+"/"+filename+".json",data,{flag:"w"},(err)=>{
     if(!err)
     {
       callback("ok");
     }
     else {
       callback(false);
     }
   });

 };
 //readFile
 data.read=function(filepath,filename,callback)
 {
   file.readFile(path+"/"+filepath+"/"+filename+".json",'utf8',(err,data)=>{
     if(!err)
     {
       callback("ok",data);
     }
     else {
       callback(false);
     }
   });

 };
 //appendFile
 data.append=function(filepath,filename,data,callback)
 {
   data=JSON.stringify(data)
   file.appendFile(path+"/"+filepath+"/"+filename+".json",data,(err)=>{
     if(!err)
     {
       callback("ok");
     }
     else {
       callback(false);
     }
   });
 };
 //deleteFile
 data.delete=function(filepath,filename,callback){
   file.unlink(path+"/"+filepath+"/"+filename+".json",(err)=>{
     if(!err)
     {
       callback("ok");
     }
     else{
       callback(false);
     }
   });
 };
//list
data.list=function(filepath,callback)
{
  file.readdir(path+"/"+filepath,(err,data)=>{
    if(!err&&data.length>0)
    {var correctfile=[];
      data.forEach(function(checkfile)
    { correctfile.push(checkfile.replace(".json",""))});
      callback("ok",correctfile);
    }
    else {
      callback("error dir may be empty");
    }
  })
}

 //export
module.exports=data;
