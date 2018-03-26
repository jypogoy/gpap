var imgServer = '/ftp';
var imgArray;
var imgActive;
var imgNavIndex = 0;
var degree = 0;
var imageOrigSize; 

$(function () {                  
    
    renderImages();            

    $('#prevBtn').click(function() {
        navPrevImage();
    });

    $('#nextBtn').click(function() {
        navNextImage();
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

    $('.loader').fadeOut();
});

var prevContext;
function renderImages() {
    $.post('../image/list/' + $('#batchId').val(), function (data) {
        if (!data) {
            toastr.warning('The search did not match any image.');
        } else {
            imgArray = data;
            imgActive = imgArray[imgNavIndex].path; // Render the first image, usually the header
        }                
    })
    .done(function (msg) {
        var xhr = createCORSRequest('GET', imgServer + imgActive);
        xhr.onload = function (e) {                  
            
            $('.filename').empty();
            $('.filename').append(imgActive); // Display the relative file path
            $('#lastPage').html(imgArray.length > 1 ? imgArray.length : 1);
            
            if(imgNavIndex == 0) {
                $('#prevBtn').addClass('disabled');
                $('#nextBtn').removeClass('disabled');
            }

            if(imgNavIndex == (imgArray.length - 1)) {
                $('#nextBtn').addClass('disabled');
                $('#prevBtn').removeClass('disabled');
            }
            
            if(xhr.status == 404)  {
                toastr.error('Image ' +  imgActive + ' does not exists!');
                return;
            } 

            var tiff = new Tiff({ buffer: xhr.response });
            var canvas = tiff.toCanvas();                            
            var context = canvas.getContext('2d');            

            var canvasEl = $('canvas')[0];
            if (canvasEl) { 
                $(canvasEl).remove();
            }

            $('#viewer').append(canvas);

            //  var canvasEl = $('canvas')[0];
            //  if (canvasEl) {                
            //     var prevContext = canvasEl.getContext('2d');
                
            //     console.log(context);
            //     console.log(prevContext);

            //     // Clear canvas
            //     prevContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
            //     prevContext.drawImage(canvas, 0, 0);
            //     // Clear path
            //     prevContext.beginPath();     

            //     // console.log($(canvasEl).position().left)
            //     // console.log($(canvasEl).position().top)
            //     var data = context.getImageData(0, 0, canvas.width, canvas.height);
            //     prevContext.putImageData(data, 0, 0);                   
                
                
            // } else {
            //     $('#viewer').append(canvas);
            // }

            //  prevContext = context;            
                        
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
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
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

function setCurrentPage() {
    $('#currentPage').empty();
    $('#currentPage').html(imgNavIndex + 1);
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
