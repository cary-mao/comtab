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
  var TYPES = {
    REMOVE_FROM_COLUMN: 'remove_from_column'
  }
  var STAGE_SELECTOR = 'body'
  var stage = $(STAGE_SELECTOR)
  var currentData = null

  stage.droppable({
    addClasses: false,
    scope: 'droppable',
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

    if (this._options.autoMount) {
      this.mount()
    }

    if (this._options.width || this._options.height) {
      this.setSize(this._options.width, this._options.height)
    }
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
     * The method to save the pane's position information in json
     * please sure that your tab has tag attribute
     */
    toJSON () {
      var position = this._pane.position()
      var width = this._pane.width()
      var height = this._pane.height()
      var tabs = this.tabs.map(function (tab) {
        var options = _createPureObject(tab._options)
        // some properties in actual time
        options.actived = tab.actived
        return options
      })
      var options = _createPureObject(this._options)
      delete options.autoMount
      options.width = width
      options.height = height
      return {
        position: position,
        options: options,
        tabs: tabs
      }
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
  
        if (activedTab && tab.actived) {
          _this._deactiveTab(tab)
          return
        }
  
        if (tab.actived) {
          _this._activeTab(activedTab = tab)
        }
      })
  
      if (!activedTab) {
        this._activeTab(activedTab = this.tabs[0])
      }
  
      this._initPaneEvent()
      this._strictEventIfSingleTab()
      this._initRestrictSize()
      this._mapDom()
      this.refreshZIndexCSS()
    },
    _strictEventIfSingleTab () {
      this._tabHeaderDraggable.draggable(this.tabs.length < 2 ? 'disable' : 'enable')
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
      this._strictEventIfSingleTab()
      pane.tabs.forEach(function (tab) {
        _this.addTab(tab)
      })
      pane._pane.remove()
    },
    _initPaneEvent () {
      var _this = this
      this._tabHeaderDraggable = this._tabHeader.draggable({
        handle: '.' + CLASSES.TAB_BTN,
        appendTo: stage,
        scope: 'droppable',
        helper (event) {
          var originEvent = event.originalEvent
          var tab = _this.tabs.filter(tab => tab.btn[0] === event.target)[0]
          tab._tpl =  _this._cloneTab(tab)
          _this._tplPaneMap = _this._clonePaneDomMap(tab._tpl)
          _this._activeTab(tab._tpl)
          currentData = _createPureObject({pane: _this, tab: tab, type: CLASSES.TAB_BTN, wrap: _this._tplPaneMap.pane})
          return _this._tplPaneMap.pane.css({
            'z-index': PaneManager.topZIndex + 1
          })
        }
      })
      this._draggable = this._pane.draggable({
        appendTo: stage,
        handle: this._paneHandle,
        addClasses: false,
        scroll: false,
        scope: 'droppable',
        start () {
          currentData = _createPureObject({type: CLASSES.PANE, pane: _this, wrap: _this._pane})
        }
      })
      this._resizable = this._pane.resizable({
        addClasses: false,
        containment: stage,
        handles: 'n, e, s, w, ne, se, sw, nw'
      })
      this._tabHeaderDroppable = this._tabHeader.droppable({
        greedy: true,
        hoverClass: CLASSES.TAB_HEADER_ACTIVE,
        tolerance: 'pointer',
        scope: 'droppable',
        over () {
          currentData.wrap.addClass(CLASSES.PANE_DROP_READY)
        },
        out () {
          currentData.wrap.removeClass(CLASSES.PANE_DROP_READY)
        },
        drop () {
          currentData.wrap.removeClass(CLASSES.PANE_DROP_READY)
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
      this._initAbsorbEvent()
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
    _initAbsorbEvent () {
      var _this = this
      var absorbs = [
        ['top', 'horizontal'],
        ['left', 'vertical'],
        ['bottom', 'horizontal'],
        ['right', 'vertical']
      ]
      _this._absorbs = {}
      absorbs.forEach(function (absorb) {
        var direction = absorb[0]
        var lineDirection = absorb[1]
        _this._absorbs[direction] = $(
          '<div class="' +
          CLASSES['ABSORB_' + lineDirection.toUpperCase()] + ' ' +
          CLASSES.ABSORB + ' ' +
          CLASSES['ABSORB_' + direction.toUpperCase()] +
          '"></div>'
        ).droppable({
          hoverClass: CLASSES.ABSORB_ACTIVE,
          tolerance: 'pointer',
          greedy: true,
          scope: 'droppable',
          over () {
            currentData.wrap.addClass(CLASSES.PANE_DROP_READY)
          },
          out () {
            currentData.wrap.removeClass(CLASSES.PANE_DROP_READY)
          },
          drop (event, ui) {
            var type = currentData.type

            currentData.wrap.removeClass(CLASSES.PANE_DROP_READY)
  
            if (type === CLASSES.PANE) {
              combinePane(currentData.pane, _this, direction)
            } else if (type === CLASSES.TAB_BTN) {
              _commonTabBtnDrop()
              setTimeout(function () {
                var pane = Pane.createPaneByDomMap(currentData.pane._tplPaneMap, [currentData.tab._tpl])
                  .setSize(currentData.pane._pane.outerWidth(), currentData.pane._pane.outerHeight())
                  .setPosition(ui.offset)
                combinePane(pane, _this, direction)
                // fix:bug tab-id will be losed, because of the helper will be removed by draggable
                currentData.tab._tpl.btn.data('tab-id', currentData.tab._tpl.id)
                currentData.tab._tpl.content.data('tab-id', currentData.tab._tpl.id)
              })
            }
          }
        })
        _this._pane.append(_this._absorbs[direction])
      })
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
      return createTab(tab.btn.clone(), tab.content.clone(), tab._options)
    },
    _appendTab (tab) {
      this._pane.append(tab.content)
      this._tabHeader.append(tab.btn)
    },
    _normalizeOptions (options) {
      options = options || {}
      this._options = options
      var defaultOptions = _createPureObject({
        autoMount: false,
        minWidth: 100,
        minHeight: 60,
        absorbDistance: 10,
        absorbOrigin: 'center'
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

  /**
   * In order to simplify logic, you should provide a map for tab
   */
  Pane.parseJSON = function (json, tabMap, autoMount) {
    json.options.autoMount = autoMount === undefined ? true : autoMount
    var pane = createPane(json.tabs.map(function (tabJSON) {
      var tab = tabMap[tabJSON.tag]
      return createTab(tab.btn, tab.content, tabJSON)
    }), json.options).setPosition(json.position)

    return pane
  }

  Pane._Fn = function Pane () {}
  _inheritPrototype(Pane._Fn, Pane)
  // Pane._Fn should be new the instance of Pane, not the instance of sub class of Pane
  Pane._Fn.prototype = Pane.prototype

  function combinePane (pane, host, direction) {
    // sure host group
    surePaneGroup(host)
    
    if (direction === 'top' || direction === 'bottom') {
      host._column.addPane(pane, host, direction)
      pane._column = host._column
      pane._group = host._group
      return
    }

    if (direction === 'left' || direction === 'right') {
      surePaneColumn(pane)
      host._group.addColumn(pane._column, host._column, direction)
      // pane._column = host._column
      pane._group = host._group
      return
    }

    function surePaneGroup (pane) {
      if (!pane._group) {
        pane._group = new PaneGroup()
        pane._column = new PaneColumn()
        pane._column.addPane(pane)
        pane._group.addColumn(pane._column)
        pane._column.init()
        pane._group.init().mount()
      }
    }

    function surePaneColumn (pane) {
      if (!pane._column) {
        pane._column = new PaneColumn()
        pane._column.addPane(pane)
        pane._column.init()
      }
    }
  }

  function PaneColumn () {
    this._panes = []
  }

  PaneColumn.prototype = {
    init () {
      var firstPane = this._panes[0]

      // calculate position and size
      var position = firstPane._pane.position()
      var width = firstPane._pane.outerWidth()
      var height = firstPane._pane.outerHeight()

      // add pane to wrap
      var wrap = this._wrap = $('<div class="' + CLASSES.PANE_GROUP_COLUMN + '"></div>')
      wrap.append(firstPane._pane)
      wrap.css({
        width: width,
        height: height,
        left: position.left,
        top: position.top
      })

      this._initEvent()
      this._inited = true
    },
    addPane (pane, host, direction) {
      if (this._panes.length < 1) {
        this._panes.push(pane)
        return
      }

      var index = this._panes.indexOf(host)

      if (index < 0) return

      if (direction === 'top') {
        this._panes.splice(index, 0, pane)
      } else if (direction === 'bottom') {
        this._panes.splice(index + 1, 0, pane)
      }
      console.log(pane.tabs)

      this._wrap.append(pane._pane)
      this.refresh()
    },
    refresh () {
      var maxWidth = 0
      var wholeHeight = 0
      var handleHeight = this._panes[0]._paneHandle.outerHeight()
      this._panes.forEach(function (pane, i) {
        var width = pane._pane.outerWidth()
        var height = pane._pane.outerHeight()

        if (i > 0) {
          if (!pane._paneHandle.data('display')) {
            pane._paneHandle.data('display', 'none').css('display', 'none')
            height = height - handleHeight
          }
          pane._absorbs['top'].droppable('disable')
        } else {
          pane._paneHandle.css('display', 'block')
          pane._absorbs['top'].droppable('enable')
        }

        pane._draggable.draggable('disable').resizable('disable')

        pane._pane.css({
          left: 0,
          top: wholeHeight,
          height: height
        })
        wholeHeight += height
        if (maxWidth < width) {
          maxWidth = width
        }
      })
      this._panes.forEach(function (pane) {
        pane._pane.css({
          width: maxWidth
        })
      })
      this._wrap.css({
        height: wholeHeight
      })
    },
    mount (group) {
      group._wrap.append(this._wrap)
      this.refresh()
      this._mounted = true
    },
    _initEvent () {
      var _this = this
      this._draggable = this._wrap.draggable({
        handle: '.' + CLASSES.TAB_HEADER,
        helper (event) {
          var pane = _this._panes.filter(function (pane) {
            return pane._tabHeader[0] === event.target
          })[0]
          return pane._pane
        }
      })
    }
  }

  function PaneGroup () {
    this._columns = []
  }

  PaneGroup.prototype = {
    init () {
      this._wrap = $('<div class="' + CLASSES.PANE_GROUP + '"></div>')
      this._inited = true
      return this
    },
    addColumn (column, host, direction) {
      if (this._columns.length < 1) {
        this._columns.push(column)
        return
      }
      var index = this._columns.indexOf(host)

      if (direction === 'left') {
        this._columns.splice(index, 0, column)
        this.onChangeLeftPosition(column)
      } else if (direction === 'right') {
        this._columns.splice(index + 1, 0, column)
      }

      column.mount(this)
      this.refreshColumnsPosition()
    },
    onChangeLeftPosition (column) {
      var width = column._wrap.outerWidth()
      var wrapPosition = this._wrap.position()
      this._wrap.css({
        left: wrapPosition.left - width
      })
    },
    refreshColumnsPosition () {
      var wholeWidth = 0
      this._columns.forEach(function (column) {
        column._wrap.css({
          left: wholeWidth,
          top: 0
        })
        wholeWidth = column._wrap.outerWidth() + wholeWidth
      })
    },
    initColumnsPosition () {
      var groupPosition = this._wrap.position()
      this._columns.forEach(function (column) {
        var position = column._wrap.position()
        column._wrap.css({
          left: position.left - groupPosition.left,
          top: position.top - groupPosition.top
        })
      })
    },
    initEvent () {
      var _this = this
      this._draggable = this._wrap.draggable({
        handle: '.' + CLASSES.PANE_HANDLE,
        start () {
          currentData = _createPureObject({type: CLASSES.PANE_GROUP, wrap: _this._wrap, group: _this})
        }
      })
    },
    mount () {
      // must mount before column
      stage.append(this._wrap)
      this._columns[0].mount(this)
      this.initEvent()

      // set position
      var position = this._columns[0]._wrap.position()
      this._wrap.css({
        left: position.left,
        top: position.top 
      })
      this.initColumnsPosition()

      this._mounted = true
    }
  }

  function _inheritPrototype (Sub, Sup) {
    var prototype = Object.create(Sup.prototype)
    Sub.prototype = prototype
    prototype.constructor = Sub
  }

  function createTab (btn, content, options) {
    options = options || {}
    var id = _genId()
    var actived = !!options.actived
    var tag = options.tag
    content.addClass(CLASSES.TAB_CONTENT).data('tab-id', id)
    btn.addClass(CLASSES.TAB_BTN).data('tab-id', id)

    if (actived) {
      btn.addClass(CLASSES.TAB_BTN_ACTIVE)
      content.addClass(CLASSES.TAB_CONTENT_ACTIVE)
    }

    return _createPureObject({
      id: id,
      btn: btn,
      content: content,
      _options: options,
      tag: tag,
      actived: actived
    })
  }

  function createPane (tabs, options) {
    return new Pane(tabs, options)
  }

  function setStageBySelector (selector) {
    STAGE_SELECTOR = selector
    stage = $(selector)
  }

  function _createCLASSES (prefix) {
    var pane = prefix + '-pane'
    var paneHandle = pane + '_handle'
    var paneDropReady = pane + '-dropready'
    var paneGroup = pane + '-group'
    var paneGroupColumn = paneGroup + '_column'
    var tab = prefix + '-tab'
    var tabHeader = tab + '_header'
    var tabContent = tab + '_content'
    var tabBtn = tab + '_btn'
    var absorb = prefix + '-absorb'
    var absorbVertical = absorb + '-vertical'
    var absorbHorizontal = absorb + '-horizontal'
    var CLASSES = _createPureObject({
      PANE: pane,
      PANE_HANDLE: paneHandle,
      PANE_GROUP: paneGroup,
      TAB: tab,
      TAB_HEADER: tabHeader,
      TAB_CONTENT: tabContent,
      TAB_BTN: tabBtn,
      ABSORB: absorb
    })
    for (var k in CLASSES) {
      CLASSES[k + '_ACTIVE'] = CLASSES[k] + '-active'
    }
    CLASSES.ABSORB_VERTICAL = absorbVertical
    CLASSES.ABSORB_HORIZONTAL = absorbHorizontal
    ;['top', 'right', 'left', 'bottom'].forEach(function (direction) {
      CLASSES['ABSORB_' + direction.toUpperCase()] = absorb + '_' + direction
    })
    CLASSES.PANE_DROP_READY = paneDropReady
    CLASSES.PANE_GROUP_COLUMN = paneGroupColumn

    return CLASSES
  }

  function _createPureObject (obj) {
    var description = {}
    if (obj) {
      for (var k in obj) {
        // fix:bug if obj is a pure object, it hasn't hasOwnProperty
        if (!obj.hasOwnProperty || obj.hasOwnProperty(k)) {
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
   * The method that export all position information in stage
   */
  function toJSON () {
    var panes = []
    for (var k in PaneManager.paneMap) {
      var v = PaneManager.paneMap[k]
      panes.push(v.toJSON())
    }
    return {
      stage: STAGE_SELECTOR,
      panes: panes
    }
  }

  function parseJSON (json, tabMap, autoMount) {
    stage !== STAGE_SELECTOR && setStageBySelector(json.stage)
    var panes = json.panes.map(function (paneJSON) {
      return Pane.parseJSON(paneJSON, tabMap, autoMount)
    })

    return panes
  }

  /**
   * There are the methods that only extract the common logic.
   */
  function _commonTabBtnDrop () {
    currentData.pane.removeTab(currentData.tab)
    currentData.pane._strictEventIfSingleTab()
    if (currentData.tab.actived) {
      currentData.pane._activeTab(currentData.pane.tabs[0])
    }
  }

  return {
    createPane,
    createTab,
    setStageBySelector,
    Pane,
    parseJSON,
    toJSON
  }

})(window.$ || window.jQurey)