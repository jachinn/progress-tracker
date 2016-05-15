var table = document.querySelector('#tracker tbody');
var headings = document.getElementById('headings');
var button = document.querySelectorAll('button');
// var form = document.querySelector('form');
var inputs = document.querySelectorAll('.inputs input');
var upload = document.querySelector('.upload input');
var exportData = []; 

upload.addEventListener('change', function() {
	Array.prototype.forEach.call(upload.files, function(file) {
		readFile(file).then(function(data) {
			table.textContent = '';
			var json = JSON.parse(data);
			for (var i = 0; i < json.length; i++) {
				var row = document.createElement('tr');
				row.appendChild(elt('td', json[i].todo));
				row.appendChild(elt('td', json[i].need));
				row.appendChild(elt('td', json[i].have));
				row.appendChild(elt('td', json[i].where));
				
				deleteButton(row);
				table.appendChild(row);
			}
			upload.value = '';
		}, function(error) {
			console.log("Couldn't import data.");
		});

	});
});

var added = [];
button[0].addEventListener('click', submit);
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('keypress', function(event) {
		if (event.keyCode == 13) {
			submit();
		}
	});
}

function readFile(file) {
	return new Promise(function(succeed, fail) {
		var reader = new FileReader();
		reader.addEventListener('load', function() {
			succeed(reader.result);
		});
		reader.addEventListener('error', function() {
			fail(reader.error);
		});
		reader.readAsText(file);
	});

}

function elt(name, text) {
	var el = document.createElement(name);
	el.textContent = text;
	return el;
}


button[1].addEventListener('click', function() {
	var rows = document.querySelectorAll('tr:not(#headings)');
	console.log(rows);
	Array.prototype.forEach.call(rows, function(row) {
		var todo = row.children[0].textContent;
		var need = row.children[1].textContent;
		var have = row.children[2].textContent;
		var where = row.children[3].textContent;
		exportData.push({
			'todo': todo,
			'need': need,
			'have': have,
			'where': where
		});
	});
	console.log(exportData);
	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(exportData));
	window.open(url, '_blank');
	window.focus();
});

function submit() {
	var item = inputs[0].value;
	var row = document.createElement('tr');
	if (added.length == 0 || added.indexOf(item) == -1) {
		added.push(item);
		createRow(row);
		deleteButton(row);
		table.appendChild(row);

	} else {
		var data = table.querySelectorAll('tr:not(#headings)');
		Array.prototype.forEach.call(data, function(row) {
			if (row.childNodes[0].textContent == item) {
				var newRow = document.createElement('tr');
				updateRow(newRow, row)
				deleteButton(newRow);
				table.replaceChild(newRow, row);
				return;
			}
		});
	}

}

function createRow(row) {
	for (var i = 0; i < inputs.length; i++) {
			var cell = document.createElement('td');
			cell.textContent = inputs[i].value;
			row.appendChild(cell);
			inputs[i].value = '';
	}
	inputs[0].focus();
}

function updateRow(row, old) {
	for (i = 0; i < inputs.length; i++) {
		var cell = document.createElement('td');
		if (i == 1 || i == 2) {
			if (isNaN(parseInt(old.children[i].textContent)) || isNaN(parseInt(inputs[i].value))) {
				cell.textContent = inputs[i].value;
			} else {
			cell.textContent = parseInt(old.children[i].textContent) + parseInt(inputs[i].value);
			}
		}
		else {
			cell.textContent = inputs[i].value;
		}
		row.appendChild(cell);
		inputs[i].value = '';
	}
	inputs[0].focus()
}

function deleteButton(row) {
	var del = document.createElement('td');
		del.appendChild(document.createElement('button'));
		del.childNodes[0].textContent = "Delete";
		del.className = "delete";
		row.appendChild(del);
		del.addEventListener('click', function() {
			added.splice(added.indexOf(row.children[0].textContent))
			table.removeChild(row);
		});
}
