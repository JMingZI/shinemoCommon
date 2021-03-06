# jquery.alertBox
web端公用弹层，依赖jquery。css使用的`SASS compass`。

在使用之前，来明确一下我们的需求，我所认为的需求是：
  - 提供一个很简便的消息弹窗，例如只有一句话的提示，一个关闭按钮；这里，我认为它是type=alert的类型。
  - 提供一个警告窗的消息提示，有确定和取消按钮，点击确定后调用自己的函数；这里，我认为它是type=confirm的类型。
  - 提供多个数量不定的，可以放自定义内容的弹窗，点击关闭时可以有警告提示，例如：`“关闭弹窗会清空内容！确定关闭？”`。也有确定和取消按钮，同样点击确定后调用自己的函数；这里，我认为它是type=modal的类型。
  
功能上的需求我认为目前就是这些，OK，接下来我们的内容。 

#### 使用介绍

- 当type 为 alert 或 confirm 时，name默认mask，且DOM结构上 data-name = mask
  - closeWarning，closeCallback，不用传
- 当type 为 modal 时
  - name 为必填 且与data-name一致 并唯一
  - 如果要传入 closeCallback , closeCallback 必须用引号括起来，closeCallback为自定义
  - closeWarning 可填可不填

1、引入（不需要手动引入css）
  ```html
  <script type="text/javascript" src="../scripts/jquery.alertbox.js"></script> 
  ```

2、引入DOM结构

- 第一种，普通的消息提示窗，也就是我定义的type='alert' or 'confirm'弹窗，我认为这2种弹窗的提示语都是很少的，例如一句话。那么结构是固定的，如下。

> 注意：这2种的data-name="modal"，是固定的，写死的。

```html
<!-- alert -->
<div class="mask msg-alert" data-name="mask" style="display:none;">
  <div class="ym-modal">
    <div class="head">
      <p class="title"></p>
      <span class="ym-close"></span>
    </div>
    <div class="body"></div>
    <div class="foot">
      <a href="javascript:;" class="modal-btns modal-close">关闭</a>
      <a href="javascript:;" class="modal-btns modal-confirm">确定</a>
    </div>  
  </div>
</div>
```

- 第二种，就是type=modal类型的弹窗，这种弹窗我们可以放很多自定义内容。

> 注意：这种的data-name="自定义"，是自定义的，不能重复。且初始化的时候，需要传进去。

```html
<!-- modal -->
<div class="mask" data-name="myModal" style="display:none;">
  <div class="ym-modal">
    <div class="head">
      <p class="title"></p>
      <span class="ym-close"></span>
    </div>
    <div class="body"></div>
    <div class="foot">
      <a href="javascript:;" class="modal-btns modal-close">关闭</a>
      <a href="javascript:;" class="modal-btns modal-confirm">确定</a>
    </div>  
  </div>
</div>
```

3、初始化及参数：

```js
$('.mask').alertBox({
  // 默认是alert，可选confirm，modal
  type: "alert" 
  msg: "这是提示",
  title: "弹窗标题",
  
  // 弹框宽度，默认是400px
  width : "400px",  
  
  // 弹框高度，默认是200px
  height: "200px", 
  
  //可选，弹框遮罩的颜色，默认黑色，透明度0.3，若需要修改请改index.scss
  // 若不需要显示, false即可
  // 否则不传
  maskcolor: false，
  
  //默认为0，即不设置。
  zIndex: 0,
  
  // type == alert or confirm 时弹窗的上边距，默认为false，则居中
  modalTop: false
  
  // type == confirm 时的确定按钮的回调
  confirmCallback: function() {},
  
  // type == modal，与data-name 对应
  name: "modal1",
  
  // type == modal，关闭弹窗时的提示文字，type=alert,confirm时，设置该值无效
  closeWarning: "关闭弹窗会清空内容！确定关闭？",
  
  // type == modal，关闭弹窗的回调
  closeCallback: "function () {}",
});
```

4、例子

  最简单的弹窗：
  ```js
  $('.mask').alertBox("我是提示");
  ```
  
  confirm弹窗
  
  ```js
  var ccc = function () { console.log('我是回调confirmCallback'); }
  $('.alert3').click(function(event) {
    $('.mask').alertBox({
      type: "confirm",
      msg: "这是提示",
      title: "你妹",
      width: "500px",
      height: "200px",
      confirmCallback: ccc
    });
  });
  ```
  
  modal 弹窗
  ```js
  var bbb = function () { 
    console.log('bbb我是关闭回调zindex2'); 
  }
  $('.alert4').click(function(event) {
    $('.mask').alertBox({
      type: "modal",
      name: "modal1",
      title: "呵呵",
      width: "500px",
      height: "200px",
      closeWarning: "关闭弹窗会清空内容！确定关闭？",
      closeCallback: "bbb",
      zIndex: 2
    });
  });
  ```
