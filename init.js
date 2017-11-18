var CircularJSON = require('circular-json');
var Rector = require('recursive-iterator');
var jpp = require('json-path-processor');
var fs = require('fs');
var _res_flag, _res,_tmp, _indx;
function node(data){
    this.v=data;
    this.d=[];
}
function init(input){  
  get(function (br) {
  var y;
  for(var i=0;i<input.length;i++){    
    findinit(input[i], br);
    if(!_res_flag){           
      if(i==0){     
         y = new node(input[i]);
         br.d.push(y);
      }
      else{
        var x=new node(input[i]);
        console.log(y);
        y.d.push(x);
        y=x;
      }
    }
    else{  
      if(i==0){   
       y = jpp(br).get(_res)._data;
      }
      else{       
        console.log(y.n);
        var tmp= jpp(br).get(_res);
        var isThr = y.d.filter(x=>x===tmp._data);
        if(!(isThr.length>0)){
         y.d.push(tmp._data);
        }
        y=tmp._data;
      }
    }   
  }
  save(br);
  });
}
function findinit(input, br){  
  _res_flag = false;
  for(let {node, path} of new Rector(br,0,true)) {
    if(path[path.length-1]=='v' && node==input){
      _res_flag=true;
      path.splice(-1,1);
     _res= path.join('.');
    }
  }
}

function save(v){
fs.writeFile('foo.txt', CircularJSON.stringify(v),
  function() {
   console.log("finish");
  });
}
function get(cb){
fs.readFile('foo.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  cb(CircularJSON.parse(data));
});
}
init("1+2=3");