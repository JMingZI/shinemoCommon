/* ========================================================================
 * AlertBox: modal v1.0.0
 * http://
 * ========================================================================
 * Copyright 2016 Jmingzi, Inc.
 * 2016-03-03
 * ======================================================================== */

+function ($) {
  'use strict';

  var targetClick = null;
  var maskSelector = null;

  // SET ALERTBOX OBJECT
  // =================== 

  var AlertBox = function (options) {
    if (!this.check(options)) return false;
    this._getEl();
    this._set();
  };

  AlertBox.prototype.defaultSetting = {
    type              : "alert", // type alert or confirm or modal
    name              : "mask",
    width             : '400px',
    height            : '200px',
    msg               : "",
    maskcolor         : "rgba(0, 0, 0, 0.5)",
    confirmCallback   : "null",
    closeWarning      : "",
    closeCallback     : "null",
    title             : "提示",
    zIndex            : 0,
    modalTop          : false
  };

  AlertBox.prototype._getEl = function() {
    var el = {
      modal  :       this.MASK.find('.modal'),
      head   :       this.MASK.find('.head'),
      foot   :       this.MASK.find('.foot'),
      title  :       this.MASK.find('.title'),
      body   :       this.MASK.find('.body'),
      close  :       this.MASK.find('.modal-close'),
      confirm:       this.MASK.find('.modal-confirm'),
      htmlBody:      $('body')
    };
    this.elements = el;
  }

  AlertBox.prototype._reset = function () {
    this.elements.modal.css({'width': this.options.width, 'height': this.options.height});
    this.MASK.css("background-color", this.options.maskcolor);
    this.elements.body.html("");
    this.elements.title.text(this.options.title);
    this.elements.close[0].style.display = "inline";
    this.elements.confirm.removeClass('close');
    this.elements.confirm.removeAttr('id');
  }

  AlertBox.prototype._set = function() {
    var msgHtml = "";
    this.elements.title.text(this.options.title);
    this.MASK.css("background-color", this.options.maskcolor);

    if (this.options.zIndex !== 0) { this.MASK[0].style.zIndex = this.options.zIndex; }

    if (this.options.type !== "modal") {
    // alert confirm  
      this._reset();
      msgHtml = this.options.msg;
      this.elements.body.html(msgHtml);

      if (this.options.type == "alert") {
        this.elements.close[0].style.display = "none";
        this.elements.confirm.addClass('close');
        this.elements.confirm.removeAttr('id');
      } else this.elements.confirm.attr('id', "modal-confirm");
    } else {
    // modal  
      if (this.options.closeWarning != "") this.MASK.attr('data-warning', this.options.closeWarning);
      if (typeof this.options.closeCallback == "string" && this.options.closeCallback != "null")
         this.MASK.attr('data-closeCallback', this.options.closeCallback);
    }

    this._show(this.MASK);
    this._setSize();
  }

  AlertBox.prototype._setSize = function () {
    var modalWidth  = 0
      , modalHeight = 0
      ;
    if (this.options.width) this.elements.modal.css("width", this.options.width);

    if (this.options.height) {
        this.elements.modal.css("height", this.options.height);
        this.elements.body.css("height", parseInt(this.options.height) - this.elements.head.outerHeight() - 
        this.elements.foot.height() + "px");
    }

    modalWidth = this.elements.modal.width();
    modalHeight = this.elements.modal.height();
    if (this.options.name == "mask" && this.options.modalTop !== false) this.elements.modal.css({"margin-left": -modalWidth/2+"px", "top": this.options.modalTop});
    else this.elements.modal.css({"margin-left": -modalWidth/2+"px", "margin-top": -modalHeight/2+"px"});
  }

  AlertBox.prototype.check = function (options) {
    // CHECK OPTIONS
    if   (typeof options === "string") {this.defaultSetting.msg = options;this.options = this.defaultSetting;}
    else if (typeof options === "object") this.options = $.extend({}, this.defaultSetting, options);
    else { alert("options must be a string or json object!");return false; }

    // CHECK TYPE
    if ('alert,modal,confirm'.indexOf(this.options.type) < 0) {
       alert("modal type is one of alert,modal,confirm!");
       return false; 
    }

    // CHECK NAME
    if (typeof this.options.name == "" || typeof this.options.name != "string") {
      alert("modal name is require or is not string");
      return false; 
    }

    // CHECK MASK
    var modalObj = $('body').find(maskSelector + '[data-name="'+this.options.name+'"]');
    if (modalObj.length === 0) {
       alert("modal name is not match width your name! (view data-name and name)");
       return false; 
    } 
    if (modalObj.length === 1) this.MASK = modalObj;
    else if (modalObj.length > 1) this.MASK = $(modalObj[0]);

    if (this.options.type !== "modal") { 
    // alert confirm
      var name = this.MASK.attr('data-name');
      if (name !== "mask") {
         alert("alert or confirm data-name must be mask!");
         return false;
      }
    } else {
    // modal  
      if (this.options.closeCallback != "null" && typeof eval(this.options.closeCallback) != "function") {
        alert("modal closeCallback must be a function"); 
        return false;
      }
    }

    // CHECK MASKCOLOR
    if (typeof this.options.maskcolor != "string") {
       alert("modal maskcolor mast be a string!");
       return false; 
    }

    // CHECK Z-INDEX
    if (typeof this.options.zIndex !== "number") {
       alert("modal zIndex mast be a number!");
       return false; 
    }
    
    return true;
  }

  AlertBox.prototype._hide = function (obj) {
    obj[0].style.display = "none";
    if (this.elements.htmlBody.height() > $(window).height()) {
        var maskIsAllHide = true;
        var maskNode = this.elements.htmlBody.find('.mask');
      if (maskNode.length >= 2) {
        maskNode.each(function(index, el) {
          if (this.style.display === "block") maskIsAllHide = false;     
        });
      }
      if (maskIsAllHide) this.elements.htmlBody.css('overflow', '');
    }
  }

  AlertBox.prototype._show =  function (obj) {
    obj[0].style.display = "block";
    
    if (this.elements.htmlBody.height() > $(window).height()) {
        this.elements.htmlBody.css('overflow', 'hidden');
    }
  }

  // INIT PLUGIN ALERTBOX
  // ====================

  var alertbox = null;
  function Plugin(options) {
    maskSelector = this.selector;

    alertbox = new AlertBox(options);
    return alertbox;
  }
  $.fn.alertBox = Plugin;

  // BIND EVENT TO BTNS ONCE!!!
  // ==========================

  $(document).on("click", ".modal .close, .modal .modal-close", function (event) {
    var maskNode = $(this).parent().parent().parent();

    if (maskNode.attr('data-name') != "mask") {
    // modal 
      var warning = maskNode.attr('data-warning');
      var closeCallback = maskNode.attr('data-closeCallback');

      if (warning && closeCallback) {
        $('.mask').alertBox({
          type: "confirm",
          msg: warning,
          title: "提示",
          confirmCallback: closeCallback
        });
      } else alertbox._hide(maskNode);
    } else alertbox._hide(maskNode);
    
    targetClick = this;
  });

  // click confirm btn-confirm 
  $(document).on("click", "#modal-confirm", function (event) {
    var maskNode = $(this).parent().parent().parent();
    var parentModal = targetClick ? $(targetClick).parent().parent().parent() : null;

    if (
    typeof alertbox.options.confirmCallback == "string" && typeof eval(alertbox.options.confirmCallback) == "function" ||
    typeof alertbox.options.confirmCallback == "function") {
      if (maskNode.attr('data-name') === "mask") {
        if (typeof alertbox.options.confirmCallback == "function") alertbox.options.confirmCallback();
        else eval(alertbox.options.confirmCallback)();
      }
      if(parentModal) alertbox._hide(parentModal);
      alertbox._hide(maskNode);
    }else {
      alertbox._hide(maskNode);
      return false;
    }
  });

}(jQuery);
