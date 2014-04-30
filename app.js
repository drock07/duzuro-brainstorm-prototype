

var duzuroApp = angular.module('duzuroApp', ['firebase', 'RecursionHelper']);

duzuroApp.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
})

.directive("tree", function(RecursionHelper) {
	return {
		restrict: "E",
		scope: {family: '='},
		template: 
			'<p>{{ family.content }}</p>'+
			'<ul>' + 
			'<li ng-repeat="child in family.children">' + 
			'<tree family="child"></tree>' +
			'</li>' +
			'</ul>',
		compile: function(element) {
			return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
			// Define your normal link function here.
			// Alternative: instead of passing a function,
			// you can also pass an object with 
			// a 'pre'- and 'post'-link function.
			});
		}
	};
});

duzuroApp.controller('appCtrl', ['$scope', '$firebase',
	function ($scope, $firebase) {
		
		$scope.notes = $firebase(new Firebase("https://duzurobrainstorm.firebaseio.com/notes"));
		$scope.notes.$bind($scope, "remoteNotes");
		$scope.remoteNotes = [];

		$scope.addNote = function() {

			$scope.notes.$add({content: $scope.noteContents, children: []});

			$scope.noteContents = '';
		};
	}
]);







/* 
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile){
	return {
		/**
		 * Manually compiles the element, fixing the recursion loop.
		 * @param element
		 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
		 * @returns An object containing the linking functions.
		 */
		compile: function(element, link){
			// Normalize the link parameter
			if(angular.isFunction(link)){
				link = { post: link };
			}

			// Break the recursion loop by removing the contents
			var contents = element.contents().remove();
			var compiledContents;
			return {
				pre: (link && link.pre) ? link.pre : null,
				/**
				 * Compiles and re-adds the contents
				 */
				post: function(scope, element){
					// Compile the contents
					if(!compiledContents){
						compiledContents = $compile(contents);
					}
					// Re-add the compiled contents to the element
					compiledContents(scope, function(clone){
						element.append(clone);
					});

					// Call the post-linking function, if any
					if(link && link.post){
						link.post.apply(null, arguments);
					}
				}
			};
		}
	};
}]);