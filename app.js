

var duzuroApp = angular.module('duzuroApp', ['firebase']);

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
});

duzuroApp.controller('appCtrl', ['$scope', '$firebase',
	function ($scope, $firebase) {
		
		$scope.notes = $firebase(new Firebase("https://duzurobrainstorm.firebaseio.com/notes"));
		$scope.notes.$bind($scope, "remoteNotes");
		$scope.remoteNotes = [];

		$scope.addNote = function() {

			$scope.notes.$add($scope.noteContents);

			$scope.noteContents = '';
		};
	}
]);