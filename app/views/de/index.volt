{{ hidden_field('data_entry_id', 'value': dataEntry.id) }}
{{ hidden_field('batch_id', 'value': batch.id) }}
{{ hidden_field('region', 'value': batch.zip.region_code) }}
{{ hidden_field('session_task_id', 'value': session.get('taskId')) }}
{{ hidden_field('session_task_name', 'value': session.get('taskName')) }}

<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
            
            {% include 'de/header_form.volt' %}
            {% include 'de/transaction_form.volt' %}
                    
            <div class="ui small basic icon buttons slip-controls" style="margin-top: 10px;">
                <button class="ui icon button more-btn" data-tooltip="Add a new Slip" data-position="top center"><i class="plus blue icon"></i></button>
                <button class="ui icon disabled button first-slip-btn" data-tooltip="First Slip" data-position="top center"><i class="arrow left green icon"></i></button>
                <button class="ui icon disabled button prev-slip-btn" data-tooltip="Previous Slip" data-position="top center"><i class="chevron left green icon"></i></button>
                <button class="ui icon disabled button next-slip-btn" data-tooltip="Next Slip" data-position="top center"><i class="chevron right green icon"></i></button>  
                <button class="ui icon disabled button last-slip-btn" data-tooltip="Last Slip" data-position="top center"><i class="arrow right green icon"></i></button>
                <button class="ui icon button delete-slip-btn" data-tooltip="Delete Slip" data-position="top center"><i class="remove red icon"></i></button>  
                <button class="ui icon button reset-slip-btn" data-tooltip="Reset Transaction" data-position="top center"><i class="recycle orange icon"></i></button>  
            </div>

            {% include 'de/summary_form.volt' %}

            <div style="margin-top: 10px;">
                <button class="ui small blue button complete-next-btn" data-tooltip="Complete Order and process another" data-position="top center">Comp/Next</button>                 
                <button class="ui small blue button complete-exit-btn" data-tooltip="Complete Order and exit to Home Page" data-position="top center">Comp/Exit</button>                                                  
                <button class="ui small green button save-next-btn" data-tooltip="Save changes and process another" data-position="top center">Save/Next</button>
                <button class="ui small green button save-exit-btn" data-tooltip="Save changes and exit to Home Page" data-position="top center">Save/Exit</button>
                {#<div style="margin: 5px 0 0 0; float: right;">                        
                    <a href="/gpap" class="ui small button">Exit</a>
                </div>#}
            </div>
        </div>
    </div>
    <div class="twelve wide column">                                
        {% include 'de/viewer.volt' %}    
    </div>
</div>

{{ modals.getConfirmation('delete', 'Transaction') }}
{{ modals.getConfirmation('complete', 'Batch') }}

<form id="redirectForm"></form>

<div class="ui active loader"></div>

{{ javascript_include('js/de.js') }}
{{ javascript_include('js/de_data_retrieval.js') }}
{{ javascript_include('js/de_data_recording.js') }}
{{ javascript_include('js/de_data_navigation.js') }}
{{ javascript_include('js/de_form_events.js') }}
{{ javascript_include('js/de_verify.js') }}