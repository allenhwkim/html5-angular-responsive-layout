// Code goes here
var app = angular.module('myApp',['ngTouch']);

app.directive("ngdWatchScroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function() {
      scope.winTop = $window.pageYOffset;
      scope.winBottom = $window.pageYOffset + $window.innerHeight;
      scope.winHeight = $window.innerHeight;
      scope.docHeight = $window.document.body.scrollHeight;
      scope.$apply();
    });
  };
});

app.directive("ngdScroll", function($window, $http) {
  return {
    scope: {}, // isolated scope
    controller: function($scope, $element, $attrs, $compile, $timeout) {
      this.templateHtml = $element[0].querySelector("#template").outerHTML;
      this.loadingEl = $element[0].querySelector("#loading");
      !this.templateHtml && console.log("missing template");
      this.lastPage = 0;
      this.loadMore = function() {
        $scope.scrollLoading = true;
        $scope.$apply();
        var url = $attrs.ngdScroll.replace(/<<page>>/, ++this.lastPage);
        var _this = this;
        $http.get(url).then(function(result) {
          $timeout(function() {
            for (var i=0; i<result.data.length; i++) {
              $scope.foo = result.data[i].foo;
              $scope.bar = result.data[i].bar;
              var linkFn = $compile(angular.element(_this.templateHtml));
              var compiledEl = linkFn($scope);
              $scope.$apply(); 
              $element[0].insertBefore(compiledEl.clone()[0], _this.loading);
            };
            $scope.scrollLoading = false;
          });
        })
      };
    }, // controller
    link: function(scope, element, attrs, controller) {
      angular.element($window).bind("scroll", function() {
        if (!scope.scrollLoading) { //do not load if already doing
          var winBottom = $window.pageYOffset + $window.innerHeight;
          var docHeight = $window.document.body.scrollHeight;
          if (winBottom + 50 > docHeight) { // close to bottom
            controller.loadMore();
          }
        }
      });
    } // link
  };
});

app.directive("ngdBg", function ($window) {
  return function(scope, element, attrs) {
    var screenWidth=angular.element($window)[0].screen.availWidth;
    var url = attrs.ngdBg;
    if (screenWidth > 767 && attrs.ngdBgMd) { 
      url = attrs.ngdBgMd;
    }
    element.css('backgroundImage', "url("+url+")");
  };
});

app.directive('ngdCarousel', function() {
  return {
    scope: {}, // isolated scope
    transclude: true,
    controller: function($scope) {
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
    }
  }
});
