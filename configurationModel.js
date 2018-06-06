import EventBus from "./EventBus.vue";

// Copyright 2015 SpinalCom  www.spinalcom.com

// This file is part of SpinalCore.

// SpinalCore is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Soda is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with Soda. If not, see <http://www.gnu.org/licenses/>.

const spinalCore = require("spinal-core-connectorjs");
const BIMForge = require("spinal-models-bim_forge");
const globalType = typeof window === "undefined" ? global : window;

export class BasicConfigurationNode extends globalType.Model {
  constructor() {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: 0,
        title: "",
        children: [],
        display: false,
        type: "",
        BIMGroup: new SpinalBIMGroupOC(this),
        special: false
      });
    }

    // console.error("constructor", this.BIMGroup)
  }

  incrementId() {
    this.id.set(this.id.get() + 1);
    return this.id.get();
  }

  createChild(_type) {
    let child = new ConfigurationNode(this);
    // console.log("type", _type);
    if (_type === "zone") {
      let parentTitle = this.title.get();
      child.setTitle(parentTitle + "-" + this.incrementId().toString());
      child.type.set(_type);
    } else if (_type === "equip") {
      child.setTitle("equip" + "-" + this.incrementId().toString());
      child.type.set(_type);
    }
    this.addChild(child);
  }

  addChild(child) {
    this.children.push(child);
    return child;
  }

  addChildren(children) {
    for (let i = 0; i < children.length; i++) {
      this.children.push(children[i]);
    }
  }

  getChildren() {
    return this.children.get();
  }

  getTitle() {
    return this.title.get();
  }

  setTitle(title) {
    this.title.set(title);
  }

  removeChildren() {
    this.children.set(null);
  }

  isLeaf() {
    if (this.children.length == 0) return true;
    else return false;
  }

  isRoot() {
    if (this.parent) return false;
    else return true;
  }

  isEquipement() {
    return this.type.get() === "equip";
  }

  getEquipements() {
    let equipementsArray = [];
    for (let i = 0; i < this.children.length; i++) {
      const equip = this.children[i];
      // console.log("recur", equip.type.get());
      // console.log(equipementsArray);
      // console.log(equip.isEquipement());
      if (equip.isEquipement())
        equipementsArray = equipementsArray.concat(equip);
      else equipementsArray = equipementsArray.concat(equip.getEquipements());
    }
    return equipementsArray;
  }

  getAllBIMGroups() {
    let res = [];
    res.push(this.BIMGroup);
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      res = res.concat(child.getAllBIMGroups());
    }
    return res;
  }

  test() {
    console.log(this)
  }

  getItems() {
    let t = [];
    t = t.concat(this.BIMGroup.arrayOfId());
    for (let i = 0; i < this.children.length; i++) {
      const element = this.children[i];
      let childItems = element.getItems();
      for (let i = 0; i < childItems.length; i++) {
        const element = childItems[i];
        if (t.indexOf(element) === -1) t.push(element);
      }
    }
    return t;
  }
}

export class ConfigurationRoot extends BasicConfigurationNode {
  constructor() {
    super();
  }
}

export class ConfigurationNode extends BasicConfigurationNode {
  constructor(newParent) {
    super();
    this.add_attr({
      parent: newParent
    });
  }

  setParent(parent) {
    // this.mod_attr("parent", parent);
    this.parent.set(parent);
  }

  getParent() {
    return this.parent.get();
  }

  removeParent() {
    this.parent.set(null);
  }

  remove() {
    this.parent.children.remove(this);
    delete FileSystem._objects[this._server_id];
  }
}

