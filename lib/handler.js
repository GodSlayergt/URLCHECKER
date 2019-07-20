var file=require("./data");
var helper=require("../helper/helper");
var date=new Date;


//handler object
var handler={};


//ping function
 handler.ping=function(data,callback)
{
  callback(200,{"status":"server is alive"});

};
//not found function
handler.notfound=function(data,callback)
{
  callback(404);
};

//user
handler.user=function(data,callback)
//method
{
  //post
  if(data["method"]==="post")
  {
    var _name=typeof(data.payload.name)=="string"&&data.payload.name.trim().length>0?data.payload.name:null;
    var _last=typeof(data.payload.last)=="string"&&data.payload.last.trim().length>0?data.payload.last:null;
    var _phone=data.payload.phone.match(/9\d{9}/g)?data.payload.phone:null;
    var _pass=typeof(data.payload.password)=="string"&&data.payload.password.trim().length>0?data.payload.password:null;

    if(_name!=null&&_phone!=null&&_last!=null&&_pass!=null)
    {
    data.payload.password=helper.crypt(_pass,_phone);
      file.write("users",_phone,data.payload,function(status){
        if(status=="ok")
        {
        callback(200);
      }
      else {
        callback(404);
      }
      })
    }
    else{
      callback(404);
    }
  }
  //get
  else if(data["method"]==="get")
  {
  
      var _phone=data.query.phone.match(/9\d{9}/g)?data.query.phone:null;
      var _token=data.headers.token;
      helper.verifytoken(_token,(bool,err)=>{
        if(bool){
            if(_phone!=null)
            {
              file.read("users",_phone,function(status,data){
                if(status=="ok")
                {
                callback(200,JSON.parse(data));
              }
              else
                {
                  callback(404);
                }
              })
            }
            else {
              callback(404);
            }
          }
          else {
            callback(404,err);
          }

      })

  }
  //put
  else if(data["method"]==="put")
  {
    var _name=typeof(data.payload.name)=="string"&&data.payload.name.trim().length>0?data.payload.name:null;
    var _last=typeof(data.payload.last)=="string"&&data.payload.last.trim().length>0?data.payload.last:null;
    var _pass=typeof(data.payload.password)=="string"&&data.payload.password.trim().length>0?data.payload.password:null;
    var _phone=data.payload.phone.match(/9\d{9}/g)?data.payload.phone:null;
    var _token=data.headers.token;

helper.verifytoken(_token,(bool,err)=>{
  if(bool)
  {
    if(_phone!=null)
    {

        file.read("users",_phone,function(status,data){
          if(status=="ok")
          {
            var obj= JSON.parse(data);
            _name!=null?obj.name=_name:obj.name;
            _last!=null?obj.last=_last:obj.last;
            _pass!=null?obj.password=helper.crypt(_pass,_phone):obj.password;
            file.write("users",_phone,obj,function(status){
              if(status=="ok")
              {
              callback(200);
            }
            else {
              callback(404);
            }
            })
        }
        else {

            callback(404);

        }
      })
    }
    else{
      callback(404);
    }

}
else {
  callback(404,err);
}
})
}
//delete
  else if(data["method"]==="delete")
  {

    var _phone=data.payload.phone.match(/9\d{9}/g)?data.payload.phone:null;
    var _token=data.headers.token;

    helper.verifytoken(_token,(bool,err)=>{
      if(bool)
      {
        if(_phone!=null)
        {
          file.read("users",_phone,function(s,data){
            if(s=="ok"){var temp=JSON.parse(data);
               var checks=temp.checksId;
               for(i=0;i<checks.length;i++)
               {
                 file.delete("checks",checks[i],(s)=>{if(s=="ok"){console.log(i +"check delete")}});
               }
          }})
          file.delete("users",_phone,function(status){
            if(status=="ok")
            {
            callback(200);
          }
          else
            {
              callback(404);
            }
          })
        }
        else {
          callback(404);
        }

     }
     else{
       callback(404,err);
     }

  })

}
}


