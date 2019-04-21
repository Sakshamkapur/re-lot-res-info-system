var siteid = getQueryVariable("siteid");

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("?");

  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  console.log('Query Variable ' + variable + ' not found');
}


$('#submit').click(function(){
  var name = $('#name').val();
  var email = $('#email').val();
  var company = $('#company').val();
  var payment = $('#payment').val();
  if(name==""||email==""||company==""||payment==""){
    alert('Please fill all details');
  }else{
    var myKeyVals = {name: name,email: email,company: company,payment: payment,site_id: siteid};

      console.log(myKeyVals);
      $.ajax({
          type: 'POST',
          url: "/view/client",
          data: myKeyVals,
          success: function(resultData) { alert('The Client Information has been added Successfully !'); window.location.reload(); }
      });
  }
});
