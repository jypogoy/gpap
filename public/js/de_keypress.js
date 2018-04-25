var listener;
$(function() {

    // Instantiate the key listener. See keypress.js
    listener = new window.keypress.Listener();

    // Add new transaction
    listener.simple_combo("alt a", function() {
        addNewSlip(); // See de_form_events.js
    });

    // Navigate to first transaction
    listener.simple_combo("ctrl home", function() {
        navigate('first'); // See de_data_navigation.js
    });

    // Navigate to previous transaction
    listener.simple_combo("pageup", function() {
        navigate('prev'); // See de_data_navigation.js
    });

    // Navigate to next transaction
    listener.simple_combo("pagedown", function() {
        navigate('next'); // See de_data_navigation.js
    });

    // Navigate to last transaction
    listener.simple_combo("ctrl end", function() {
        navigate('last'); // See de_data_navigation.js
    });

    // Insert transaction after the current
    listener.simple_combo("alt i", function() {
        insertSlip(); // See de_form_events.js
    });

    // Delete current transaction
    listener.simple_combo("ctrl del", function() {
        deleteSlip(); // See de_form_events.js
    });

    // Clear form
    listener.simple_combo("alt c", function() {
        clearForm(); // See de_form_events.js
    });

    // Link image to transaction
    listener.simple_combo("alt l", function() {
        linkSlip(); // See de_form_events.js
    });

    // Unlink image to transaction
    listener.simple_combo("alt u", function() {
        unlinkSlip(); // See de_form_events.js
    });
});