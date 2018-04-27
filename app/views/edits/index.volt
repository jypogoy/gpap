<h2><i class="pencil icon"></i>Batch Edit</h2>

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
    </div>     
</form> 

<table class="ui selectable celled striped table" style="margin-top: 0px;">
    <thead>
        <tr>
            <th>Region</th>
            <th>Recording Date</th>                    
            <th>Transaction Type</th>
            <th>Sequence</th>
            <th>Batch</th>
            <th></th>
        </tr>
    </thead>
    <tbody class="listBody">
        <tr><td colspan="6">No records found.</td></tr>        
    </tbody>    
</table>

{{ alert.getRedirectMessage() }}

<div class="ui active loader"></div>

{{ javascript_include('js/edits.js') }}