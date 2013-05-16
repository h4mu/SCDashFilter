$('#addFilter').click(function() {
    var filterIndex = $('#filterForm div').length;
    var div = document.createElement('div');
    var delFilter = document.createElement('button');
    delFilter.role = 'button';
    delFilter.className = 'btn delFilter';
    delFilter.id = 'delFilter_' + filterIndex;
    div.appendChild(delFilter);
    var fieldSelect = document.createElement('select');
    div.appendChild(fieldSelect);
    
});

PropaDashFilter.prototype.getActivityMetadata = function(activities) {
    // var node = activities.collection;
    // for (var childName in node) {
    //     var child = node[childName];
    //     if (typeof child === typeof node) {
    //         node = child;
    //     } else if (child !== null) {
    //         this.activityMetadata[childName] = typeof child;
    //     }
    // }
};

function PropaDashFilter() {
    this.activityMetadata = {};
    var thisObj = this;
    SC.get('/me/activities', { limit: 20 }, function(activities) { thisObj.getActivityMetadata(activities); });
}