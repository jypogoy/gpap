<h2><i class="pencil icon"></i>Record Edits</h2>

<form class="ui form" id="listForm" action="boards" method="post">
    <div class="ui equal width stackable grid">
        <div class="column">
            <div class="inline fields">
                <div class="field">            
                    <label>Region</label>                        
                    <div id="currency_id_dropdown" class="ui search selection dropdown header-dropdown">
                        <input id="currency_id" type="hidden" class="header-field">
                        <div class="default text">Choose a region</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>
                </div>
                <div class="field" style="margin-left: 10px;">            
                    <label>Job</label>                        
                    <div id="currency_id_dropdown" class="ui search selection dropdown header-dropdown">
                        <input id="currency_id" type="hidden" class="header-field">
                        <div class="default text">Choose a job</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>
                </div>
                <div class="ui primary button">Filter</div>
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
            <th>Last Activity</th>
            <th></th>
        </tr>
    </thead>
    <tbody class="deListBody">
        <tr><td colspan="6">Fetching record...</td></tr>        
    </tbody>    
</table>

{{ alert.getRedirectMessage() }}

{{ javascript_include('js/edits.js') }}