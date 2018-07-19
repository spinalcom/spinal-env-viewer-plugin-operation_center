(function() {
  var endpointModel = require("./endpointModel");
  // const spinalcore = require("spinal-core-connectorjs");
  angular.module("app.spinalforge.plugin").controller("endpointCtrl", [
    "$scope",
    "$rootScope",
    "$mdToast",
    "$mdDialog",
    "authService",
    "$compile",
    "$injector",
    "layout_uid",
    "spinalModelDictionary",
    "ngSpinalCore",
    function(
      $scope,
      $rootScope,
      $mdToast,
      $mdDialog,
      authService,
      $compile,
      $injector,
      layout_uid,
      spinalModelDictionary,
      ngSpinalCore
    ) {
      $scope.viewer = v;
      $scope.listOfEndpoints = new Lst();
      $scope.valuesOfEndpoints = [];
      $scope.coloringType = 0;
      $scope.display = true;

      spinalModelDictionary.init().then(
        m => {
          if (m) {
            if (m.endpointPlugin) {
              m.endpointPlugin.load(mod => {
                $scope.listOfEndpoints = mod;
                $scope.listOfEndpoints.bind($scope.onModelChange);
              });
            } else {
              $scope.listOfEndpoints = new Lst();
              m.add_attr({
                endpointPlugin: new Ptr($scope.listOfEndpoints)
              });
              $scope.listOfEndpoints.bind($scope.onModelChange);
            }
            // if (m.SNMPModel) {
            //   m.SNMPModel.load(mod => {
            //     $scope.valuesOfEndpoints = mod;
            //     $scope.valuesOfEndpoints.bind($scope.onDataChange);
            //   });
            // }
          }
        },
        function() {
          console.log("model unreachable");
        }
      );

      $scope.onModelChange = function() {
        for (let i = 0; i < $scope.listOfEndpoints.length; i++) {
          if ($scope.listOfEndpoints[i].has_been_modified)
            $scope.refresh($scope.listOfEndpoints[i]);
        }
        $scope.$apply();
      };

      $scope.onDataChange = function() {
        $scope.listOfEndpoints[0].currentValue.set(
          $scope.valuesOfEndpoints.temperature[0].get() / 1000
        );
        console.log($scope.listOfEndpoints[0].currentValue.get());
      };

      $scope.activateData = function() {
        ngSpinalCore.load("SNMPModel").then(m => {
          console.log(m.temperature.get());
          // m.bind($scope.onDataChange);
          $scope.valuesOfEndpoints = m;
          // $scope.listOfEndpoints.bind($scope.onDataChange);
          $scope.valuesOfEndpoints.bind($scope.onDataChange);
        });
      };

      $scope.getValue = function() {
        $mdDialog
          .show(
            $mdDialog
            .prompt()
            .title("value")
            .placeholder("Please enter the Name")
            .ariaLabel("Add Theme")
            .clickOutsideToClose(true)
            .required(true)
            .ok("Confirm")
            .cancel("Cancel")
          )
          .then(
            function(result) {
              $scope.listOfEndpoints[0].currentValue.set(result);
            },
            () => {}
          );
      };

      $scope.refresh = function(endpoint) {
        if (endpoint.display.get()) {
          endpoint.colorByValue1();
          setColors(endpoint, endpoint.color.get());
        }
      };

      $scope.refreshAll = function() {
        for (let i = 0; i < $scope.listOfEndpoints.length; i++) {
          if ($scope.listOfEndpoints[i].has_been_modified)
            $scope.refresh($scope.listOfEndpoints[i]);
        }
      };

      $scope.getSelected = function() {
        var selected = $scope.viewer.getSelection();
        return selected;
      };

      $scope.OnCreateEndpoint = () => {
        $mdDialog
          .show(
            $mdDialog
            .prompt()
            .title("add Endpoint")
            .placeholder("Please enter the Name")
            .ariaLabel("Add Theme")
            .clickOutsideToClose(true)
            .required(true)
            .ok("Confirm")
            .cancel("Cancel")
          )
          .then(
            function(result) {
              addEndpoint(result);
            },
            () => {}
          );
      };

      var addEndpoint = function(_title) {
        var endpoint = new endpointModel.endpoint();
        endpoint.title.set(_title);
        $scope.listOfEndpoints.push(endpoint);
      };

      $scope.onToggleAll = () => {
        toggleAll();
      };

      var toggleAll = () => {
        if ($scope.display) {
          $scope.display = false;
          unsetAllColors();
          setDisplayAll(false);
        } else {
          $scope.display = true;
          setDisplayAll(true);
        }
      };

      $scope.onAddItemsButton = function(endpointIndex) {
        if ($scope.listOfEndpoints[endpointIndex])
          $scope.listOfEndpoints[endpointIndex].addItems($scope.getSelected());
      };

      $scope.onRemoveItems = function(endpointIndex) {
        if ($scope.listOfEndpoints[endpointIndex]) {
          var removedItems = $scope.listOfEndpoints[endpointIndex].removeItems(
            $scope.getSelected()
          );
          if (removedItems > 0)
            $scope.whenItemsRemoved(removedItems, endpointIndex);
        }
      };

      $scope.whenItemsRemoved = (_removedItems, endpointIndex) => {
        unsetColors(_removedItems, endpointIndex);
      };

      $scope.onRemoveEndpoint = function(_endpointIndex) {
        $scope.onRemoveItems(
          $scope.listOfEndpoints[_endpointIndex].items.get(),
          _endpointIndex
        );
        $scope.listOfEndpoints.splice(_endpointIndex, 1);
      };

      $scope.onToggleDisplay = function(_endpoint, endpointIndex) {
        toggleDisplay(_endpoint);
        unsetColors(_endpoint.items.get(), endpointIndex);
      };

      var toggleDisplay = _endpoint => {
        _endpoint.display.get() ?
          _endpoint.display.set(false) :
          _endpoint.display.set(true);
      };

      var setDisplayAll = value => {
        for (let i = 0; i < $scope.listOfEndpoints.length; i++) {
          $scope.listOfEndpoints[i].setDisplay(value);
        }
      };

      $scope.$on("colorpicker-closed", function(data1, data2) {
        data1.targetScope.ep.color.set(data2.value);
      });

      var setColors = function(endpoint, color) {
        if ($scope.coloringType === 1) {
          var R = hexToR(color) / 255;
          var G = hexToG(color) / 255;
          var B = hexToB(color) / 255;
          var color2 = new THREE.Vector4(R, G, B, 1);
          for (let index = 0; index < endpoint.items.length; index++) {
            $scope.viewer.setThemingColor(endpoint.items[index].get(),
              color2);
          }
        } else
          $scope.viewer.setColorMaterial(
            endpoint.items.get(),
            color,
            $scope.listOfEndpoints.indexOf(endpoint)
          );
      };

      var unsetColors = (_removedItems, endpointIndex) => {
        if ($scope.coloringType === 1) {
          $scope.viewer.clearThemingColors();
        } else $scope.viewer.restoreColorMaterial(_removedItems,
          endpointIndex);
      };

      var unsetAllColors = () => {
        if ($scope.coloringType === 1) {
          $scope.viewer.clearThemingColors();
          console.log("here");
        } else removeAllColors();
      };

      $scope.print = function() {
        for (let i = 0; i < $scope.listOfEndpoints.length; i++) {
          console.log($scope.listOfEndpoints[i].items.get());
        }
      };

      $scope.printEndpoint = function(_endpoint) {
        console.log(_endpoint);
      };

      var removeAllColors = () => {
        for (let i = 0; i < $scope.listOfEndpoints.length; i++) {
          $scope.viewer.restoreColorMaterial(
            $scope.listOfEndpoints[i].items.get(),
            i
          );
        }
      };

      function hexToR(h) {
        return parseInt(cutHex(h).substring(0, 2), 16);
      }

      function hexToG(h) {
        return parseInt(cutHex(h).substring(2, 4), 16);
      }

      function hexToB(h) {
        return parseInt(cutHex(h).substring(4, 6), 16);
      }

      function cutHex(h) {
        return h.charAt(0) == "#" ? h.substring(1, 7) : h;
      }
    }
    // end of controller
  ]);
})();

// $scope.viewer.getProperties($scope.listOfEndpoints[endpointIndex].items.get(), (result) => {
//   var color = new THREE.Vector4(1, 0, 0, 1); // r, g, b, intensity
//   $scope.viewer.setThemingColor($scope.listOfEndpoints[endpointIndex].items.get(), color);
//   console.log(result);
// });