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
	
	// Function checks sports checkboxes, pushes checked sports to array, converts array to string
	function chkBoxData(){
		var sports = [];
		if($('#football').prop('checked')){
			football = "Yes";
			sports.push("Football");
		}else {
			football = "No";
		}
		if($('#baseball').prop('checked')){
			baseball = "Yes";
			sports.push("Baseball");
		}else {
			baseball = "No";
		}
		if($('#basketball').prop('checked')){
			basketball = "Yes";
			sports.push("Basketball");
		}else {
			basketball = "No";
		}
		if($('#soccer').prop('checked')){
			soccer = "Yes";
			sports.push("Soccer");
		}else {
			soccer = "No";
		}
		if($('#track').prop('checked')){
			track = "Yes";
			sports.push("Track");
		}else{
			track = "No";
		}
		
		sprtStr = sports.toString();

	}; // End of /chkBoxData
	
	var storeData = function(data){
		if(!data){
			var uniqueId = Math.floor(Math.random()*1000000001);
		}else{
			var uniqueId = data;
		}// end if 
		
		chkBoxData();

		var obj ={};
			obj.sName 			= ["School:", $('#sName').val()];
			obj.contact 		= ["Contact:", $('#contact').val()];
			obj.cNumber 		= ["Phone #:", $('#cNumber').val()];
			obj.building 		= ["Building:", $('#building').val()];
			obj.enrollment 		= ["Enrollment:", $('#enrollment').val()];
			obj.sports			= ["Sports:", sprtStr];
			obj.notes 			= ["Notes:", $('#notes').val()];

		
		localStorage.setItem(uniqueId, JSON.stringify(obj));
		alert("School Saved!");
		window.location.reload();
		console.log(obj);			
	};// end storeData
});

//pageinit for display page
$('#display').on('pageinit', function(obj){
	// code needed for display page goes here.
	
	var getData=function(){
		if(localStorage.length === 0){
			alert("No data on file!");
		}

		for(var i = 0, j=localStorage.length; i<j; i++){

			var theKey = localStorage.key(i);
			var val = localStorage.getItem(theKey);
			var newStr = JSON.parse(val);
			$('#schools').append('<li></li>');
			for(var x in newStr){
				var optText = newStr[x][0]+" "+newStr[x][1];
				$('#schools li:last-child').append('<p>' + optText + '</p>');
			}
			$('#schools li:last-child').append('<li><a href="#" key=theKey class="edit">Edit</a></li>');
		}
	}
	getData();
	$("#schools").listview("refresh");
});

var deleteItem = function(){
	var verify = confirm("Are you sure you want to delete this school?");
		if(verify){
			localStorage.removeItem(this.key);
			alert("School was deleted.");
			window.location.reload();
		}else{
			alert("School not deleted.");
		}
}; // End of /deleteItem

var clearLocal = function(){
	if(localStorage.length === 0){
		alert("Storage Empty. Nothing to clear.");
	}else{
		localStorage.clear();
		alert("School Data Cleared!");
		window.location.reload();
		return false;
	}
}; // End of /clearLocal

/*

function createEditLinks(objKey, makeEditLi){
	//Edit Link
	var editSchool = document.createElement('a');
	editSchool.href = "#";
	editSchool.key = objKey;
	var text = "Edit School";
//	editSchool.addEventListener("click", editSch);
	editSchool.innerHTML = text;
	makeEditLi.append(editSchool);
	
	var pageBreak = document.createElement('br');
	makeEditLi.append(pageBreak);
	
	//Delete Link
	var delSchool = document.createElement('a');
	delSchool.href = "#";
	delSchool.key = objKey;
	var delText = "Delete School";
	delSchool.addEventListener("click", deleteItem);
	delSchool.innerHTML = delText;
	makeEditLi.append(delSchool);
}; // End of createEditLinks

*/