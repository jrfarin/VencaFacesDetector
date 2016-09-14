/* jshint loopfunc: true */

(function () {
    "use strict";

    // Init flash bulb sound

    var sources = [
        { 'type': 'audio/ogg',  'ext': 'ogg' },
        { 'type': 'audio/mpeg', 'ext': 'mp3' },
        { 'type': 'audio/wav',  'ext': 'wav' },
        { 'type': 'audio/aac',  'ext': 'aac' }
    ], 
    source,
    sound = new Audio(),
    processing = false;

    for (var s = 0; s < sources.length; s++) {
        source = document.createElement('source');
        source.type = sources[s].type;
        source.src  = '/sounds/flash.' + sources[s].ext;
        sound.appendChild(source);
    }

    sound.load();

    // jQuery Stuff

    $(function() {
        var $video = $('#demo-video'),
            $img   = $('#demo-img');

        // Flash flash bulb

        function flash() {
            $('<div />', {
                'class': 'flash'
            })
            .appendTo('body')
            .fadeOut('fast', function() {
                $(this).remove();
            });

            sound.play();
        }

        // Demo
        // Detect faces in Pictures

        $('.do-img-detect').click(function(e) {
            e.preventDefault();

            if (processing) {
                return false;
            }

            processing = true;

            initFaces();

            $('.spinner').css('opacity', 1);

            $img.faceDetection({
                interval: 4,
                async: true,
                complete: function(faces) {
                    completed(faces);
                    flash();

                    processing = false;

                    $('.spinner').css('opacity', 0);
                    $('body').addClass('processed');
                },
                error:function(code, message) {
                    alert('Error: ' + message);
                }
            });
        });

        function initFaces() {
            $('.portrait, .face-img').remove();

            $('.demo-click').removeClass('animated flipInX');

            $('body').removeClass('processed');
        }

        function completed(faces) {
            var marg = 20;

            for (var i = 0; i < faces.length; i++) {
                var left   = (faces[i].x - marg),
                    top    = (faces[i].y - marg),
                    width  = (faces[i].width  + (marg * 2)),
                    height = (faces[i].height + (marg * 2));

                $('<div />', {
                    'class': 'face-img',
                    'css': {
                        'left':   left   * faces[i].scaleX + 'px',
                        'top':    top    * faces[i].scaleY + 'px',
                        'width':  width  * faces[i].scaleX + 'px',
                        'height': height * faces[i].scaleY + 'px'
                    }
                })
                .appendTo($img.closest('div'));

                var $div = $('<div />', {
                    'class': 'portrait',
                    'css': {
                        'background-image': 'url(' + $img.attr('src') + ')',
                        'background-position': -left + 'px ' + -top + 'px'
                    }
                }).on('click', function(e) {
                    e.preventDefault();

                    $('.portrait').fadeOut('fast', function() {
                        $(this).remove();

                        initFaces();
                    });
                }).appendTo('#portraits');

                (function($div, i) {
                    setTimeout(function() {
                        $div.addClass('animated swing');
                    }, 100 * i);
                })($div, i);
            }
        }

        // Demo
        // Detect faces in Video

        $('.do-video-detect').click(function(e) {
            e.preventDefault();
            
            $('.face-video').remove();

            if ($video[0].paused) {
                $video[0].play();
            }
            
            setTimeout(function() {
                $video[0].pause();

                $video.faceDetection({
                    interval: 1,
                    async: true,
                    complete: function(faces) {
                        flash();
                        
                        $('<div>', {
                            'class':'face-video',
                            'css': {
                                'left':   faces[0].x * faces[0].scaleX + 'px',
                                'top':    faces[0].y * faces[0].scaleY + 'px',
                                'width':  faces[0].width  * faces[0].scaleX + 'px',
                                'height': faces[0].height * faces[0].scaleY + 'px'
                            }
                        })
                        .insertAfter(this);
                    }
                });
            }, 500);
        });

        // Video controls

        $('#play-video').on('click', function () {
            $video[0].play(); 
        });

        $video.on('play', function () {
            $('#play-video').hide();
            $('.face-video').remove();
        }).on('pause', function () {
            $('#play-video:hidden').show();
        });
    });
})();