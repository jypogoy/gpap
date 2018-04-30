{{ form('', 'id' : 'headerDataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

    <h4 class="ui dividing header" style="color: darkblue;">
        <div class="ui grid">
            <div class="ten wide column">
                <i class="shopping cart icon"></i>Merchant Header
            </div>
            <div class="six wide column" style="text-align: right;">Batch {{ batch.id }} - {{ session.get('taskName') }} {{ session.get('fromEdits') ? 'Edit' : '' }}</div>
        </div>        
    </h4>

    {{ hidden_field('merchant_header_id') }}

    <div id="merchant_number_wrapper" class="required small field">
        <label>Merchant Number </label>
        {{ text_field('merchant_number', 'class': 'header-field', 'maxlength': '16', 'placeholder': 'Type in the Merchant Number and press <Enter> to validate') }}
    </div>  
    <div id="merchant_name_wrapper" class="required small field">
        <label>Merchant Name</label>
        {{ text_field('merchant_name', 'class': 'header-field', 'disabled' : true) }}
    </div>  
    <div class="small fields">
        <div id="dcn_wrapper" class="four wide required field">
            <label>DCN</label>
            {{ text_field('dcn', 'class': 'header-field', 'maxlength': 7) }}
        </div> 
        <div id="currency_id_wrapper" class="required field">
            <label>Currency Code</label>                        
            <div id="currency_id_dropdown" class="ui search selection dropdown header-dropdown">
                <input id="currency_id" type="hidden" class="header-field">
                <div class="default text">Choose a code</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div>
        <div id="other_currency_wrapper" class="required hidden field">
            <label>Currency Code</label>                        
            <div class="ui action input">
                <input type="text" id="other_currency" class="uppercase header-field" maxlength="3">
                <button id="otherCurrencyBtn" class="ui small icon button" data-tooltip="Close" data-position="top center"><i class="remove icon"></i></button>
            </div>
        </div>      
        <div id="deposit_amount_wrapper" class="eight wide required field">
            <label>Batch Amt</label>
            {{ text_field('deposit_amount', 'maxlength': '13', 'class': 'header-field balancing-enabled') }}
        </div>                                                      
    </div>    
        
    {#<div id="deposit_date_wrapper" class="required field">
        <label>Deposit Date</label>
        <div class="ui calendar" id="deposit_date_cal">
            <div class="ui input left icon">
            <i class="calendar icon"></i>
            {{ text_field('deposit_date', 'class': 'header-field', 'placeholder': 'Date') }}
            </div>
        </div>
    </div>#} 
    <div id="batch_pull_reason_id_wrapper" class="field">
        <label>Pull Reason</label>
        <div id="batch_pull_reason_id_dropdown" class="ui search selection dropdown header-dropdown">
            <input id="batch_pull_reason_id" type="hidden" class="header-field">
            <div class="default text">Choose a reason</div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>                    
    </div> 

</form>