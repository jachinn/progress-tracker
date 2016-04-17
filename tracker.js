var table = document.getElementById('tracker');
var headings = document.getElementById('headings');
var button = document.querySelectorAll('button');
// var form = document.querySelector('form');
var inputs = document.querySelectorAll('input');
var added = [];
button[0].addEventListener('click', submit);
for (var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('keypress', function(event) {
		if (event.keyCode == 13) {
			submit();
		}
	});
}

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