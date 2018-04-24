var imgServer = '/GPAPdocs';
var imgArray;
var imgActive;
var imgNavIndex = 0;
var degree = 0;
var imageOrigSize; 

$(function () {                  
    
    $('.command').draggable();
    $('.command').mousedown(function(e) { // Replace mouse pointers
        $('.command').css({ 'cursor' : 'move' });
        $(this).mousemove(function(e) {
            // Do nothing.
        }).mouseup(function(e) {
            $('.command').off('mousemove');
        });
    }).mouseup(function(e) {
        $('.command').css({ 'cursor' : 'default' });
    });    

    $('#firstBtn').click(function() {
        navFirstImage();
    });

    $('#prevBtn').click(function() {
        navPrevImage();
    });

    $('#nextBtn').click(function() {
        navNextImage();
    });

    $('#lastBtn').click(function() {
        navLastImage();
    });

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

    $('.dropdown').dropdown();

    getBatchImages().then(function(images) {
        imgArray = images;

        // Build the page selection if image count is more that 1.
        if (imgArray.length > 1) {
            var pSelectorEl = '<select id="pageSelector">';
            for (let i = 0; i < imgArray.length; i++) {
                pSelectorEl = pSelectorEl + '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
            }                                                    
            pSelectorEl = pSelectorEl + '</select>';
            $('#currentPage').html(pSelectorEl);
        }

        renderImages();  
        $('.loader').fadeOut();

        $('#pageSelector').change(function() {
            imgNavIndex = $(this).find(':selected').val() - 1;     
            renderImages();    
        });
    });            

});

function getBatchImages() {
    var d = $.Deferred();

    $.post('../image/list/' + $('#batch_id').val(), function (data) {
        if (!data) {
            toastr.warning('The search did not match any image.');
        } else { 
            d.resolve(data);
        }
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });

    return d.promise();
}

var prevContext;
function renderImages() {
    
    // Trap exceeding previous page click.
    if (imgNavIndex < 0) {
        imgNavIndex = 0;
        setCurrentPage();
    }

    if (imgNavIndex >= 0) {
        // Trap exceeding next page click.
        if (imgNavIndex > (imgArray.length - 1)) {
            imgNavIndex = imgArray.length - 1;
            setCurrentPage();
        }

        imgActive = imgArray[imgNavIndex].path; // Render the first image, usually the header
        
        var xhr = createCORSRequest('GET', imgServer + imgActive);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {                  
            $('.filename').empty();
            $('.filename').append(imgActive); // Display the relative file path
            $('#lastPage').html(imgArray.length > 1 ? imgArray.length : 1);
            
            if(imgNavIndex <= 0) {
                $('#firstBtn').addClass('disabled');
                $('#prevBtn').addClass('disabled');
                $('#nextBtn').removeClass('disabled');
                $('#lastBtn').removeClass('disabled');
            } else if(imgNavIndex < (imgArray.length - 1)) {
                $('#firstBtn').removeClass('disabled');
                $('#prevBtn').removeClass('disabled');
                $('#nextBtn').removeClass('disabled');
                $('#lastBtn').removeClass('disabled');
            }
            
            if(imgNavIndex == (imgArray.length - 1)) {
                $('#firstBtn').removeClass('disabled');
                $('#prevBtn').removeClass('disabled');
                $('#nextBtn').addClass('disabled');
                $('#lastBtn').addClass('disabled');                 
            }
            
            if(xhr.status == 404)  {
                toastr.error('Image ' +  imgActive + ' does not exists!');
                var canvasEl = $('canvas')[0];
                if (canvasEl)  $(canvasEl).remove();
                return;
            } 
            
            var tiff = new Tiff({ buffer: this.response });
            var canvas = tiff.toCanvas();                            
            var context = canvas.getContext('2d');            

            var canvasEl = $('canvas')[0];
            if (canvasEl) $(canvasEl).remove();

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
    }      
}

function renderImages1() {
    $.post('../image/list/' + $('#batch_id').val(), function (data) {
        if (!data) {
            toastr.warning('The search did not match any image.');
        } else {
            imgArray = data;
            imgActive = imgArray[imgNavIndex].path; // Render the first image, usually the header
        }                
    })
    .done(function (msg) {
        if (msg.indexOf('undefined') != -1) {
            toastr.error(msg);
        } else {
            $.get('../image/get', function(imgEl) {
                $('#viewer').append(imgEl); 

                $('.filename').append(imgActive); // Display the relative file path
                $('#lastPage').html(imgArray.length > 1 ? imgArray.length : 1);

                // Set styling and events for the appended image element with ID 'canvas'
                $('#canvas').width($('#canvas').width() / 2);       
                $('#canvas').draggable({ scroll: true }); // Make the canvas draggable. See jqueryui
                $('#canvas').mousedown(function(e) { // Replace mouse pointers
                    $('#canvas').css({ 'cursor' : 'move' });
                    $(this).mousemove(function(e) {
                        // Do nothing.
                    }).mouseup(function(e) {
                        $('#canvas').off('mousemove');
                    });
                }).mouseup(function(e) {
                    $('#canvas').css({ 'cursor' : 'default' });
                });
                
                imageOrigSize = $('#canvas').width();
            });                                             
        }
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function navFirstImage() {
    imgNavIndex = 0;     
    setCurrentPage();
    renderImages();    
}

function navPrevImage() {
    imgNavIndex--;     
    setCurrentPage();
    renderImages();    
}

function navNextImage() {
    imgNavIndex++;    
    setCurrentPage();
    renderImages();    
}

function navLastImage() {
    imgNavIndex = imgArray.length - 1;    
    setCurrentPage();
    renderImages();    
}

function setCurrentPage() {
    $('#pageSelector option[value=' + (imgNavIndex + 1) + ']').prop('selected', true);
    // $('#currentPage').empty();
    // $('#currentPage').html(imgNavIndex + 1);    
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
