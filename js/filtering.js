function filterAdd() {
    var div = document.createElement('div');
    div.className = 'filterDiv stringFilter';
    var delFilter = document.createElement('button');
    delFilter.role = 'button';
    delFilter.className = 'btn delFilter stringFilter numberFilter booleanFilter';
    div.appendChild(delFilter);
    $(delFilter).click(function() {
        var parent = this.parentNode;
        parent.parentNode.removeChild(parent);
    });
    delFilter.appendChild(document.createTextNode('-'));
    var fieldSelect = document.createElement('select');
    fieldSelect.className = 'stringFilter numberFilter booleanFilter';
    div.appendChild(fieldSelect);
    for (var field in propertyTypes) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(field));
        fieldSelect.appendChild(option);
    }
    $(fieldSelect).change(function() {
        this.parentNode.className = 'filterDiv ' + propertyTypes[$(this).val()] + 'Filter';
    });
    var relationString = createSelect(['matches', 'doesn\'t match']);
    relationString.className = 'stringFilter';
    div.appendChild(relationString);
    var relationNumber = createSelect(['&lt;', '&le;', '=', '&ge;', '&gt;', '&ne;']);
    relationNumber.className = 'numberFilter';
    div.appendChild(relationNumber);
    var relationBoolean = document.createElement('span');
    relationBoolean.appendChild(document.createTextNode('='));
    relationBoolean.className = 'booleanFilter';
    div.appendChild(relationBoolean);
    var inputString = document.createElement('input');
    inputString.type = 'text';
    inputString.className = 'stringFilter';
    div.appendChild(inputString);
    var inputNumber = document.createElement('input');
    inputNumber.type = 'number';
    inputNumber.className = 'numberFilter';
    div.appendChild(inputNumber);
    var inputBoolean = createSelect(['false', 'true']);
    inputBoolean.className = 'booleanFilter';
    div.appendChild(inputBoolean);
    $('#filterForm').prepend(div);
}

function createSelect(items) {
    var select = document.createElement('select');
    for (var i = 0; i < items.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = items[i];
        select.appendChild(option);
    }
    return select;
}

function getTypes(data, types, nameFractions) {
    for (var propName in data) {
		nameFractions.push(propName);
		var prop = data[propName];
		if (typeof prop === 'object') {
			getTypes(prop, types, nameFractions);
		} else {
			types[nameFractions.join('.')] = typeof prop;
		}
		nameFractions.pop();
	}
}
	
function parse(data) {
	var types = {}, nameFractions = [];
	for (var i = 0; i < data.collection.length; i++) {
		getTypes(data.collection[i], types, nameFractions);
	}
	return types;
}

function getActivityMetadata(activities) {
    propertyTypes = parse(activities);
    // for(var propName in result) {
    //     document.write(propName + ': ' + result[propName] + '<br/>');
    // } 
}

function initFiltering() {
    // SC.get('/me/activities', { limit: 20 }, getActivityMetadata);
    $('#addFilter').click(filterAdd);
}

var propertyTypes = {a:'string', b:'number', c:'boolean'};
initFiltering();
