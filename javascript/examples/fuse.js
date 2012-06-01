$(function() {
  function start(books) {
    var $inputSearch = $('#inputSearch'),
        $result = $('#results'),

        $authorCheckbox = $('#author'),
        $titleCheckbox = $('#title'),

        searchAuthors = false,
        searchTitles = true,

        fuse;

    function search() {
      var r = fuse.search($inputSearch.val());
      $result.empty();
      $.each(r, function() {
        $result.append('<li class="result-item">' + this.title + ', <span>' + this.author + '</span></li>');
      });
    }

    function createFuse() {
      var keys = [];
      if (searchAuthors) {
        keys.push('author');
      }
      if (searchTitles) {
        keys.push('title');
      }
      fuse = new Fuse(books, {
        keys: keys
      });
    }

    function onAuthorCheckboxChanged() {
      searchAuthors= $authorCheckbox.prop('checked');
      createFuse();
      search();
    }

    function onTitleCheckboxChanged() {
      searchTitles = $titleCheckbox.prop('checked');
      createFuse();
      search();
    }

    $authorCheckbox.on('change', onAuthorCheckboxChanged);
    $titleCheckbox.on('change', onTitleCheckboxChanged);

    $inputSearch.on('keyup', search);

    createFuse();
  }

  $.getJSON('../data/books.json', function(data) {
     start(data);
  });

});