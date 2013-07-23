function(doc) {
	if (doc._id.substr(0, 7) === "school:"){
		emit(doc._id.substr(7), {
			"sName": doc.sName,
			"contact": doc.contact,
			"cNumber": doc.cNumber,
			"building": doc.building,
			"enrollment": doc.enrollment,
			"sports": doc.sports,
			"notes": doc.notes
		});
	}
};