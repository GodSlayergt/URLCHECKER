var crypto=require("crypto");
var file=require("../lib/data");
var fs=require("fs");
var path=require("path");
var date=new Date;
var query_string=require("querystring");
var https=require("https");
var twilio = {
  'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
  'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
  'fromPhone' : '+15005550006'
}





//helper object
var helper={};


//to convert the string into json object
helper.buffer=function(str){
  try{
    var buff=JSON.parse(str);
    return buff;
  }
  catch(e)
  {
    return({});
  }
};
//crpting password
helper.crypt=function(str,key)
{
  var enc=crypto.createCipher('aes-192-ofb',key).update(str,"utf-8","hex");
  return(enc);
}

//randomstring
helper.randomstring=function(len,callback)
{
  crypto.randomBytes(len,(err,buffer)=>{
    if(!err)
    {
       var string=buffer.toString("hex");
       callback(string);

    }

  });

}
//verify tokens
helper.verifytoken=function(id,callback)
{
  file.read("tokens",id,function(status,data){
    if(status=="ok")
    {
    var obj=JSON.parse(data);
    if(obj.expire>date.getTime())
    {
      callback(true);
    }
    else {
      callback(false,{"error":"token expire"});
    }
  }
  else
    {
      callback(false,{"error":"token is not correct"});
    }
  })
}

//third party api
helper.connecting_thrid_api=function(phone,messg,callback){
  var _phone=phone.match(/8\d{9}/g)?phone:null;
  var _messg=typeof(messg)==="string"&&messg.trim().length>0?messg:null;
  if(_phone!=null&&_messg!=null)
  {
    var payload={
      "From":twilio.fromPhone,
      "TO":_phone,
      "Body":_messg
    }
    var stringpayload=query_string.stringify(payload);
    var req_details=
    {
      "protocol":"https:",
      "method":"POST",
      "hostname":"api.twilio.com",
      "auth":twilio.accountSid+':'+twilio.authToken,
      "path": '/2010-04-01/Accounts/'+twilio.accountSid+'/Messages.json',
      "headers":{
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringpayload)
      }
    }

    var req=https.request(req_details,(res)=>{
      var status=res.statusCode;
      if(["200","201"].indexOf(status)>-1)
      {
        callback("get the response");
      }else {
        callback("not get the response");
      }
      req.on("error",(err)=>{
        callback("error");
        throw err;
      })
      req.write(stringpayload);
      req.end();

    })

  }
  else {
    callback("phone or messg is invalid");
  }
}

helper.gettemplate=function(filename,body_obj,callback)
{
  var globle_obj={
    "body.title":"Indexpage",
    "globle.relased_data":"17/6/2018",
    "globle.company_name":"GT Industries"
  }
  var basedir=path.join(__dirname,"/../template");
  filename=(filename==""||filename=="home")?"index":filename;
  fs.readFile(basedir+"/"+filename+".html","utf-8",(err,data)=>{
    if(!err)
    {
      var finalbody=checkstring(body_obj,data);
      fs.readFile(basedir+"/header.html","utf-8",(err,data)=>{
        if(!err){var finalheader=checkstring(globle_obj,data);
          fs.readFile(basedir+"/footer.html","utf-8",(err,data)=>{
            if(!err){
              var finalfooter=checkstring(globle_obj,data);
              var finaltemplate=finalheader+finalbody+finalfooter;
              callback(finaltemplate);
    
            }
            else {

              callback("");
            }
          })

        }
        else {
          {
            callback("");
          }
        }
      })
    }
    else
    {callback("");}
  })
}
checkstring=function(object,data){
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var find="{"+key+"}";
      var replace=object[key];
    data=data.replace(find,replace);

    }
  }

  return(data);
}

helper.public=function(filename,callback)
{
  var basedir=path.join(__dirname,"/../public");
  fs.readFile(basedir+"/"+filename,(err,data)=>{
    if(!err){callback(false,data);}
    else{callback(true,data);}
  })
}

//exports
module.exports=helper;
