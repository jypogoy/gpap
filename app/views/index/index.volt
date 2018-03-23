<h2><i class="tasks icon"></i>My Work In Progress</h2>

<form class="ui form" id="listForm" action="boards" method="post">
    <div class="ui equal width stackable grid">
        <div class="column">
            <div class="ui action left icon input">
                <i class="edit icon"></i>
                {{ text_field("keyword", "id" : "fieldKeyword", "placeholder" : "Type in keywords...", "value" : '') }}
                <button type="submit" class="ui teal submit button">Submit</button>
            </div>            
        </div>
        <div class="right aligned column">
            <a class="ui primary button data-process-btn get-batch"><i class="plus icon"></i>Get Batch</a>
        </div>
    </div>     
</form> 

<table class="ui sortable selectable celled striped table">
    <thead>
        <tr>
            <th>REGION</th>
            <th>RECODING DATE</th>                    
            <th>TRANSACTION TYPE</th>
            <th>SEQUENCE</th>
            <th>BATCH</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>PH</td>
            <td>03-12-2018</td>
            <td>Normal</td>
            <td>0001</td>
            <td>1</td>
            <td class="data-process-btn">
                <a href="de/1" data-tooltip="Review" data-position="bottom center">
                    <i class="edit orange icon"></i>
                </a>
                <a data-tooltip="Complete" data-position="bottom center">
                    <i class="check green icon"></i>
                </a>                
            </td>
        </tr>
    </tbody>    
</table>

<div class="ui active loader"></div>

{% include 'de/batch_modal.volt' %} 

{{ javascript_include('js/home.js') }}