var listener;
$(function() {

    // Instantiate the key listener. See keypress.js
    listener = new window.keypress.Listener();

    // Transaction navigation. See de_form_events.js--------------------------------------------------------------
    // Add new transaction
    listener.simple_combo("alt a", function() {
        addNewSlip();
    });

    // Navigate to first transaction
    listener.simple_combo("ctrl home", function() {
        navigate('first');
    });

    // Navigate to previous transaction
    listener.simple_combo("pageup", function() {
        navigate('prev');
    });

    // Navigate to next transaction
    listener.simple_combo("pagedown", function() {
        navigate('next');
    });

    // Navigate to last transaction
    listener.simple_combo("ctrl end", function() {
        navigate('last');
    });

    // Insert transaction after the current
    listener.simple_combo("alt i", function() {
        insertSlip();
    });

    // Delete current transaction
    listener.simple_combo("ctrl delete", function() {
        if (slipMap.count() > 1) deleteSlip();
    });

    // Clear form
    listener.simple_combo("alt c", function() {
        clearForm();
    });

    // Link image to transaction
    listener.simple_combo("alt l", function() {
        linkSlip(); // 
    });

    // Unlink image to transaction
    listener.simple_combo("alt u", function() {
        unlinkSlip(); // See de_form_events.js
    });

    // Recording actions. See de_form.events.js --------------------------------------------------------------    
    // Save
    listener.simple_combo("ctrl 1", function() {
        preSave(true, false, false);
    });
    listener.simple_combo("ctrl num_1", function() {
        preSave(true, false, false);
    });

    if ($('#session_from_edits').val() == '' || $('#session_from_edits').val() < 1) {
        // Complete and Next
        listener.simple_combo("ctrl 2", function() {
            preSave(false, true, true);
        });
        listener.simple_combo("ctrl num_2", function() {
            preSave(false, true, true);
        });

        // Complete and Exit
        listener.simple_combo("ctrl 3", function() {
            preSave(false, false, true);
        });
        listener.simple_combo("ctrl num_3", function() {
            preSave(false, false, true);
        });

        // Save and Next
        listener.simple_combo("ctrl 4", function() {
            preSave(false, true, false);
        });
        listener.simple_combo("ctrl num_4", function() {
            preSave(false, true, false);
        });
    }

    // Save and Exit
    listener.simple_combo("ctrl 5", function() {
        preSave(false, false, false);
    });
    listener.simple_combo("ctrl num_5", function() {
        preSave(false, false, false);
    });

    // Viewer commands. See viewer.js--------------------------------------------------------------   
    // First image
    listener.simple_combo("ctrl up", function() {
        navFirstImage();
    });
    
    // Previous image
    listener.simple_combo("ctrl left", function() {
        navPrevImage();
    });

    // Next image
    listener.simple_combo("ctrl right", function() {
        navNextImage(); 
    });

    // Last image
    listener.simple_combo("ctrl down", function() {
        navLastImage();
    });

    // Restore full view
    listener.simple_combo("ctrl shift f", function() {
        $('canvas').width(imageOrigSize);
        performRotate(getRotationDegrees($('canvas')) + (360 - getRotationDegrees($('canvas'))));
        degree = 0;
    });

    // Rotate left
    listener.simple_combo("ctrl shift e", function() {
        degree  = degree - 90;
        performRotate(degree); 
    });

    // Rotate right
    listener.simple_combo("ctrl shift r", function() {
        degree  = degree + 90;
        performRotate(degree); 
    });

    // Zoom out
    listener.simple_combo("ctrl shift z", function() {
        performZoomOut();
    });
    
    // Zoom in
    listener.simple_combo("ctrl shift x", function() {
        performZoom();
    });

    // Ruler
    listener.simple_combo("ctrl /", function() {
        toggleShow(); // See ruler.js
    });
});

