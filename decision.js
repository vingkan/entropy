function Node(type, value, contents, children){
	return {
		type: type, //string
		value: value, //string
		contents: contents || [], //list of nodes
		children: children || [] //list of nodes
	}
}

var countem = 0;

function DecisionTree(dataSet, outcomeKey, emptySet){
	return {
		dataSet: dataSet,
		outcomeKey: outcomeKey, 
		emptySet: emptySet,

		root: null,

		init: function(){
			this.root = Node('root', 'Unknown', this.dataSet);
			this.root = this.handleNode(this.root);
			console.log(this.root);
		},

		handleNode: function(node){
			var split = Entropy.chooseSplitPoint(node.contents, this.outcomeKey, this.emptySet);	
			if(split.attr !== 'NONE_DEFAULT'){
				node.value = split.attr;
			}
			var branches = this.splitBranches(node.contents, split);
			node.contents = branches;
			var children = this.getChildren(branches, split);
			for(var n in children){
				if(children[n] && children[n].type === 'split'){
					var decisionNode = this.handleNode(children[n]);
					node.children.push(decisionNode);
				}
				else if(children[n] && children[n].type === 'terminal'){
					node.children.push(children[n]);
				}
			}
			return node;
		},

		splitBranches: function(nodeDataSet, split){
			var branches = {};
			for(var d in nodeDataSet){
				if(nodeDataSet[d]){
					var item = nodeDataSet[d];
					var branchKey = item[split.attr];
					if(branches[branchKey]){
						branches[branchKey].push(item);
					}
					else{
						branches[branchKey] = [item];
					}
				}
			}
			return branches;
		},

		getChildren: function(branches, split){
			var children = [];
			for(var b in branches){
				if(branches[b]){
					var newNode = null;
					var branch = branches[b];
					var smolMatrix = Entropy.getMatrixFromDataSet(branch, this.outcomeKey, this.emptySet);
					/*console.log(smolMatrix)
					console.log(split.attr)
					console.log(b)*/
					if(split.attr !== 'NONE_DEFAULT'){
						var infoMatrix = smolMatrix[split.attr][b]
						console.log(infoMatrix)
						var entropy = Entropy.entropyOneAttr(infoMatrix);
						console.log('Entropy for branch ' + b + ' is = ' + entropy)
						if(entropy > 0){
							newNode = Node('split', 'Unknown', branch);
						}
						else{
							var result = resultFromFrequency(infoMatrix);
							newNode = Node('terminal', result.name, branch);
						}
					}
					else{
						newNode = Node('unclear', 'Unknown', branch);
					}
					children.push(newNode);
				}
			}
			return children;
		},

		renderNode: function(node){
			var tds = '';
			var nList = node.children;
			for(var n = 0; n < nList.length; n++){
				var val = nList[n].type.charAt(0).toUpperCase();
				if(nList[n].children.length > 0){
					var output = this.renderNode(nList[n]);
					tds += '<td>' + output + '</td>';	
				}
				else{
					tds += '<td class="node-terminal"><div class="node-leaf">' + val + '</div></td>';
				}
			}
			var html = '<table>';
			html += '<tr><td colspan="' + nList.length + '" class="node-value">' + node.type + ': ' + node.value + '</td></tr>';
			html += '<tr>' + tds + '</tr>';
			html += '</table>';
			return html;
		},

		render: function(target){
			var html = this.renderNode(this.root);
			target.innerHTML = html;
		}

	}

}

function resultFromFrequency(freq){
	var max = {
		name: 'NONE_DEFAULT',
		value: 0
	}
	for(var i in freq){
		if(freq[i]){
			if(freq[i] > max.value){
				max.name = i;
				max.value = freq[i];
			}
		}
	}
	return max;
}