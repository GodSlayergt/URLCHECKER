var readline= require("readline");
var eventclass=require("events");
var file=require("./data");

class _eventclass extends eventclass{}
var _event =new _eventclass();
var queryoption={
    'exit' : 'Kill the CLI (and the rest of the application)',
    'man' : 'Show this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get statistics on the underlying operating system and resource utilization',
    'List users' : 'Show a list of all the registered (undeleted) users in the system',
    'More user info --{userId}' : 'Show details of a specified user',
    'List checks --up --down' : 'Show a list of all the active checks in the system, including their state. The "--up" and "--down flags are both optional."',
    'More check info --{checkId}' : 'Show details of a specified check',
}
_event.on("query",function(query){
  for (var key in queryoption) {
    if (queryoption.hasOwnProperty(key)) {
      var match=query.length>10?query.slice(0,10):query;
      if(key.indexOf(match)>-1){
        _event.emit(key,query);
      }
    }
  }
})

_event.on("exit",function(query){
   process.exit(0);
})

//man
_event.on("man",function(query){
  justify(query);
  _event.emit("data");

})
//help

//man
_event.on("help",function(query){
justify(query);
  _event.emit("data");

})
//list users
_event.on("List users",function(query){
  justify(query);
  file.list("users",function(status,data){
    if(status=="ok"){
      for(i=0;i<data.length;i++)
      {
        console.log(data[i]);
      }
    }
  })
})

//more user info
_event.on("More user info --{userId}",function(query){
  justify(query);
  var id=query.split("--");
  file.read("users",id[1],function(status,data){
    if(status=="ok"){
      console.log(JSON.parse(data));
    }
  })

})

//users checks
_event.on("List checks --up --down",function(query){
  justify(query);
  var up=[];
  var down=[];
  var check_status=query.split("--");
  file.list("checks",function(status,data){
    if(status=="ok"){
      console.log(data);
      for(k=0;k<data.length;k++)
      {
        file.read("checks",data[k],function(s,d){
          if(s=="ok"){
        
            var object=JSON.parse(d);
            object.state=="up"?up.push(data[k]):down.push(data[k]);
            if(check_status[1]=="up")
            {
              for(j=0;j<up.length;j++)
              {
                console.log(up[j]);
              }
            }
          else if(check_status[1]=="down")
            {
              for(j=0;j<down.length;j++)
              {
                console.log(down[j]);
              }
            }
            else{
              for(j=0;j<up.length;j++)
              {
                console.log(up[j]);
              }
              for(j=0;j<down.length;j++)
              {
                console.log(down[j]);
              }
            }
          }
        })
      }
    }
  })
})
//checks more info
_event.on("More check info --{checkId}",function(query){
  justify(query);
  var id=query.split("--");
  file.read("checks",id[1],function(status,data){
    if(status=="ok"){
      console.log(JSON.parse(data));
    }
  })

})

//heading align
function justify(query){
  _event.emit("line",1);
  _event.emit("space",1);
 _event.emit("align",query);
 _event.emit("space",1);
 _event.emit("line",1);
}


//data
_event.on("data",function(){
  var width=process.stdout.columns*0.1;
  var line="";
  for(i=0;i<width;i++)
  {line+=" "}
  for (var key in queryoption) {
    if (queryoption.hasOwnProperty(key)) {
      _event.emit("space",1);
      console.log(key.trim()+line+queryoption[key].trim());

    }
  }

})

//textalign
_event.on("align",function(query){
  var width=process.stdout.columns-(query.length+4);
  var line="";
  for(i=0;i<width;i++)
  {
    if(i==Math.round(width/2))
    {
      console.log(line+" "+query+" "+line);
      break;
    }
    else {
      line+=" ";
    }
  }

})


//horizontal_line
_event.on("line",function(n){
  var width=Math.round(process.stdout.columns*n);
  var line="";
  for(i=0;i<width;i++)
  {
    line+="-";
  }
  console.log(line);
});
//vertical_space
_event.on("space",function(n){
  for(i=0;i<n;i++)
  {
    console.log("");
  }
})
var cli={};
//setting readline interface
 cli.Init=function(){

var option={
  "input":process.stdin,
  "output":process.stdout,
  "prompt":"$"
}

var _interface=readline.createInterface(option);
  _interface.prompt();
_interface.on("line",function(query){
  _event.emit("query",query);
 _interface.prompt();
});

_interface.on("close",function(){
  process.exit(0);
})

};

















module.exports=cli;
