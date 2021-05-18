import { _createPureObject } from "./utils"

interface CLASSES_LIST {
  TAB: string;
  TAB_HEADER: string;
  TAB_BTN: string;
  TAB_CONTENT: string;
  TAB_ACTIVE: string;
  TAB_HEADER_ACTIVE: string;
  TAB_BTN_ACTIVE: string;
  TAB_CONTENT_ACTIVE: string;
  PANE: string;
  PANE_HANDLE: string;
  PANE_GROUP: string;
  PANE_ACTIVE: string;
  PANEL_HANDLE_ACTIVE: string;
  PANE_GROUP_ACTIVE: string;
  STAGE: string;
}

function _createCLASSES(prefix): CLASSES_LIST {
  var stage = prefix + '-stage'
  var panel = prefix + '-panel'
  var panelHandle = panel + '_handle'
  var panelDropReady = panel + '-dropready'
  var panelGroup = panel + '-group'
  var panelGroupColumn = panelGroup + '_column'
  var tab = prefix + '-tab'
  var tabHeader = tab + '_header'
  var tabContent = tab + '_content'
  var tabBtn = tab + '_btn'
  var absorb = prefix + '-absorb'
  var absorbVertical = absorb + '-vertical'
  var absorbHorizontal = absorb + '-horizontal'
  var container = prefix + '-container'
  var CLASSES = _createPureObject({
    PANE: panel,
    PANE_HANDLE: panelHandle,
    PANE_GROUP: panelGroup,
    TAB: tab,
    TAB_HEADER: tabHeader,
    TAB_CONTENT: tabContent,
    TAB_BTN: tabBtn,
    ABSORB: absorb,
    CONTAINER: container
  })
  for (var k in CLASSES) {
    CLASSES[k + '_ACTIVE'] = CLASSES[k] + '-active'
  }
  CLASSES.ABSORB_VERTICAL = absorbVertical
  CLASSES.ABSORB_HORIZONTAL = absorbHorizontal
    ;['top', 'right', 'left', 'bottom'].forEach(function (direction) {
      CLASSES['ABSORB_' + direction.toUpperCase()] = absorb + '_' + direction
    })
  CLASSES.PANE_DROP_READY = panelDropReady
  CLASSES.PANE_GROUP_COLUMN = panelGroupColumn
  CLASSES.TAB_HEADER_DROP = tabHeader + '_droppable'
  CLASSES.STAGE = stage

  return CLASSES
}

export default _createCLASSES('comtab');
