export default function () {
  var _previewImg, _uploadInput, _cutBox, _cutBtn;

  var _left;
  var _top;
  var _file;
  var _dataUrl;

  function registerEvent() {
    //载入图片
    _uploadInput.onchange = function (param) {
      var file = _file = param.target.files[0];
      var fileReader = new FileReader();

      fileReader.onload = function () {
        // 通过 reader.result 来访问生成的 DataURL
        _dataUrl = fileReader.result;
        //设置图片预览：
        _previewImg.src = _dataUrl;
      };
      fileReader.readAsDataURL(file);
    }
    //新建剪切框
    _previewImg.addEventListener('mousedown', function (event) {
      //阻止默认行为，清除图片无法拖动影响。
      event.preventDefault();
      _cutBox.style.display = 'block'
      //设置范围
      var obj = _previewImg.getBoundingClientRect();

      //记录起点。
      var startX = event.clientX;
      var startY = event.clientY;

      _left = startX - obj.left;
      _top = startY - obj.top;

      function moveFn(event) {
        //阻止默认行为
        event.preventDefault();

        var endX = event.clientX;
        var endY = event.clientY;

        //修正终点
        if (endX >= obj.right) {
          endX = obj.right;
        }
        if (endX <= obj.left) {
          endX = obj.left;
        }
        if (endY >= obj.bottom) {
          endY = obj.bottom;
        }
        if (endY <= obj.top) {
          endY = obj.top;
        }

        //修正left、top值。
        if (endX <= startX) {
          _left = endX - obj.left;
        }
        if (endY <= startY) {
          _top = endY - obj.top;
        }

        var width = Math.abs(endX - startX);
        var height = Math.abs(endY - startY);

        _cutBox.style.left = _left + 'px';
        _cutBox.style.top = _top + 'px';
        _cutBox.style.width = width + 'px';
        _cutBox.style.height = height + 'px';

      }
      function upFn(event) {
        document.removeEventListener('mousemove', moveFn);
        document.removeEventListener('mouseup', upFn);
      }
      document.addEventListener('mousemove', moveFn)
      document.addEventListener('mouseup', upFn)
    });
    //拖动框
    _cutBox.addEventListener('mousedown', function (param) {
      param.stopPropagation();
      var startX = event.clientX;
      var startY = event.clientY;
      _cutBox.style.cursor = 'move';

      function moveFn(event) {
        var distanceX = event.clientX - startX;
        var distanceY = event.clientY - startY;
        //记录left、top值。
        _left = parseFloat(getComputedStyle(_cutBox).left) + distanceX;
        _top = parseFloat(getComputedStyle(_cutBox).top) + distanceY;

        _cutBox.style.left = _left + 'px';
        _cutBox.style.top = _top + 'px';

        //循环重置起点位置。
        startX = event.clientX;
        startY = event.clientY;

      }
      function upFn(event) {
        _cutBox.style.cursor = 'default'
        document.removeEventListener('mousemove', moveFn);
        document.removeEventListener('mouseup', upFn);

      }
      document.addEventListener('mousemove', moveFn)
      document.addEventListener('mouseup', upFn)
    })
    //确定剪切
    _cutBtn.addEventListener('click', function (param) {
      //获取剪切好的图像，然后给图片区域。并获取记录对应的blob.

      var canvas = document.createElement('canvas');
      var width = parseFloat(getComputedStyle(_cutBox).width);
      var height = parseFloat(getComputedStyle(_cutBox).height);

      //必须此处设置宽高，否则图片后面绘制时设置宽高无效。
      canvas.width = width;
      canvas.height = height;



      var ctx = canvas.getContext('2d');

      ctx.drawImage(_previewImg, _left, _top, width, height, 0, 0, 200, 200);//绘制
      //
      _previewImg.src = _dataUrl = canvas.toDataURL();



      //同时转化为blob
      canvas.toBlob(function (blob) {
        _file = new window.File([blob], 'random.' + blob.type.split('/')[1], { type: blob.type });
      })
      //关闭剪切框
      _cutBox.style.width = _cutBox.style.height = 0;
    })
  }
  return {
    init({ preViewBox, fileBox, cutBox, cutBtn }) {
      _previewImg = document.querySelector(preViewBox);
      _uploadInput = document.querySelector(fileBox);
      _cutBox = document.querySelector(cutBox);
      _cutBtn = document.querySelector(cutBtn);
      _left = 0;
      _top = 0;
      _file = null;
      _dataUrl = "";
      //注册事件
      registerEvent();
    },
    getImageImfo() {
      console.log(_file, _dataUrl);
      return {
        file: _file,
        dataUrl: _dataUrl
      };
    }

  }
};