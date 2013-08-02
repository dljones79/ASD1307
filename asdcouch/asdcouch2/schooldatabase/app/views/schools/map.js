function(doc) {
	if (doc._id.substr(0, 7) === "school:"){
		emit(doc._id.substr(7), {
			"id" : doc._id,
			"rev" : doc._rev,
			"sName": doc.sName,
			"building": doc.building,
			"enrollment": doc.enrollment
		});
	}
};