<h2><i class="tasks icon"></i>My Work In Progress</h2>

<form class="ui form" id="listForm" action="boards" method="post">
    <div class="ui equal width stackable grid">
        <div class="column">
            <div class="ui action left icon input">
                <i class="search icon"></i>
                {{ text_field("keyword", "id" : "fieldKeyword", "placeholder" : "Type in keywords...", "value" : '') }}
                <button type="submit" class="ui teal submit button">Submit</button>
            </div>            
        </div>
        <div class="right aligned column">
            <a href="de" class="ui primary button"><i class="plus icon"></i>Get Order</a>
        </div>
    </div>     
</form> 

<table class="ui sortable selectable celled striped table">
    <thead>
        <tr>
            <th>ORDER</th>
            <th>START TIME</th>
            <th>END TIME</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0001</td>
            <td>03-12-2018 12:22:00 PM</td>
            <td>03-12-2018 12:48:00 PM</td>
            <td>
                <a href="de" data-tooltip="Review" data-position="bottom center">
                    <i class="folder open orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                        
            </td>
        </tr>
        <tr>
            <td>0002</td>
            <td>03-12-2018 12:22:00 PM</td>
            <td>03-12-2018 12:48:00 PM</td>
            <td>
                <a href="de" data-tooltip="Review" data-position="bottom center">
                    <i class="folder open orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                        
            </td>
        </tr>
        <tr>
            <td>0003</td>
            <td>03-12-2018 12:22:00 PM</td>
            <td>03-12-2018 12:48:00 PM</td>
            <td>
                <a href="de" data-tooltip="Review" data-position="bottom center">
                    <i class="folder open orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                        
            </td>
        </tr>
        <tr>
            <td>0004</td>
            <td>03-12-2018 12:22:00 PM</td>
            <td>03-12-2018 12:48:00 PM</td>
            <td>
                <a href="de" data-tooltip="Review" data-position="bottom center">
                    <i class="folder open orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                        
            </td>
        </tr>
        <tr>
            <td>0005</td>
            <td>03-12-2018 12:22:00 PM</td>
            <td>03-12-2018 12:48:00 PM</td>
            <td>
                <a href="de" data-tooltip="Review" data-position="bottom center">
                    <i class="folder open orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                        
            </td>
        </tr>
    </tbody>
</table>