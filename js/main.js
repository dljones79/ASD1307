// David Jones
// ASD 1307
// ASD Work

/* pageinit for home page
$('#home').on('pageinit', function(){
	// code needed for home page goes here
});
*/

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
			window.location.reload();	
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
		var schKey = $("#schoolKey").val();
		
		if(!schKey){
			var uniqueId = Math.floor(Math.random()*1000000001);
		}else{
			var uniqueId = schKey;
		}// end if 
		
		chkBoxData();

		var obj ={};
			obj.sName 			= [$('#sName').val()];
			obj.contact 		= [$('#contact').val()];
			obj.cNumber 		= [$('#cNumber').val()];
			obj.building 		= [$('#building').val()];
			obj.enrollment 		= [$('#enrollment').val()];
			obj.sports			= [sprtStr];
			obj.notes 			= [$('#notes').val()];

		
		localStorage.setItem(uniqueId, JSON.stringify(obj));
		alert("School Saved!");
		window.location.reload();
		console.log(obj);			
	};// end storeData
	
	$('#clearData').on("click", clearLocal);
});

//pageinit for display page
$('#display').on('pageinit', function(obj){
	// code needed for display page goes here.
	
	// AJAX Call to pull XML Data from file.
	$(".XML").on("click", function(){
		$.ajax({
			url: "xhr/data.xml",
			type: "GET",
			dataType: "xml",
			success: function(schoolDataXML) {
				$('schoolInfo', schoolDataXML).each(function(){
					var uniqueId = Math.floor(Math.random()*10000000001);
					var saveSch = {
						sName 			:[$("sName", this).text()],
						contact			:[$("contact", this).text()],
						cNumber			:[$("cNumber", this).text()],
						building		:[$("building", this).text()],
						enrollment		:[$("enrollment", this).text()],
						sports			:[$("sports", this).text()],
						notes			:[$("notes", this).text()],
					}
					localStorage.setItem(uniqueId, JSON.stringify(saveSch));
				});
				alert("XML Data Loaded");
				window.location.reload();
			},
			error: function(error){
				console.log(error);
			}
		});// End of .ajax
	});// End of XML function
	
	// ajax call to pull JSON data from file
	$(".JSON").on("click", function(){
		$.ajax({
			url: "xhr/data.json",
			type: "GET",
			dataType: "json",
			success: function(data){
				$.each(data.schoolInfo, function(index, single){
					var uniqueId = Math.floor(Math.random()*1000000001);
					var saveSchool = JSON.stringify(single);
					localStorage.setItem(uniqueId, saveSchool);
				});
				alert("JSON Data Loaded");
				window.location.reload();
			},
			error: function(data){
				console.log(data);
			}
			
		});// End of .ajax
	});// End of JSON function

// Function to pull data from local storage and append to #display page.	
	var getData = function(){
		if (localStorage.length === 0){
			alert("No data on file!");
		}
		
		$('#dispSect').append("<ul></ul>");
		
		for(var i = 0, j = localStorage.length; i<j; i++){
			var theKey = localStorage.key(i);
			var val = localStorage.getItem(theKey);
			var newStr = JSON.parse(val);
			
			var schLi = $("<li></li>");
			var schLiData = $(
				"<h4>School: " + newStr.sName[0] + "</h4>" +
				"<p>Contact: " + newStr.contact[0] + "</p>" +
				"<p>Contact Number: " + newStr.cNumber[0] + "</p>" +
				"<p>Building: " + newStr.building[0] + "</p>" +
				"<p>Enrollment: " + newStr.enrollment[0] + "</p>" +
				"<p>Sports: " + newStr.sports[0] + "</p>" +
				"<p>Notes: " + newStr.notes[0] + "</p>" +
				"<button class='editBut' id=" + theKey + ">Edit</button>" +
				"<button class='delBut' data-key=" + theKey + ">Delete</button>"
			)
			
			var editSchool = $('<li></li>');
		//	var editSchool = $('<a href="#" class="edit" id=' + theKey + '></a>');
			editSchool.html(schLiData);
			schLi.append(editSchool).appendTo("#schools");
			
			$('.delBut').on('click', deleteItem);
			$('.editBut').on('click', function (){
				var schKey = this.id;
				editSch(schKey);
			});
		};
		$("#schools").listview("refresh");		
	}; // End of /getData function
	getData();
	$("#schools").listview("refresh");	
}); // End of #display pageinit

// Function deletes a single item
var deleteItem = function (){
	var verify = confirm("Are you sure you want to delete this school?");
		if(verify){
			localStorage.removeItem($(this).attr('data-key'));
			alert("School was deleted.");
			window.location.reload();
		}else{
			alert("School not deleted.");
			window.location.reload();
		}
}; // End of /deleteItem

// Function clears local storage
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

//Function edits a selected item
var editSch = function(schKey){
	$.mobile.changePage('#formPage');
	
	var schoolData = localStorage.getItem(schKey);
	var schoolArchive = JSON.parse(schoolData);
	
	$("#sName").val(schoolArchive.sName[0]);
	$("#contact").val(schoolArchive.contact[0]);
	$("#cNumber").val(schoolArchive.cNumber[0]);
	$("#enrollment").val(schoolArchive.enrollment[0]).slider("refresh");
	$("#building option:selected").text(schoolArchive.building[0]);
	$("#notes").val(schoolArchive.notes[0]);	
	$("#schoolKey").val(schKey);

}; // End of /editSch
