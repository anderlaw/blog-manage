// let baseUrl = 'http://127.0.0.1:3000';
let baseUrl = 'https://www.tech-share.cn';
export default function (option) {
  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  let queryStr = '?';
  for (let key in option.data) {
    queryStr += `${key}=${option.data[key]}&`;
  }
  queryStr = queryStr.substring(0, queryStr.length - 1);

  //默认post方法。
  var method = option.method || 'post';
  queryStr = method === 'get' ? queryStr : "";
  var data = method === 'get' ? null : option.data;

  xhr.open(method, baseUrl + option.url+queryStr);
  xhr.onload = function () {
    let res = JSON.parse(xhr.responseText);
    option.callback(res)
  }
  xhr.send(data);
}