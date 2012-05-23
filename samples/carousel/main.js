$(function() {

  var $prevButton = $('.prv'),
      $nextButton = $('.nxt'),

      $ul = $('> ul', '.sliderGallery'),

      $items = $ul.find('> li');

      $selectedItem = $items.filter('.selected'),

      selectedIndex = 0;

      NUM_ITEMS = 26,
      viewableArea = 13,
      viewableAreaIndex = 1,

      WIDTH = 32,

      percentage = 0.80,

      RESET_SPEED = 150,

      currViewAreaLocationIndex = 0;

  // If there's no selected item to begin with,
  // simply select the first.
  if ($selectedItem.length === 0) {
    $selectedItem = $items.first().addClass('selected');
    selectedIndex = 0;
  }

  function scrollRight(spots, speed) {
    $ul.animate({
      left: '-=' + (spots * WIDTH)
    }, speed || 400);
  }

  function scrollLeft(spots, speed) {
    $ul.animate({
      left: '+=' + (spots * WIDTH)
    }, speed || 400);
  }

  function next(index) {
    selectedIndex = index !== undefined ? index :  ++selectedIndex;
    viewableAreaIndex++;

    if (selectedIndex === NUM_ITEMS) {
      selectedIndex = 0;
      viewableAreaIndex = 1;
      currViewAreaLocationIndex = 0;
    }

    $selectedItem.removeClass('selected');
    $selectedItem = $items.eq(selectedIndex).addClass('selected');

    if (selectedIndex === 0) {
      scrollLeft(NUM_ITEMS - viewableArea, RESET_SPEED);
    } else {
      var viewableAreaMoveIndex = Math.ceil(viewableArea * percentage),
          viewableAreaMidPoint = Math.ceil(viewableArea / 2);

      if (viewableAreaIndex >= viewableAreaMoveIndex) {
        var viewableAreaLastItemIndex = selectedIndex + 1 + (viewableArea - viewableAreaIndex),
            moveDistance = viewableAreaIndex - viewableAreaMidPoint,
            numItemsLeft = NUM_ITEMS - viewableAreaLastItemIndex,
            distance = Math.min(moveDistance, numItemsLeft);

            currViewAreaLocationIndex += distance;

        if (distance > 0) {
          scrollRight(distance);
          viewableAreaIndex -= distance
        }
      }
    }

    console.log(viewableAreaIndex, currViewAreaLocationIndex);
  }

  function prev(index) {
    selectedIndex = index !== undefined ? index : --selectedIndex;
    viewableAreaIndex--;

    if (selectedIndex === -1) {
      selectedIndex = NUM_ITEMS - 1;
      viewableAreaIndex = viewableArea;
      currViewAreaLocationIndex = NUM_ITEMS - viewableArea
    }

    $selectedItem.removeClass('selected');
    $selectedItem = $items.eq(selectedIndex).addClass('selected');

    if (selectedIndex === NUM_ITEMS - 1) {
      scrollRight(NUM_ITEMS - viewableArea, RESET_SPEED);
    } else {
      var viewableAreaMoveIndex = Math.ceil(viewableArea * percentage),
          viewableAreaMidPoint = Math.ceil(viewableArea / 2);

      if (viewableAreaIndex <= viewableArea - viewableAreaMoveIndex + 1) {
        var viewableAreaLastItemIndex = selectedIndex - viewableAreaIndex + 2,
            moveDistance = viewableAreaMidPoint - viewableAreaIndex,
            numItemsLeft = viewableAreaLastItemIndex - 1,
            distance = Math.min(moveDistance, numItemsLeft);

            currViewAreaLocationIndex -= distance;

        if (distance > 0) {
          scrollLeft(distance);
          viewableAreaIndex += distance
        }
      }
    }

    console.log(viewableAreaIndex, currViewAreaLocationIndex);
  }

  function onPrevButtonClicked() {
    prev();
  }

  function onNextButtonClicked() {
    next();
  }

  function onItemClicked(event) {
    var $item = $(event.target).closest('li');
    selectedIndex = $item.index();
    viewableAreaIndex = selectedIndex - currViewAreaLocationIndex,
    mid = Math.ceil(viewableArea / 2);

    if (viewableAreaIndex >= mid) {
      next(selectedIndex);
    } else {
      viewableAreaIndex = selectedIndex - currViewAreaLocationIndex + 2;
      prev(selectedIndex);
    }

    console.log(selectedIndex, $item);
  }

  $prevButton.on('click', onPrevButtonClicked);
  $nextButton.on('click', onNextButtonClicked);
  $ul.on('click', onItemClicked);

  $(window).on('keyup', function(event) {
    if (event.which === 39) {
      onNextButtonClicked();
    } else if (event.which === 37) {
      onPrevButtonClicked();
    }
  })

});