//Initialisation
var eathealthy = angular.module('eathealthy', ['ngRoute']);

//Configuration
function routeConfiguration($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'pages/loginTemplate.html'
	});
	$routeProvider.when('/home', {
		templateUrl: 'pages/mainTemplate.html'
	});
	$routeProvider.when('/Restaurants/:RestaurantIndex', {
		templateUrl: 'pages/detailsTemplate.html'
	});
}
	
eathealthy.config(routeConfiguration);

//Login Controller
eathealthy.controller('loginController', function($scope, $location) {
	function goToHome(email,password) {																																							
		if (email && password) {																																		
			$location.url('home');																																									//Go to 'home' when submit button is clicked
		} else {
			console.log('not validated');
		}
	}
	$scope.goToHome = goToHome;
});

//Restaurant Lists
eathealthy.service('restaurantService', function(){
	this.restaurantLists = [
		{
			name: 'Shang Palace',
            description:'Dark hued hotel dining room with chandeliers and a fine dining Chinese food menu.',
			location: '19, Ashoka Rd, Janpath, Connaught Place, New Delhi, Delhi 110001, India',
			meal_for_two: 'Rs 5000/-',
			recommended_for: 'A special occasion, birthday or anniversary',
			image: '1.jpg',
			rating: '4.5',
			favourites: {
				dish_name: 'chicken korean dish food fry spicy stirfry',
                url:'https://cdn.pixabay.com/photo/2014/11/07/19/29/chicken-521097_960_720.jpg'
			}
		},
		{
			name: 'Tamra Restaurant',
            description:'Sizable, upscale hotel restaurant with unique, smart decor offering a global buffet and cocktails..',
			location: '19, Ashoka Rd, Janpath, Connaught Place, New Delhi, Delhi 110001',
			meal_for_two: 'Rs 5000/-',
			recommended_for: 'For your fix of great North-Indian food in a city where it’s fairly elusive',
			image: '2.jpg',
			rating: '4.1',
			favourites: {
				dish_name: 'food lunch dish dinner plate white plate of food',
				url:'https://cdn.pixabay.com/photo/2016/01/29/06/16/food-1167398_960_720.jpg'
			}
		},
		{
			name: 'Sorrento Restaurant',
            description:'Upscale hotels refined yet relaxed Italian restaurant with a wood-fired oven and white wall tiling.',
			location: 'Shangri La Eros Hotel, 19 Ashoka Road, Connaught Place, New Delhi, Delhi 110001',
			meal_for_two: 'Rs 4000/-',
			recommended_for: 'Calm and peace and leaving the chaos of the world outside',
			image: '3.jpg',
			rating: '4.3',
			favourites: {
				dish_name: 'The Taco Emoji',
				url:'http://foodnetwork.sndimg.com/content/dam/images/food/fullset/2015/10/22/0/fnd_tacos-istock.jpg.rend.snigalleryslide.jpeg'
			}
		},
		{
			name: 'Indian Accent',
            description:'Contemporary twists on Indian cuisine are served at this stylish, prize-winning restaurant.',
			location: '77, Friends colony West, New Delhi, Delhi 110065',
			meal_for_two: 'Rs 7000/-',
			recommended_for: 'Taking your International clients for an Indian meal',
			image: '4.jpg',
			rating: '4.0',
			favourites: {
				dish_name: 'Chinese Baked Pork Chop Rice',
				url: 'http://farm8.static.flickr.com/7219/7341959302_029a1e33df.jpg'
			}
		},
	]
});


//Restaurant Controller
eathealthy.controller('restaurantController', function($scope, restaurantService) {
	$scope.restaurantLists = restaurantService.restaurantLists;
});

//Restaurant Details Controller
eathealthy.controller('detailsController', function($scope, restaurantService, $routeParams, $http){
	var list = restaurantService.restaurantLists;
	$scope.showDetails = false;
    $scope.protein = false;
    $scope.fat = false;
    $scope.carbohydrates = false;
	$scope.Restaurant = list[$routeParams.RestaurantIndex];
	$scope.ingredients = [];
    var fatLists=['almonds','avocado','chocolate','eggs','butter','oil','cheese','flaxseed','Olives','Salmon'];
     var carLists=['milk','icecream','juice','Bread','rice','cereal','cheese','Potatoes','corn','corn'];
     var proLists=['meat','fish','cheese','egg','tofu','yogurt','cheese','milk','beans','lentils','nuts','seeds','chicken'];

//API Functioning
	$scope.showDishDetails = function(url){
		var data = '{"inputs":[{"data":{"image":{"url":"' + url + '"}}}]}';
		$http({
				'method': 'POST',
				'url': 'https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs',
				'headers': {
					'Authorization': 'Key f6d876aa272f4138bd669112435e40f7',													//key generated from www.clarifi.com
					'Content-Type': 'application/json'
				},
				'data': data,
		}).then (function(response) {
			var ingredient = response.data.outputs[0].data.concepts;
			var list = '';
			for (var i =0; i < ingredient.length; i++) {																												//Showing the ingredients in html page
							$scope.ingredients.push(ingredient[i].name);
                
                //
                if(fatLists.indexOf(ingredient[i].name)!= -1 && $scope.fat != true)
                    $scope.fat = true;
                if(proLists.indexOf(ingredient[i].name)!= -1 && $scope.protein != true)
                    $scope.protein = true;
                if(carLists.indexOf(ingredient[i].name)!= -1 && $scope.carbohydrates != true)
                    $scope.carbohydrates = true;
			}
		})
	};
});