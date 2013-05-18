function filterAdd() {
    var filterIndex = $('#filterForm div').length;
    var div = document.createElement('div');
    var delFilter = document.createElement('button');
    delFilter.role = 'button';
    delFilter.className = 'btn delFilter';
    delFilter.id = 'delFilter_' + filterIndex;
    div.appendChild(delFilter);
    var fieldSelect = document.createElement('select');
    div.appendChild(fieldSelect);
    // for ()
    $('#filterForm').prepend(div);
}

function getTypes(data, types, nameFractions) {
    for(var propName in data) {
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
	for(var i = 0; i < data.collection.length; i++) {
		getTypes(data.collection[i], types, nameFractions);
	}
	return types;
}

function getActivityMetadata(activities) {
    this.propertyTypes = parse(activities);
    // for(var propName in result) {
    //     document.write(propName + ': ' + result[propName] + '<br/>');
    // } 
}

function initFiltering() {
    this.filterProto = {
        string: {
            relations: ['matches', 'doesn\'t match']
        },
        number: {
            relations: ['&lt;', '&le;', '=', '&ge;', '&gt;', '&ne;']
        },
        boolean: {
            relations: ['=']
        }
    };
    SC.get('/me/activities', { limit: 20 }, getActivityMetadata);
    $('#addFilter').click(filterAdd);
}

initFiltering();