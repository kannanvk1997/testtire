'use strict';

var app = angular.module('TireSizeComparison', []);

app.controller('MainCtrl', function ($scope, tireSizeModel) {
	
	$scope.tireSizes = tireSizeModel.getTireSizes();
	$scope.speeds = tireSizeModel.getSpeeds();
	
	$scope.o = {};
	$scope.n = {};
	
	$scope.o.tireCode1 = $scope.tireSizes[0];
	$scope.o.tireCode2 = $scope.o.tireCode1.sub[0];
	$scope.o.tireCode3 = $scope.o.tireCode2.code3[0];
	
	$scope.n.tireCode1 = $scope.tireSizes[0];
	$scope.n.tireCode2 = $scope.n.tireCode1.sub[0];
	$scope.n.tireCode3 = $scope.n.tireCode2.code3[0];
	
	$scope.speed = $scope.speeds[13];
	$scope.speedAbbreviation = 'mph';
	$scope.measurement = 'imperial';
	$scope.metricBool = false;
	
	$scope.calculated = {o: {}, n: {}, d:{}};
	
	$scope.setSectionWidth = function (tire) {
		$scope.calculated[tire].sectionWidthImperial = round2($scope[tire].tireCode1.code1 / 25.4);
		$scope.calculated[tire].sectionWidthMetric = Math.round($scope[tire].tireCode1.code1);
	}
	
	$scope.setRimDiameter = function (tire) {
		$scope.calculated[tire].rimDiameterImperial = $scope[tire].tireCode3;
		$scope.calculated[tire].rimDiameterMetric = Math.round($scope[tire].tireCode3 * 25.4);
	}
	
	$scope.setSidewallHeight = function (tire) {
		$scope.calculated[tire].sidewallHeightImperial = round2($scope[tire].tireCode2.code2 / 100 * $scope[tire].tireCode1.code1 / 25.4);
		$scope.calculated[tire].sidewallHeightMetric = Math.round($scope[tire].tireCode2.code2 / 100 * $scope[tire].tireCode1.code1);
	}
	
	$scope.setOverallDiameter = function (tire) {
		$scope.calculated[tire].overallDiameterImperial = round2($scope.calculated[tire].sidewallHeightImperial * 2 + $scope.calculated[tire].rimDiameterImperial);
		$scope.calculated[tire].overallDiameterMetric = Math.round($scope.calculated[tire].sidewallHeightMetric * 2 + $scope.calculated[tire].rimDiameterMetric);
	}
	
	$scope.setRadius = function (tire) {
		$scope.calculated[tire].radiusImperial = round2($scope.calculated[tire].overallDiameterImperial / 2);
		$scope.calculated[tire].radiusMetric = Math.round($scope.calculated[tire].overallDiameterMetric / 2);
	}
	
	$scope.setCircumference = function (tire) {
		$scope.calculated[tire].circumferenceImperial = round2($scope.calculated[tire].overallDiameterImperial * 3.14159);
		$scope.calculated[tire].circumferenceMetric = Math.round($scope.calculated[tire].overallDiameterMetric * 3.14159);
	}
	
	$scope.setRevs = function (tire) {
		$scope.calculated[tire].revsPerMile = round2((5280 * 12) / ($scope.calculated[tire].overallDiameterImperial * 3.14159));
		$scope.calculated[tire].revsPerKilometer = round2((1000 * 1000) / ($scope.calculated[tire].overallDiameterMetric * 3.14159));
	}
	
	$scope.setDifferences = function () {
		$scope.calculated.d.sectionWidthImperial = $scope.calculated.n.sectionWidthImperial - $scope.calculated.o.sectionWidthImperial;
		$scope.calculated.d.sectionWidthMetric = $scope.calculated.n.sectionWidthMetric - $scope.calculated.o.sectionWidthMetric;
		$scope.calculated.d.rimDiameterImperial = $scope.calculated.n.rimDiameterImperial - $scope.calculated.o.rimDiameterImperial;
		$scope.calculated.d.rimDiameterMetric = $scope.calculated.n.rimDiameterMetric - $scope.calculated.o.rimDiameterMetric;
		$scope.calculated.d.sidewallHeightImperial = $scope.calculated.n.sidewallHeightImperial - $scope.calculated.o.sidewallHeightImperial;
		$scope.calculated.d.sidewallHeightMetric = $scope.calculated.n.sidewallHeightMetric - $scope.calculated.o.sidewallHeightMetric;
		$scope.calculated.d.overallDiameterImperial = $scope.calculated.n.overallDiameterImperial - $scope.calculated.o.overallDiameterImperial;
		$scope.calculated.d.overallDiameterMetric = $scope.calculated.n.overallDiameterMetric - $scope.calculated.o.overallDiameterMetric;
		$scope.calculated.d.radiusImperial = $scope.calculated.n.radiusImperial - $scope.calculated.o.radiusImperial;
		$scope.calculated.d.radiusMetric = $scope.calculated.n.radiusMetric - $scope.calculated.o.radiusMetric;
		$scope.calculated.d.circumferenceImperial = $scope.calculated.n.circumferenceImperial - $scope.calculated.o.circumferenceImperial;
		$scope.calculated.d.circumferenceMetric = $scope.calculated.n.circumferenceMetric - $scope.calculated.o.circumferenceMetric;
		$scope.calculated.d.revsPerMile = $scope.calculated.n.revsPerMile - $scope.calculated.o.revsPerMile;
		$scope.calculated.d.revsPerKilometer = $scope.calculated.n.revsPerKilometer - $scope.calculated.o.revsPerKilometer;
		
		$scope.calculated.d.sectionWidthPercentMetric = -(1 - ($scope.calculated.n.sectionWidthMetric / $scope.calculated.o.sectionWidthMetric)) * 100;
		$scope.calculated.d.rimDiameterPercentImperial = -(1 - ($scope.calculated.n.rimDiameterImperial / $scope.calculated.o.rimDiameterImperial)) * 100;
		$scope.calculated.d.sidewallHeightPercentMetric = -(1 - ($scope.calculated.n.sidewallHeightMetric / $scope.calculated.o.sidewallHeightMetric)) * 100;
		$scope.calculated.d.overallDiameterPercentMetric = -(1 - ($scope.calculated.n.overallDiameterMetric / $scope.calculated.o.overallDiameterMetric)) * 100;
		$scope.calculated.d.radiusPercentMetric = -(1 - ($scope.calculated.n.radiusMetric / $scope.calculated.o.radiusMetric)) * 100;
		$scope.calculated.d.circumferencePercentMetric = -(1 - ($scope.calculated.n.circumferenceMetric / $scope.calculated.o.circumferenceMetric)) * 100;
		$scope.calculated.d.revsPerMilePercent = -(1 - ($scope.calculated.n.revsPerMile / $scope.calculated.o.revsPerMile)) * 100;
		$scope.calculated.d.revsPerKilometerPercent = -(1 - ($scope.calculated.n.revsPerKilometer / $scope.calculated.o.revsPerKilometer)) * 100;
		
		if ($scope.calculated.d.overallDiameterPercentMetric < 3 && $scope.calculated.d.overallDiameterPercentMetric > -3) {
			$scope.calculated.d.overallDiameterPercentColor = 'green';
		}
		else {
			$scope.calculated.d.overallDiameterPercentColor = 'red';
		}
	}
	
	$scope.refreshSpeed = function () {
		$scope.calculated.d.speedDifference = $scope.calculated.n.overallDiameterMetric / $scope.calculated.o.overallDiameterMetric * $scope.speed.speed;
		$scope.calculated.d.speedDifferencePercent = Math.abs(1 - ($scope.speed.speed / $scope.calculated.d.speedDifference)) * 100;
		
		if ($scope.calculated.d.speedDifference < $scope.speed.speed) {
			$scope.speedFasterSlower = 'slower';
		}
		else {
			$scope.speedFasterSlower = 'faster';
		}
	}
	
	$scope.setMeasurementSystem = function () {
		if ($scope.measurement == 'imperial') {
			$scope.metricBool = false;
			$scope.speedAbbreviation = 'mph';
		}
		else {
			$scope.metricBool = true;
			$scope.speedAbbreviation = 'kph';
		}
	}
	
	$scope.refreshCalculations = function (tire) {
		$scope.setSectionWidth(tire);
		$scope.setRimDiameter(tire);
		$scope.setSidewallHeight(tire);
		$scope.setOverallDiameter(tire);
		$scope.setRadius(tire);
		$scope.setCircumference(tire);
		$scope.setRevs(tire);
		$scope.setDifferences();
		$scope.refreshSpeed();
	}
	
	$scope.refreshCalculations('o');
	$scope.refreshCalculations('n');
	
	$scope.$watch('o.tireCode1', function(newValue, oldValue){
    for (var i=0; i<$scope.o.tireCode1.sub.length; i++) {
			if ($scope.o.tireCode2.code2 === $scope.o.tireCode1.sub[i].code2) {
				$scope.o.tireCode2 = $scope.o.tireCode1.sub[i];
				$scope.refreshCalculations('o');
				return;
			}
		}
		$scope.o.tireCode2 = $scope.o.tireCode1.sub[0];
		$scope.refreshCalculations('o');
  })
  
  $scope.$watch('o.tireCode2', function(newValue, oldValue){
    for (var i=0; i<$scope.o.tireCode2.code3.length; i++) {
			if ($scope.o.tireCode3 === $scope.o.tireCode2.code3[i]) {
				$scope.o.tireCode3 = $scope.o.tireCode2.code3[i];
				$scope.refreshCalculations('o');
				return;
			}
		}
		$scope.o.tireCode3 = $scope.o.tireCode2.code3[0];
		$scope.refreshCalculations('o');
  })
  
  $scope.$watch('n.tireCode1', function(newValue, oldValue){
    for (var i=0; i<$scope.n.tireCode1.sub.length; i++) {
			if ($scope.n.tireCode2.code2 === $scope.n.tireCode1.sub[i].code2) {
				$scope.n.tireCode2 = $scope.n.tireCode1.sub[i];
				$scope.refreshCalculations('n');
				return;
			}
		}
		$scope.n.tireCode2 = $scope.n.tireCode1.sub[0];
		$scope.refreshCalculations('n');
  })
  
  $scope.$watch('n.tireCode2', function(newValue, oldValue){
    for (var i=0; i<$scope.n.tireCode2.code3.length; i++) {
			if ($scope.n.tireCode3 === $scope.n.tireCode2.code3[i]) {
				$scope.n.tireCode3 = $scope.n.tireCode2.code3[i];
				$scope.refreshCalculations('n');
				return;
			}
		}
		$scope.n.tireCode3 = $scope.n.tireCode2.code3[0];
		$scope.refreshCalculations('n');
  })
  
  function round2(val) {
		val = Math.round(val*100)/100;
		return val;
	}
  
})

