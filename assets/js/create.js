// code for tag seperation
var Months=['January','February','March','April','May','June','July','August','September','October','November','December'];


function nth(d) {
  if(d>3 && d<21) return 'th'; // thanks kennebec
  switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

var Thedate = new Date(),
      date = Thedate.getDate(), 
      mon = Thedate.getMonth();

var today = date+nth(date)+" "+Months[mon];

// submit code

$('#submit').click(function(){
  var sitename = $('#sitename').val();
  var location = $('#location').val();
  var housemodal = $('#housemodal').val();
  var houseunits = $('#houseunits').val();
  if(sitename==""||location==""||housemodal==""||houseunits==""){
    alert('Please fill all details');
  }else{
    console.log(sitename);
    console.log(location);
    console.log(housemodal);
    console.log(houseunits);
    console.log(today);
    var myKeyVals = {site_name: sitename,location: location,house_model_info: housemodal,house_unit_info: houseunits,created_on: today};

      console.log(myKeyVals);
      $.ajax({
          type: 'POST',
          url: "/view",
          data: myKeyVals,
          success: function(resultData) { alert('The Development site has been added Successfully !'); window.location.reload(); }
      });
  }
});

