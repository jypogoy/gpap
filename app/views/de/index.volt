{{ hidden_field('data_entry_id', 'value': dataEntry.id) }}
{{ hidden_field('batch_id', 'value': batch.id) }}
{{ hidden_field('region', 'value': batch.zip.region_code) }}
{{ hidden_field('job', 'value': [batch.zip.rec_date, batch.zip.operator_id, batch.zip.getSequence()] | join('_')) }}
{{ hidden_field('region', 'value': batch.zip.region_code) }}
{{ hidden_field('session_task_id', 'value': session.get('taskId')) }}
{{ hidden_field('session_task_name', 'value': session.get('taskName')) }}
{{ hidden_field('session_from_edits', 'value': session.get('fromEdits')) }}

<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
            
            {% include 'de/header_form.volt' %}
            {% include 'de/transaction_form.volt' %}
                    
            <div class="ui small basic icon buttons slip-controls" style="margin-top: 10px;">
                <button class="ui icon button more-btn" data-tooltip="Add a new Slip [Alt+a]" data-position="right center"><i class="plus blue icon"></i></button>
                <button class="ui icon disabled button first-slip-btn" data-tooltip="First Slip [Ctrl+Home]" data-position="top center"><i class="arrow left green icon"></i></button>
                <button class="ui icon disabled button prev-slip-btn" data-tooltip="Previous Slip [PgUp]" data-position="top center"><i class="chevron left green icon"></i></button>
                <button class="ui icon disabled button next-slip-btn" data-tooltip="Next Slip [PgDown]" data-position="top center"><i class="chevron right green icon"></i></button>  
                <button class="ui icon disabled button last-slip-btn" data-tooltip="Last Slip [Ctrl+End]" data-position="top center"><i class="arrow right green icon"></i></button>
                <button class="ui icon disabled button insert-slip-btn" data-tooltip="Insert Before [Alt+i]" data-position="top center"><i class="resize horizontal blue icon"></i></button>
                <button class="ui icon disabled button delete-slip-btn" data-tooltip="Delete Slip [Ctrl+Del]" data-position="top center"><i class="remove red icon"></i></button>  
                <button class="ui icon button reset-slip-btn" data-tooltip="Clear Form [Alt+c]" data-position="top center"><i class="recycle orange icon"></i></button>  
                <button class="ui icon button link-slip-btn" data-tooltip="Link Image [Alt+l]" data-position="top center"><i class="linkify blue icon"></i></button>  
                <button class="ui icon hidden button unlink-slip-btn" data-tooltip="Unlink Image [Alt+u]" data-position="top center"><i class="unlinkify blue icon"></i></button> 
            </div>

            {% include 'de/summary_form.volt' %}

            <div style="margin-top: 10px;">
                <button class="ui small teal button save-btn" data-tooltip="Save current entries without exiting [Ctrl+1]" data-position="top left">Save</button>                 
                {% if !session.get('fromEdits') %}
                    <button class="ui small blue button complete-next-btn" data-tooltip="Complete Order and process another [Ctrl+2]" data-position="top center">Comp/Next</button>                 
                    <button class="ui small blue button complete-exit-btn" data-tooltip="Complete Order and exit to Home Page [Ctrl+3]" data-position="top center">Comp/Exit</button>                                                  
                    <button class="ui small green button save-next-btn" data-tooltip="Save changes and process another [Ctrl+4]" data-position="top center">Save/Next</button>                    
                {% endif %}
                <button class="ui small green button save-exit-btn" data-tooltip="Save changes and exit to Home Page [Ctrl+5]" data-position="top center">Save/Exit</button>
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
{{ modals.getWarning() }}

<form id="redirectForm"></form>

<div class="ui active loader"></div>

{{ javascript_include('js/de.js') }}
{{ javascript_include('js/de_keypress.js') }}
{{ javascript_include('js/de_data_retrieval.js') }}
{{ javascript_include('js/de_data_recording.js') }}
{{ javascript_include('js/de_data_navigation.js') }}
{{ javascript_include('js/de_form_events.js') }}
{{ javascript_include('js/de_verify.js') }}
{#{ javascript_include('js/heartbeat.js') }#}