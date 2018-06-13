<script>
import Vue from "vue";
import zoneForest from "./physical_zones/zoneForest.vue";
import chart from "./assets/utilities/chart.vue";
const ComponentCtor1 = Vue.extend(zoneForest);
const ComponentCtor2 = Vue.extend(chart);
const ClassName = "Configuration";

const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;

const PanelTitle1 = "configuration-zone";
const ButtonLabel1 = "configuration-zone";
const ButtonIcon1 = "settings";
// configuration-network
const PanelTitle2 = "Time-Series";
const ButtonLabel2 = "Time-Series";
const ButtonIcon2 = "perm_data_setting";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.panel2 = null;
    this.relOptions = null;
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
    this.panel1 = new PanelClass(this.viewer, PanelTitle1);
    this.panel1.container.style.height = "calc(80vh)";
    var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    button1.onClick = e => {
      if (!this.panel1.isVisible()) {
        this.panel1.setVisible(true);
        if (this.relOptions != null) this.relOptions.button1Active.set(true);
      } else {
        this.panel1.setVisible(false);
        if (this.relOptions != null) this.relOptions.button1Active.set(false);
      }
    };
    button1.container.style.color = "red";
    var icon = button1.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon1;
    button1.setToolTip(ButtonLabel1);

    this.panel2 = new PanelClass(this.viewer, PanelTitle2);
    this.panel2.container.style.left = "600px";
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
    this.subToolbar.addControl(button1);
    this.subToolbar.addClass("bkcolor");
    this.subToolbar.addControl(button2);
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
            model.relForestOptions.load(relFO => {
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
