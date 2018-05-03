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

let globalType = window ? window : global;
export class BasicConfigurationNode extends globalType.Model {
  constructor() {
    super();
    this.add_attr({
      id: 0,
      title: "",
      children: [],
      display: false,
      type: ""
    });
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
    this.add_attr({
      list: new Lst(),
      id: 0
    });
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
