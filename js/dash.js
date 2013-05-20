
function isAllowed(prop, type, relation, value) {
    switch (relation) {
        case '':
        case '=':
            return prop == value;
        case '≥':
            return prop >= value;
        case '>':
            return prop > value;
        case '≠':
            return prop != value;
        case '<':
            return prop < value;
        case '≤':
            return prop <= value;
        case 'matches':
            return new RegExp(prop).test(value);
        case 'doesn\'t match':
            return ! new RegExp(prop).test(value);
        default:
            return true;
    }
}

function getPropertyValue(obj, propertyName) {
    var components = propertyName.split('.');
    for (var i = 0; i < components.length; i++) {
        obj = obj[components[i]];
    }
    return obj;
}

function isHidden(activity, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (!isAllowed(getPropertyValue(activity, filter[1]), filter[0], filter[2], filter[3])) {
            return true;
        }
    }
    return false;
}

function filterActivities(filters) {
    var lis = $('#sounds ul li');
    for (var i = 0; i < lis.length; i++) {
        var li = $(lis[i]);
        if (isHidden(li.data('activity'), filters)) {
            li.addClass('filteredOut');
        } else {
            li.removeClass('filteredOut');
        }
    }
    lis.slideDown();
    $('.filteredOut').slideUp();
}

function applyFilters() {
    if (localStorage.SCFilterFilters) {
        var filters = localStorage.SCFilterFilters.split('\u241E');
        for (var i = 0; i < filters.length; i++) {
            filters[i] = filters[i].split('\u241F');
        }
        filterActivities(filters);
    }
}

function loadSound(url, startPlaying) {
    SC.Widget($('#playerwidget iframe')[0]).load(url, { auto_play : startPlaying });    
}

function isActivityShowable(activity) {
    return activity.origin.streamable && activity.origin.embeddable_by === 'all';
}

function populateSoundList(activities) {
    if(activities.next_href) {
        next_href = activities.next_href;        
    }
    var activityCollection = activities.collection;
    var ul = document.createElement('ul');
    ul.className = 'nav nav-list';
    for (var i = 0; i < activityCollection.length; i++) {
        var activity = activityCollection[i];
        if(isActivityShowable(activity)) {
            var origin = activity.origin;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = 'javascript:void';
            li.appendChild(a);
            a.appendChild(document.createTextNode(origin.user.username + ' / ' + origin.title));
            $(li).data('activity', activity);
            ul.appendChild(li);
        }
    }
    $('#sounds').empty().append(ul);
    SC.oEmbed($(ul.firstChild).addClass('active').data('activity').origin.uri, function(oembed) {
        $('#playerwidget').html(oembed.html);
        var widget = SC.Widget($('#playerwidget iframe')[0]);
        
        widget.bind(SC.Widget.Events.READY, function() {
            widget.getVolume(function(volume) {
                $('#range').attr({
                  min: 0,
                  max: 100
                })
                .val(volume)
                .change(function() {
                    widget.setVolume($('#range').val());
                });
            });
        });
        widget.bind(SC.Widget.Events.FINISH, function() {
            var active = $('li.active');
            var next = active.next();
            if(next.length > 0) {
                active.removeClass('active');
                widget.load(next.addClass('active').data('activity').origin.uri, { auto_play : true });
            }
        });
    });

    $('#sounds ul li').dblclick(function() {
        loadSound($(this).data('activity').origin.uri, true);
        $('#sounds ul li').removeClass('active');
        $(this).addClass('active');
    });
    
    if (initFiltering) {
        initFiltering();
    }
}

function renderUserButton(user) {
    $('.authVisible').show();
    var i = document.createElement('i');
    i.className = 'icon-user';
    $('#user')
    .empty()
    .append(i)
    .append(document.createTextNode(user.username))
    .attr('href', user.permalink_url);
}

function init(){
    SC.initialize({
      client_id: getSCClientId(),
      redirect_uri: 'https://c9.io/h4mu/scdashfilter/workspace/callback.html'
    });
    
    SC.connect(function() {
        SC.get('/me', renderUserButton);
        SC.get('/me/activities', { limit: 50/*, offset: 0*/ }, populateSoundList);
        // SC.get('/me/activities', { limit: 20 }, getActivityMetadata);
    });
}

var next_href = '';
$(document).ready(init);
