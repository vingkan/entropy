var GolfData = [
	{outlook: 'Rainy', temp: 'Hot', humidity: 'High', windy: 'False', play: 'No'},
	{outlook: 'Rainy', temp: 'Hot', humidity: 'High', windy: 'True', play: 'No'},
	{outlook: 'Overcast', temp: 'Hot', humidity: 'High', windy: 'False', play: 'Yes'},
	{outlook: 'Sunny', temp: 'Mild', humidity: 'High', windy: 'False', play: 'Yes'},
	{outlook: 'Sunny', temp: 'Cool', humidity: 'Normal', windy: 'False', play: 'Yes'},
	{outlook: 'Sunny', temp: 'Cool', humidity: 'Normal', windy: 'True', play: 'No'},
	{outlook: 'Overcast', temp: 'Cool', humidity: 'Normal', windy: 'True', play: 'Yes'},
	{outlook: 'Rainy', temp: 'Mild', humidity: 'High', windy: 'False', play: 'No'},
	{outlook: 'Rainy', temp: 'Cool', humidity: 'Normal', windy: 'False', play: 'Yes'},
	{outlook: 'Sunny', temp: 'Mild', humidity: 'Normal', windy: 'False', play: 'Yes'},
	{outlook: 'Rainy', temp: 'Mild', humidity: 'Normal', windy: 'True', play: 'Yes'},
	{outlook: 'Overcast', temp: 'Mild', humidity: 'High', windy: 'True', play: 'Yes'},
	{outlook: 'Overcast', temp: 'Hot', humidity: 'Normal', windy: 'False', play: 'Yes'},
	{outlook: 'Sunny', temp: 'Mild', humidity: 'High', windy: 'True', play: 'No'}
];

/*console.log("GOLF DATA");
var split = Entropy.chooseSplitPoint(GolfData, 'play', {Yes: 0, No: 0});
var tree = DecisionTree(GolfData, 'play', {Yes: 0, No: 0});
tree.init();
var target = document.getElementById('golf-tree');
tree.render(target);*/

var start = Date.now();
var count = 1000;
var url = "https://data.cityofchicago.org/resource/ucdv-yd74.json";
getData(url, {}, count,
	function(data){
		if(data['inspection_status'] !== 'CLOSED'){
			data['inspection_status'] = 'FAILED';
		}
		var clean = {
			status: data['inspection_status'],
			category: data['inspection_category'],
			department: data['department_bureau']
		}
		return clean;
	},
	function(dataSet){
		console.log('Cleaned in ' + (Date.now() - start) + ' ms.');
		start = Date.now()
		var tree = DecisionTree({
			outcomeKey: 'status',
			emptySet: {CLOSED: 0, FAILED: 0}
		});
		tree.train(dataSet);
		console.log('Trained in ' + (Date.now() - start) + ' ms.');
		start = Date.now()
		tree.render(document.getElementById('buildings-tree'));
		console.log('Rendered in ' + (Date.now() - start) + ' ms.');
});