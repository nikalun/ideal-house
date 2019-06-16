"use strict";

/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function () {
  "use strict";

  function t(o) {
    if (!o) throw new Error("No options passed to Waypoint constructor");
    if (!o.element) throw new Error("No element option passed to Waypoint constructor");
    if (!o.handler) throw new Error("No handler option passed to Waypoint constructor");
    this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1;
  }

  var e = 0,
      i = {};
  t.prototype.queueTrigger = function (t) {
    this.group.queueTrigger(this, t);
  }, t.prototype.trigger = function (t) {
    this.enabled && this.callback && this.callback.apply(this, t);
  }, t.prototype.destroy = function () {
    this.context.remove(this), this.group.remove(this), delete i[this.key];
  }, t.prototype.disable = function () {
    return this.enabled = !1, this;
  }, t.prototype.enable = function () {
    return this.context.refresh(), this.enabled = !0, this;
  }, t.prototype.next = function () {
    return this.group.next(this);
  }, t.prototype.previous = function () {
    return this.group.previous(this);
  }, t.invokeAll = function (t) {
    var e = [];

    for (var o in i) {
      e.push(i[o]);
    }

    for (var n = 0, r = e.length; r > n; n++) {
      e[n][t]();
    }
  }, t.destroyAll = function () {
    t.invokeAll("destroy");
  }, t.disableAll = function () {
    t.invokeAll("disable");
  }, t.enableAll = function () {
    t.Context.refreshAll();

    for (var e in i) {
      i[e].enabled = !0;
    }

    return this;
  }, t.refreshAll = function () {
    t.Context.refreshAll();
  }, t.viewportHeight = function () {
    return window.innerHeight || document.documentElement.clientHeight;
  }, t.viewportWidth = function () {
    return document.documentElement.clientWidth;
  }, t.adapters = [], t.defaults = {
    context: window,
    continuous: !0,
    enabled: !0,
    group: "default",
    horizontal: !1,
    offset: 0
  }, t.offsetAliases = {
    "bottom-in-view": function bottomInView() {
      return this.context.innerHeight() - this.adapter.outerHeight();
    },
    "right-in-view": function rightInView() {
      return this.context.innerWidth() - this.adapter.outerWidth();
    }
  }, window.Waypoint = t;
}(), function () {
  "use strict";

  function t(t) {
    window.setTimeout(t, 1e3 / 60);
  }

  function e(t) {
    this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
      x: this.adapter.scrollLeft(),
      y: this.adapter.scrollTop()
    }, this.waypoints = {
      vertical: {},
      horizontal: {}
    }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, n.windowContext || (n.windowContext = !0, n.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler();
  }

  var i = 0,
      o = {},
      n = window.Waypoint,
      r = window.onload;
  e.prototype.add = function (t) {
    var e = t.options.horizontal ? "horizontal" : "vertical";
    this.waypoints[e][t.key] = t, this.refresh();
  }, e.prototype.checkEmpty = function () {
    var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
        e = this.Adapter.isEmptyObject(this.waypoints.vertical),
        i = this.element == this.element.window;
    t && e && !i && (this.adapter.off(".waypoints"), delete o[this.key]);
  }, e.prototype.createThrottledResizeHandler = function () {
    function t() {
      e.handleResize(), e.didResize = !1;
    }

    var e = this;
    this.adapter.on("resize.waypoints", function () {
      e.didResize || (e.didResize = !0, n.requestAnimationFrame(t));
    });
  }, e.prototype.createThrottledScrollHandler = function () {
    function t() {
      e.handleScroll(), e.didScroll = !1;
    }

    var e = this;
    this.adapter.on("scroll.waypoints", function () {
      (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t));
    });
  }, e.prototype.handleResize = function () {
    n.Context.refreshAll();
  }, e.prototype.handleScroll = function () {
    var t = {},
        e = {
      horizontal: {
        newScroll: this.adapter.scrollLeft(),
        oldScroll: this.oldScroll.x,
        forward: "right",
        backward: "left"
      },
      vertical: {
        newScroll: this.adapter.scrollTop(),
        oldScroll: this.oldScroll.y,
        forward: "down",
        backward: "up"
      }
    };

    for (var i in e) {
      var o = e[i],
          n = o.newScroll > o.oldScroll,
          r = n ? o.forward : o.backward;

      for (var s in this.waypoints[i]) {
        var a = this.waypoints[i][s];

        if (null !== a.triggerPoint) {
          var l = o.oldScroll < a.triggerPoint,
              h = o.newScroll >= a.triggerPoint,
              p = l && h,
              u = !l && !h;
          (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group);
        }
      }
    }

    for (var c in t) {
      t[c].flushTriggers();
    }

    this.oldScroll = {
      x: e.horizontal.newScroll,
      y: e.vertical.newScroll
    };
  }, e.prototype.innerHeight = function () {
    return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight();
  }, e.prototype.remove = function (t) {
    delete this.waypoints[t.axis][t.key], this.checkEmpty();
  }, e.prototype.innerWidth = function () {
    return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth();
  }, e.prototype.destroy = function () {
    var t = [];

    for (var e in this.waypoints) {
      for (var i in this.waypoints[e]) {
        t.push(this.waypoints[e][i]);
      }
    }

    for (var o = 0, n = t.length; n > o; o++) {
      t[o].destroy();
    }
  }, e.prototype.refresh = function () {
    var t,
        e = this.element == this.element.window,
        i = e ? void 0 : this.adapter.offset(),
        o = {};
    this.handleScroll(), t = {
      horizontal: {
        contextOffset: e ? 0 : i.left,
        contextScroll: e ? 0 : this.oldScroll.x,
        contextDimension: this.innerWidth(),
        oldScroll: this.oldScroll.x,
        forward: "right",
        backward: "left",
        offsetProp: "left"
      },
      vertical: {
        contextOffset: e ? 0 : i.top,
        contextScroll: e ? 0 : this.oldScroll.y,
        contextDimension: this.innerHeight(),
        oldScroll: this.oldScroll.y,
        forward: "down",
        backward: "up",
        offsetProp: "top"
      }
    };

    for (var r in t) {
      var s = t[r];

      for (var a in this.waypoints[r]) {
        var l,
            h,
            p,
            u,
            c,
            d = this.waypoints[r][a],
            f = d.options.offset,
            w = d.triggerPoint,
            y = 0,
            g = null == w;
        d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = Math.floor(y + l - f), h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group);
      }
    }

    return n.requestAnimationFrame(function () {
      for (var t in o) {
        o[t].flushTriggers();
      }
    }), this;
  }, e.findOrCreateByElement = function (t) {
    return e.findByElement(t) || new e(t);
  }, e.refreshAll = function () {
    for (var t in o) {
      o[t].refresh();
    }
  }, e.findByElement = function (t) {
    return o[t.waypointContextKey];
  }, window.onload = function () {
    r && r(), e.refreshAll();
  }, n.requestAnimationFrame = function (e) {
    var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
    i.call(window, e);
  }, n.Context = e;
}(), function () {
  "use strict";

  function t(t, e) {
    return t.triggerPoint - e.triggerPoint;
  }

  function e(t, e) {
    return e.triggerPoint - t.triggerPoint;
  }

  function i(t) {
    this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this;
  }

  var o = {
    vertical: {},
    horizontal: {}
  },
      n = window.Waypoint;
  i.prototype.add = function (t) {
    this.waypoints.push(t);
  }, i.prototype.clearTriggerQueues = function () {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    };
  }, i.prototype.flushTriggers = function () {
    for (var i in this.triggerQueues) {
      var o = this.triggerQueues[i],
          n = "up" === i || "left" === i;
      o.sort(n ? e : t);

      for (var r = 0, s = o.length; s > r; r += 1) {
        var a = o[r];
        (a.options.continuous || r === o.length - 1) && a.trigger([i]);
      }
    }

    this.clearTriggerQueues();
  }, i.prototype.next = function (e) {
    this.waypoints.sort(t);
    var i = n.Adapter.inArray(e, this.waypoints),
        o = i === this.waypoints.length - 1;
    return o ? null : this.waypoints[i + 1];
  }, i.prototype.previous = function (e) {
    this.waypoints.sort(t);
    var i = n.Adapter.inArray(e, this.waypoints);
    return i ? this.waypoints[i - 1] : null;
  }, i.prototype.queueTrigger = function (t, e) {
    this.triggerQueues[e].push(t);
  }, i.prototype.remove = function (t) {
    var e = n.Adapter.inArray(t, this.waypoints);
    e > -1 && this.waypoints.splice(e, 1);
  }, i.prototype.first = function () {
    return this.waypoints[0];
  }, i.prototype.last = function () {
    return this.waypoints[this.waypoints.length - 1];
  }, i.findOrCreate = function (t) {
    return o[t.axis][t.name] || new i(t);
  }, n.Group = i;
}(), function () {
  "use strict";

  function t(t) {
    this.$element = e(t);
  }

  var e = window.jQuery,
      i = window.Waypoint;
  e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) {
    t.prototype[i] = function () {
      var t = Array.prototype.slice.call(arguments);
      return this.$element[i].apply(this.$element, t);
    };
  }), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) {
    t[o] = e[o];
  }), i.adapters.push({
    name: "jquery",
    Adapter: t
  }), i.Adapter = t;
}(), function () {
  "use strict";

  function t(t) {
    return function () {
      var i = [],
          o = arguments[0];
      return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () {
        var n = t.extend({}, o, {
          element: this
        });
        "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n));
      }), i;
    };
  }

  var e = window.Waypoint;
  window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

