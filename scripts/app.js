"use strict";

var app = angular.module("myBlogApp", []);
app.controller("myBlogCtrl", function($scope, $window) {
	$scope.allBlogs = [];
	$scope.selectedIdx = -1;

	$scope.status = "";
	$scope.newMode = false;
	$scope.editMode = false;
	
	//blog objects for ng-model
	$scope.editBlog = {};
	$scope.newBlog = {};
	
	var xhttp = new XMLHttpRequest();
	
	//get an entity from DB via AJAX GET
	$window.onload = function() {		
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					$scope.allBlogs = JSON.parse(this.responseText);
					$scope.status = "get all blogs successfully!";
					//need call $apply manually to fire $digest cycle
					$scope.$apply();
				} else {
					$scope.status = "get all blogs failed: " + this.status;				
				}
			}
		};
		//xhttp.open("GET", "http://restedblog.herokuapp.com/lichen/api/", true);
		xhttp.open("GET", "./mock/read.txt", true);
		xhttp.send();
	};
	
	$scope.deleteAll = function() {
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					$scope.status = "delete all blogs successfully!";
				} else {
					$scope.status = "delete all blogs failed: " + this.status;				
				}
			}
		};
		xhttp.open("DELETE", "http://restedblog.herokuapp.com/lichen/api/", true);
		xhttp.send();
	};

	//call AJAX post to create an entity in DB
	$scope.create = function() {
		//build a json string from inputs
		var jsonStr = $scope.buildJsonStr($scope.newBlog.title, $scope.newBlog.text);
				
		//when request finished and response is ready
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				//successful
				if (this.status == 200) {
					$scope.status = "new blog is created successfully";
				} else { //error handling
					$scope.status = "create a new blog failed: " + this.status;				
				}
			}
		};
		xhttp.open("POST", "http://restedblog.herokuapp.com/lichen/api/", true);
		xhttp.send(jsonStr);
	};
	
	//when Edit button is clicked
	$scope.edit = function(idx) {
		$scope.selectedIdx = idx;
		//need fill in the fields initially
		$scope.editBlog.title = $scope.allBlogs[idx].title;
		$scope.editBlog.text = $scope.allBlogs[idx].text;
		$scope.editMode = true;
	}
	
	$scope.cancelEdit = function(idx) {
		$scope.editMode = false;
	}
	
	//update an entity in DB via AJAX POST
	$scope.update = function(idx) {	
		let id = $scope.allBlogs[idx].id;
		//build a json string from inputs
		var jsonStr = $scope.buildJsonStr(this.editBlog.title, this.editBlog.text, id);
		
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					$scope.status = "update blog successfully!";
					$scope.selectedIdx = -1;
				} else {
					$scope.status = "update blog failed: " + this.status;				
				}
			}
		};
		xhttp.open("POST", "http://restedblog.herokuapp.com/lichen/api/" + id, true);
		xhttp.send(jsonStr);
	};
	
	$scope.crud_delete = function(idx) {
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					$scope.status = this.responseText;
				} else {
					$scope.status = "delete action failed: " + this.status;				
				}
			}
		};
		xhttp.open("DELETE", "http://restedblog.herokuapp.com/lichen/api/" + $scope.allBlogs[idx].id, true);
		xhttp.send();
	};

	//create a json string for ajax call
	$scope.buildJsonStr = function(bTitle, bText, bId) {
		var json = {
				"title": bTitle,
				"text": bText	
		};
		if (bId !== undefined) {
			json.id = bId;
		}
			
		return JSON.stringify(json);
	}
	
	$scope.hideCreateBlog = function() {
		$scope.newMode = false;
	}
});
