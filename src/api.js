let baseUrl = 'http://106.13.170.74:3000';
export default function(option){  
  var xhr = new XMLHttpRequest();
  //默认post方法。
  xhr.open('post',baseUrl+option.url);
  xhr.onload = function () { 
      let res = JSON.parse(xhr.responseText);
      option.callback(res)
  }
  xhr.send(option.data);
}