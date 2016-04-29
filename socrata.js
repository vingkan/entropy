var URL = "https://data.cityofchicago.org/resource/ucdv-yd74.json";
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

function getData(query, limit, callback){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: URL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			handleRequestData(callback, data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleRequestData(callback, dataList){
	var cleanList = [];
	for(var d in dataList){
		if(dataList[d]){
			var n = dataList[d];
			if(n['inspection_status'] !== 'CLOSED'){
				n['inspection_status'] = 'FAILED';
			}
			var a = {
				inspection_status: n['inspection_status'],
				inspection_category: n['inspection_category'],
				department_bureau: n['department_bureau']
			}
			cleanList.push(a);
		}
	}
	callback(cleanList);
}