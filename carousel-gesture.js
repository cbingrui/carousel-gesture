import {
  formatParams,
  mouseCoords,
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
  MOUSE_OUT,
  TOUCH_MOVE,
  TOUCH_START,
  TOUCH_END,
  PI180
} from './utility';

export default class CarouselGesture {
  constructor(circleName = '#circle', carouseArea = '#carouse-area') {
    this.initElements(circleName, carouseArea);
    this.initProperties();
    this.bindEvents();
  }

  initProperties() {
    this.curCumulatedAngle = 0;
    this.mouseBeginDown = null;
    this.startAngle = 0;
    this.oldAngle = 0;
    this.inCircle = null;
    this.circleRadius = this.circle.clientWidth / 2;
    this.displayCircle(null, false);
  }

  initElements(circleName = '', carouseArea = '') {
    this.circle = document.querySelector(circleName);
    this.move = document.querySelector(carouseArea);
  }

  touchLeaveValidation(e) {
    // not support touchleave
    e.preventDefault();
    var touch = e.touches[0];
    if (this.inCircle) {
      console.log('incircle');
      if (this.circle !== document.elementFromPoint(touch.pageX, touch.pageY)) {
        this.inCircle = false;
        console.log('leave');
        this.updateStartAngle();
      }
    } else {
      this.pressmove(e);
    }
  }

  bindEvents() {
    // issue: touchstart & touchleave couldn't work in inner circle
    [MOUSE_DOWN, TOUCH_START].forEach(ev => {
      this.move.addEventListener(ev, this.startEvent.bind(this));
    });

    this.move.addEventListener(TOUCH_MOVE, ev => {
      this.touchLeaveValidation(ev);
    });

    [MOUSE_UP, TOUCH_END].forEach(ev => {
      this.move.addEventListener(ev, this.endEvent.bind(this));
      this.circle.addEventListener(ev, this.endEvent.bind(this));
    });

    this.bindMoveEvent = this.pressmove.bind(this);
    this.bindMouseoutEvent = this.updateStartAngle.bind(this);
  }

  startEvent(e) {
    this.inCircle = true;
    this.displayCircle(e);
    console.log('start');
    this.circle.addEventListener(MOUSE_OUT, this.bindMouseoutEvent);
  }

  endEvent(e) {
    this.displayCircle(e, false);
    e.preventDefault();
    e.stopPropagation();
    [MOUSE_MOVE].forEach(ev => {
      this.move.removeEventListener(ev, this.bindMoveEvent);
    });
    this.circle.removeEventListener(MOUSE_OUT, this.bindMouseoutEvent);
    console.log('end');
    this.endUp && this.endUp();
  }

  addEndEventListener(fn) {
    this.endUp = fn;
  }
  addMoveEventListener(fn) {
    this.moving = fn;
  }

  pressmove(e) {
    // e.preventDefault();
    var ev = mouseCoords(e);
    var x = ev.x - this.mouseBeginDown.x;
    var y = ev.y - this.mouseBeginDown.y;

    var curAngle = this.toDegreeOf360(x, y);

    if (curAngle - this.oldAngle > 2 * PI180 * 0.9) {
      this.curCumulatedAngle -= 2 * PI180;
    } else if (this.oldAngle - curAngle > 2 * PI180 * 0.9) {
      this.curCumulatedAngle += 2 * PI180;
    }

    var realCumulatedAngle =
      this.curCumulatedAngle + curAngle - this.startAngle;

    if (realCumulatedAngle < 0) {
      this.startAngle = curAngle;
      this.oldAngle = 0;
      this.curCumulatedAngle = 0;
      return;
    }

    this.oldAngle = curAngle;
    this.moving && this.moving(realCumulatedAngle, this.curAngle);
  }

  displayCircle(e = null, display = true) {
    if (display && e) {
      this.mouseBeginDown = mouseCoords(e);
      console.log(this.circleRadius);
      this.circle.setAttribute(
        'style',
        `display:block;top:${this.mouseBeginDown.y -
          this.circleRadius}px;left:${this.mouseBeginDown.x -
          this.circleRadius}px`
      );
    } else {
      this.circle.style.display = 'none';
    }
  }

  updateStartAngle(e) {
    console.log('add move event');
    [MOUSE_MOVE].forEach(ev => {
      this.move.addEventListener(ev, this.bindMoveEvent);
    });
    var ev = mouseCoords(e);
    var x = ev.x - this.mouseBeginDown.x;
    var y = ev.y - this.mouseBeginDown.y;
    this.startAngle = this.toDegreeOf360(x, y);
    this.oldAngle = this.startAngle;
  }

  toDegreeOf360(x, y) {
    return Math.atan2(y, x) / Math.PI * PI180 + PI180;
  }
}
