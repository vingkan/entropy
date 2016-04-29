function LogBase(base, arg){
	return Math.log(arg) / Math.log(base);
}

function countTotalCases(data){
	var count = 0;
	if(typeof data === 'number'){
		count = data;
	}
	else{
		for(var attr in data){
			if(typeof data[attr] === 'number'){
				count += data[attr];
			}
			else if(data[attr]){
				count += countTotalCases(data[attr]);
			}
		}
	}
	return count;
}

function getFrequency(data, attr){
	var occurences = countTotalCases(data[attr]);
	var total = countTotalCases(data);
	return occurences / total;
}

/*
 * Dubious function
 */
function sumOutcomes(data, empty){
	var sumSet = empty || {yes: 0, no: 0};
	for(var attr in data){
		if(data[attr]){
			for(var tag in data[attr]){
				sumSet[tag] += data[attr][tag];
			}
		}
	}
	return sumSet;
}

/*
 * API Points: data can be either a map or an array!
 * entropyOneAttr({y:5, n:9}) === entropyOneAttr([5, 9])
 */
function entropyOneAttr(data){
	var sum = 0;
	for(var attr in data){
		if(data[attr]){
			var freq = getFrequency(data, attr);
			var partial = (-1 * freq) * LogBase(2, freq);
			sum += partial;
		}
	}
	return sum;
}

function entropyTwoAttr(data){
	var sum = 0;
	for(var attr in data){
		if(data[attr]){
			var outcomes = data[attr];
			var freq = getFrequency(data, attr);
			var entropy = entropyOneAttr(outcomes);
			var partial = freq * entropy;
			sum += partial;
		}
	}
	return sum;
}

function getInformationGain(data, empty){
	var emptySet = empty || {yes: 0, no: 0};
	var outcomeSet = sumOutcomes(data, emptySet); //Dubious function
	var targetEntropy = entropyOneAttr(outcomeSet);
	var splitEntropy = entropyTwoAttr(data);
	var gain = targetEntropy - splitEntropy;
	return gain;
}

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

var GolfOneAttr = {
	yes: 9,
	no: 5
}

var GolfOutlook = {
	sunny: {yes: 3, no: 2},
	overcast: {yes: 4, no: 0},
	rainy: {yes: 2, no: 3}
}


function getMatrixFromDataSet(dataSet, outcomeKey, empty){
	var emptySet = empty || {yes: 0, no: 0};
	var attributes = {};
	for(var i in dataSet){
		if(dataSet[i]){
			var sample = dataSet[i];
			var outcomeVal = sample[outcomeKey];
			for(var j in sample){
				if(sample[j] && j !== outcomeKey){
					if(!attributes[j]){
						attributes[j] = {};
					}
					var infoMap = attributes[j]
					var val = sample[j];
					if(infoMap[val]){
						infoMap[val][outcomeVal]++;
					}
					else{
						infoMap[val] = empty || {Yes: 0, No: 0};
						infoMap[val][outcomeVal] = 1;
					}
				}
			}
		}
	}
	return attributes;
}

function topInformationGain(dataSet, outcomeKey, empty){
	var matrix = getMatrixFromDataSet(dataSet, outcomeKey);
	var gainMap = {};
	var emptySet = empty || {yes: 0, no: 0};
	for(var info in matrix){
		if(matrix[info]){
			console.log(matrix[info])
			var gain = getInformationGain(matrix[info], emptySet);
			gainMap[info] = gain;
		}
	}
	var maxGain = {
		attr: 'NONE_DEFAULT',
		gain: 0
	}
	for(var info in gainMap){
		var gain = gainMap[info];
		if(gain > maxGain.gain){
			maxGain.attr = info;
			maxGain.gain = gain;
		}
	}
	return maxGain;
}

var topGain = topInformationGain(GolfData, 'play', {Yes: 0, No: 0});
console.log(topGain);