// tokens
handler.tokens=function(data,callback)
{
  //post
  if(data["method"]==="post")
  {


    var _phone=data.payload.phone.match(/9\d{9}/g)?data.payload.phone:null;
    var _pass=typeof(data.payload.password)=="string"&&data.payload.password.trim().length>0?data.payload.password:null;
    if(_phone!=null)
    {
      file.read("users",_phone,function(status,data){
        if(status=="ok")
        {
          data=JSON.parse(data);
          if(helper.crypt(_pass,_phone)===data.password)
          {
              helper.verifytoken(data.token_id,(bool,t)=>{if(!bool){
                helper.randomstring(20,function(id){
                var token={
                "id":id,
                "phone":_phone,
                "expire":date.getTime()+24*1000*60*60
                }
                file.write("tokens",token.id,token,function(status){
                if(status=="ok")
                  {
                    data.token_id=token.id;
                    file.write("users",_phone,data,(s)=>{if(s=="ok"){ callback(200,token)};});
                  }
                  else{
                    callback(404,{"error":"cant write data"});
                   }
                 })
          })

          }
          else{
            callback(404,{"error":"token already exits"});
          }
        })


          }
          else
          {
            callback(404,{"error":"wrong password"});
          }
        }
        else {
          callback(404,{"error":"user doesnot exist"});
        }
      })
    }
    else {
      callback(404,{"error":"phone no is not coorect"});
    }
  }

//..get method
else if(data["method"]==="get")
{
    var _id=data.query.id;
    if(_id!=null)
    {
      file.read("tokens",_id,function(status,data){
        if(status=="ok")
        {var obj=JSON.parse(data);
          if(obj.expire>date.getTime())
          {
        callback(200,obj);
      }
      else {
        call(404,{"error":"token expire"});
      }
      }
      else {
        {
          callback(404,{"error":"id is not valid"});
        }
      }
      })
    }
    else {
      callback(404,{"error":"id is null"});
    }

}

//delete method
else if(data["method"]==="delete")
{
  var _id=data.payload.id;
  helper.verifytoken(_id,(bool,err)=>{
    if(bool)
    {
      if(_id!=null)
      {
        file.delete("tokens",_id,function(status){
          if(status=="ok")
          {
          callback(200);
        }
        else {
          {
            callback(404,{"error":"id is not correct"});
          }
        }
        })
      }
      else {
        callback(404,"id is null");
      }

  }
  else {
    callback(404,err);
  }
})


}

}
//CHECKS
handler.checks=function(data,callback)
{
  if(data["method"]==="post")
  {
    var _protocol=typeof(data.payload.protocol)=="string"&&["http","https"].indexOf(data.payload.protocol)>-1?data.payload.protocol:null;
    var _method=typeof(data.payload.method)=="string"&&["post","get","delete","put"].indexOf(data.payload.method)>-1?data.payload.method:null;
    var _url=typeof(data.payload.url)=="string"&&data.payload.protocol.trim().length>0?data.payload.url:null;
    var _timeoutsec=typeof(Number(data.payload.timeout))=="number"&&6>data.payload.timeout>0?data.payload.timeout:null;
    var _phone=data.payload.phone.match(/9\d{9}/g)?data.payload.phone:null;
    var _sucesscode=data.payload.sucesscode instanceof Array?data.payload.sucesscode:null;
    var _token=data.headers.token;
    helper.verifytoken(_token,(bool,err)=>{
      if(bool)
      {
        console.log(_protocol,_url,_timeoutsec,_sucesscode,_phone);
        if(_protocol&&_method&&_url&&_timeoutsec&&_sucesscode&&_phone)
        {
          helper.randomstring(15,(string)=>{
          var check={
            "id":string,
            "userphone":_phone,
            "protocol":_protocol,
            "method":_method,
            "url":_url,
            "timeout":_timeoutsec,
            "sucesscode":_sucesscode
          }
          file.read("users",_phone,(status,data)=>{
            if(status=="ok")
            {
              var object=JSON.parse(data);
              object.checksId=object.checksId!=undefined?object.checksId:[];
              object.checksId.push(check.id);
              file.write("users",_phone,object,(status)=>{
                if(status=="ok")
                {
                  if(object.checksId.length<=5)
                  {
                    file.write("checks",check.id,check,(status)=>{

                      if(status=="ok")
                      {
                        callback(200,check);

                      }
                      else {
                        callback(404,{"error":"can not write the object"});
                      }
                    })

                  }
                  else {
                    callback(404,{"error":"checks can not exceeds than 5"});
                  }
                }
              })

            }
            else {
              callback(404,{"error":`user is not define ${_phone}`});

            }

          })

        })
        }
        else {
          callback(404,{"error":"invalid or passing parameters"});
        }
      }
      else {
      callback(404,err);
      }
    })

  }

else if(data["method"]==="get")
{
  var _id=typeof(data.query.id)=="string"&&data.query.id.trim().length>0?data.query.id:null;
  var _token=data.headers.token;
  helper.verifytoken(_token,(bool,err)=>{
    if(bool)
    {
    file.read("checks",_id,(status,data)=>{
      if(status=="ok")
      {
        callback(200,JSON.parse(data));
      }
      else {
        callback(404,{"error":"incorrect id"});
      }
    })
  }
  else {
    callback(404,err);
  }
})
}

else if(data["method"]==="put")
{
    var _id=typeof(data.payload.id)=="string"&&data.payload.id.trim().length>0?data.payload.id:null;
    var _protocol=typeof(data.payload.protocol)=="string"&&["http","https"].indexOf(data.payload.protocol)>-1?data.payload.protocol:null;
    var _method=typeof(data.payload.method)=="string"&&["post","get","delete","put"].indexOf(data.payload.method)>-1?data.payload.method:null;
    var _url=typeof(data.payload.url)=="string"&&data.payload.protocol.trim().length>0?data.payload.url:null;
    var _timeoutsec=typeof(data.payload.timeout)=="number"&&6>data.payload.timeout>0?data.payload.timeout:null;
    var _sucesscode=data.payload.sucesscode instanceof Array&&data.payload.sucesscode.length==2?data.payload.sucesscode:null;
    var _token=data.headers.token;

helper.verifytoken(_token,(bool,err)=>{
if(bool)
{
  if(_protocol||_method||_url||_timeoutsec||_sucesscode)
  {

      file.read("checks",_id,function(status,data){
        if(status=="ok")
        {
          var obj= JSON.parse(data);
          _protocol!=null?obj.protocol=_protocol:obj.protocol;
          _method!=null?obj.method=_method:obj.method;
          _url!=null?obj.url=_url:obj.url;
          _timeoutsec!=null?obj.timeout=_timeoutsec:obj.timeout;
          _sucesscode!=null?obj.sucesscode=_sucesscode:obj.sucesscode;
          file.write("checks",_id,obj,function(status){
            if(status=="ok")
            {
            callback(200);
          }
          else {
            callback(404);
          }
          })
      }
      else {

          callback(404);

      }
    })
  }
  else{
    callback(404);
  }

}
else {
callback(404,err);
}
})

}

else if(data["method"]==="delete")
{

  var _id=typeof(data.payload.id)=="string"&&data.payload.id.trim().length>0?data.payload.id:null;
  var _token=data.headers.token;

  helper.verifytoken(_token,(bool,err)=>{
    if(bool)
    {
      if(_id!=null)
      {
        file.delete("checks",_id,function(status){
          if(status=="ok")
          {
            file.read("tokens",_token,(status,data)=>{
            if(status=="ok")
            {
              var temp=JSON.parse(data);
              file.read("users",temp.phone,(status,data)=>{
                if(status=="ok")
                {
                  var temp1=JSON.parse(data);
                  var position=temp1.checksId.indexOf(_id);
                  temp1.checksId.splice(position,1);
                  file.write("users",temp.phone,temp1,(status)=>{
                    if(status=="ok")
                    {
                      callback(200);
                    }
                    else {
                      callback(404,{"error":"tech problem"});
                    }
                  })
                }
                else {
                  callback(404);
                }
              })
            }
            else {
              callback(404,err);
            }

            })

        }
        else
          {
            callback(404,{"error":"no such id found"});
          }
        })
      }
      else {
        callback(404,{"error":"id is null"});
      }

   }
   else{
     callback(404,err);
   }

  })


}


}