window.onload = function () {
  var Contacts =
  /*#__PURE__*/
  function () {
    function Contacts() {
      _classCallCheck(this, Contacts);

      this.input = document.querySelectorAll('.inputmask');
      this.init();
    }

    _createClass(Contacts, [{
      key: "init",
      value: function init() {
        this.setMask();
      }
    }, {
      key: "setMask",
      value: function setMask() {
        var masks = new Inputmask("+7 (\\919)-9999999");
        Array.from(this.input).forEach(function (input) {
          masks.mask(input);
        });
      }
    }]);

    return Contacts;
  }();

  var Header =
  /*#__PURE__*/
  function () {
    function Header() {
      _classCallCheck(this, Header);

      this.headerHeight = [];
      this.body = document.body;
      this.header = document.querySelector('.header');
      this.miniMenu = this.header.querySelector('.header__menu-mini');
      this.menuWrapper = this.header.querySelector('.header__menu-wrapper');
      this.burger = this.header.querySelector('.header__burger');
      this.close = this.header.querySelector('.header__close');
      this.continuousElements = document.getElementsByClassName('hash-block');
      this.up = this.header.querySelector('.header__link:first-of-type');
      this.links = this.header.querySelectorAll('.header__link:not(:first-of-type)');
      this.companyElement = this.body.querySelector('.company');
      this.init();
    }

    _createClass(Header, [{
      key: "init",
      value: function init() {
        var _this = this;

        window.addEventListener('scroll', this.setHeaderMini.bind(this));
        this.burger.addEventListener('click', this.openMenu.bind(this));
        this.close.addEventListener('click', this.closeMenu.bind(this));
        this.setHeaderMini();
        this.setActiveMenu();
        this.up.addEventListener('click', this.scrollTop);
        Array.from(this.links).forEach(function (link) {
          link.addEventListener('click', _this.animateScroll);
        });
      }
    }, {
      key: "animateScroll",
      value: function animateScroll(e) {
        e.preventDefault();
        var href = e.currentTarget.getAttribute('href');
        $('html, body').animate({
          scrollTop: "".concat($(href).offset().top, "px")
        }, 700);
      }
    }, {
      key: "scrollTop",
      value: function scrollTop(e) {
        e.preventDefault();
        $('body,html').animate({
          scrollTop: 0
        }, 700);
      }
    }, {
      key: "setActiveMenu",
      value: function setActiveMenu() {
        var _this2 = this;

        var links = this.header.querySelectorAll('.header__link:not(.header__link_top)');
        Array.from(this.continuousElements).forEach(function (item) {
          _this2.point = new Waypoint({
            element: item,
            offset: 20,
            handler: function handler(direction) {
              var hash = this.element.id;
              Array.from(links).forEach(function (link) {
                var url = link.getAttribute('href');

                if (url === "#".concat(hash)) {
                  link.classList.add('header__link_bold');

                  switch (direction) {
                    case 'down':
                      link.classList.add('header__link_active');
                      break;

                    case 'up':
                      link.classList.remove('header__link_active');
                      break;

                    default:
                      break;
                  }
                } else {
                  link.classList.remove('header__link_bold');
                }
              });
            }
          });
        });
      }
    }, {
      key: "openMenu",
      value: function openMenu() {
        this.miniMenu.classList.add('header__menu-mini_open');
        this.menuWrapper.classList.add('header__menu-wrapper_open');
      }
    }, {
      key: "closeMenu",
      value: function closeMenu() {
        this.miniMenu.classList.remove('header__menu-mini_open');
        this.menuWrapper.classList.remove('header__menu-wrapper_open');
      }
    }, {
      key: "setHeaderMini",
      value: function setHeaderMini() {
        this.headerHeight.push(this.header.offsetHeight);
        var screenHeight = this.companyElement.getBoundingClientRect().height + this.headerHeight[0];

        if (this.getScroll() > screenHeight) {
          this.body.style.marginTop = "".concat(this.headerHeight[0], "px");
          this.header.classList.add('header_scroll');
        } else {
          this.headerHeight = [];
          this.body.style.marginTop = 0;
          this.header.classList.remove('header_scroll');
        }
      }
    }, {
      key: "getScroll",
      value: function getScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return scrollTop;
      }
    }]);

    return Header;
  }();

  ;

  var Map =
  /*#__PURE__*/
  function () {
    function Map() {
      _classCallCheck(this, Map);

      this.init();
    }

    _createClass(Map, [{
      key: "init",
      value: function init() {
        this.initialMap();
      }
    }, {
      key: "initialMap",
      value: function initialMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 52.726978,
            lng: 41.447103
          },
          zoom: 16,
          draggable: false,
          disableDefaultUI: true,
          scrollwheel: false,
          styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
              "color": "#e9e9e9"
            }, {
              "lightness": 17
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
              "color": "#f5f5f5"
            }, {
              "lightness": 20
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "lightness": 17
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "lightness": 29
            }, {
              "weight": 0.2
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "lightness": 18
            }]
          }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
              "color": "#ffffff"
            }, {
              "lightness": 16
            }]
          }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
              "color": "#f5f5f5"
            }, {
              "lightness": 21
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
              "color": "#dedede"
            }, {
              "lightness": 21
            }]
          }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#ffffff"
            }, {
              "lightness": 16
            }]
          }, {
            "elementType": "labels.text.fill",
            "stylers": [{
              "saturation": 36
            }, {
              "color": "#333333"
            }, {
              "lightness": 40
            }]
          }, {
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
              "color": "#f2f2f2"
            }, {
              "lightness": 19
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#fefefe"
            }, {
              "lightness": 20
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
              "color": "#fefefe"
            }, {
              "lightness": 17
            }, {
              "weight": 1.2
            }]
          }]
        });
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(52.726978, 41.447103),
          map: map,
          icon: {
            url: 'img/marker.png',
            scaledSize: new google.maps.Size(87, 109)
          }
        });
      }
    }]);

    return Map;
  }();

  ;

  var Input =
  /*#__PURE__*/
  function () {
    function Input() {
      _classCallCheck(this, Input);

      this.inputs = document.querySelectorAll('.input-box__input:not(.inputmask)');
      if (this.inputs.length > 0) this.init();
    }

    _createClass(Input, [{
      key: "init",
      value: function init() {
        var _this3 = this;

        Array.from(this.inputs).forEach(function (input) {
          input.addEventListener('input', _this3.getValue);

          _this3.getInitailValue(input);
        });
      }
    }, {
      key: "getInitailValue",
      value: function getInitailValue(input) {
        if (input.value !== '') {
          input.classList.add('input-box__input_value');
        } else {
          input.classList.remove('input-box__input_value');
        }
      }
    }, {
      key: "getValue",
      value: function getValue(e) {
        var input = e.target;

        if (input.value !== '') {
          input.classList.add('input-box__input_value');
        } else {
          input.classList.remove('input-box__input_value');
        }
      }
    }]);

    return Input;
  }();

  ;

  var Popup =
  /*#__PURE__*/
  function () {
    function Popup() {
      _classCallCheck(this, Popup);

      this.popup = document.querySelector('.popup');
      this.close = this.popup.querySelector('.popup__close');
      if (this.popup) this.init();
    }

    _createClass(Popup, [{
      key: "init",
      value: function init() {
        this.close.addEventListener('click', this.closePopup.bind(this));
      }
    }, {
      key: "closePopup",
      value: function closePopup() {
        this.popup.classList.add('popup_close');
      }
    }]);

    return Popup;
  }();

  ;

  var Button =
  /*#__PURE__*/
  function () {
    function Button() {
      _classCallCheck(this, Button);

      this.buttons = document.querySelectorAll('.button_pay');
      this.buttonsMap = document.querySelectorAll('.button_map');
      if (this.buttons.length > 0 || this.buttonsMap.length > 0) this.init();
    }

    _createClass(Button, [{
      key: "init",
      value: function init() {
        var _this4 = this;

        Array.from(this.buttons).forEach(function (button) {
          button.addEventListener('click', _this4.viewPopup);
        });
        Array.from(this.buttonsMap).forEach(function (button) {
          button.addEventListener('click', _this4.scrollToMap);
        });
      }
    }, {
      key: "scrollToMap",
      value: function scrollToMap(e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: "".concat($('#map').offset().top, "px")
        }, 700);
      }
    }, {
      key: "viewPopup",
      value: function viewPopup(e) {
        e.preventDefault();
        var popup = document.querySelector('.popup');

        if (popup.classList.contains('popup_close')) {
          popup.classList.remove('popup_close');
        }
      }
    }]);

    return Button;
  }();

  ;
  var popup = new Popup();
  var input = new Input();
  var map = new Map();
  var header = new Header();
  var contacts = new Contacts();
  var button = new Button();
};