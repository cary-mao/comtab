/**
 * compatibility: ie9+
 */
var comtab = (function ($, undefined) {
  if (!$) {
    throw new Error('[comtab]: comtab.js require jquery.js')
  } else if (!$.ui) {
    throw new Error('[comtab]: comTab.js require jquery-ui.js')
  }

  var CLASSES = _createCLASSES('comtab')
  var STAGE_SELECTOR = 'body'
  var stage = $(STAGE_SELECTOR)
  var currentData = null

  stage.droppable({
    addClasses: false,
    drop (event, ui) {
      if (currentData.type === CLASSES.TAB_BTN) {
        _commonTabBtnDrop()
        // after drag-stop
        setTimeout(function () {
          Pane
            .createPaneByDomMap(currentData.pane._tplPaneMap, [currentData.tab._tpl])
            .setPosition(ui.offset)
            .mount()
          // fix:bug tab-id will be losed, because of the helper will be removed by draggable
          currentData.tab._tpl.btn.data('tab-id', currentData.tab._tpl.id)
          currentData.tab._tpl.content.data('tab-id', currentData.tab._tpl.id)
        })
      }
    }
  })

  function Pane (tabs, options) {
    this.tabs = tabs
    this._normalizeOptions(options)
    this._init()
  }

  Pane.prototype = {
    /**
     * *************************************
     * public methods
     * There are all methods in Pane which can be called by user
     * *************************************
     */
    mount () {
      stage.append(this._pane)
      return this
    },
    removeTab (tab) {
      this.tabs.splice(this.tabs.indexOf(tab), 1)
      tab.content.remove()
      tab.btn.remove()
    },
    addTab (tab) {
      this.tabs.push(tab)
      this._tabHeader.append(tab.btn)
      this._pane.append(tab.content)
    },
    setPosition (position) {
      this._pane.css({
        position: 'absolute',
        left: position.left + 'px',
        top: position.top + 'px'
      })
      return this
    },
    setRestrictSize (size) {
      var props = ['minWidth', 'minHeight', 'maxWidth', 'maxHeight']
      var _this = this
      props.forEach(function (p) {
        var _p = '_' + p
        _this._resizable.resizable('option', p, _this[_p] = size[p] || _this[_p])
      })
    },
    setSize (w, h) {
      this._pane.css({
        width: w,
        height: h
      })
      return this
    },
    refreshZIndexCSS () {
      this._pane.css('z-index', this.zIndex)
    },
    /**
     * *************************************
     * private methods
     * There are all methods in Pane which only used in plugin
     * *************************************
     */
    _init () {
      var _this = this
      var paneDomMap = this._createPaneDomMap()
      var activedTab = null
  
      this._pane = paneDomMap.pane
      this._paneHandle = paneDomMap.paneHandle
      this._tabHeader = paneDomMap.tabHeader
  
      this.tabs.forEach(function (tab) {
        _this._appendTab(tab)
        _this._initTabEvent(tab)
  
        if (activedTab && tab.actived) {
          _this._deactiveTab(tab)
          return
        }
  
        if (tab._actived) {
          _this._activeTab(activedTab = tab)
        }
      })

      if (this.tabs.length < 2) {
        this.tabs[0]._draggable.draggable('disable')
      }
  
      if (!activedTab) {
        this._activeTab(activedTab = this.tabs[0])
      }
  
      this._initPaneEvent()
      this._initRestrictSize()
      this._mapDom()
      this.refreshZIndexCSS()
    },
    _activeTab (tab) {
      tab.actived = true
      tab.btn.addClass(CLASSES.TAB_BTN_ACTIVE)
      tab.content.addClass(CLASSES.TAB_CONTENT_ACTIVE)
    },
    _deactiveTab (tab) {
      tab.actived = false
      tab.btn.removeClass(CLASSES.TAB_BTN_ACTIVE)
      tab.content.removeClass(CLASSES.TAB_CONTENT_ACTIVE)
    },
    _initRestrictSize () {
      this.setRestrictSize(this._options)
    },
    _mapDom () {
      this._pane.data('pane-id', this.id = PaneManager.addPane(this))
    },
    _concatPane (pane) {
      var _this = this
      PaneManager.removePane(pane.id)
      this.tabs.forEach(function (tab) {
        if (tab.actived) {
          _this._deactiveTab(tab)
        }
      })
      if (this.tabs.length < 2) {
        this.tabs[0]._draggable.draggable('enable')
      }
      pane.tabs.forEach(function (tab) {
        _this.addTab(tab)
        // reset draggable because the `_this` point to the old pane
        tab._draggable.draggable('destroy')
        _this._initTabEvent(tab)
      })
      pane._pane.remove()
    },
    _initTabEvent (tab) {
      var _this = this
      tab._draggable = tab.btn.draggable({
        appendTo: stage,
        addClasses: false,
        helper () {
          tab._tpl =  _this._cloneTab(tab)
          _this._tplPaneMap = _this._clonePaneDomMap(tab._tpl)
          _this._activeTab(tab._tpl)
          currentData = _createPureObject({pane: _this, tab: tab, type: CLASSES.TAB_BTN})
          return _this._tplPaneMap.pane
        },
        drag (event) {
          _commonActiveTabHeaderDrag(event)
        }
      })
    },
    _initPaneEvent () {
      var _this = this
      this._draggable = this._pane.draggable({
        appendTo: stage,
        handle: this._paneHandle,
        addClasses: false,
        start () {
          currentData = _createPureObject({type: CLASSES.PANE, pane: _this})
        },
        drag (event) {
          _commonActiveTabHeaderDrag(event)
        }
      })
      this._resizable = this._pane.resizable({
        addClasses: false,
        containment: stage,
        handles: 'n, e, s, w, ne, se, sw, nw'
      })
      this._droppable = this._pane.droppable({
        greedy: true,
        addClasses: false,
        tolerance: 'pointer',
        over () {
          currentData.overedPane = _this
        },
        out () {
          currentData.overedPane = null
          _commonCancelOveredTabHeader(_this)
        },
        drop () {
          // remove class and configure data
          _commonCancelOveredTabHeader(_this)

          // if drop pane to tab header
          if (currentData.type === CLASSES.PANE) {
            _this._concatPane(currentData.pane)
          }
          // if drop temporary pane to tab header
          else if (currentData.type === CLASSES.TAB_BTN) {
            if (currentData.pane !== _this) {
              var pane = Pane.createPaneByDomMap(currentData.pane._tplPaneMap, [currentData.tab._tpl])
              _this._concatPane(pane)
              _commonTabBtnDrop()
            }
          }
        }
      })
      this._listeners = {
        paneSelect (event) {
          PaneManager.selectPane(_this)
          var target = $(event.target)
          var id = target.data('tab-id')
          if (id) {
            var tab = _this.tabs.filter(function (t) {return t.id === id})[0]
            if (tab && !tab.actived) {
              _this.tabs.forEach(function (t) {
                if (t.actived) {
                  _this._deactiveTab(t)
                }
              })
              _this._activeTab(tab)
            }
          }
        }
      }
      this._pane.on('mousedown', this._listeners.paneSelect)
    },
    _clonePaneDomMap (tab) {
      var paneDomMap = this._createPaneDomMap()
  
      this._appendTab.call({
        _pane: paneDomMap.pane,
        _paneHandle: paneDomMap.paneHandle,
        _tabHeader: paneDomMap.tabHeader
      }, tab)
  
      return paneDomMap
    },
    _cloneTab (tab) {
      return createTab(tab.btn.clone(), tab.content.clone())
    },
    _appendTab (tab) {
      this._pane.append(tab.content)
      this._tabHeader.append(tab.btn)
    },
    _normalizeOptions (options) {
      options = options || {}
      var defaultOptions = _createPureObject({
        minWidth: 100,
        minHeight: 60
      })
      this._options = Object.assign(defaultOptions, options)
    },
    _createPaneDomMap () {
      var pane = $('<div class="' + CLASSES.PANE + '"></div>')
      var paneHandle = $('<div class="' + CLASSES.PANE_HANDLE + '"></div>')
      var tabHeader = $('<div class="' + CLASSES.TAB_HEADER +'"></div>')
      
      pane.append(paneHandle).append(tabHeader)
  
      return _createPureObject({
        pane: pane,
        paneHandle: paneHandle,
        tabHeader: tabHeader
      })
    }
  }

  /**
   * *****************
   * static methods
   * *****************
   */
  Pane.createPaneByDomMap = function (paneDomMap, tabs) {
    var o = new Pane._Fn()
    o._createPaneDomMap = function () {return paneDomMap}
    Pane.call(o, tabs)
    delete o._createPaneDomMap

    return o
  }
  // fix Fn's name as Pane
  Pane._Fn = function Pane () {}
  Pane._Fn.prototype = Pane.prototype
  Pane._Fn.constructor = PaneW

  function createTab (btn, content, actived) {
    var id = _genId()
    content.addClass(CLASSES.TAB_CONTENT).data('tab-id', id)
    btn.addClass(CLASSES.TAB_BTN).data('tab-id', id)

    return _createPureObject({
      id: id,
      btn: btn,
      content: content,
      _actived: !!actived
    })
  }

  function createPane (tabs, options) {
    return new Pane(tabs, options)
  }

  function _createCLASSES (prefix) {
    var pane = prefix + '-pane'
    var paneHandle = pane + '_handle'
    var tab = prefix + '-tab'
    var tabHeader = tab + '_header'
    var tabContent = tab + '_content'
    var tabBtn = tab + '_btn'
    var CLASSES = _createPureObject({
      PANE: pane,
      PANE_HANDLE: paneHandle,
      TAB: tab,
      TAB_HEADER: tabHeader,
      TAB_CONTENT: tabContent,
      TAB_BTN: tabBtn
    })
    for (var k in CLASSES) {
      CLASSES[k + '_ACTIVE'] = CLASSES[k] + '-active'
    }

    return CLASSES
  }

  function _createPureObject (obj) {
    var description = {}
    if (obj) {
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          description[k] = {
            value: obj[k],
            writable: true,
            configurable: true,
            enumerable: true
          }
        }
      }
    }
    
    return Object.create(null, description)
  }

  function _isNumberInInterval (num, interval) {
    return num >= interval[0] && num <= interval[1]
  }

  function _transformPoint (point, area) {
    point.x -= area.left
    point.y -= area.top
    return point
  }

  function _isPointInArea (point, area) {
    return _isNumberInInterval(point.x, [area.left, area.left + area.width])
      && _isNumberInInterval(point.y, [area.top, area.top + area.height])
  }

  var PaneManager = {
    paneMap: _createPureObject(null),
    paneCount: 0,
    topZIndex: 0,
    addPane (pane) {
      var id = _genId()
      this.paneMap[id] = pane
      this.topZIndex = pane.zIndex = this.paneCount++
      return id
    },
    removePane (id) {
      // normalize pane layer
      // only keep the max zindex correct, not reset
      if (this.topZIndex === this.paneMap[id].zIndex) {
        this.topZIndex--
      }
      delete this.paneMap[id]
      this.paneCount--
    },
    selectPane (pane) {
      // not the top-level layer
      if (pane.zIndex !== this.topZIndex) {
        for (var k in this.paneMap) {
          var v = this.paneMap[k]
          if (v.zIndex > pane.zIndex) {
            v.zIndex--
            v.refreshZIndexCSS()
          }
        }
        pane.zIndex = this.topZIndex
        pane.refreshZIndexCSS()
      }
    }
  }

  function _genId () {
    var len = 32
    var radix = 16
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = [], i
    radix = radix || chars.length
    if(len) {
      for(i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]
    } else {
      var r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if(!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }

  /**
   * There are the methods that only extract the common logic.
   */
  function _commonTabBtnDrop () {
    currentData.pane.removeTab(currentData.tab)
    if (currentData.pane.tabs.length < 2) {
      currentData.pane.tabs[0]._draggable.draggable('disable')
    }
    if (currentData.tab.actived) {
      currentData.pane._activeTab(currentData.pane.tabs[0])
    }
  }

  function _commonActiveTabHeaderDrag (event) {
    var oPane = currentData.overedPane
    if (oPane) {
      var tabHeader = oPane._tabHeader
      var point = _transformPoint({x: event.pageX, y: event.pageY}, oPane._pane.offset())
      // now, focus on the bound box of oPane
      var tabHeaderBound = tabHeader.position()
      tabHeaderBound.width = tabHeader.outerWidth()
      tabHeaderBound.height = tabHeader.outerHeight()

      var inHeader = _isPointInArea(point, tabHeaderBound)
      var changeState = currentData.inOveredTabHeader ^ inHeader
      currentData.inOveredTabHeader = inHeader

      if (changeState) {
        if (inHeader) {
          tabHeader.addClass(CLASSES.TAB_HEADER_ACTIVE)
        } else {
          tabHeader.removeClass(CLASSES.TAB_HEADER_ACTIVE)
        }
      }
    }
  }

  function _commonCancelOveredTabHeader (pane) {
    if (currentData.inOveredTabHeader) {
      pane._tabHeader.removeClass(CLASSES.TAB_HEADER_ACTIVE)
      currentData.inOveredTabHeader = false
    }
  }

  return {
    createPane,
    createTab
  }

})(window.$ || window.jQurey)