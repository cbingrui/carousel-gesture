export const MOUSE_DOWN = 'mousedown';
export const MOUSE_UP = 'mouseup';
export const MOUSE_MOVE = 'mousemove';
export const MOUSE_OUT = 'mouseout';
export const MOUSE_ENTER = 'mouseenter';
export const TOUCH_START = 'touchstart';
export const TOUCH_END = 'touchend';
export const TOUCH_MOVE = 'touchmove';
export const PI180 = 180;

export function formatParams(params) {
  if (!params) {
    return '';
  }

  return (
    '?' +
    Object.keys(params)
      .map(function(key) {
        return key + '=' + encodeURIComponent(params[key]);
      })
      .join('&')
  );
}

export function mouseCoords(ev) {
  ev = ev || window.event;
  return {
    x:
      ev.pageX ||
      (ev.touches && ev.touches[0].pageX) ||
      (ev.originalEvent.touches
        ? ev.originalEvent.touches[0].pageX
        : ev.clientX + document.body.scrollLeft - document.body.clientLeft),
    y:
      ev.pageY ||
      (ev.touches && ev.touches[0].pageY) ||
      (ev.originalEvent.touches
        ? ev.originalEvent.touches[0].pageY
        : ev.clientY + document.body.scrollTop - document.body.clientTop)
  };
}

export var getJSON = function(url, successHandler, errorHandler, params) {
  var xhr =
    typeof XMLHttpRequest != 'undefined'
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHTTP');
  var urlWithParam = url + formatParams(params);
  xhr.open('get', urlWithParam, true);
  // xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    var status;
    var data;
    if (xhr.readyState == 4) {
      status = xhr.status;
      if (status == 200) {
        data = JSON.parse(xhr.responseText);
        successHandler && successHandler(data);
      } else {
        errorHandler && errorHandler(status);
      }
    }
  };
  xhr.send('');
};
