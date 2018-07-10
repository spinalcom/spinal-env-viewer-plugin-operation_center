<script>
import Vue from "vue";
// import { PanelManager } from "spinal-models-operation_center";

import zoneManager from "./physical_zones/zoneManager.vue";
import networkManager from "./network/networkManager.vue";
import EventBus from "./assets/utilities/EventBus.vue";
// import panelButton from "./panelButton.vue";
const ComponentCtor1 = Vue.extend(zoneManager);
const ComponentCtor2 = Vue.extend(networkManager);
const ClassName = "Configuration";

const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;

const PanelTitle1 = "zone manager";
const ButtonLabel1 = "Operation Center";
const ButtonIcon1 = "perm_data_setting";
// configuration-network
const PanelTitle2 = "network manager";
const ButtonLabel2 = "network manager";
const ButtonIcon2 = "perm_data_setting";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.panel2 = null;
    this.relOptions = null;
    this.show = false;
    this.show2 = false;
  }
  load() {
    if (this.viewer.toolbar) {
      this.linkToDB();
      this.createUI();
    } else {
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(
        av.TOOLBAR_CREATED_EVENT,
        this.onToolbarCreatedBinded
      );
    }

    // setInterval(() => {
    //   EventBus.$emit("testtry", this);
    // }, 500);

    return true;
  }
  onToolbarCreated() {
    this.viewer.removeEventListener(
      av.TOOLBAR_CREATED_EVENT,
      this.onToolbarCreatedBinded
    );
    this.onToolbarCreatedBinded = null;
    this.createUI();
  }
  unload() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  }
  // This function is to create your button on viewer, it used autodesk forge api
  createUI() {
    // let panelManager = new PanelManager(this.viewer, panelButton);
    // globalType.spinal.panelManager = panelManager;

    this.panel1 = new PanelClass(this.viewer, PanelTitle1);
    globalType.spinal.panelManager.registerPanel(
      this.panel1,
      "operationCenter"
    );
    // globalType.spinal.panelManager.registerPanel(this.panel1, "test");
    // this.panel1.container.style.height = "calc(80vh)";
    // this.panel1.container.style.minHeight = "35px";
    // this.panel1.container.style.height = "0px";
    // this.panel1.container.style.left = "0px";

    // this.panel1.container.style.top = "0px";

    // this.panel1.title.onclick = () => {
    //   if (this.show) {
    //     this.show = false;
    //     this.panel1.container.style.minHeight = "35px";
    //     this.panel1.container.style.height = "0px";
    //     if (this.panel2.container.style.left < "200px")
    //       this.panel2.container.style.top = "35px";
    //   } else {
    //     this.show = true;

    //     this.panel1.container.style.minHeight = "35px";
    //     this.panel1.container.style.height = "200px";
    //     if (this.panel2.container.style.left < "200px")
    //       this.panel2.container.style.top = "200px";
    //   }

    //   EventBus.$emit("showPanelContent", this.show);
    // };
    // this.panel1.container.style.height = "0 px";
    // this.panel1.container.style.minHeight = "0 px";

    var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    globalType.spinal.panelManager.registerButton(button1, "operationCenter");

    // button1.onClick = e => {
    //   if (!this.panel1.isVisible()) {
    //     this.panel1.setVisible(true);
    //     if (this.relOptions != null) this.relOptions.button1Active.set(true);
    //   } else {
    //     this.panel1.setVisible(false);
    //     if (this.relOptions != null) this.relOptions.button1Active.set(false);
    //   }
    // };
    button1.container.style.color = "red";
    var icon = button1.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon1;
    button1.setToolTip(ButtonLabel1);

    this.panel2 = new PanelClass(this.viewer, PanelTitle2);

    globalType.spinal.panelManager.registerPanel(
      this.panel2,
      "operationCenter"
    );

    // this.panel2.container.style.left = "calc(100vw - 68%)";
    // this.panel2.container.style.left = "0px";
    // this.panel2.container.style.top = "35px";
    // this.panel2.title.onclick = () => {
    //   if (this.show2) {
    //     this.show2 = false;
    //     this.panel2.container.style.minHeight = "35px";
    //     this.panel2.container.style.height = "0px";
    //   } else {
    //     this.show2 = true;
    //     this.panel2.container.style.minHeight = "35px";
    //     this.panel2.container.style.height = "200px";
    //   }

    //   EventBus.$emit("show2PanelContent", this.show2);
    // };
    var button2 = new Autodesk.Viewing.UI.Button(ButtonLabel2);

    button2.onClick = e => {
      if (!this.panel2.isVisible()) {
        this.panel2.setVisible(true);
      } else {
        this.panel2.setVisible(false);
      }
    };
    var icon = button2.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon2;
    button2.setToolTip(ButtonLabel2);

    this.subToolbar = this.viewer.toolbar.getControl("spinalcom");
    if (!this.subToolbar) {
      this.subToolbar = new Autodesk.Viewing.UI.ControlGroup("spinalcom");
      this.viewer.toolbar.addControl(this.subToolbar);
    }
    // this.subToolbar.addControl(button1);
    this.subToolbar.addClass("bkcolor");
    // this.subToolbar.addControl(button2);
    this.initialize();
  }
  initialize() {
    var _container1 = document.createElement("div");
    _container1.className = this.panel1.container.id + "-pannelcontainer";
    _container1.style.height = "calc(100% - 45px)";
    _container1.style.overflowY = "auto";
    this.panel1.container.appendChild(_container1);
    new ComponentCtor1().$mount(_container1);

    var _container2 = document.createElement("div");
    _container2.className = this.panel2.container.id + "-pannelcontainer";
    _container2.style.height = "calc(100% - 45px)";
    _container2.style.overflowY = "auto";
    this.panel2.container.appendChild(_container2);
    new ComponentCtor2().$mount(_container2);
  }
  linkToDB() {
    spinalSystem.getModel().then(forgefile => {
      if (forgefile) {
        if (forgefile.operationCenter) {
          forgefile.operationCenter.load(model => {
            model.relForestOptionsZone.load(relFO => {
              relFO.options.load(opt => {
                this.relOptions = opt;
                if (typeof this.relOptions.button1Active === "undefined") {
                  this.relOptions.add_attr({ button1Active: false });
                }
                this.relOptions.button1Active.set(false);
              });
            });
          });
        }
      }
    });
  }
};
export default new class {
  constructor() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      ClassName,
      classExtention
    ); // this is the register of your class
    window.spinal.ForgeExtentionManager.addExtention(ClassName);
  }
}();
</script>


<style>
.bkcolor {
  background-color: rgba(17, 48, 223, 0.644);
}
</style>
import PanelManager from "./PanelManager"
import panel from "./panel.vue";

const globalType = typeof window === "undefined" ? global : window;
let viewer = globalType.v;
let panelManager = new PanelManager(viewer, panel);
globalType.spinal.panelManager = panelManager;