/**
html stuff
**/

//universal template function
handler.universalTemplate=function(data,callback)
{
  if(data.method=="get"){
    var heading={
      "":"Hello world how are you!!!",
      "home":"Hello world how are you",
      "login":"login please",
      "signin":"sign in please",
      "settings":"your settings",
      "update":"update your account",
      "getdetails":"see your details",
      "deleteuser":"delete your account",
      "dashboard":"create checks"
    }
    var body_obj={
      "body.heading":"dashboard in please"
    }
   for (var key in heading) {
     if(key==data.trimmedPath)
     {
       body_obj["body.heading"]=heading[key];
     }

   }

helper.gettemplate(data.trimmedPath,body_obj,(finaltemplate)=>{
  if(finaltemplate!=""){
callback(200,finaltemplate,"html");
}
else {
  callback(404,finaltemplate,"html");
}
});
}
else {
  callback(404,{"error":"method is not get"},"");
}
}
//public  handler
handler.public=function(data,callback)
{
  var path=data.trimmedPath;
  var trimpath=path.replace("public/","");
  if(path.indexOf(".css")>-1)
  {
    helper.public(trimpath,(err,css)=>{
      if(!err){
    callback(200,css,"css");
  }
  else {
    callback(404,css,"css");
  }
    })
  }
  else if(path.indexOf(".png")>-1)
  {
    helper.public(trimpath,(err,img)=>{
      if(!err){
    callback(200,img,"img");
  }
  else {
    callback(400,img,"img");
  }
})
}
  else if(path.indexOf(".js")>-1)
  {
    helper.public(trimpath,(err,js)=>{
      if(!err){
    callback(200,js,"js");
  }
  else {
    callback(400,js,"js");
  }
    })
  }
}



//exports
module.exports=handler;
