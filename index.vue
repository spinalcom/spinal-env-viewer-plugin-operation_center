<script>
import Vue from "vue";
import zoneForest from "./zoneForest.vue";
import networkForest from "./networkForest.vue";
const ComponentCtor1 = Vue.extend(zoneForest);
const ComponentCtor2 = Vue.extend(networkForest);
const ClassName = "Configuration";

const PanelTitle1 = "configuration-zone";
const ButtonLabel1 = "configuration-zone";
const ButtonIcon1 = "settings";

const PanelTitle2 = "configuration-network";
const ButtonLabel2 = "configuration-network";
const ButtonIcon2 = "perm_data_setting";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.panel2 = null;
  }
  load() {
    if (this.viewer.toolbar) {
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
    var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    button1.onClick = e => {
      if (!this.panel1.isVisible()) {
        this.panel1.setVisible(true);
      } else {
        this.panel1.setVisible(false);
      }
    };
    var icon = button1.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon1;
    button1.setToolTip(ButtonLabel1);

    this.panel2 = new PanelClass(this.viewer, PanelTitle2);
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
};
export default new class {
  constructor() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      ClassName,
      classExtention
    ); // this is the register of your class
    window.ForgeExtentionManager.addExtention(ClassName);
  }
}();
</script>