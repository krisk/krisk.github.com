$(function() {

  function Carousel($el, options) {

    var $prevButton = options.prev,
        $nextButton = options.next,
        $ul = $el.find('> ul'),
        $items = $ul.find('> li'),
        $selectedItem = $items.filter('.selected'),

        $self = $(this),

        selectedIndex = 0,
        itemsCount = $items.length,

        scrollAreaIndex = 1,
        currViewAreaLocationIndex = 0,
        scrollAreaMoveIndex,

        containerWidth = $el.width(),
        itemWidth = $items.eq(0).outerWidth(),
        scrollArea = containerWidth / itemWidth,
        scrollAreaMidPoint = Math.ceil(scrollArea / 2);

    // Get options
    options = $.extend({}, Carousel.defaults, options);

    scrollAreaMoveIndex = Math.ceil(scrollArea * options.percentage);

    // PRIVATE functions
    function init() {
      // If there's no selected item to begin with, select the first.
      if ($selectedItem.length === 0) {
        $selectedItem = $items.first().addClass('selected');
        selectedIndex = 0;
      }
    }

    function move(direction, spots, speed) {
      $ul.animate({
        left: (direction === 1 ? '+=' : '-=') + (spots * itemWidth)
      }, speed || 400);
    }

    function scrollRight(spots, speed) {
      move(-1, spots, speed);
    }

    function scrollLeft(spots, speed) {
      move(1, spots, speed);
    }

    function selectItemAtIndex(index) {
      selectedIndex = index;
      $selectedItem.removeClass('selected');
      $selectedItem = $items.eq(selectedIndex).addClass('selected');

      // Trigger a 'selected' events
      $self.trigger('selected', { index: index });
    }

    function next(index) {
      var scrollAreaLastItemIndex,
          moveDistance,
          numItemsLeft,
          distance;

      index = index !== undefined ? index : selectedIndex + 1;
      scrollAreaIndex++;

      if (index === itemsCount) {
        index = 0;
        scrollAreaIndex = 1;
        currViewAreaLocationIndex = 0;
      }

      selectItemAtIndex(index);

      if (index === 0) {
        scrollLeft(itemsCount - scrollArea, options.resetSpeed);
      } else {
        if (scrollAreaIndex >= scrollAreaMoveIndex) {
          scrollAreaLastItemIndex = index + 1 + (scrollArea - scrollAreaIndex);
          numItemsLeft = itemsCount - scrollAreaLastItemIndex;
          moveDistance = scrollAreaIndex - scrollAreaMidPoint;
          distance = Math.min(moveDistance, numItemsLeft);

          currViewAreaLocationIndex += distance;

          if (distance > 0) {
            scrollRight(distance);
            scrollAreaIndex -= distance
          }
        }
      }

      console.log(scrollAreaIndex, currViewAreaLocationIndex);
    }

    function previous(index) {
      var scrollAreaFirstItemIndex,
          moveDistance,
          numItemsLeft,
          distance;

      index = index !== undefined ? index : selectedIndex - 1;
      scrollAreaIndex--;

      if (index === -1) {
        index = itemsCount - 1;
        scrollAreaIndex = scrollArea;
        currViewAreaLocationIndex = itemsCount - scrollArea
      }

      selectItemAtIndex(index);

      if (index === itemsCount - 1) {
        scrollRight(itemsCount - scrollArea, options.resetSpeed);
      } else {
        if (scrollAreaIndex <= scrollArea - scrollAreaMoveIndex + 1) {
          scrollAreaFirstItemIndex = index - scrollAreaIndex + 2;
          numItemsLeft = scrollAreaFirstItemIndex - 1;
          moveDistance = scrollAreaMidPoint - scrollAreaIndex;
          distance = Math.min(moveDistance, numItemsLeft);

          currViewAreaLocationIndex -= distance;

          if (distance > 0) {
            scrollLeft(distance);
            scrollAreaIndex += distance
          }
        }
      }

      console.log(scrollAreaIndex, currViewAreaLocationIndex);
    }

    function selectItem(index) {
      scrollAreaIndex = index - currViewAreaLocationIndex;

      if (scrollAreaIndex >= scrollAreaMidPoint) {
        next(index);
      } else {
        scrollAreaIndex = index - currViewAreaLocationIndex + 2;
        previous(index);
      }
    }

    // Handlers
    function onPrevButtonClicked() {
      previous();
    }

    function onNextButtonClicked() {
      next();
    }

    function onItemClicked(event) {
      var $item = $(event.target).closest('li');

      selectItem($item.index());
    }

    // Handler binding
    function bindHandlers() {
      $prevButton.on('click', onPrevButtonClicked);
      $nextButton.on('click', onNextButtonClicked);
      $ul.on('click', onItemClicked);

      $(window).on('keyup', function(event) {
        if (event.which === 39) {
          onNextButtonClicked();
        } else if (event.which === 37) {
          onPrevButtonClicked();
        }
      });
    }

    init();
    bindHandlers();

    // PRIVILEGED functions
    this.next = next;
    this.previous = previous;
    this.selectItem = selectItem;
  }

  Carousel.defaults = {
    percentage: 0.8,
    resetSpeed: 150
  };

  window.Carousel = Carousel;

});