export class Forest extends globalType.Model {
  constructor() {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        list: new Lst(),
        id: 0
      });
    }
  }

  incrementId() {
    this.id.set(this.id.get() + 1);
    return this.id.get();
  }

  addTree(title) {
    var tree = new ConfigurationRoot();
    tree.setTitle(title + " " + this.incrementId().toString());
    this.list.push(tree);
  }

  removeTree(root) {
    this.list.remove(root);
    delete FileSystem._objects[root._server_id];
  }

  getEquipements() {
    let equipementsArray = [];
    for (let i = 0; i < this.list.length; i++) {
      const tree = this.list[i];
      // console.log(equipementsArray);
      equipementsArray = equipementsArray.concat(tree.getEquipements());
    }
    return equipementsArray;
  }

  getAllBIMGroups() {
    let res = [];
    for (let i = 0; i < this.list.length; i++) {
      const tree = this.list[i];
      // console.log(equipementsArray);
      res = res.concat(tree.getAllBIMGroups());
    }
    return res;
  }
}

export class ConfigurationModel extends globalType.Model {
  constructor() {
    super();
    this.add_attr({
      zoneForest: new Forest(),
      networkForest: new Forest()
    });
  }
}

var SpinalBIMGroupOCId = 0;
export class SpinalBIMGroupOC extends BIMForge.SpinalBIMGroupForge {
  constructor(_parent, name = "SpinalBIMGroupOC") {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        id: SpinalBIMGroupOCId++,
        currentValue: 0,
        timeSeries: [],
        parent: _parent,
      });
      this.populateTimeSeries();
      this.display.set(true);
    }
  }

  // initialize() {
  //   let max = 30;
  //   for (let index = 0; index < 30; index++) {
  //     const element = timeSeries[index];


  //   }
  // }

  populateTimeSeries() {
    // console.log("test")
    let max = 30;
    let intervalle = 2;
    // setInterval(() => {
    // console.log(this, this.timeSeries.get())
    if (this.timeSeries.length >= max) {
      this.timeSeries.shift();
      this.timeSeries.push(this.currentValue.get())

    } else {
      this.timeSeries.push(this.currentValue.get())
    }
    // }, intervalle * 1000);
  }

  contains(itemId) {
    return this.arrayOfId().indexOf(itemId) !== -1;
  }

  addItem(itemId) {
    if (!this.contains(itemId)) {
      let newBIMObject = new SpinalBIMObjectOC(itemId, this.id.get());
      newBIMObject.fillInfo().then(() => {
        this.BIMObjects.push(newBIMObject);
      });
    }
  }



  addItems(input) {
    // input is a list of BIMObjects to add
    input.forEach(i => {
      if (this.BIMObjects.indexOf(i) === -1) {
        this.BIMObjects.push(i);
      }
    });
  }

  removeItems(input) {
    // input is a list of BIMObjects to be removed
    var removedItems = [];
    for (var i = 0; i < input.length; ++i) {
      var index = this.BIMObjects.indexOf(input[i]);
      if (index !== -1) {
        removedItems.push(this.BIMObjects[index].get());
        this.BIMObjects.splice(index, 1);
      }
    }
    return removedItems;
  }

  // setDisplay(display) {
  //   this.display.set(display);
  // }

  arrayOfId() {
    let t = [];
    for (let i = 0; i < this.BIMObjects.length; i++) {
      const item = this.BIMObjects[i];
      t.push(item.id.get());
    }
    return t;
  }

  isolate() {
    globalType.v.isolateById(this.arrayOfId());

    // globalType.v.getObjectTree(function(objTree) {
    //   console.log(objTree);

    // });

    // objTree.enumNodeChildren(
    //   objTree.getRootId(),
    //   function(dbId) {
    //     // Work with dbId
    //   },
    //   true
    // );
  }

  // colorByValue() {
  //   let min = 30;
  //   let max = 90;
  //   var lin = this.linMapValue(this.currentValue.get(), min, max);
  //   // console.log("lin", lin);

  //   function componentToHex(c) {
  //     var hex = c.toString(16);
  //     return hex.length == 1 ? "0" + hex : hex;
  //   }

  //   function rgbToHex(r, g, b) {
  //     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  //   }

  //   var newcolor = rgbToHex(
  //     Math.floor(lin * 255),
  //     0,
  //     Math.floor((1 - lin) * 255)
  //   );
  //   this.color.set(newcolor);
  // }

  colorByValue() {
    let min = 30;
    let max = 90;
    var lin = this.linMapValue(this.currentValue.get(), min, max);
    // console.log("lin", lin);

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    var newcolor = rgbToHex(
      Math.floor(lin * 255),
      0,
      Math.floor((1 - lin) * 255)
    );
    this.color.set(newcolor);
  }

  colorByValue1() {
    // var R = [];
    // var G = [];
    // var B = [];
    var R;
    var G;
    var B;
    // let elements = 128;
    let dx = 0.8;

    // for (let i = 0; i < elements; i++) {
    //   R[i] = 0;
    //   G[i] = 0;
    //   B[i] = 0;
    // }
    let min = 40;
    let max = 90;
    var lin = this.linMapValue(this.currentValue.get(), min, max);
    // console.log("lin", lin);
    var g = (6 - 2 * dx) * lin + dx;
    // console.log("g", g);
    // for (let i = 0; i < elements; i++) {
    //   g = (6 - 2 * dx) * f + dx;
    //   index = int16(f * 128 + 1);
    //   R[i] = max(0, (3 - Math.abs(g - 4) - Math.abs(g - 5)) / 2);
    //   G[i] = max(0, (4 - Math.abs(g - 2) - Math.abs(g - 4)) / 2);
    //   B[i] = max(0, (3 - Math.abs(g - 1) - Math.abs(g - 2)) / 2);
    R = Math.max(0, (3 - Math.abs(g - 4) - Math.abs(g - 5)) / 2);

    G = Math.max(0, (4 - Math.abs(g - 2) - Math.abs(g - 4)) / 2);
    B = Math.max(0, (3 - Math.abs(g - 1) - Math.abs(g - 2)) / 2);
    //   // } f=0:(1/128):1
    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);
    // console.log("R", R);
    // console.log("G", G);
    // console.log("B", B);
    // }

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    var newcolor = rgbToHex(R, G, B);
    this.color.set(newcolor);
  }

  VBColorToHEX(i) {
    var bbggrr = ("000000" + i.toString(16)).slice(-6);
    var rrggbb =
      bbggrr.substr(4, 2) + bbggrr.substr(2, 2) + bbggrr.substr(0, 2);
    return "#" + rrggbb;
  }

  linMap(list) {
    (mx = max(list)), (mn = min(list));
    return [((x - mn) / (mx - mn)) | (x < -list)];
  }

  linMapValue(value, min, max) {
    return (value - min) / (max - min);
  }

  max(list) {
    var max = list[0];
    for (let i = 1; i < list.length; i++) {
      if (list[i] > max) max = list[i];
    }
    return max;
  }

  min(list) {
    var min = list[0];
    for (let i = 1; i < list.length; i++) {
      if (list[i] < max) min = list[i];
    }
    return min;
  }
}

export class SpinalBIMObjectOC extends BIMForge.SpinalBIMObjectForge {
  constructor(itemId, groupId, name = "SpinalBIMObjectOC") {
    super();
    if (FileSystem._sig_server) {
      this.add_attr({
        groupId: groupId
      });
      this.id.set(itemId);
      this.display.set(true);
    }
  }

  // setDisplay(display) {
  //   this.display.set(display);
  // }

  // getDisplay() {
  //   this.display.get();
  // }

  // setColor(color) {
  //   this.color.set(color);
  // }

  fillInfo() {
    return new Promise((resolve, reject) => {
      globalType.v.getProperties(this.id.get(), r => {
        this.name.set(r.name);
        resolve();
      });
    });
  }

  // getTitle(){

  // }
}

spinalCore.register_models([BasicConfigurationNode,
  Forest,
  ConfigurationModel,
  ConfigurationNode,
  ConfigurationRoot,
  SpinalBIMObjectOC,
  SpinalBIMGroupOC
])