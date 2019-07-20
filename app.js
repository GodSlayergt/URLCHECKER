var index=require("./index");
var worker=require("./lib/worker");
var cli=require("./lib/cli");
var cl=require("cluster");
var os=require("os");
if(cl.isMaster)
{
  worker.Init();
  setTimeout(cli.Init,200);

var cpus=os.cpus();

  for(i=0;i<cpus.length;i++)
  {
    cl.fork();
  }
}
else{

  index.serverInit();
}
