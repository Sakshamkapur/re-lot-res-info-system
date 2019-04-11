/**
 * Variables
 */
const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms')

/**
 * Add event listener to the "Sign Up" button
 */
signupButton.addEventListener('click', () => {
  userForms.classList.remove('bounceRight')
  userForms.classList.add('bounceLeft')
}, false)

/**
 * Add event listener to the "Login" button
 */
loginButton.addEventListener('click', () => {
  userForms.classList.remove('bounceLeft')
  userForms.classList.add('bounceRight')
}, false)



$('.forms_buttons-action').click(function(e){
	e.preventDefault();
	var type = $(this).val();

	if(type == "Log In"){

		var email= $('#email').val();
		var pass= $('#pass').val();
		if(email==""||pass==""){
			alert("Fill both fields");
		}else{
			var myKeyVals = {
	            email: email,
	            pass: pass
	        };
			$.ajax({
	            type: 'POST',
	            url: "/login_details",
	            data: myKeyVals,
	            success: function(resultData) { 
	            	console.log(resultData);
	            	if(resultData.login){
	            		alert('login Successfully!');
	                	window.location.href = '/properties_list';
	            	}else{
	            		alert(resultData.err);
	            	}
	            }
	        });
		}

	}else if(type == "Sign up"){
		var email= $('#email2').val();
		var pass= $('#pass2').val();
		if(email==""||pass==""){
			alert("Fill both fields");
		}else{
			var myKeyVals = {
	            email: email,
	            pass: pass
	        };
			console.log(myKeyVals);
			$.ajax({
	            type: 'POST',
	            url: "/register_details",
	            data: myKeyVals,
	            success: function(resultData) { 
	                if(resultData.length == 0){
	                    alert('No data for the entered filter value');
	                }
	                else{
	                	alert('You have been registered Successfully!');
	                	window.location.href = '/';
	                }
	            }
	        });
		}
	}
});

