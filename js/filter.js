
SCFilter.prototype.loadSound = function(url, startPlaying) {
    SC.Widget($('#playerwidget iframe')[0]).load(url, { auto_play : startPlaying });    
};

SCFilter.prototype.isShowable = function(activity) {
    return activity.origin.streamable && activity.origin.embeddable_by === 'all';
};

SCFilter.prototype.populateSoundList = function(activities) {
    if(activities.next_href) {
        this.next_href = activities.next_href;        
    }
    var activityCollection = activities.collection;
    var ul = document.createElement('ul');
    ul.className = 'nav nav-list';
    for (var i = 0; i < activityCollection.length; i++) {
        if(this.isShowable(activityCollection[i])) {
            var origin = activityCollection[i].origin;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = 'javascript:void';
            li.appendChild(a);
            a.appendChild(document.createTextNode(origin.user.username + ' / ' + origin.title));
            $(li).data('uri', origin.uri);
            ul.appendChild(li);
        }
    }
    $('#sounds').empty().append(ul);
    SC.oEmbed($(ul.firstChild).data('uri'), function(oembed) {
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
                widget.load(next.addClass('active').data('uri'), { auto_play : true });
            }
        });
    });

    var thisObj = this;
    $('#sounds ul li').dblclick(function() {
        thisObj.loadSound($(this).data('uri'), true);
        $('#sounds ul li').removeClass('active');
        $(this).addClass('active');
    });
};

SCFilter.prototype.populateUserButton = function(user) {
    $('.authVisible').show();
    var i = document.createElement('i');
    i.className = 'icon-user';
    $('#user')
    .empty()
    .append(i)
    .append(document.createTextNode(user.username))
    .attr('href', user.permalink_url);
};

SCFilter.prototype.init = function(){
    SC.initialize({
      client_id: getSCClientId(),
      redirect_uri: 'https://c9.io/h4mu/scdashfilter/workspace/callback.html'
    });
    
    var thisObj = this;
    SC.connect(function() {
        SC.get('/me', function(user) { thisObj.populateUserButton(user); });
        SC.get('/me/activities', { limit: 50/*, offset: 0*/ }, function(activities) { thisObj.populateSoundList(activities); });
    });
};

function SCFilter() {
    var next_href = '';
    var thisObj = this;
    $(document).ready(function () { thisObj.init(); });
}

new SCFilter();
