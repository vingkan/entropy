function Node(type, value, contents, children){
	return {
		type: type, //string
		value: value, //string
		contents: contents || [], //list of nodes
		children: children || [] //list of nodes
	}
}

function DecisionTree(config){
	return {
		title: config.title || "Decision Tree",
		outcomeKey: config.outcomeKey, 
		emptySet: config.emptySet,
		attributes: config.attributes,
		root: null,

		train: function(dataSet){
			this.root = Node('root', {}, dataSet);
			this.root = this.trainNode(this.root);
		},

		trainNode: function(node){
			var split = Entropy.chooseSplitPoint(node.contents, this.outcomeKey, this.emptySet);
			if(split.attr !== 'NONE_DEFAULT'){
				node.value.result = split.attr;
			}
			var branches = this.splitBranches(node.contents, split);
			node.contents = branches;
			var children = this.getChildren(branches, split);
			for(var n in children){
				if(children[n] && children[n].type === 'split'){
					var decisionNode = this.trainNode(children[n]);
					node.children.push(decisionNode);
				}
				else if(children[n]){
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
			if(split.attr !== 'NONE_DEFAULT'){
				for(var b in branches){
					if(branches[b]){
						var newNode = null;
						var branch = branches[b];
						var smolMatrix = Entropy.getMatrixFromDataSet(branch, this.outcomeKey, this.emptySet);
						try{
							var infoMatrix = smolMatrix[split.attr][b]
						}
						catch(e){
							console.warn(e);
							console.log(smolMatrix)
						}
						var entropy = Entropy.entropyOneAttr(infoMatrix);
						var result = resultFromFrequency(infoMatrix, this.outcomeKey);
						var value = {
							result: result.name,
							attr: split.attr,
							branch: b,
							confidence: result.confidence
						}
						var type = 'split'
						if(entropy > 0){
							var hasSplit = Entropy.chooseSplitPoint(branch, this.outcomeKey, this.emptySet);
							if(hasSplit.attr === 'NONE_DEFAULT'){
								type = 'terminal'
							}
						}
						else{
							type = 'terminal'
						}
						newNode = Node(type, value, branch);
						children.push(newNode);
					}
				}
			}
			return children;
		},

		traverseRules: function(){

			function traverseNode(node, pathList){
				var rules = [];
				var path = pathList || [];
				if(node.value.attr && node.value.branch){
					path.push({
						attr: node.value.attr,
						value: node.value.branch
					});
				}
				if(node.children.length > 0){
					for(var n in node.children){
						if(node.children[n]){
							var pathStub = _.clone(path);
							var childRules = traverseNode(node.children[n], pathStub);
							rules.push.apply(rules, childRules);
						}
					}
				}
				else{
					rules.push({
						path: path,
						result: node.value.result,
						size: node.contents.length,
						confidence: node.value.confidence
					});
				}
				return rules;
			}

			var rules = traverseNode(this.root, []);
			return rules;

		},

		renderTooltip: function(node){
			return node + '';
		},

		renderNode: function(node){
			var results = '';
			var nList = node.children;
			for(var n = 0; n < nList.length; n++){
				var resultName = nList[n].type.charAt(0).toUpperCase();
				var tooltip = this.renderTooltip(nList[n]);
				var splitName = this.attributes[node.value.result];
				var branchName = nList[n].value.branch;
				if(nList[n].children.length > 0){
					var output = this.renderNode(nList[n]);
					results += '<td class="node-terminal"><div class="branch">|</div><div class="node-split">' + branchName + '</div>' + output + '</td>';	
				}
				else{
					var notes = null;
					var num = nList[n].contents.length;
					var confidence = nList[n].value.confidence.toFixed(4);
					if(num > 0){
						notes = nList[n].value.result + ' (' + num + ')';
					}
					else{
						notes = '...';
					}
					results += '<td class="node-terminal"><div class="branch">|</div><div class="node-split">' + branchName + '</div><div class="node-leaf" style="opacity: ' + confidence + '">' + notes + '</div><div class="node-tooltip">' + tooltip + '</div></td>';
				}
			}
			var html = '<table class="tree">';
			html += '<tr><td colspan="' + nList.length + '" class="node-value">' + splitName + '</td></tr>';
			html += '<tr>' + results + '</tr>';
			html += '</table>';
			return html;
		},

		render: function(targetID){
			var target = document.getElementById(targetID);
			var html = ''
				html += '<h1>' + this.title + '</h1>';
				html += this.renderNode(this.root);
				html += this.renderRules();
			if(target){
				target.innerHTML = html;
			}
			else{
				var div = document.createElement('div');
				div.innerHTML = html;
				document.body.appendChild(div);
			}
		},

		ruleToString: function(rule){
			var res = '';
			var arrow = ' &rarr; ';
			for(var r = 0; r < rule.path.length; r++){
				var step = rule.path[r];
				res += this.attributes[step.attr] + ': ' + step.value;
				if(!(r === (rule.path.length-1))){
					res += arrow;
				}
			}
			return res;
		},

		ruleToTable: function(rule){
			var res = '<table class="rule-path">';
				var attrs = '';
				var values = '';
				for(var r in rule.path){
					if(rule.path[r]){
						var step = rule.path[r];
						attrs += '<th>' + step.attr + '</th>';
						values += '<td>' + step.value + '</td>';
					}
				}
				res += '<tr>' + attrs + '</tr>';
				res += '<tr>' + values + '</tr>';
			res += '</table>';
			return res;
		},

		renderRules: function(){
			var rules = this.traverseRules();
			rules = rules.sort(function(a, b){
				var aConf = a.confidence * a.size;
				var bConf = b.confidence * b.size;
				return bConf - aConf;
			});
			var html = '';
			html += '<h2>Decision Rules</h2>';
				html += '<table class="rules">';
				html += '<tr>';
					html += '<td><h3>Rule</h3></td>';
					html += '<td><h3>Result</h3></td>';
					html += '<td><h3>n</h3></td>';
					html += '<td><h3>p</h3></td>';
				html += '</tr>';
				for(var r in rules){
					if(rules[r]){
						var rule = rules[r];
						var row = '';
						var rulesCell = '<td>' + this.ruleToString(rules[r]) + '</td>';
						var resCell = '<td>' + rule.result + '</td>';
						var nCell = '<td>' + rules[r].size + '</td>';
						var pCell = '<td>' + (1.0 - rules[r].confidence).toFixed(4) + '</td>';
						if(rules[r].confidence >= 0.95){
							nCell = '<td><span class="confident">' + rules[r].size + '</span></td>';
							pCell = '<td><span class="confident">' + (1.0 - rules[r].confidence).toFixed(4) + '</span></td>';
						}
						row = rulesCell + resCell + nCell + pCell;
						html += '<tr style="opacity: ' + rules[r].confidence + '">' + row + '</tr>';
					}
				}
				html += '</table>'
			return html;
		}

	}

}

function resultFromFrequency(freq, outcomeKey){
	var max = {
		name: 'NONE_DEFAULT',
		value: 0
	}
	for(var i in freq){
		if(freq[i] && i !== outcomeKey){
			if(freq[i] > max.value){
				max.name = i;
				max.value = freq[i];
			}
		}
	}
	max.confidence = Entropy.getFrequency(freq, max.name);
	return max;
}