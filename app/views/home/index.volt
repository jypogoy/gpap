{{ hidden_field('user_id', 'value': user['id'] ) }}
{{ hidden_field('session_task_id', 'value': session.get('taskId')) }}

<h2><i class="tasks icon"></i>My Work In Progress</h2>

<form class="ui form" id="listForm" action="boards" method="post">
    <div class="ui equal width stackable grid">
        {#<div class="column">
            <div class="ui disabled action left icon input">
                <i class="edit icon"></i>
                {{ text_field("keyword", "id" : "fieldKeyword", "placeholder" : "Type in keywords...", "value" : '') }}
                <button type="submit" class="ui teal disabled submit button">Submit</button>
            </div>            
        </div>#}
        <div class="column user-tasks"></div>
        <div class="right aligned column">
            <a class="ui primary hidden button data-process-btn get-batch"><i class="plus icon"></i>Get Batch</a>   
            <div id="batchCount" class="floating ui hidden label" style="margin-left: -40px !important; margin-top: 10px !important;">...</div>         
        </div>
    </div>     
</form> 

<table class="ui selectable celled striped table">
    <thead>
        <tr>
            <th>Region</th>
            <th>Type</th>
            <th>Recording Date</th>  
            <th>Operator</th>                              
            <th>Sequence</th>
            <th>Batch</th>
            <th>Trans</th>
            <th></th>
        </tr>
    </thead>
    <tbody class="deListBody">
        <tr><td colspan="6">Fetching record...</td></tr>        
    </tbody>    
</table>

{{ alert.getRedirectMessage() }}
{{ modals.getConfirmation('complete', 'Batch') }}

<div class="ui active loader"></div>

{% include 'de/batch_modal.volt' %} 

<form id="beginForm"></form>

{{ javascript_include('js/home.js') }}