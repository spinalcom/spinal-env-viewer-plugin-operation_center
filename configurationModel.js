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
      display: true
    });
  }

  incrementId() {
    this.id.set(this.id.get() + 1);
    return this.id.get();
  }

  createChild() {
    let parentTitle = this.title.get();
    let child = new ConfigurationNode(this);
    child.setTitle(parentTitle + "-" + this.incrementId().toString());
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
}
