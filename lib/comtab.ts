/**
 * A library for creating panels like PhotoShop.
 * 
 * Support ES5 browsers and above (ie10+, edge12+, chrome23+, safari6+, opeara15+)
 * For more compatibility details, see https://www.caniuse.com/es5
 * 
 * @author cary-mao
 * @license MIT
 * @copyright cary-mao 2021
 * @email 773099867@qq.com
 */
import Panel from "./panel/Panel";
import PanelGroup from "./group/PanelGroup";
import PanelStage from "./stage/PanelStage";
import {cloneDeep, merge} from './utils';
import { PanelOptions } from './panel/PanelModel';
import { PanelStageOptions } from "./stage/PanelStageModel";
import { PanelTabOptions } from "./tab/PanelTabModel";
import PanelTab from "./tab/PanelTab";
import './styles/comtab.css';
import Logger from "./mvc/logger";
import { logger } from "./share";
import { PanelGroupOptions } from "./group/PanelGroupModel";

// @ts-ignore
export interface ComtabPanelOptions extends PanelOptions {
  tabs?: Array<PanelTabOptions>;
}

// @ts-ignore
export interface ComtabGroupOptions extends PanelGroupOptions {
  matrix?: Array<Array<ComtabPanelOptions>>;
}

export interface ComtabStateOptions {
  stage?: string | HTMLElement;
  panels?: Array<ComtabPanelOptions>;
  groups?: Array<ComtabGroupOptions>;
}

interface Comtab {
  /**
   * render by json data
   */
  (state: ComtabStateOptions): PanelStage;
  /**
   * @contrustor
   */
  Panel: Function;
  /**
   * @contrustor
   */
  PanelStage: Function;
  /**
   * @contrustor
   */
  PanelGroup: Function;
  /**
   * logger for debugger
   */
  logger: Logger;
}

const comtab: Comtab = function render (stateOptions: ComtabStateOptions): PanelStage {
  stateOptions = initialStateOpts(stateOptions);
  const panelStageOptions: PanelStageOptions = { stage: stateOptions.stage };
  panelStageOptions.panels = stateOptions.panels.map(p => decodePanelOptions(p));
  panelStageOptions.groups = stateOptions.groups.map(g => decodeGroupOptions(g));
  const stage = new PanelStage(panelStageOptions);
  return stage;
};

function decodeGroupOptions (g: ComtabGroupOptions) {
  const matrix = g.matrix.map(r => {
    return r.map(c => decodePanelOptions(c));
  });

  return new PanelGroup({
    matrix,
    position: g.position,
    autoPos: g.autoPos
  });
}

function decodePanelOptions (p: ComtabPanelOptions) {
  const r = cloneDeep(p) as PanelOptions;
  if (p.tabs) {
    const activedTabs = p.tabs.filter(t => t.actived);
    if (activedTabs.length) {
      for (let i = 1, len = activedTabs.length; i < len; i++) {
        activedTabs[i].actived = false;
      }
    }
    r.tabs = p.tabs.map(t => new PanelTab(t));
  }
  return new Panel(r);
}

comtab.Panel = Panel;
comtab.PanelStage = PanelStage;
comtab.PanelGroup = PanelGroup;
comtab.logger = logger;

export default comtab;

function initialStateOpts (stateOptions: ComtabStateOptions = {}) {
  return merge({
    panels: [],
    groups: [],
    stage: 'body'
  }, stateOptions);
}

