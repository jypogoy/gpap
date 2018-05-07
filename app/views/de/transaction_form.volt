{{ form('', 'id' : 'transactionDataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

    <h4 class="ui dividing header" style="color: darkblue; margin-top: 20px; font-size: 9pt;">
        <div class="ui equal width grid">
            <div class="column"><i class="random icon"></i>Transactions</div>            
            <div class="column" style="text-align: right;"><span id="currentSlipPage">1</span> of <span id="totalSlips">...</span></div>
        </div>
    </h4>
    
    <div class="equal width small fields">
        <div id="transaction_type_id_wrapper" class="required field">
            <label>Trans Type</label>
            {{ hidden_field('transaction_type_id', 'class': 'slip-field auto-fill', 'maxlength': 2, 'value': batch.TransactionType.id) }}
            {{ text_field('transaction_type_type', 'class': 'slip-field auto-fill', 'maxlength': 2, 'value': batch.TransactionType.type, 'disabled': true) }}            
        </div>   
        <div id="region_code_wrapper" class="required field">
            <label>Region</label>
            {{ text_field('region_code', 'class': 'slip-field auto-fill', 'maxlength': 2, 'value': batch.zip.region_code, 'disabled': true) }}
        </div> 
        <div id="transaction_date_wrapper" class="required field">
            <label>Trans Date</label>
            <div class="ui calendar" id="transaction_date_cal">
                <div class="ui input left icon">
                <i class="calendar icon"></i>
                {{ text_field('transaction_date', 'placeholder': 'Date', 'class': 'slip-field') }}
                </div>
            </div>
        </div> 
    </div>
    <div id="card_number_wrapper" class="small required field">
        <label>Cardholder Number (PAN)</label>
        <div class="ui right labeled input">
            {{ text_field('card_number', 'maxlength': '19', 'placeholder': 'Credit Card Number', 'class': 'slip-field') }}
            <div class="ui basic label"><img id="cardLogo" src="../public/img/card/private.png" style="height: 12px !important;"></div>
        </div>
    </div>    
    <div class="equal width small fields">                        
        <div id="authorization_code_wrapper" class="required field">
            <label>Auth Code</label>
            {{ text_field('authorization_code', 'minlength': 3, 'maxlength': 6, 'class': 'slip-field') }}
        </div>  
        <div id="transaction_amount_wrapper" class="required field">
            <label>Trans Amt</label>
            {{ text_field('transaction_amount', 'maxlength': '9', 'class': 'slip-field balancing-enabled') }}
        </div>    
        <div id="installment_months_id_wrapper" class="field">    
            <label>Inst. Term</label>
            <div id="installment_months_id_dropdown" class="ui search selection dropdown slip-dropdown">
                <input type="hidden" id="installment_months_id" class="slip-field">
                <div class="default text">Choose a term</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div> 
    </div>    
    <div id="other_fields_div" class="hidden small fields">                    
        <div id="airline_ticket_number_wrapper" class="sixteen wide hidden field">    
            <label>Ticket No.</label> 
            {{ text_field('airline_ticket_number', 'maxlength': 13, 'class': 'airline-field slip-field') }} 
        </div>        
        <div id="customer_reference_identifier_wrapper" class="six wide hidden field">    
            <label>Cust Ref</label> 
            {{ text_field('customer_reference_identifier', 'maxlength': 30, 'class': 'vi-field slip-field') }}
            <div id="customer_reference_identifier_counter" class="charcount">17 chars left.</div>
        </div>
        <div id="merchant_order_number_wrapper" class="seven wide hidden field">    
            <label>Order No.</label> 
            {{ text_field('merchant_order_number', 'maxlength': 40, 'class': 'vi-field slip-field') }}
            <div id="merchant_order_number_counter" class="charcount">25 chars left.</div>
        </div>
        <div id="commodity_code_wrapper" class="three wide hidden field">    
            <label>Com Code</label> 
            {{ text_field('commodity_code', 'maxlength': 4, 'class': 'vi-field slip-field') }}
        </div>
    </div>     
    <div class="equal width small fields">                    
        <div id="slip_pull_reason_id_wrapper" class="field">
            <label>Pull Reason</label>
            <div id="slip_pull_reason_id_dropdown" class="ui search selection dropdown slip-dropdown">
                <input type="hidden" id="slip_pull_reason_id" class="slip-field">
                <div class="default text">Choose a reason</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div>             
        <div id="exception_id_wrapper" class="field">    
            <label>Other Exceptions</label>
            <div id="exception_id_dropdown" class="ui search selection dropdown slip-dropdown">
                <input type="hidden" id="exception_id" class="slip-field">
                <div class="default text">Choose an exception</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div>                                                     
    </div>         
    <div id="other_exception_detail_wrapper" class="small hidden field">    
        <label>Other Exception Detail</label>
        {{ text_field('other_exception_detail', 'maxlength': '30', 'class': 'slip-field') }} 
    </div>      
    <div id="image_file_wrapper" class="required small field">
        <label>Linked Image</label>
        {{ hidden_field('image_id', 'class': 'slip-field') }}
        {{ text_field('image_file', 'class': 'slip-field image-link', 'disabled': true) }}
    </div>                                                                    
</form> 