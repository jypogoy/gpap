{{ form('', 'id' : 'summaryDataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

    <h4 class="ui dividing header" style="color: darkblue; margin-top: 20px;">
        <div class="ui equal width grid">
            <div class="column"><i class="filter icon"></i>Summary</div>
        </div>
    </h4>

    <div class="equal width small fields"> 
        <div class="field">    
            <label>Total Trans Amount</label> 
            {{ text_field('total_transaction_amount', 'disabled': true, 'value': '0.00') }}
        </div>
        <div class="field">    
            <label>Variance</label> 
            {{ text_field('variance', 'disabled': true, 'value': '0.00') }}
        </div>
        <div id="variance_exception_wrapper" class="field"> 
            <label>&nbsp;</label>
            <div class="ui checkbox">                
                {{ check_field('variance_exception', 'checked': (batch.is_exception ? true : null)) }}<label><strong><small>Exception</small></strong></label>  
            </div>
        </div>    
    </div>   

</form> 