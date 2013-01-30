/*
 * based on the work of Rasul Bahmanziari (rasul.b@gmail.com / http://gahnevesht.name/)
 * I suspect he based his work on Julien Roumagnac (http://www.j-roumagnac.net/).
 *
 * social & rss icons created by Helen Gizi (http://www.onextrapixel.com/2012/02/28/freebies-black-white-minimal-social-icons-pack/)
 *
 * rewritten and improved to enhance CSS3 support and enjoy the new browsers capabalities rather than Javascript's
 * Pierre Bodilis
 * http://rataki.eu/
 * pierre.bodilis@rataki.eu
 * 
 */
var panelOut;
$(window).load(function () {
    // let's chose current color - same for all pages
    setTheme(readCookie('theme_color'), false);
    $('#menu.but.color a').click(function() {
        setTheme(this.className, true);
        createCookie('theme_color', this.className, 30);
    });

    var isAnImage = document.location.href.indexOf('x=') == -1;

    if (isAnImage) { // that's an image, let's load the image stuff and the panel
        var fromComments = document.location.href.indexOf('comments') > -1;

        $('#thank_for_comment').toggleClass('show', fromComments);
        panelOut = fromComments || readCookie('theme_panelVisibility') == '1';
        $('#panel').toggleClass('out', panelOut);
        $('#panel_handle').click(function (event) {
            togglePanel();
        });

        arrowsTooltip();
        refreshElements();
        CSBfleXcroll('panel_scroll');
        checkCommentForm();
        $('#photo_frame').fadeIn(400);
    }
});
$(window).resize(function () {
    refreshElements();
});

function setTheme(className, transition) {
    if (transition) className += ' themeTransition';
    document.body.className = className;
}

function arrowsTooltip() {
    $('.wtooltip').tipsy({
        offset: 5,
        opacity: 0.9,
        gravity: 'w',
    });
    $('.etooltip').tipsy({
        offset: 5,
        opacity: 0.9,
        gravity: 'e',
    });
}
function togglePanel() {
    $('#panel').addClass('transition');
    $('#panel').toggleClass('out');
    panelOut = !panelOut;
    createCookie('theme_panelVisibility', (panelOut ? '1' : '0'), 30);
}

function refreshElements() {
    setPanelHeight();
    setPhotoPositionAndInfo();
}
function setPanelHeight() {
    newPanelHeight = dE.clientHeight - $('#header').height();
    $('#panel').css('height', newPanelHeight)
}
function setPhotoPositionAndInfo() {
    var borderWidth = 5; // check in css file #photo_frame for consistency
    var frameWidth, frameHeight, resizedWidth, resizedHeight;
    
    if (imageHeight < dE.clientHeight - $('#header').height() - borderWidth * 2 - 20) {
        resizedHeight = imageHeight;
        resizedWidth = imageWidth;
    } else { // height smaller than the display area, let's resize the image
        resizedHeight = dE.clientHeight - $('#header').height() - borderWidth * 2 - 20;
        resizedWidth = resizedHeight * imageWidth / imageHeight;
    }
    frameHeight = resizedHeight;
    frameWidth = resizedWidth;
    
    $('#photo_frame').css({
        'width': frameWidth,
        'height': frameHeight,
        'margin-left': -(frameWidth/2) + $('#panel_handle').width()/2 - borderWidth,
        'margin-top': -(frameHeight/2) + $('#header').height()/2 - borderWidth,
    });
    $('#photo_infos').css({
        'bottom': (dE.clientHeight - frameHeight) / 2, // + $('#header').height() - $('#photo_infos').height(),
        'left': (dE.clientWidth + frameWidth) / 2 + $('#panel_handle').width(),
    });
//     $('#photo_infos').css({
//         top:frameHeight * 3/2,
//         left:frameWidth * 3/2,
//     });
}

function checkCommentForm() {
    $('#message').val(defaultValue).focus(function () {
        if ($(this).val() == defaultValue) {
            $(this).val('')
        }
    }).blur(function () {
        if ($(this).val() == '') {
            $(this).val(defaultValue)
        }
    });
    $('#comment_submit').click(function () {
        var name = $('#name');
        var email = $('#email');
        var message = $('#message');

        var nameNOK = name.val().length < 3;
        name.toggleClass('error', nameNOK);

        var emailNOK = !isValidEmailAddress(email.val());
        email.toggleClass('error', emailNOK);

        var messageNOK = message.val().length < 3 || message.val() == defaultValue;
        message.toggleClass('error', messageNOK);

        if (!emailNOK && !nameNOK && !messageNOK) {
            $('#comment_submit').val(sendingValue).attr('disabled', 'disabled');
            $('#form').submit();
        }
        return false;
    })
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress)
}


// cookies! yummy
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

