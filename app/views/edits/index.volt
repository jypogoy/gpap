<input type="hidden" id="session_lifetime" value="<?php echo $this->config->get('session_lifetime'); ?>"/>
{{ hidden_field('session_region_code', 'value': session.get('regionCode')) }}
{{ hidden_field('session_zip_id', 'value': session.get('zipId')) }}

<div class="ui warning message static">
    <div class="header">Caution:</div>
    <div>This module directly affect keyed batch and transaction records on their respective last completed task.<br/>
    Please be mindful of the changes you intend to make as these cannot be reverted.</div>
</div>

<h2><i class="pencil icon"></i>Record Edit</h2>

<form class="ui form" id="listForm" action="boards" method="post">
    <div class="ui equal width stackable grid">
        <div class="column">
            <div class="inline fields">
                <div class="field">            
                    <label>Region</label>                        
                    <div id="region_dropdown" class="ui search selection dropdown">
                        <input id="region_code" type="hidden">
                        <div class="default text">Choose a region</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            {% for region in regions %}
                                <div class="item" data-value="{{ region.code }}">{{ region.name }} ({{ region.code }})</div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
                <div class="disabled field job_field" style="margin-left: 10px;">            
                    <label>Job</label>       
                    <div id="job_dropdown" class="ui search selection dropdown">
                        <input id="zip_id" type="hidden">
                        <div class="default text">Choose a job</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>
                </div>
                <div id="filterBtn" class="ui disabled primary button">Filter</div>
            </div>
        </div>
        <div>
        </div>
    </div>     
</form> 

<table class="ui selectable celled striped table" style="margin-top: 0px;">
    <thead>
        <tr>
            <th>Region Code</th>            
            <th>Job Name</th>
            <th>Transaction Type</th>
            <th>File Name</th>
            <th>Batch #</th>
            <th>Completed Tasks</th>
        </tr>
    </thead>
    <tbody class="listBody">
        <tr><td colspan="6">No records found.</td></tr>        
    </tbody>    
</table>

<form id="beginForm"></form>

{{ alert.getRedirectMessage() }}

<div class="ui active loader"></div>

{{ javascript_include('js/edits.js') }}
{{ javascript_include('js/session_listener.js') }}