$(document).ready(function(){

SC.initialize({
  client_id: getSCClientId(),
  redirect_uri: 'https://c9.io/h4mu/scdashfilter/workspace/callback.html'
});

SC.get('/me', function(me, error) {
    if (error) {
        if (error.message.indexOf('401') === 0) {
            SC.connect(function() {SC.get('/me', populateUserButton);});
        } else {
            console.log(error.message);
        }
    } else {
        populateUserButton(me);
    }
});

var widgetIframe = document.createElement('iframe');
$('#playerwidget').empty().append($(widgetIframe).attr(
    {
        id:"sc-widget",
        src:"https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/91595019",
        width:"100%",
        height:"170",
        scrolling:"no",
        frameborder:"no"
    }));
var widget = SC.Widget(widgetIframe);

widget.bind(SC.Widget.Events.READY, function() {
    widget.getVolume(function(volume) {
        $('#range').attr({
          min: 0,
          max: 100
        })
        .val(volume)
        .change(function() {
            widget.setVolume($('#range').val());
            // widget.getVolume(function(volume) {
            //     console.log('current volume value is ' + volume);
            // });
        });
    });
});

$('#filter').submit(function() { SC.get('/me/activities', { limit: 50/*, offset: 0*/ }, populateSoundList) });

});

function populateSoundList(activities) {
    
}

function populateUserButton(user) {
    $('.authVisible').show();
    var i = document.createElement('i');
    i.className = 'icon-user';
    $('#user')
    .empty()
    .append(i)
    .append(document.createTextNode(user.username))
    .attr('href', user.permalink_url);
}
