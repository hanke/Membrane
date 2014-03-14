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
    $.each(brain_array, function(view,src_array) {
        the_horse.append(buildQuad(view,src_array[0],src_array[1])); // add to meta div
    });

    if (desc != '') {
        // build description Quad
        the_horse.append(buildDescription(desc));
    }

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
function buildQuad(view,title,src) {
    var new_quad = $('<div/>', { class: 'quad' });
    new_quad.append(buildHeader(title)); // build header
    var new_vid = buildVideo(view,src); // create the video element

    // we need video info to build the canvas, so only do so once the video is loaded
    new_vid.on('loadeddata', function() {
        var new_overlay = buildOverlay(this);

        // bind events to canvas
        $(new_overlay).mousedown(function(e) {
            current_canvas = $(this);
            var video_list = {};
            var canvas_list = {};

            var grand_div = $(this).parent().parent();
            $(grand_div).find('video').each(function(index,video) {
                var view = $(video).attr("data-view");
                canvas_list[view] = $(video).prev("canvas")[0];
                video_list[view] = video;
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
function buildVideo(view,src) {
    var new_video = $('<video/>', { 'src': src, 'data-view': view });
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

function esotericSeek(video, esoteric_pos){
    var esoteric_time = esoteric_pos / fps;
    if (esoteric_time > video.duration / 2) {
        video.currentTime = esoteric_time - (video.duration / 2);
    } else {
        video.currentTime = esoteric_time + (video.duration / 2);
    }
}

function mythicalMagic(canvas,cursor,canvas_list,video_list) {
    var posX = cursor.pageX - $(canvas).offset().left;
    var posY = cursor.pageY - $(canvas).offset().top;

    // clear all the canvases
    $.each(canvas_list, function(i, val){
        clearCanvas(val);
    });

    var this_view = $(canvas).next("video").attr("data-view");
    var posThis;
    var video = video_list[this_view];
    if (video.currentTime > video.duration / 2) {
        posThis = (video.currentTime - (video.duration / 2)) * fps;
    } else {
        posThis = (video.currentTime + (video.duration / 2)) * fps; 
    }

    switch(this_view) {
        case 'a':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['b'],'x',posY); drawLine(canvas_list['b'],'y',posThis);
            drawLine(canvas_list['c'],'y',posX); drawLine(canvas_list['c'],'x',canvas_list['c'].height - posThis);

            esotericSeek(video_list['b'], posX);
            esotericSeek(video_list['c'], canvas.height - posY);
          break;
        case 'b':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['a'],'x',posY); drawLine(canvas_list['a'],'y',posThis);
            drawLine(canvas_list['c'],'x',canvas.width - posX); drawLine(canvas_list['c'],'y',posThis);

            esotericSeek(video_list['a'], posX);
            esotericSeek(video_list['c'], canvas.height - posY);
          break;
        case 'c':
            drawLine(canvas,'x',posY); drawLine(canvas,'y',posX);
            drawLine(canvas_list['a'],'y',posX); drawLine(canvas_list['a'],'x',canvas_list['a'].height - posThis);
            drawLine(canvas_list['b'],'y',canvas.height - posY); drawLine(canvas_list['b'],'x',canvas_list['b'].height - posThis);

            esotericSeek(video_list['a'], canvas.height - posY);
            esotericSeek(video_list['b'], posX);
          break;
    }
}

function setupCSS() {
    $("<style>")
        .prop("type", "text/css")
        .html("\
            .quad {\
                float: left;\
                position: relative;\
            }\
            .quad canvas {\
                cursor: crosshair;\
                position: absolute;\
                z-index: 1;\
            }\
            .quad video {\
                display: block;\
                margin: auto;\
            }\
        ")
        .appendTo("head");
}
