buildTreeFromData({
	title: 'Will the building pass inspection?',
	url: 'https://data.cityofchicago.org/resource/ucdv-yd74.json',
	size: 1000,
	outcome: 'inspection_status',
	success: 'CLOSED',
	failure: 'FAILED',
	attributes: ['inspection_status', 'inspection_category', 'department_bureau']
});