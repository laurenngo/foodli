$(function() {
  console.log('page ready');


//Deletes recipes from favorites

  $('.delete-button').on('click', function(e){
    e.preventDefault();
    var delBtn= $(this);
    if(confirm('Are you sure you want to delete this recipe from My Recipes?')){
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

  //Deletes ingredients from list

  $('.delete-item').on('click', function(e){
    e.preventDefault();
    var delBtn= $(this);
    // var form= $(this).closest('form')
    var tr = $(this).closest('tr')
    // var data= form.serialize();



    if(confirm('Are you sure you want to delete this item from My Shopping List?')){
      // var myUrl=$(this).attr('action');

      $.ajax({
        method:'DELETE',
        url:'/favorites',
        data:{
          name:$(this).data('name'),
          department:$(this).data('department'),
          unit:$(this).data('unit'),
          listId:$(this).data('list-id')
        }
      }).done(function(data){
        console.log('got response',data);
        if(data.result){
          $(delBtn).closest('tr').fadeOut('slow', function(){
            $(this).remove();
          })
        }else{
          alert('unable to delete item.');
          console.log(data.error);
        }
      })
    }
  })

})

// //Deletes ingredients from list

//   $('.delete-item').on('click', function(e){
//     e.preventDefault();
//     var delBtn= $(this);
//     var tr= $(this).closest('tr')
//     if(confirm('Are you sure you want to delete this item from My Shopping List?')){
//       var myUrl=$(this).parent().attr('tr');
//       console.log("THIS BE URL:", myUrl)
//       $.ajax({
//         method:'DELETE',
//         url:myUrl
//       }).done(function(data){

//         })
//         $(delBtn).closest('tr').fadeOut('slow', function(){

//           $(this).remove();
//       })
//     }
//   })

// })



