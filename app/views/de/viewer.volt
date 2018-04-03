<div id="viewer" style="width: 100%; height: 98vh; overflow: scroll; background-color: lightgrey;" class="ui raised segment"></div>
<div class="ui large label filename"></div>
<div class="command">           
    <div class="ui small basic icon buttons">
        <button id="prevBtn" class="ui disabled button" data-tooltip="Previous" data-position="bottom center"><i class="chevron left icon"></i></button>
        <div class="ui large label">Page <span id="currentPage">1</span> of <span id="lastPage">...</span></div>
        <button id="nextBtn" class="ui disabled button" data-tooltip="Next" data-position="bottom center"><i class="chevron right icon"></i></button>
        <button id="restoreBtn" class="ui button" data-tooltip="Full View" data-position="bottom center"><i class="maximize icon"></i></button>
        <button id="rotateLeftBtn" class="ui button" data-tooltip="Rotate Left" data-position="bottom center"><i class="undo icon"></i></button>
        <button id="rotateRightBtn" class="ui button" data-tooltip="Rotate Right" data-position="bottom center"><i class="repeat icon"></i></button>
        <button id="zOutBtn" class="ui button" data-tooltip="Zoom Out" data-position="bottom center"><i class="zoom out icon"></i></button>
        <button id="zoomBtn" class="ui button" data-tooltip="Zoom In" data-position="bottom center"><i class="zoom icon"></i></button>
        <button id="rulerBtn" class="ui button" data-tooltip="Ruler Spacing" data-position="bottom center">
            <select id="spacing">
                <option>2cm</option>
                <option>1in</option>
                <option>1.5in</option>
            </select>
        </button>
    </div>
</div>  

{% include 'de/ruler.volt' %}  

{{ stylesheet_link('css/viewer.css') }}
{{ javascript_include('js/viewer.js') }}

{{ stylesheet_link('css/ruler.css') }}
{{ javascript_include('js/ruler.js') }}