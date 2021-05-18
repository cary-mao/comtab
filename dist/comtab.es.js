import t from"lodash";class e{constructor(t,e){this.link(t,e)}dispatch(...t){const e=t[0],s=this[`dispatch${e.getTypeName()}`];Reflect.apply(s,this,t),this.propagation(e,t)}link(t,e){t.bind(this,e),e.bind(this,t),this._model=t,this._view=e}setParent(t){this._parent=t}propagation(t,e){this._parent&&t.isPropagation()&&(t.progagation(),Reflect.apply(this._parent.dispatch,this._parent,[t,...e]))}}class s extends e{dispatchModel(t,e){"activateTab"===e&&(this._model.getState().tabs.forEach((t=>t._model.activate())),t.stopPropagation())}dispatchView(t,...e){throw new Error("Method not implemented.")}}function a(...e){return t.merge.apply(null,e)}function i(t=""){var e,s=16,a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),i=[];for(s=s||a.length,e=0;e<32;e++)i[e]=a[0|Math.random()*s];return t+i.join("")}function n(t,e="div"){return $(`<${e} class="${t}">`)}class r extends class{constructor(t,e=!0){this.type=t+"Event",this._bubble=e,this._isBubble=!1}isType(t){return this.getTypeName()===t}getTypeName(){return t=this.type,e=0,s=-5,t.substring(e,s<0?t.length+s:s);var t,e,s}stopPropagation(){this._bubble=!1}isPropagation(){return this._bubble}progagation(){this._isBubble=!0}isBubble(){return this._isBubble}}{constructor(t){super("Model",t)}}function o(t,e,s){Reflect.apply(t,e,s)}function l(t,e){this._controller=t,this instanceof h?this.linkView(e):this.linkModel(e)}class h{constructor(){this._data=Object.create(null),this.bind=l}linkView(t){this._view=t}}h.prototype.notify=function(...t){o(this._controller.dispatch,this._controller,t)};class c extends h{constructor(t){super(),this._state={id:i("panel"),position:{left:0,top:0},zIndex:0,actived:!1,tabs:[]},a(this._state,t)}activate(){this._state.actived=!0,this.notify(new r,"activateTab")}deactivate(){this._state.actived=!1,this.notify(new r,"deactivateTab")}getState(){return this._state}}class _{constructor(){this.bind=l}linkModel(t){this._model=t}}_.prototype.notify=function(...t){o(this._controller.dispatch,this._controller,t)};var d=function(t){var e=t+"-stage",s=t+"-panel",a=s+"-dropready",i=s+"-group",n=i+"_column",r=t+"-tab",o=r+"_header",l=t+"-absorb",h=l+"-vertical",c=l+"-horizontal",_=function(t){var e={};if(t)for(var s in t)t.hasOwnProperty&&!t.hasOwnProperty(s)||(e[s]={value:t[s],writable:!0,configurable:!0,enumerable:!0});return Object.create(null,e)}({PANE:s,PANE_HANDLE:s+"_handle",PANE_GROUP:i,TAB:r,TAB_HEADER:o,TAB_CONTENT:r+"_content",TAB_BTN:r+"_btn",ABSORB:l,CONTAINER:t+"-container"});for(var d in _)_[d+"_ACTIVE"]=_[d]+"-active";return _.ABSORB_VERTICAL=h,_.ABSORB_HORIZONTAL=c,["top","right","left","bottom"].forEach((function(t){_["ABSORB_"+t.toUpperCase()]=l+"_"+t})),_.PANE_DROP_READY=a,_.PANE_GROUP_COLUMN=n,_.TAB_HEADER_DROP=o+"_droppable",_.STAGE=e,_}("comtab");class p extends _{create(t){this._createElements(),this._$wrapper.append(this._$panelHandle).append(this._$header),t.forEach((t=>{const{btn:e,content:s}=t.getView().getElements();this._$wrapper.append(s),this._$header.append(e)}))}_createElements(){this._$wrapper=n(d.PANE),this._$panelHandle=n(d.PANE_HANDLE),this._$header=n(d.TAB_HEADER)}getElements(){return{wrapper:this._$wrapper,handle:this._$panelHandle,header:this._$header}}}class u{constructor(t){this._model=new c(t),this._view=new p,this._controller=new s(this._model,this._view),this._init()}_init(){const t=this._model.getState();this._view.create(t.tabs),t.tabs.forEach((t=>t._controller.setParent(this._controller)))}}class b extends e{dispatchModel(t,e){}dispatchView(t,e){}}class v extends h{constructor(t){super(),this._state={panels:[],groups:[],stage:"body"},a(this._state,t)}getState(){return this._state}addPanel(t){this._state.panels.push(t),this.notify(new r(!1),"addPanel",t)}deletePanel(e){!function(...e){t.pull.apply(null,e)}(this._state.panels,e),this.notify(new r(!1),"deletePanel",e)}}class w extends _{create(t){this._$wrapper=$(t.stage).addClass(d.STAGE),t.panels.forEach((t=>this.addPanel(t)))}addPanel(t){this._$wrapper.append(t._view.getElements().wrapper)}deletePanel(t){}}class T{constructor(t){this._model=new v(t),this._view=new w,this._controller=new b(this._model,this._view),this._init()}addPanel(t){this._model.addPanel(t)}deletePanel(t){this._model.deletePanel(t)}_init(){const t=this._model.getState();this._view.create(t),t.panels.forEach((t=>t._controller.setParent(this._controller)))}}class E extends e{dispatchModel(t,...e){"activateTab"===e[0]&&this._view.activate()}dispatchView(t,...e){throw new Error("Method not implemented.")}}class g extends h{constructor(t){super(),this._state={btnText:"btn",content:"<p>This is content.<p>",actived:!1},a(this._state,t)}activate(){this._state.actived=!0,this.notify(new r,"activateTab")}deactivate(){this._state.actived=!1,this.notify(new r,"deactivateTab")}getState(){return this._state}}class f extends _{create(t){this._$btn=n(d.TAB_BTN).text(t.btnText),this._$content=$(t.content).addClass(d.TAB_CONTENT),t.actived&&this.activate(),this.bindEvents()}bindEvents(){this._$btn.on("click",(()=>this._model.activate()))}activate(){this._$content.addClass(d.TAB_CONTENT_ACTIVE),this._$btn.addClass(d.TAB_BTN_ACTIVE)}deactive(){this._$content.removeClass(d.TAB_CONTENT_ACTIVE),this._$btn.removeClass(d.TAB_BTN_ACTIVE)}getElements(){return{btn:this._$btn,content:this._$content}}}class m{constructor(t){this._model=new g(t),this._view=new f,this._controller=new E(this._model,this._view),this._init()}_init(){const t=this._model.getState();this._view.create(t)}getView(){return this._view}getModel(){return this._model}}
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
const A=function(e){const s={stage:(e=function(t={}){return a({panels:[],groups:[],stage:"body"},t)}(e)).stage};s.panels=e.panels.map((e=>{const s=(a=e,t.cloneDeep(a));var a;if(e.tabs){const t=e.tabs.filter((t=>t.actived));if(t.length)for(let e=1,s=t.length;e<s;e++)t[e].actived=!1;s.tabs=e.tabs.map((t=>new m(t)))}return new u(s)}));return new T(s)};A.Panel=u,A.PanelStage=T,A.PanelGroup=class{};export default A;