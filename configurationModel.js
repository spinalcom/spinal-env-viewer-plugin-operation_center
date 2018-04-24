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



export default class Node {

  constructor(data) {
    this.parent = null;
    this.title = '';
    this.children = [];
  };

  addChild(child) {
    child.setParent(this);
    this.children.push(child);
    return child;
  }

  addChildren(children) {
    children.forEach(child => {
      child.setParent(this);
      this.children.push(child);
    });
  }

  getChildren() {
    return this.children;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  setParent(parent) {
    this.parent = parent;
  }

  getParent() {
    return this.parent
  }

  isRoot() {
    return (this.parent === null);
  }

  isLeaf() {
    if (this.children.size() == 0)
      return true;
    else
      return false;
  }

  removeParent() {
    this.parent = null;
  }

  removeChildren() {
    this.parent = null;
  }

}