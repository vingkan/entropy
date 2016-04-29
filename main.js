function LogBase(base, arg){
	return Math.log(arg) / Math.log(base);
}

var GolfOneAttr = {
	yes: 9,
	no: 5
}

var GolfOutlook = {
	sunny: {yes: 3, no: 2},
	overcast: {yes: 4, no: 0},
	rainy: {yes: 2, no: 3}
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
			console.log(entropy);
			sum += partial;
		}
	}
	return sum;
}

function getInformationGain(data){
	var outcomeSet = sumOutcomes(data); //Dubious function
	var targetEntropy = entropyOneAttr(outcomeSet);
	var splitEntropy = entropyTwoAttr(data);
	var gain = targetEntropy - splitEntropy;
	return gain;
}

var eGolfOne = entropyOneAttr(GolfOneAttr);
console.log('The entropy for one attribute is: ' + eGolfOne);
var eGolfTwo = entropyTwoAttr(GolfOutlook);
console.log('The entropy for two attribute is: ' + eGolfTwo);

getInformationGain(GolfOutlook)