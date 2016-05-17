buildTreeFromData({
	title: 'Will the building pass inspection?',
	url: 'https://data.cityofchicago.org/resource/ucdv-yd74.json',
	size: 10000,
	outcome: 'inspection_status',
	success: 'CLOSED',
	failure: 'FAILED',
	attributes: {
		'inspection_status': 'Status',
		'inspection_category': 'Category',
		'department_bureau': 'Bureau',
	}
});

buildTreeFromData({
	title: 'Will the sanitation complaint be closed?',
	url: 'https://data.cityofchicago.org/resource/kcdz-f29q.json',
	size: 10000,
	outcome: 'status',
	success: 'Completed',
	failure: 'Open',
	attributes: {
		'ward': 'Ward',
		'police_district': 'District',
		'community_area': 'Community'
	}
});

buildTreeFromData({
	title: 'Will the micro-market recovery permit be approved?',
	url: 'https://data.cityofchicago.org/resource/w9hv-pqhu.json',
	size: 10000,
	outcome: 'permit_status',
	success: 'C',
	failure: 'X',
	attributes: {
		'permit_type_description': 'Description',
		'mmrp_zone': 'Zone',
		'community_area': 'Community',
		'ward': 'Ward'
	}
});