app.factory('tireSizeModel', function () {
	var getTireSizes = function() {
		var tempArray = [
			{code1:"145", sub:[{code2:"65", code3:[15]}]},
			{code1:"155", sub:[{code2:"60", code3:[15]}, {code2:"70", code3:[13]}, {code2:"80", code3:[13, 15]}]},
			{code1:"165", sub:[{code2:"65", code3:[13, 14]}, {code2:"70", code3:[13]}, {code2:"80", code3:[13]}]},
			{code1:"175", sub:[{code2:"55", code3:[15]}, {code2:"60", code3:[15, 16]}, {code2:"65", code3:[14, 15]}, {code2:"70", code3:[13, 14]}]},
			{code1:"185", sub:[{code2:"55", code3:[14, 15, 16]}, {code2:"60", code3:[13, 14, 15]}, {code2:"65", code3:[14, 15]}, {code2:"70", code3:[13, 14]}, {code2:"75", code3:[14]}]},
			{code1:"195", sub:[{code2:"40", code3:[16, 17]}, {code2:"45", code3:[15, 16, 17]}, {code2:"50", code3:[15, 16]}, {code2:"55", code3:[15, 16]}, {code2:"60", code3:[14, 15, 16]}, {code2:"65", code3:[14, 15]}, {code2:"70", code3:[14, 15]}, {code2:"75", code3:[14]}]},
			{code1:"205", sub:[{code2:"40", code3:[16, 17, 18]}, {code2:"45", code3:[16, 17]}, {code2:"50", code3:[15, 16, 17]}, {code2:"55", code3:[14, 15, 16, 17]}, {code2:"60", code3:[13, 15, 16]}, {code2:"65", code3:[15, 16, 17]}, {code2:"70", code3:[14, 15, 16]}, {code2:"75", code3:[14, 15, 16]}, {code2:"80", code3:[16]}]},
			{code1:"215", sub:[{code2:"30", code3:[20]}, {code2:"35", code3:[17, 18, 19]}, {code2:"40", code3:[16, 17, 18]}, {code2:"45", code3:[16, 17, 18]}, {code2:"50", code3:[16, 17]}, {code2:"55", code3:[16, 17, 18]}, {code2:"60", code3:[14, 15, 16, 17]}, {code2:"65", code3:[15, 16, 17]}, {code2:"70", code3:[14, 15, 16, 17]}, {code2:"85", code3:[16]}]},
			{code1:"225", sub:[{code2:"30", code3:[20]}, {code2:"35", code3:[17, 18, 19, 20]}, {code2:"40", code3:[18, 19]}, {code2:"45", code3:[15, 16, 17, 18, 19]}, {code2:"50", code3:[14, 15, 16, 17, 18]}, {code2:"55", code3:[16, 17, 18, 19]}, {code2:"60", code3:[14, 15, 16, 17, 18, 19]}, {code2:"65", code3:[16, 17]}, {code2:"70", code3:[14, 15, 16, 17]}, {code2:"75", code3:[15, 16, 17]}]},
			{code1:"235", sub:[{code2:"30", code3:[19, 20, 22]}, {code2:"35", code3:[18, 19, 20]}, {code2:"40", code3:[17, 18, 19]}, {code2:"45", code3:[17, 18, 19, 20]}, {code2:"50", code3:[15, 17, 18, 19]}, {code2:"55", code3:[16, 17, 18, 19, 20]}, {code2:"60", code3:[14, 15, 16, 17, 18]}, {code2:"65", code3:[16, 17, 18]}, {code2:"70", code3:[15, 16, 17]}, {code2:"75", code3:[15, 16, 17]}, {code2:"80", code3:[17]}, {code2:"85", code3:[16]}]},
			{code1:"245", sub:[{code2:"30", code3:[19, 20, 21, 22]}, {code2:"35", code3:[17, 18, 19, 20, 21]}, {code2:"40", code3:[17, 18, 19, 20, 21]}, {code2:"45", code3:[16, 17, 18, 19, 20]}, {code2:"50", code3:[16, 17, 18, 19, 20]}, {code2:"55", code3:[17, 18, 19]}, {code2:"60", code3:[14, 15, 17, 18, 20]}, {code2:"65", code3:[17, 18]}, {code2:"70", code3:[16, 17]}, {code2:"75", code3:[16, 17]}]},
			{code1:"255", sub:[{code2:"30", code3:[19, 20, 21, 22, 24]}, {code2:"35", code3:[18, 19, 20, 21, 22]}, {code2:"40", code3:[17, 18, 19, 20]}, {code2:"45", code3:[17, 18, 19, 20]}, {code2:"50", code3:[16, 17, 18, 19, 20]}, {code2:"55", code3:[17, 18, 19, 20]}, {code2:"60", code3:[15, 17, 18, 19]}, {code2:"65", code3:[16, 17, 18]}, {code2:"70", code3:[15, 16, 17, 18]}, {code2:"75", code3:[15, 17]}, {code2:"80", code3:[17]}, {code2:"85", code3:[16]}]},
			{code1:"265", sub:[{code2:"30", code3:[19, 20, 21, 22]}, {code2:"35", code3:[18, 19, 20, 21, 22]}, {code2:"40", code3:[17, 18, 19, 20, 21, 22]}, {code2:"45", code3:[18, 20, 21, 22]}, {code2:"50", code3:[18, 19, 20]}, {code2:"55", code3:[19]}, {code2:"60", code3:[17, 18]}, {code2:"65", code3:[17, 18]}, {code2:"70", code3:[15, 16, 17, 18]}, {code2:"75", code3:[15, 16]}]},
			{code1:"275", sub:[{code2:"25", code3:[20, 24, 26]}, {code2:"30", code3:[19, 20, 21, 22, 24]}, {code2:"35", code3:[18, 19, 20, 21]}, {code2:"40", code3:[17, 18, 19, 20, 21, 22]}, {code2:"45", code3:[16, 18, 19, 20, 21, 22]}, {code2:"50", code3:[15, 17, 19, 20]}, {code2:"55", code3:[17, 18, 19, 20]}, {code2:"60", code3:[15, 16, 17, 18, 20]}, {code2:"65", code3:[17, 18, 20]}, {code2:"70", code3:[16, 17, 18]}]},
			{code1:"285", sub:[{code2:"25", code3:[20, 22]}, {code2:"30", code3:[18, 19, 20, 21, 22, 24]}, {code2:"35", code3:[18, 19, 20, 21, 22, 23, 24]}, {code2:"40", code3:[17, 18, 19, 20, 22, 23, 24]}, {code2:"45", code3:[18, 19, 20, 22]}, {code2:"50", code3:[18, 20, 22]}, {code2:"55", code3:[18, 20, 22]}, {code2:"60", code3:[17, 18, 20]}, {code2:"65", code3:[17, 18, 20]}, {code2:"70", code3:[17]}, {code2:"75", code3:[16, 17, 18]}]},
			{code1:"295", sub:[{code2:"25", code3:[20, 21, 22, 26, 28]}, {code2:"30", code3:[18, 19, 20, 21, 22, 24, 26]}, {code2:"35", code3:[17, 18, 19, 20, 21, 24]}, {code2:"40", code3:[18, 20, 21, 22, 24]}, {code2:"45", code3:[18, 19, 20, 22]}, {code2:"50", code3:[15, 20]}, {code2:"60", code3:[20]}, {code2:"65", code3:[18]}, {code2:"70", code3:[17, 18]}, {code2:"75", code3:[16]}]},
			{code1:"305", sub:[{code2:"25", code3:[20, 21]}, {code2:"30", code3:[19, 20, 21, 22, 26]}, {code2:"35", code3:[18, 20, 22, 23, 24]}, {code2:"40", code3:[18, 22, 23]}, {code2:"45", code3:[18, 20, 22]}, {code2:"50", code3:[20]}, {code2:"55", code3:[20]}, {code2:"60", code3:[18, 20]}, {code2:"65", code3:[17, 18]}, {code2:"70", code3:[16, 17, 18]}]},
			{code1:"315", sub:[{code2:"25", code3:[19, 20, 22]}, {code2:"30", code3:[18, 20, 30]}, {code2:"35", code3:[17, 18, 20, 24, 30]}, {code2:"40", code3:[18, 25, 26]}, {code2:"45", code3:[18, 20, 22]}, {code2:"50", code3:[24]}, {code2:"60", code3:[20]}, {code2:"70", code3:[17, 18]}, {code2:"75", code3:[16]}]},
			{code1:"325", sub:[{code2:"25", code3:[20, 21]}, {code2:"30", code3:[19, 20, 21]}, {code2:"35", code3:[28]}, {code2:"40", code3:[22]}, {code2:"45", code3:[24]}, {code2:"50", code3:[15, 22]}, {code2:"55", code3:[22]}, {code2:"60", code3:[18, 20, 22]}, {code2:"65", code3:[18]}, {code2:"70", code3:[17]}, {code2:"80", code3:[16]}]},
			{code1:"335", sub:[{code2:"25", code3:[20, 22]}, {code2:"30", code3:[18, 19, 20]}, {code2:"35", code3:[17]}]},
			{code1:"345", sub:[{code2:"25", code3:[20]}, {code2:"30", code3:[19, 20]}, {code2:"35", code3:[15, 19]}, {code2:"40", code3:[17]}, {code2:"75", code3:[16]}]},
			{code1:"355", sub:[{code2:"25", code3:[21]}, {code2:"30", code3:[19]}, {code2:"60", code3:[20]}, {code2:"65", code3:[18]}]},
			{code1:"365", sub:[{code2:"75", code3:[16]}]},
			{code1:"385", sub:[{code2:"70", code3:[16]}]},
			{code1:"405", sub:[{code2:"25", code3:[24]}]}
		];
		return tempArray;
	};
	
	var getSpeeds = function() {
		var tempArray = [
			{speed:5},
			{speed:10},
			{speed:15},
			{speed:20},
			{speed:25},
			{speed:30},
			{speed:35},
			{speed:40},
			{speed:45},
			{speed:50},
			{speed:55},
			{speed:60},
			{speed:65},
			{speed:70},
			{speed:75},
			{speed:80},
			{speed:85},
			{speed:90},
			{speed:95},
			{speed:100},
			{speed:105},
			{speed:110},
			{speed:115},
			{speed:120},
			{speed:125},
			{speed:130},
			{speed:135},
			{speed:140},
			{speed:145},
			{speed:150},
			{speed:155},
			{speed:160},
			{speed:165},
			{speed:170},
			{speed:175},
			{speed:180},
			{speed:185},
			{speed:190},
			{speed:195},
			{speed:200}
		];
		return tempArray;
	};
	
	return {
		getTireSizes: getTireSizes,
		getSpeeds: getSpeeds
	};
	
});


