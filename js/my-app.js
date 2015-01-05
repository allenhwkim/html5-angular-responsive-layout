// Code goes here
var app = angular.module('myApp',['ngTouch']);

app.directive("ngdWatchScroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function() {
      scope.scrollRate = $window.pageYOffset / $window.innerHeight;
      scope.$apply();
    });
  };
});

app.directive('ngdCarousel', function() {
  return {
    scope: {}, // isolated scope
    transclude: true,
    controller: function($scope) {
      console.log('$scope', $scope)
      this.totalSlides;
      this.curSlide;
      this.slidesEl;
      
      var ctrl = this;
      $scope.is1stSlide = function() {
        return ctrl.curSlide == 1;
      };
      $scope.isLastSlide = function() {
        return ctrl.curSlide == ctrl.totalSlides;
      };
      $scope.showPrev = function() {
        ctrl.curSlide = Math.max(--ctrl.curSlide, 1);
        ctrl.slidesEl.setAttribute('slide', ctrl.curSlide);
      };
      $scope.showNext = function() {
        ctrl.curSlide = Math.min(++ctrl.curSlide, ctrl.totalSlides);
        ctrl.slidesEl.setAttribute('slide', ctrl.curSlide);
      };
    },
    link: function(scope, element, attrs, ctrl, transclude) {
      transclude(scope, function(clone) {
        element.append(clone);
      });
    }
  };
});

app.directive('ngdCarouselSlides', function() {
  return {
    require: '^ngdCarousel', 
    link: function(scope, element, attrs, controller) {
      var container = element[0];
      var slides = container.children;
      var totalSlides = slides.length;
      var curSlide = parseInt(attrs.slide) || 1;
      
      container.style.position ="relative";
      container.style.width =  (totalSlides * 100) + "%";
      for (var i=0; i<totalSlides; i++) {
        slides[i].style.width = 100/totalSlides + "%";
      }
      
      controller.slidesEl = container;
      controller.totalSlides = totalSlides;
      controller.curSlide = curSlide;
      console.log('curSlide', curSlide);
    }
  }
});
