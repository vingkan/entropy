var URL = "https://data.cityofchicago.org/resource/ucdv-yd74.json";
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

function getData(url, query, limit, cleaner, callback){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: url,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			handleRequestData(cleaner, callback, data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleRequestData(cleaner, callback, dataList){
	var cleanList = [];
	for(var d in dataList){
		if(dataList[d]){
			var a = cleaner(dataList[d])
			cleanList.push(a);
		}
	}
	callback(cleanList);
}

function buildTreeFromData(config){
	var empty = {};
		empty[config.success] = 0;
		empty[config.failure] = 0;
	config.attributes[config.outcome] = config.outcome;
	getData(config.url, {}, config.size,
		function(data){
			if(data[config.outcome] !== config.success){
				data[config.outcome] = config.failure;
			}
			clean = {}
			for(var key in config.attributes){
				if(config.attributes[key]){
					clean[key] = data[key]
				}
			}
			return clean;
		},
		function(dataSet){
			var tree = DecisionTree({
				title: config.title,
				outcomeKey: config.outcome,
				attributes: config.attributes,
				emptySet: empty
			});
			tree.train(dataSet);
			tree.render();
	});
}