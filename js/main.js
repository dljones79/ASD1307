// David Jones
// ASD 1307
// ASD Work

//pageinit for home page
$('#home').on('pageinit', function(){
	// code needed for home page goes here
});

//pageinit for form page
$('#formPage').on('pageinit', function(){
	// code needed for form page goes here
	var addForm = $('#schoolForm'),
		errorsLink = $('#errorsLink')
	;
	addForm.validate({
		invalidHandler: function(form, validator) {
			errorsLink.click();
			var errorText = '';
			for(var key in validator.submitted){
				var label = $('label[for^="'+ key + '"]').not('.error');
				var legend = label.closest('fieldset').find('.ui-controlgroup-label');
				var fieldName = legend.length ? legend.text() : label.text();
				errorText += '<li>'+ fieldName +'</li>';
			};
			$("#recordErrors ul").html(errorText);
		},
		submitHandler: function(){
			var data = addForm.serializeArray();
				storeData(data);
		}
	});
	
	function chkBoxData(){
		if($('#football').checked){
			football = "Yes";
		}else {
			football = "No";
		}
		if($('#baseball').checked){
			baseball = "Yes";
		}else {
			baseball = "No";
		}
		if($('#basketball').checked){
			basketball = "Yes";
		}else {
			basketball = "No";
		}
		if($('#soccer').checked){
			soccer = "Yes";
		}else {
			soccer = "No";
		}
		if($('#track').checked){
			track = "Yes";
		}else{
			track = "No";
		}
	};
	
	var storeData = function(data){
		if(!data){
			var uniqueId = Math.floor(Math.random()*1000000001);
		}else{
			var uniqueId = data;
		}// end if 
		
		chkBoxData();

		var obj ={};
			obj.sName = ["School:", $('#sName').val()];
			obj.contact = ["Contact:", $('#contact').val()];
			obj.cNumber = ["Phone #:", $('#cNumber').val()];
			obj.building = ["Building:", $('#building').val()];
			obj.enrollment = ["Enrollment:", $('#enrollment').val()];
			obj.notes = ["Notes:", $('#notes').val()];
		
		localStorage.setItem(uniqueId, JSON.stringify(obj));
		alert("School Saved!");
		window.location.reload();
		console.log(obj);			
	};// end storeData
});

//pageinit for display page
$('#display').on('pageinit', function(){
	// code needed for display page goes here
});