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
	var storeData = function(data){
		if(!data){
			var uniqueId = Math.floor(Math.random()*1000000001);
		}else{
			var uniqueId = data;
		}// end if 
		
		var obj ={};
			obj.sName = ["School:", $('sName').value];
			obj.contact = ["Contact:", $('contact').value];
			obj.cNumber = ["Phone #:", $('cNUmber').value];
			obj.building = ["Building:", $('building').value];
			
	};// end storeData
});

//pageinit for display page
$('#display').on('pageinit', function(){
	// code needed for display page goes here
});