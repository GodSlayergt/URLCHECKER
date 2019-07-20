var sum=0;
var ar=[2,3,5];
var count=-1;
var store=[];
function Element(ar,i,n,k)
{

  let buget=smallest(ar,i,n,k);
  sum+=buget.cost;
  if(i==n)
  {count++;
    console.log(sum,count);
    return(count);
  }
  else if(sum>=11)
  {

      console.log(sum,count);
      return(count);
  }
  count++;
  ar.splice(buget.index,1);
  Element(ar,i,n-1);
}

function smallest(ar,start,end,k)
{let buget={
  cost:0,
  index:null
}

  for(i=start;i<end;i++)
  {
    for(j=i+1;j<end;j++)
    {
      if((ar[i]+((i+1)*k))<(ar[j]+((j+1)*k)))
      {
        let cost=(ar[i]+((i+1)*k));
        buget.cost=cost;
        buget.index=i;
      }
      else {
          let cost=(ar[j]+((j+1)*k));
          buget.cost=cost;
          buget.index=j;
      }
    }

  }
  return(buget);
}

// function start()
// {
// let result;
// let ar=[2,3,5];
// for(i=1;i<=3;i++)
// {
// let sum=0;
// let count=0;
// let arr=[...ar];
// let temp=Element(arr,0,3,i,sum,count);
// store.push(temp);
// }
//
// for(i=0;i<store.length;i++)
// {
//   for(j=i+1;j<store.length;j++)
//   {
//     if(store[i]<store[j])
//     {
//       result=store[i];
//     }
//     else {
//         result=store[j];
//     }
//   }
//
// }
//
// console.log(result);
// // }
//
// start();
Element(ar,0,3,2);
