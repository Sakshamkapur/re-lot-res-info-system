$('.com-expand-holder').click(function(e){
  e.preventDefault();
  $(this).parent().toggleClass('active');
  $('.card-stuff').toggleClass('active');
});

$(".searchTerm").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".card").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

$('.edit').click(function(){
	var id = $(this)[0].id
	var name = $('.name').val();
	var email = $('.email').val();
	var company = $('.company').val();
  	var payment = $('.payment').val();
  if(name==""||email==""||company==""|| payment==""){
    alert('Please fill all details');
  }else{
    var myKeyVals = {id: id,name: name,email: email,company: company,payment: payment};

      console.log(myKeyVals);
      $.ajax({
          type: 'POST',
          url: "/view/client/update",
          data: myKeyVals,
          success: function(resultData) { alert('The Client Information has been modified Successfully !');  window.location.reload(); }
      });
  }
});

$('.delete').click(function(e){
  var id = $(this)[0].id;
  console.log(id);
  if(confirm("Are you sure you want to delete this Client Information?")){
    $.ajax({
            type: 'DELETE',
            url: "/view/client"+id,
            success: function(resultData) { console.log(id +"  deleted!"); window.location.reload();  }
        }); 
  }
});


$('#more').on('click', function(){
  $('progress').val( $('progress').val() + 20);
  return false;
});
$('#less').on('click', function(){
  $('progress').val( $('progress').val() - 20);
  return false;
});