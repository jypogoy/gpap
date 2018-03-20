$(function () {        
    
    $('form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    $('#merchantId').on('keyup', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            console.log($(this).val())
            $.post('merchant/get/' + $(this).val(), function (data) {
                toastr.success("HEY");                
            })
            .done(function (msg) {
                // Do nothing...
            })
            .fail(function (xhr, status, error) {
                toastr.error(error);
            });
        }
    });

    $('#merchantId').blur(function() {
        $(this).val(new Array($(this).attr('maxlength') - $(this).val().toString().length + 1).join('0') + $(this).val());
    });

    $('#dcn').blur(function() {
        $(this).val(new Array($(this).attr('maxlength') - $(this).val().toString().length + 1).join('0') + $(this).val());
    });    

    $('#depositDate').calendar({ 
        type: 'date',
        monthFirst: true,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = new Array(2 - date.getDate().toString().length + 1).join('0') + date.getDate();            
                var month = new Array(2 - (date.getMonth() + 1).toString().length + 1).join('0') + (date.getMonth() + 1);
                var year = date.getFullYear().toString().substr(-2);
                return month + '/' + day + '/' + year;
            }
        }
    });

    $('#depositAmount').blur(function() {
        $(this).val(parseFloat(Math.round($(this).val() * 100) / 100).toFixed(2));
    });    

    // IIPMooViewer options: See documentation at http://iipimage.sourceforge.net for more details
    // Server path: set if not using default path
    //var server = '/fcgi-bin/iipsrv.fcgi';
    var server = '/fcgi-bin/IIPImageServer.fcgi';

    // The *full* image path on the server. This path does *not* need to be in the web
    // server root directory. On Windows, use Unix style forward slash paths without
    // the "c:" prefix
    var image = 'C:/01images/0.tif';

    // Copyright or information message
    var credit = '&copy; ADEC Innovations';

    // Create our iipmooviewer object
    // new IIPMooViewer("viewer", {
    //     server: server,
    //     image: image,
    //     credit: credit,
    //     navigation: {
    //         draggable: true,
    //         buttons: ['reset','zoomIn','zoomOut']
    //       }
    // });

    // $(document).ready(function() {
    //     $('#viewer').diva({
    //         iipServerURL: server,
    //         objectData: 'none',
    //         imageDir: "C:/01images/"
    //         // Other options can be set here as well - see the Settings wiki page
    //     });
    // });

    var imageOrigSize;    
    //var xhr = createCORSRequest('GET', 'http://sdtdev.amdatex.com:82/20100101-BN-001/Airline/scan0001-5.tif');
    var xhr = createCORSRequest('GET', '/ftp/tiff/scan0001.tif');    
    if (!xhr) {
        console.error('---- CORS not supported! ----');
    } else {
        console.log('---- CORS supported! ----');
    }

    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    xhr.onload = function (e) {
        var tiff = new Tiff({buffer: xhr.response});
        var canvas = tiff.toCanvas();
        $('#viewer').append(canvas);
        $('canvas').width($('canvas').width() / 2);        
        $('canvas').draggable({ scroll: true }); // Make the canvas draggable. See jqueryui
        $('canvas').mousedown(function(e) { // Replace mouse pointers
            $('canvas').css({ 'cursor' : 'move' });
            $(this).mousemove(function(e) {
                // Do nothing.
            }).mouseup(function(e) {
                $('canvas').off('mousemove');
            });
        }).mouseup(function(e) {
            $('canvas').css({ 'cursor' : 'default' });
        });
        imageOrigSize = $('canvas').width();
    };
    xhr.send();        

    // $.ajax({
    //     url: 'http://sdtdev.amdatex.com:82/20100101-BN-001/Airline/scan0001-5.tif',
    //     //url: '/ftp/tiff/scan0001.tif',
    //     method: 'GET',
    //     data: {},
    //     crossDomain: true,
    //     dataType: 'arraybuffer',
    //     xhrFields: {
    //         withCredentials: true
    //      },
    //     beforeSend: function() {
    //         console.log('Done!');
    //     },
        
    // }).done(function(data) {
    //     console.log(data);
    //     var tiff = new Tiff({buffer: data});
    //     console.log(tiff)
    // });

    var degree = 0;
    $('#restoreBtn').on('click' , function() {
        $('canvas').width(imageOrigSize);
        performRotate(getRotationDegrees($('canvas')) + (360 - getRotationDegrees($('canvas'))));
        degree = 0;
    });
    
    $('#rotateLeftBtn').on('click' , function() {
        degree  = degree - 90;
        performRotate(degree); 
    });

    $('#rotateRightBtn').on('click' , function() {
        degree  = degree + 90;
        performRotate(degree);      
    });    

    // $('#rotateRightBtn').on('click' , function() {
    //     var imageSize = $('canvas').width();
    //     imageSize = imageSize + 100;
    //     $('canvas').width(imageSize);
    // });

    $('#zOutBtn').on('click' , function() {
        performZoomOut();
    });

    var int;
    $('#zOutBtn').mousedown(function() {        
        int = setInterval(performZoomOut, 100);
    }).mouseup(function() {
        clearInterval(int);
    });    

    $('#zoomBtn').on('click' , function() {
        performZoom();
    });    

    $('#zoomBtn').mousedown(function() {        
        int = setInterval(performZoom, 100);
    }).mouseup(function() {
        clearInterval(int);
    });    

    //Firefox
    $('#viewer').bind('DOMMouseScroll', function(e){

        if(e.originalEvent.detail > 0) {
            //scroll down
            performZoomOut();
        } else {
            //scroll up
            performZoom();
        }

        //prevent page fom scrolling
        return false;
    });

    //Chrome, IE, Opera, Safari
    $('#viewer').bind('mousewheel', function(e){

        if(e.originalEvent.wheelDelta < 0) {
            //scroll down
            performZoomOut();
        } else {
            //scroll up
            performZoom();
        }

        //prevent page fom scrolling
        return false;
    });    

    $('.loader').fadeOut();
});

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    if ("withCredentials" in xhr) {
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);    
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');  
    } else if (typeof XDomainRequest != "undefined") {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
    return xhr;
}
  

function performRotate(degree) {
    // For webkit browsers: e.g. Chrome
    $('canvas').css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
    // For Mozilla browser: e.g. Firefox
    $('canvas').css({ '-moz-transform': 'rotate(' + degree + 'deg)'});  
}

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
}

function performZoomOut() {
    if ($('canvas').width() > 100) {
        var imageSize = $('canvas').width();
        imageSize = imageSize - 100;
        $('canvas').width(imageSize);
    } else {
        $('canvas').width(100);
    }
}

function performZoom() {
    var imageSize = $('canvas').width();
    imageSize = imageSize + 100;
    $('canvas').width(imageSize);
}
