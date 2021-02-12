// required @types/jquery
type $ = JQuery;

interface PaneDomMap {
  pane: $;
  paneHandle: $;
  tabHeader: $;
}

interface Tab {
  btn: $;
  content: $;
  actived: boolean;
}

interface PaneOptions {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface Position {
  left: number;
  top: number;
}

class Pane {
  static createPaneByDomMap(paneDomMap: PaneDomMap, tabs: Array<Tab>): Pane;
  constructor(tabs: Array<Tab>, options: PaneOptions);
  mount(): Pane;
  setPosition(position: Position): Pane;
}

interface Comtab {
  createPane(tabs: Array<Tab>, options?: PaneOptions): Pane;
  createTab(btn: $, content: $, actived?: boolean): Tab;
}

declare var comtab:Comtab;