function fullMonty(brain_array,desc) {
    // some global vars
    fps = 25;
    current_canvas = '';
    var the_horse = $('<div/>');

    // create CSS rules
    setupCSS();

    // listen for mouseup
    $(window).mouseup(function() {
        $(current_canvas).unbind("mousemove");
    });

    // loop over each video submitted
    $.each(brain_array, function(title,src) {
        the_horse.append(buildQuad(title,src)); // add to meta div
    });

    // build description Quad
    the_horse.append(buildDescription(desc));

    return $(the_horse);
}

function buildDescription(desc) {
    var new_quad = $('<div/>', { class: 'quad' });
    new_quad.append(buildHeader('Description'));
    new_quad.append($('<p>' + desc + '</p>'));

    return $(new_quad);
}

function buildHeader(title) {
    var new_header = $('<h2>' + title + '</h2>');
    return $(new_header);
}
// create the overlay canvas
function buildOverlay(vid) {
    var offset = $(vid).offset().left - $(vid).parent().offset().left; // webkit bug makes us use offset vs position
    var new_canvas = $('<canvas/>')
        .css('left', offset + 'px');
    new_canvas[0].width = vid.videoWidth;
    new_canvas[0].height = vid.videoHeight;

    return $(new_canvas);
}
function buildQuad(title,src) {
    var new_quad = $('<div/>', { class: 'quad' });
    new_quad.append(buildHeader(title)); // build header
    var new_vid = buildVideo(src); // create the video element

    // we need video info to build the canvas, so only do so once the video is loaded
    new_vid.on('loadeddata', function() {
        var new_overlay = buildOverlay(this);

        // bind events to canvas
        $(new_overlay).mousedown(function(e) {
            current_canvas = $(this);
            var video_list = {};
            var canvas_list = {};

            var grand_div = $(this).parent().parent();
            $(grand_div).find('canvas').each(function(index, canvas) {
                var title = $(canvas).prev("h2").text();
                canvas_list[title] = canvas;
                video_list[title] = $(canvas).next("video")[0];
            });

            mythicalMagic(this,e,canvas_list,video_list);

            $(this).mousemove(function(e) {
                mythicalMagic(this,e,canvas_list,video_list);
            });
        });

        $(this).before(new_overlay); // insert overlay
    });
    new_quad.append(new_vid); // insert video element

    return $(new_quad);
}
function buildVideo(name) {
    var new_video = $('<video/>', { src: name });
    return $(new_video);
}

function clearCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLine(canvas,axis,pos) {
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = 'lime';

    if (axis == "x") {
        ctx.beginPath();
        ctx.moveTo(0,pos);
        ctx.lineTo(canvas.width,pos);
        ctx.closePath();
        ctx.stroke();
    }
    if (axis == "y") {
        ctx.beginPath();
        ctx.moveTo(pos,0);
        ctx.lineTo(pos,canvas.height);
        ctx.closePath();
        ctx.stroke();
    }
}

function mythicalMagic(canvas,cursor,canvas_list,video_list) {
    var posX = cursor.pageX - $(canvas).offset().left;
    var posY = cursor.pageY - $(canvas).offset().top;

    // clear all the canvases
    $.each(canvas_list, function(i, val){
        clearCanvas(val);
    });

    var this_title = $(canvas).prev("h2").text();

    switch(this_title) {
        case 'X':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['Y'],'y',posX);
            drawLine(canvas_list['Z'],'y',posY);

            video_list['Y'].currentTime = posY / fps;
            video_list['Z'].currentTime = posX / fps;
          break;
        case 'Y':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['X'],'y',posX);
            drawLine(canvas_list['Z'],'x',posY);

            video_list['X'].currentTime = posY / fps;
            video_list['Z'].currentTime = posX / fps;
          break;
        case 'Z':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['X'],'x',posX);
            drawLine(canvas_list['Y'],'x',posY);

            video_list['X'].currentTime = posY / fps;
            video_list['Y'].currentTime = posX / fps;
          break;
    }
}

function setupCSS() {
    $("<style>")
        .prop("type", "text/css")
        .html("\
            .quad {\
                background: black;\
                float: left;\
                margin: 5px 0;\
                height: 350px;\
                width: 470px;\
                position: relative;\
            }\
            .quad:nth-child(odd) {\
                margin-right: 10px;\
            }\
            .quad h2 {\
                color: white;\
                text-align: center;\
            }\
            .quad p {\
                color: white;\
                margin: 0 3em;\
            }\
            .quad canvas {\
                position: absolute;\
                z-index: 1;\
            }\
            .quad video {\
                cursor: crosshair;\
                display: block;\
                margin: auto;\
            }\
        ")
        .appendTo("head");
}
