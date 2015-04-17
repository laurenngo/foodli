$(function() {
  console.log('page ready');

  $('.delete-button').on('click', function(e){
    e.preventDefault();
    var delBtn= $(this);
    if(confirm('Are you sure you want to delete this movie from My Recipes?')){
      var myUrl=$(this).parent().attr('href');
      console.log("THIS BE URL:", myUrl)
      $.ajax({
        method:'DELETE',
        url:myUrl
      }).done(function(data){
        // console.log("HERRRRR"data)
        })
        $(delBtn).closest('.favoriteRecipe').fadeOut('slow', function(){

          $(this).remove();
      })
    }
  })
})
