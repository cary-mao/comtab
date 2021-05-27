import t,{pull as e}from"lodash";function s(...e){return t.merge.apply(null,e)}function a(e){return t.cloneDeep(e)}function i(t){return void 0!==t}function n(t){var e={};if(t)for(var s in t)t.hasOwnProperty&&!t.hasOwnProperty(s)||(e[s]={value:t[s],writable:!0,configurable:!0,enumerable:!0});return Object.create(null,e)}function o(t=""){var e,s=16,a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),i=[];for(s=s||a.length,e=0;e<32;e++)i[e]=a[0|Math.random()*s];return t+i.join("")}function l(t,e="div"){return $(`<${e} class="${t}">`)}class r{constructor(t,e=!0){this.type=t+"Event",this._bubble=e,this._isBubble=!1}isType(t){return this.getTypeName()===t}getTypeName(){return t=this.type,e=0,s=-5,t.substring(e,s<0?t.length+s:s);var t,e,s}stopPropagation(){this._bubble=!1}isPropagation(){return this._bubble}progagation(){this._isBubble=!0}isBubble(){return this._isBubble}}class h extends r{constructor(t){super("Model",t)}}const d={task:"init",type:"init",debugger:"development"==={}.NODE},c=new class{constructor(){this.tasks=[],this.currIdx=-1,this.immediate=!1}record(t,e){this.currTask===t?this.tasks[this.tasks.length-1].logs.push(e):(this.immediate&&this.currIdx>=0&&this.log(this.currIdx),this.currTask=t,this.tasks.push({name:t,logs:[e]}),this.currIdx++)}log(t){this.tasks[t].logs.forEach((t=>Reflect.apply(console.log,console,t)))}scopeLog(t=0,e=this.tasks.length){for(;t<e;)console.log(`%c task ${t}: %c ${this.tasks[t].name} `,"color: red; weight: bold","color: blue"),console.log("%c -------------------------- ","color: orange"),this.log(t),console.log("%c -------------------------- ","color: orange"),console.log("\n\n"),t++}};var p=new class extends class{constructor(t){this._value=t,this._initValue=a(t)}set value(t){this._value=t}get value(){return this._value}reset(){this._value=a(this._initValue)}}{setTask(t){this.value.task=t}resetWithoutTask(){const t=this.value.task;this.reset(),this.setTask(t)}}(d);class _{constructor(t,e){this.link(t,e)}dispatch(...t){c.record(p.value.task,[`${t[1]}(${this.constructor.name}): `,t.slice(2)]);const e=t[0],s=this[`dispatch${e.getTypeName()}`];Reflect.apply(s,this,t),this.propagation(e,t.slice(1))}link(t,e){t.bind(this,e),e.bind(this,t),this._model=t,this._view=e}setParent(t){this._parent=t}getParent(){return this._parent}propagation(t,e){this._parent&&t.isPropagation()&&(t.progagation(),Reflect.apply(this._parent.dispatch,this._parent,[t,...e]))}}class b extends _{constructor(t,e,s){super(t,e),this.host=s}dispatchModel(t,e,s){"deactivateTab"!==e?"activateTab"!==e||this._parent?"toggleTabHandleEvent"===e&&(this._view.toggleTabHandleEvent(s),t.stopPropagation()):this._view.activate():this._view.deactivate()}dispatchView(t,...e){throw new Error("Method not implemented.")}}function v(t,e,s){Reflect.apply(t,e,s)}function g(t,e){this._controller=t,this instanceof u?this.linkView(e):this.linkModel(e)}class u{constructor(){this._data=Object.create(null),this.bind=g}linkView(t){this._view=t}}u.prototype.notify=function(...t){v(this._controller.dispatch,this._controller,t)};class T extends u{constructor(t,e){super(),this._state={btnText:"btn",content:"<p>This is content.<p>",actived:!1,_tabHandleEnabled:!1},s(this._state,t),this.host=e}toggleTabHandleEvent(t){this._state._tabHandleEnabled!==t&&(this._state._tabHandleEnabled=t,this.notify(new h(!1),"toggleTabHandleEvent",t))}activate(t=new h){this._state.actived||(this._state.actived=!0,this.notify(t,"activateTab",this))}deactivate(t=new h){this._state.actived=!1,this.notify(t,"deactivateTab")}getState(){return this._state}}var m=function(t){var e=t+"-stage",s=t+"-panel",a=s+"-dropready",i=s+"-group",o=i+"_column",l=t+"-tab",r=l+"_header",h=t+"-absorb",d=h+"-vertical",c=h+"-horizontal",p=n({PANE:s,PANE_HANDLE:s+"_handle",PANE_GROUP:i,TAB:l,TAB_HEADER:r,TAB_CONTENT:l+"_content",TAB_BTN:l+"_btn",ABSORB:h,CONTAINER:t+"-container"});for(var _ in p)p[_+"_ACTIVE"]=p[_]+"-active";return p.ABSORB_VERTICAL=d,p.ABSORB_HORIZONTAL=c,["top","right","left","bottom"].forEach((function(t){p["ABSORB_"+t.toUpperCase()]=h+"_"+t})),p.PANE_DROP_READY=a,p.PANE_GROUP_COLUMN=o,p.TAB_HEADER_DROP=r+"_droppable",p.STAGE=e,p}("comtab");class w{constructor(){this.bind=g}linkModel(t){this._model=t}}w.prototype.notify=function(...t){v(this._controller.dispatch,this._controller,t)};class E extends w{constructor(t){super(),this.events={},this.host=t}toggleTabHandleEvent(t){t?this._$btn.addClass(m.PANE_HANDLE):this._$btn.removeClass(m.PANE_HANDLE)}create(t){t=t||this._model.getState(),this._$btn=l(m.TAB_BTN).text(t.btnText),this._$content=$(t.content).addClass(m.TAB_CONTENT),t.actived&&this.activate(),this.bindEvents()}bindEvents(){this._$btn.on("click",(()=>{p.setTask("activateTab"),this._model.activate()})),this.events.tabSplit=this._$btn.draggable({delay:200,helper:()=>{p.setTask("tmpPanelFromTabDrag");const t=A.copyPanelByTabs(this.host);return p.value.panel=t,p.value.tab=this.host,p.value.type="tmpPanelFromTabDrag",t._view.getElements().wrapper}})}toggleTabSplitEvent(t){t=i(t)?t:this.events.tabSplit.draggable("option","disabled"),this.events.tabSplit,this.events.tabSplit.draggable(t?"enable":"disable")}activate(){this._$content.addClass(m.TAB_CONTENT_ACTIVE),this._$btn.addClass(m.TAB_BTN_ACTIVE)}deactivate(){this._$content.removeClass(m.TAB_CONTENT_ACTIVE),this._$btn.removeClass(m.TAB_BTN_ACTIVE)}getElements(){return{btn:this._$btn,content:this._$content}}remove(){this._$btn.remove(),this._$content.remove()}}class P{constructor(t){this._model=new T(t,this),this._view=new E(this),this._controller=new b(this._model,this._view,this),this._init()}_init(){const t=this._model.getState();this._view.create(t)}getParent(){return this._controller.getParent().host}static copy(t){return new P(t._model.getState())}}class f extends _{constructor(t,e,s){super(t,e),this.host=s}dispatchModel(t,e,s){if("activateTab"===e)this._model.getState().tabs.forEach((t=>{const e=t._model,a=e.getState().actived;s===e?t._view.activate():a&&e.deactivate(new h(!1))})),t.stopPropagation();else if("deleteTab"===e){const e=s.tab;e._view.remove(),e._model.getState().actived&&this._model.getState().tabs[0]._model.activate(),t.stopPropagation()}else"setPanelPosition"===e?(this._view.setPosition(s),t.stopPropagation()):"toggleTabSplitEvent"===e?this._view.setTabSplitEvent(s):"setZIndex"===e?this._view.setZIndex(s):"addTabs"===e&&(s.forEach((t=>{t._controller.setParent(this)})),this._view.addTabs(s),this._model.toggleTabSplitEvent(this._model.getState().tabs.length>1),t.stopPropagation())}dispatchView(t,e,s){if("panelDragStart"===e)p.value.panel=s;else if("insertPanelToTabHeader"===e){const e=p.value.panel;this._parent.host.deletePanel(e),e.state.tabs.forEach((t=>{t._model.deactivate(new h(!1)),t._view.create()})),p.resetWithoutTask(),Reflect.apply(this._model.addTabs,this._model,e.state.tabs),t.stopPropagation()}}getModel(){return this._model}}class y extends u{constructor(t,e){super(),this._state={id:o("panel"),position:{left:0,top:0},zIndex:0,actived:!1,tabs:[],_tabSplitEnabled:!0},s(this._state,t),this.host=e}setZIndex(t){this._state.zIndex=t,this.notify(new h(!1),"setZIndex",t)}setPosition(t){s(this._state.position,t),this.notify(new h(!1),"setPanelPosition",this._state.position)}activate(){this._state.actived=!0,this.notify(new h,"activatePanel",this.host)}deactivate(){this._state.actived=!1,this.notify(new h,"deactivatePanel")}deleteTab(t){e(this._state.tabs,t),this.notify(new h,"deleteTab",{tab:t})}addTabs(...t){this._state.tabs=this._state.tabs.concat(t),this.notify(new h(!1),"addTabs",t)}toggleTabSplitEvent(t){this._state._tabSplitEnabled=i(t)?t:!this._state._tabSplitEnabled,this.notify(new h(!1),"toggleTabSplitEvent",this._state._tabSplitEnabled)}getState(){return this._state}}class S extends r{constructor(t){super("View",t)}}class x extends w{constructor(t){super(),this.events={},this.host=t}refreshTabSplitEvent(){const t=this._model.getState();t.tabs.length<=1&&t._tabSplitEnabled?this._model.toggleTabSplitEvent(!1):t.tabs.length>1&&!t._tabSplitEnabled&&this._model.toggleTabSplitEvent(!0)}addTabs(t){t.forEach((t=>{const{btn:e,content:s}=t._view.getElements();this._$header.append(e),this._$wrapper.append(s)}))}setZIndex(t){this._$wrapper.css("z-index",t)}setTabSplitEvent(t){this._model.getState().tabs.forEach((e=>{e._view.toggleTabSplitEvent(t),this.toggleDragPanelWithTabEvent(e,!t)}))}toggleDragPanelWithTabEvent(t,e){t._model.toggleTabHandleEvent(e)}setPosition(t){this.events.panelDrag=this._$wrapper.css({left:t.left+"px",top:t.top+"px"})}create(){const t=this._model.getState().tabs;this._createElements(),this._$wrapper.append(this._$panelHandle).append(this._$header),t.forEach((t=>{const{btn:e,content:s}=t._view.getElements();this._$wrapper.append(s),this._$header.append(e)})),this.bindEvents()}bindEvents(){this._$wrapper.on("mousedown",(()=>{p.setTask("activatePanel"),this._model.activate()})),this._$wrapper.draggable({handle:"."+m.PANE_HANDLE,start:()=>{p.setTask("panelDragStart"),this.notify(new S(!1),"panelDragStart",this.host)}}),this._$header.droppable({tolerance:"pointer",drop:()=>{"tmpPanelFromTabDrag"!==p.value.type&&(p.setTask("insertPanelToTabHeader"),this.notify(new S,"insertPanelToTabHeader",this.host))}})}_createElements(){this._$wrapper=l(m.PANE),this._$panelHandle=l(m.PANE_HANDLE),this._$header=l(m.TAB_HEADER)}getElements(){return{wrapper:this._$wrapper,handle:this._$panelHandle,header:this._$header}}}class A{constructor(t){this._model=new y(t,this),this._view=new x(this),this._controller=new f(this._model,this._view,this),this._init()}get state(){return this._model.getState()}setZIndex(t){this._model.setZIndex(t)}setPosition(t){this._model.setPosition(t)}_init(){const t=this._model.getState();this._view.create(),t.tabs.forEach((t=>t._controller.setParent(this._controller))),this._view.refreshTabSplitEvent()}deleteTab(t){this._model.deleteTab(t)}static copyPanelByTabs(...t){const e=t.map((t=>{const e=P.copy(t);return e._model.activate(new h(!1)),e}));return new A({tabs:e})}}class I{constructor(){this._panelMap=n(null),this._panelCount=0,this._topZIndex=0}add(t){const e=t.state.id;this._panelMap[e]=t,this._topZIndex=this._panelCount++,t.setZIndex(this._panelCount-1)}remove(t){var e=this._panelMap[t];e&&(this._topZIndex===e.state.zIndex&&this._topZIndex--,delete this._panelMap[t],this._panelCount--)}activate(t){if(t.state.zIndex!==this._topZIndex){for(var e in this._panelMap){var s=this._panelMap[e];s.state.zIndex>t.state.zIndex&&s.setZIndex(s.state.zIndex-1)}t.setZIndex(this._topZIndex)}}}class N extends _{constructor(t,e,s){super(t,e),this.host=s}dispatchModel(t,e,s){"addPanel"===e?(this.host.panelLayer.add(s),s._controller.setParent(this),this._view.addPanel(s)):"deletePanel"===e?(this.host.panelLayer.remove(s),this._view.deletePanel(s)):"activatePanel"===e&&this.host.panelLayer.activate(s)}dispatchView(t,e,s){if("tmpPanelFromTabDrag"===e){p.value.task=e;const t=p.value.tab.getParent();t.deleteTab(p.value.tab),p.value.panel._view.create(),p.value.panel.setPosition(s.offset),t._view.refreshTabSplitEvent(),this._model.addPanel(p.value.panel),p.resetWithoutTask()}}}class k extends u{constructor(t){super(),this._state={panels:[],groups:[],stage:"body"},s(this._state,t)}getState(){return this._state}addPanel(t){this._state.panels.push(t),this.notify(new h(!1),"addPanel",t)}deletePanel(e){!function(...e){t.pull.apply(null,e)}(this._state.panels,e),this.notify(new h(!1),"deletePanel",e)}}class B extends w{create(t){this._$wrapper=$(t.stage).addClass(m.STAGE),t.panels.forEach((t=>this.addPanel(t))),this.bindEvents()}addPanel(t){this._$wrapper.append(t._view.getElements().wrapper)}deletePanel(t){t._view.getElements().wrapper.remove()}bindEvents(){this._$wrapper.droppable({drop:(t,e)=>{"tmpPanelFromTabDrag"===p.value.type&&(p.setTask("tmpPanelFromTabDrag"),this.notify(new S,"tmpPanelFromTabDrag",e))}})}}class D{constructor(t){this.panelLayer=new I,this._model=new k(t),this._view=new B,this._controller=new N(this._model,this._view,this),this._init()}addPanel(t){this._model.addPanel(t)}deletePanel(t){this._model.deletePanel(t)}_init(){const t=this._model.getState();this._view.create(t),t.panels.forEach((t=>{t._controller.setParent(this._controller),this.panelLayer.add(t)}))}}
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
const C=function(t){const e={stage:(t=function(t={}){return s({panels:[],groups:[],stage:"body"},t)}(t)).stage};e.panels=t.panels.map((t=>{const e=a(t);if(t.tabs){const s=t.tabs.filter((t=>t.actived));if(s.length)for(let t=1,e=s.length;t<e;t++)s[t].actived=!1;e.tabs=t.tabs.map((t=>new P(t)))}return new A(e)}));return new D(e)};C.Panel=A,C.PanelStage=D,C.PanelGroup=class{},C.logger=c;export default C;
