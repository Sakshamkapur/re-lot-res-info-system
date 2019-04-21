$('.edit').click(function(){
	var id = $(this)[0].id
	var sitename = $('.sitename').val();
	var location = $('.location').val();
	var house_model_info = $('.house_model_info').val();
  var house_unit_info = $('.house_unit_info').val();
  if(sitename==""||location.length==0||house_model_info==""|| house_unit_info==""){
    alert('Please fill all details');
  }else{
    var myKeyVals = {id: id,site_name: sitename,location: location,house_model_info: house_model_info,house_unit_info: house_unit_info};

      console.log(myKeyVals);
      $.ajax({
          type: 'POST',
          url: "/view/update",
          data: myKeyVals,
          success: function(resultData) { alert('The Site Information has been modified Successfully !'); window.location.reload(); }
      });
  }
});

$('.delete').click(function(e){
  var id = $(this)[0].id;
  console.log(id);
  if(confirm("Are you sure you want to delete this Development Site Information?")){
    $.ajax({
            type: 'DELETE',
            url: "/view/"+id,
            success: function(resultData) { console.log(id +"  deleted!"); window.location.reload();  }
        }); 
  }
});