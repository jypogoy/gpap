$(function() {

    // Build "dynamic" rulers by adding items    
    $(".ruler[data-items]").each(function() {
        var ruler = $(this).empty(),
            len = Number(ruler.attr("data-items")) || 0,
            item = $(document.createElement("li")),
            i;
        for (i = 0; i < len; i++) {
            ruler.append(item.clone().text(i + 1));
        }
    });    

    changeRulerSpacing('2cm'); // Set initial size

    $("#spacing").change(function() {
        changeRulerSpacing($(this).val());
    });

    $('.ruler').draggable();

    $('.ruler').mousedown(function(e) { // Replace mouse pointers
        $('.ruler').css({ 'cursor' : 'move' });
        $(this).mousemove(function(e) {
            // Do nothing.
        }).mouseup(function(e) {
            $('.ruler').off('mousemove');
        });
    }).mouseup(function(e) {
        $('.ruler').css({ 'cursor' : 'pointer' });
    });
});

// Change the spacing programatically
function changeRulerSpacing(spacing) {
    $(".ruler").
      css("padding-right", spacing).
      find("li").
        css("padding-left", spacing);
}