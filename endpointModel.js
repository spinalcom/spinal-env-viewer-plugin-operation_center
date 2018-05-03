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

export class endpointTimeSeries extends globalType.Model {
  constructor(name = "Endpoint Time Series") {
    super();
    this.add_attr({
      time: [], // timestamp list
      value: [] // value
    });
  }
}

export class endpoint extends globalType.Model {
  constructor(name = "Endpoint") {
    super();
    var timeSeries = new endpointTimeSeries();
    this.add_attr({
      display: true,
      onOff: false,
      id: "",
      title: "",
      color: "",
      username: "",
      date: Date.now(),
      currentValue: 0,
      timeSerie: new Ptr(timeSeries),
      items: []
    });
  }

  addItems(input) {
    // input is a list of items to add
    input.forEach(i => {
      if (this.items.indexOf(i) === -1) {
        this.items.push(i);
      }
    });
  }

  removeItems(input) {
    // input is a list of items to be removed
    var removedItems = [];
    for (var i = 0; i < input.length; ++i) {
      var index = this.items.indexOf(input[i]);
      if (index !== -1) {
        removedItems.push(this.items[index].get());
        this.items.splice(index, 1);
      }
    }
    return removedItems;
  }

  setDisplay(display) {
    this.display.set(display);
  }

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
    let min = 50;
    let max = 70;
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
    // console.log("newcolor", newcolor);
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
