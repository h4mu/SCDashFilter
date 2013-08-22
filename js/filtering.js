function filterAdd() {
    var div = document.createElement('div');
    div.className = 'stringFilter';     //TODO use 1st elem
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
        this.parentNode.className = propertyTypes[$(this).val()] + 'Filter';
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
    $('#filterForm div:last-child').before(div);
    return div;
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
	
function getActivityMetadata() {
    var nameFractions = [], lis = $('#sounds li');
	for (var i = 0; i < lis.length; i++) {
		getTypes($(lis[i]).data('activity'), propertyTypes, nameFractions);
	}
}

// GS: \u241D RS: \u241E US: \u241F
function saveFilters() {
    var divs = $('#filterForm div'), filters = [];
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        if (div.className) {
            var filter = [ div.className ];
            for (var j = 1; j < div.childNodes.length; j++) {
                var childNode = div.childNodes[j];
                if (childNode.className.indexOf(div.className) >= 0) {
                    var value = $(childNode).val();
                    filter.push(value);
                }
            }
            filters.push(filter.join('\u241F'));
        }
    }
    if (localStorage) {
        localStorage.SCFilterFilters = filters.join('\u241E');
    }
}

function loadFilters() {
    if (localStorage.SCFilterFilters) {
        var filters = localStorage.SCFilterFilters.split('\u241E');
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i].split('\u241F'),
            div = filterAdd(),
            children = $(div).children('.' + filter[0]);
            div.className = filter[0];
            for (var j = 1; j < filter.length && j < children.length; j++) {
                if (filter[j]) {
                    $(children[j]).val(filter[j]);
                }
            }
        }
    }
}

function saveAndApplyFilters() {
    saveFilters();
    applyFilters();
}

function initFiltering() {
    getActivityMetadata();
    loadFilters();
    $('#addFilter').click(filterAdd);
    $('#filterApply').click(saveAndApplyFilters);
}

var propertyTypes = {};
