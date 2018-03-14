$(function () {
    
    // IIPMooViewer options: See documentation at http://iipimage.sourceforge.net for more details
    // Server path: set if not using default path
    //var server = '/fcgi-bin/iipsrv.fcgi';
    var server = '/fcgi-bin/IIPImageServer.fcgi';

    // The *full* image path on the server. This path does *not* need to be in the web
    // server root directory. On Windows, use Unix style forward slash paths without
    // the "c:" prefix
    var image = 'C:/01images/sample.png';

    // Copyright or information message
    //var credit = '&copy; ADEC Innovations';

    // Create our iipmooviewer object
    // new IIPMooViewer( "viewer", {
    //     server: server,
    //     image: image,
    //     credit: credit,
    //     navigation: {
    //         draggable: true,
    //         buttons: ['reset','zoomIn','zoomOut']
    //       }
    // });

    $(document).ready(function() {
        $('#viewer').diva({
            iipServerURL: server,
            objectData: 'none',
            imageDir: "C:/01images/"
            // Other options can be set here as well - see the Settings wiki page
        });
    });

});