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

export class BasicConfigurationNode extends window.Model {
  constructor() {
    super();
    this.add_attr({
      title: "",
      children: []
    });
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

export class ConfigurationRoot extends BasicConfigurationNode {
  constructor() {
    super();
  }
}

export class Forest extends window.Model {
  constructor() {
    super();
    this.add_attr({
      list: new Lst(),
      id: 0
    });
  }

  addTree(title) {
    var tree = new ConfigurationRoot();
    tree.setTitle(title);
    this.list.push(tree);
  }
}

// export default class Zone extends Node {

//   constructor(data) {
//     super();
//     this.parent = null;
//     this.title = '';
//     this.children = [];
//   };

//   addChild(child) {
//     child.setParent(this);
//     this.children.push(child);
//     return child;
//   }

//   addChildren(children) {
//     children.forEach(child => {
//       child.setParent(this);
//       this.children.push(child);
//     });
//   }

//   getChildren() {
//     return this.children;
//   }

//   getTitle() {
//     return this.title;
//   }

//   setTitle(title) {
//     this.title = title;
//   }

//   setParent(parent) {
//     this.parent = parent;
//   }

//   getParent() {
//     return this.parent
//   }

//   isRoot() {
//     return (this.parent === null);
//   }

//   isLeaf() {
//     if (this.children.size() == 0)
//       return true;
//     else
//       return false;
//   }

//   removeParent() {
//     this.parent = null;
//   }

//   removeChildren() {
//     this.parent = null;
//   }

// }
