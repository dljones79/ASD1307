// David Jones
// ASD 1307
// ASD Work

// Pageinit for Dislplay page.
$(document).on("pageinit", '#display', function(){
	$('#schools').empty();
	
	var schoolDocs = [];

	
	$.couch.db("schooldatabase").view("app/schools",{
		success: function(data){

			$.each(data.rows, function(index, school){
				var schoolItem 	= (school.value || school.doc);
				
				var schoolDoc = {
					_id: schoolItem.id,
					_rev: schoolItem.rev
				}
				
				schoolDocs.push(schoolDoc);
				
				$('#schools').append(
					$('<li>').append(
						$('<a>')
							.attr("href", "school.html?school=" + schoolItem.sName)
							.text(schoolItem.sName)
					)
				);
			});
			$('#schools').listview('refresh');
		}
	});
	
	//Function to clear all data.
	$("#clearAll").on("click", function(){
		if(schoolDocs.length === 0){
			alert("No data on file.");
		} else {
			var verifyWipe = confirm("Are you sure you want to clear the database?");
			if(verifyWipe){
				$.couch.db("schooldatabase").bulkRemove({"docs": schoolDocs},{
					success: function(data){
						alert("All data erased.");
						window.location.href = "index.html";
					}
				});
			} else {
				alert("Database not erased.");
				window.location.reload();
			}
		}
	});
});

//Pageinit for school page.
$(document).on("pageinit", '#school', function(){
	var urlData = $(this).data("url");
	var urlParts = urlData.split('?');
	var urlPairs = urlParts[1].split('&');
	var urlValues = {};
	for (var pair in urlPairs){
		var keyValue = urlPairs[pair].split('=');
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		urlValues[key] = value;
	}
	var schoolKey = urlValues["school"];
	
	$.couch.db("schooldatabase").view("app/schools", {
		key: schoolKey,
		
		success: function(schoolInfo){
			$.each(schoolInfo.rows, function(index, schoolData){
				var schoolObj = (schoolData.value || schoolData.doc)
				
				var schoolDoc = {
					_id : schoolObj.id,
					_rev : schoolObj.rev,	
				};
				
				$("#deleteSchool").attr("href", "delete.html?school=" + schoolObj.sName)
				$("#editSchool").attr("href", "edit.html?school=" + schoolObj.sName)
				
				var schLi = $("<li></li>");
				var listSchInfo = $(
					"<h3>" + schoolObj.sName + "</h3>" +
					"<p>Building: " + schoolObj.building + "</p>" +
					"<p>Enrollment: " + schoolObj.enrollment + "</p>"
				);
				schLi.append(listSchInfo).appendTo("#schoolInfo");
			});
			$("#schoolInfo").listview("refresh");
		}
	});
});

//Pageinit for form page
$("#formPage").on("pageinit", function(){
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
	
	var storeData = function(data){
	
	var schoolInfo = {
		"_id" 			: "school:" + $("#sName").val(),
		"sName" 		: $("#sName").val(),
		"building" 		: $("#building").val(),
		"enrollment" 	: $("#enrollment").val(),
		"schoolKey" 	: $("#schoolKey").val() + $("#sName").val(),
	};
	
	$.couch.db("schooldatabase").saveDoc(schoolInfo, {
		
		success: function(data){
			console.log(data)
		},
		error: function(error){
			console.log(error)
		}
	});
	alert("School info saved!");
	};
});

//Pageinit for edit page
$(document).on("pageinit", "#editSchool", function(){
	var urlData = $(this).data("url");
	var urlParts = urlData.split("?");
	var urlPairs = urlParts[1].split("&");
	var urlValues = {}
	for (var pair in urlPairs){
		var keyValue = urlPairs[pair].split("=");
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		urlValues[key] = value;
	}
	
	var schoolKey = urlValues["school"];
	
	$.couch.db("schooldatabase").view("app/schools",{
		key: schoolKey,
		success: function(schoolInfo){
			$.each(schoolInfo.rows, function(index, schoolData){
				var schoolObj = (schoolData.value || schoolData.doc)
				var schoolDoc = {
					_id : schoolObj.id,
					_rev : schoolObj.rev
				}
				
				$("#editId").val(schoolObj.id);
				$("#rev").val(schoolObj.rev);
				$("#editName").val(schoolObj.sName);
				$("#editBuilding").val(schoolObj.building).selectmenu();
				$("#editBuilding").selectmenu('refresh');
				$("#editEnrollment").val(schoolObj.enrollment);
			});
		}
	});
	// Form validation for edit form
	$("#editForm").validate({
		invalidHandler: function(form, validator) {
			$("#errorsLink").click();
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
			var data = $("#editForm").serializeArray();
			editSchool(data);
			window.location.reload();	
		}
	});

	// Function to push edited school data to the database
	var editSchool = function(data){
	
		var schoolInfo = {
			_id 		: $("#editId").val(),
			_rev 		: $("#rev").val(),
			sName 		: $("#editName").val(),
			building 	: $("#editBuilding").val(),
			enrollment 	: $("#editEnrollment").val(),
			schoolKey 	: $("#schoolKey").val() + $("#editName").val()
		};
		
		$.couch.db("schooldatabase").saveDoc(schoolInfo, {
			
			success: function(data){
				console.log(data)
			},
			error: function(error){
				console.log(error)
			}
		});
		alert("School info saved!");
		window.location.reload();
	};
/*	
	var editSchool = function(data){
		var editSchoolInfo = {
			"_id" 			: $("#editName").val(),
			"sName" 		: $("#editName").val(),
			"building" 		: $("#editBuilding").val(),
			"enrollment" 	: $("#editEnrollment").val(),
			"schoolKey" 	: $("#schoolKey").val() + $("#editName").val()
		};
		
		$.couch.db("schooldatabase").saveDoc(editSchool, {
			success: function(data){
				console.log(data);
			},
			error: function(status){
				console.log(status);
			}
		});
		alert("School edited and saved.");
		$.mobile.changePage("index.html");
	};	
*/
}); // End of edit pageinit

//Pageinit for delete page
$(document).on("pageinit", "#delete", function (){

    var urlData = $(this).data("url");
    var urlParts = urlData.split("?");
    var urlPairs = urlParts[1].split("&");
    
    var urlValues = {};
    for (var pair in urlPairs){
        var keyValue = urlPairs[pair].split("=");
        var key = decodeURIComponent(keyValue[0]);
        var value = decodeURIComponent(keyValue[1]);
        urlValues[key] = value;
    }

    var schoolKey = urlValues["school"];

    $.couch.db("schooldatabase").view("app/schools", {

        key: schoolKey,
        success: function(schoolInfo){

            $.each(schoolInfo.rows, function(index, schoolData) {
                var schoolObj = (schoolData.value || schoolData.doc)

                var schoolDoc = {
                _id : schoolObj.id,
                _rev : schoolObj.rev
                }
                
                $("#schoolName").val(schoolObj.sName);
                $("#schoolId").val(schoolObj.id);
                $("#schoolRev").val(schoolObj.rev);

                $(".deleteSchool").on("click", function (){

                    var verify = confirm("Delete School?");
                    if (verify) {
                        $.couch.db("schooldatabase").removeDoc(schoolDoc, {
                            success: function(data) {
                                alert("School Erased!")
                                window.location.href = "index.html";
                            }
                        });
                    } else {
                        alert("School data not erased.");
                        $.mobile.changePage("index.html");
                    } // end of else
                }) // end of delete click function

            }); // end of function
        } // end of success
    }); // end of couch view

}); //End of pageinit

