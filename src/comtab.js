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
    drop (event, ui) {
      if (currentData.type === CLASSES.TAB_BTN) {
        currentData.pane.removeTab(currentData.tab)
        setTimeout(function () {
          Pane
            .createPaneByDomMap(currentData.pane._tplPaneMap, [currentData.tab._tpl])
            .setPosition(ui.offset)
            .mount()
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
    _initTabEvent (tab) {
      var _this = this
      tab._draggable = tab.btn.draggable({
        appendTo: 'body',
        helper (event, ui) {
          tab._tpl =  _this._cloneTab(tab)
          _this._tplPaneMap = _this._clonePaneDomMap(tab._tpl)
          _this._activeTab(tab._tpl)
          currentData = _createPureObject({pane: _this, tab: tab, type: CLASSES.TAB_BTN})
          return _this._tplPaneMap.pane
        }
      })
    },
    _initPaneEvent () {
      var _this = this
      this._draggable = this._pane.draggable({
        appendTo: stage,
        handle: this._paneHandle,
        start () {
          currentData = _createPureObject({type: CLASSES.PANE})
        }
      })
      this._resizable = this._pane.resizable({
        containment: stage,
        handles: 'n, e, s, w, ne, se, sw, nw'
      })
      this._listeners = {
        paneSelect () {
          PaneManager.selectPane(_this)
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
  Pane._Fn.constructor = Pane

  function createTab (btn, content, actived) {
    content.addClass(CLASSES.TAB_CONTENT)
    btn.addClass(CLASSES.TAB_BTN)
    return _createPureObject({
      btn: btn,
      content: content,
      _actived: !!actived
    })
  }

  function createPane (tabs) {
    return new Pane(tabs)
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

  var PaneManager = {
    paneMap: _createPureObject(null),
    paneCount: 0,
    addPane (pane) {
      var id = (new Date()).getTime()
      this.paneMap[id] = pane
      pane.zIndex = this.paneCount++
      return id
    },
    removePane (id) {
      delete this.paneMap[id]
      this.paneCount--
    },
    selectPane (pane) {
      var topZIndex = this.paneCount - 1
      // not the top-level layer
      if (pane.zIndex !== topZIndex) {
        for (var k in this.paneMap) {
          var v = this.paneMap[k]
          if (v.zIndex > pane.zIndex) {
            v.zIndex--
            v.refreshZIndexCSS()
          }
        }
        pane.zIndex = topZIndex
        pane.refreshZIndexCSS()
      }
    }
  }

  return {
    createPane,
    createTab
  }

})(window.$ || window.jQurey)