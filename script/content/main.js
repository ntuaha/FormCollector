console.log("HI");


function sendData(data) {
  // https://blog.garstasio.com/you-dont-need-jquery/ajax/#posting
  // https://itbilu.com/javascript/js/VkiXuUcC.html
  // https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS


  //var form_data = new FormData();
  var f = []
  for (let key in data) {
    f.push([key, data[key]])
  }
  var data_string = f.map(function (a) {
    return encodeURIComponent(a[0]) + '=' + encodeURIComponent(a[1])
  }).join('&')

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://data.aha.taipei/esun/bank/api/form', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


  xhr.withCredentials = true;
  xhr.onload = function () {
    console.log(xhr.responseText);
  };

  function callback(r) {
    console.log(r.status, r.responseText);
  };

  xhr.send(data_string);



  /*
  var ajax = $.ajax({
    url: 'https://data.aha.taipei/esun/bank/api/form',
    method: "POST",
    dataType: "json",
    data: data,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
  }).done(function (data) {
    console.log(data);
  })
  */

}

function recordVal(e) {
  this.__innerval__ = this.value;
}

function collecINPUT(e) {
  console.log("blur new", this.value, "blur old", this.__innerval__)
  if (this.value != this.__innerval__) {
    let data = {
      url: window.location.href,
      ele_id: this.id || this.getAttribute('data-changeid') || "",
      data: this.value,
      tag: this.tagName,
      input_time: (new Date()).getTime()
    }
    sendData(data)
    console.log(data)
  }
}

function collecSELECT(e) {
  console.log("blur new", this.value, "blur old", this.__innerval__)
  if (this.value != this.__innerval__) {
    let data = {
      url: window.location.href,
      ele_id: this.id || this.getAttribute('data-changeid') || "",
      data: this.selectedOptions[0].value,
      name: this.selectedOptions[0].text,
      tag: this.tagName,
      input_time: (new Date()).getTime()
    }
    sendData(data)
    console.log(data)
  }
}



function recordVal_RATIO(e) {
  this.__innerval__ = this.checked;
}

function collectRADIO(e) {
  console.log("blur new", this.checked, "blur old", this.__innerval__)
  if (this.checked != this.__innerval__) {
    let data = {
      url: window.location.href,
      ele_id: this.name || this.id || this.getAttribute('data-changeid') || "",
      data: this.value,
      name: this.name,
      tag: 'radio',
      input_time: (new Date()).getTime()
    }
    sendData(data)
    console.log(data)
  }
}







// https://javascript.ruanyifeng.com/dom/mutationobserver.html#toc9
(function (win) {
  'use strict';

  var listeners = [];
  var doc = win.document;
  var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
  var observer;

  function ready(selector, fn) {

    listeners.push({
      selector: selector,
      fn: fn
    });
    if (!observer) {

      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true
      });
    }

    check();
  }

  function check() {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];

      var elements = doc.querySelectorAll(listener.selector);
      for (var j = 0; j < elements.length; j++) {
        var element = elements[j];

        if (!element.ready) {
          element.ready = true;
          listener.fn.call(element, element);
        }
      }
    }
  }


  win.ready = ready;

})(window);

ready('*', function (e) {
  if (e.tagName == 'INPUT') {
    if (e.getAttribute('type') === 'radio') {
      e.addEventListener('blur', collectRADIO, false)
      e.addEventListener('focus', recordVal_RATIO, false)
    } else {
      e.addEventListener('change', collecINPUT, false)
      e.addEventListener('focus', recordVal, false)
    }

  }
  if (e.tagName == 'SELECT') {
    e.addEventListener('blur', collecSELECT, false)
    e.addEventListener('focus', recordVal, false)
  }
});