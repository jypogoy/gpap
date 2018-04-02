<?= $this->tag->hiddenField(['batch_id', 'value' => $batch->id]) ?>
<?= $this->tag->hiddenField(['region', 'value' => $batch->zip->region_code]) ?>
<?= $this->tag->hiddenField(['merchant_header_id']) ?>
<?= $this->tag->hiddenField(['session_task_id', 'value' => $this->session->get('taskId')]) ?>
<?= $this->tag->hiddenField(['session_task_name', 'value' => $this->session->get('taskName')]) ?>

<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
            
            <?= $this->tag->form(['', 'id' => 'headerDataForm', 'class' => 'ui form', 'autocomplete' => 'off']) ?>

    <h4 class="ui dividing header" style="color: darkblue;">
        <div class="ui grid">
            <div class="ten wide column">
                <i class="shopping cart icon"></i>Merchant Header
            </div>
            <div class="six wide column" style="text-align: right;">Batch <?= $batch->id ?> - <?= $this->session->get('taskName') ?></div>
        </div>        
    </h4>

    <div id="merchant_number_wrapper" class="required small field">
        <label>Merchant Number </label>
        <?= $this->tag->textField(['merchant_number', 'class' => 'header-field', 'maxlength' => '16', 'placeholder' => 'Type in the Merchant Number and press <Enter> to validate']) ?>
    </div>  
    <div id="merchant_name_wrapper" class="required small field">
        <label>Merchant Name</label>
        <?= $this->tag->textField(['merchant_name', 'class' => 'header-field', 'disabled' => true]) ?>
    </div>  
    <div class="equal width small fields">
        <div id="currency_id_wrapper" class="required field">
            <label>Currency Code</label>                        
            <div id="currency_id_dropdown" class="ui selection dropdown header-dropdown">
                <input id="currency_id" type="hidden" class="header-field">
                <div class="default text">Choose a code</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div>                        
        <div id="dcn_wrapper" class="required field">
            <label>DCN</label>
            <?= $this->tag->textField(['dcn', 'class' => 'header-field', 'maxlength' => 7]) ?>
        </div>                       
    </div>    
    <div class="two small fields">
        <div id="deposit_date_wrapper" class="required field">
            <label>Deposit Date</label>
            <div class="ui calendar" id="deposit_date_cal">
                <div class="ui input left icon">
                <i class="calendar icon"></i>
                <?= $this->tag->textField(['deposit_date', 'class' => 'header-field', 'placeholder' => 'Date']) ?>
                </div>
            </div>
        </div>    
        <div id="deposit_amount_wrapper" class="required field">
            <label>Deposit Amount</label>
            <?= $this->tag->textField(['deposit_amount', 'maxlength' => '13', 'class' => 'header-field']) ?>
        </div>                                         
    </div>    
    <div id="batch_pull_reason_id_wrapper" class="small field">
        <label>Batch Pull Reason</label>
        <div id="batch_pull_reason_id_dropdown" class="ui selection dropdown header-dropdown">
            <input id="batch_pull_reason_id" type="hidden" class="header-field">
            <div class="default text">Choose a reason</div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>                    
    </div> 

</form>
            <?= $this->tag->form(['', 'id' => 'transactionDataForm', 'class' => 'ui form', 'autocomplete' => 'off']) ?>

    <h4 class="ui dividing header" style="color: darkblue; margin-top: 20px;">
        <div class="ui equal width grid">
            <div class="column"><i class="random icon"></i>Transaction</div>
            <div class="column" style="text-align: right;"><span id="currentSlipPage">1</span> of <span id="totalSlips">...</span></div>
        </div>
    </h4>
    
    <div class="equal width small fields">
        <div id="transaction_type_id_wrapper" class="required field">
            <label>Transaction Type</label>
            <div id="transaction_type_id_dropdown" class="ui selection dropdown slip-dropdown">
                <input type="hidden" id="transaction_type_id" class="slip-field">
                <div class="default text">Choose a type</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div>   
        <div id="region_code_wrapper" class="required field">
            <label>Region</label>
            <?= $this->tag->textField(['region_code', 'class' => 'slip-field auto-fill', 'maxlength' => 2, 'value' => $batch->zip->region_code, 'disabled' => true]) ?>
        </div> 
        <div id="transaction_date_wrapper" class="required field">
            <label>Transaction Date</label>
            <div class="ui calendar" id="transaction_date_cal">
                <div class="ui input left icon">
                <i class="calendar icon"></i>
                <?= $this->tag->textField(['transaction_date', 'placeholder' => 'Date', 'class' => 'slip-field']) ?>
                </div>
            </div>
        </div> 
    </div>
    <div id="card_number_wrapper" class="small required field">
        <label>Cardholder Number (PAN)</label>
        <div class="ui right labeled input">
            <?= $this->tag->textField(['card_number', 'maxlength' => '19', 'placeholder' => 'Credit Card Number', 'class' => 'slip-field']) ?>
            <div class="ui basic label"><img id="cardLogo" src="../public/img/card/private.png" style="height: 12px !important;"></div>
        </div>
        <div class="ui basic red pointing prompt label transition hidden" id="card_number_alert">
            <i class="warning icon"></i><span id="card_number_msg"></span>
        </div>
    </div>    
    <div class="equal width small fields">                        
        <div id="authorization_code_wrapper" class="required field">
            <label>Authorization Code</label>
            <?= $this->tag->textField(['authorization_code', 'maxlength' => 6, 'class' => 'slip-field']) ?>
        </div>  
        <div id="transaction_amount_wrapper" class="required field">
            <label>Transaction Amount</label>
            <?= $this->tag->textField(['transaction_amount', 'maxlength' => '9', 'class' => 'slip-field']) ?>
        </div>    
        <div id="installment_months_id_wrapper" class="required field">    
            <label>Installment Months</label>
            <div id="installment_months_id_dropdown" class="ui selection dropdown slip-dropdown">
                <input type="hidden" id="installment_months_id" class="slip-field">
                <div class="default text">Choose a plan</div>
                <i class="dropdown icon"></i>
                <div class="menu"></div>
            </div>
        </div> 
    </div>    
    <div id="other_fields_div" class="equal width small hidden fields">                    
        <div id="airline_ticket_number_wrapper" class="hidden field">    
            <label>Airline Ticket Number</label> 
            <?= $this->tag->textField(['airline_ticket_number', 'maxlength' => '13', 'class' => 'airline-field slip-field']) ?> 
        </div>
        <div id="merchant_order_number_wrapper" class="hidden field">    
            <label>Merchant Order Number</label> 
            <?= $this->tag->textField(['merchant_order_number', 'maxlength' => '25', 'class' => 'vi-field slip-field']) ?>
        </div>
        <div id="customer_reference_identifier_wrapper" class="hidden field">    
            <label>Customer Reference</label> 
            <?= $this->tag->textField(['customer_reference_identifier', 'maxlength' => '17', 'class' => 'vi-field slip-field']) ?>
        </div>
        <div id="commodity_code_wrapper" class="hidden field">    
            <label>Commodity Code</label> 
            <?= $this->tag->textField(['commodity_code', 'maxlength' => '4', 'class' => 'vi-field slip-field']) ?>
        </div>
    </div>      
    <div class="equal width small fields"> 
        <div class="field">    
            <label>Total Trans Amount</label> 
            <?= $this->tag->textField(['total_transaction_amount', 'disabled' => true, 'value' => '0.00']) ?>
        </div>
        <div class="field">    
            <label>Variance</label> 
            <?= $this->tag->textField(['variance', 'disabled' => true, 'value' => '0.00']) ?>
        </div>
        <div id="variance_exception_wrapper" class="field"> 
            <div class="ui checkbox">
                <input type="checkbox" id="variance_exception" class="slip-field">
                <label><strong><small>Variance Exception</small></strong></label>
            </div>
        </div>    
    </div>          
    <div id="slip_pull_reason_id_wrapper" class="small field">
        <label>Transaction Pull Reason</label>
        <div id="slip_pull_reason_id_dropdown" class="ui selection dropdown slip-dropdown">
            <input type="hidden" id="slip_pull_reason_id" class="slip-field">
            <div class="default text">Choose a reason</div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>
    </div>                 
    <div id="exception_id_wrapper" class="small field">    
        <label>Other Exceptions</label>
        <div id="exception_id_dropdown" class="ui selection dropdown slip-dropdown">
            <input type="hidden" id="exception_id" class="slip-field">
            <div class="default text">Choose an exception</div>
            <i class="dropdown icon"></i>
            <div class="menu"></div>
        </div>
    </div>     
    <div id="other_exception_detail_wrapper" class="small hidden field">    
        <label>Other Exception Detail</label>
        <?= $this->tag->textField(['other_exception_detail', 'maxlength' => '30', 'class' => 'slip-field']) ?> 
    </div>                                         
                                                                                    
</form> 
            
            <div class="ui small basic icon buttons slip-controls" style="margin-top: 10px;">
                <button class="ui icon button more-btn" data-tooltip="Add a new Slip" data-position="top center"><i class="plus blue icon"></i></button>
                <button class="ui icon disabled button first-slip-btn" data-tooltip="First Slip" data-position="top center"><i class="arrow left green icon"></i></button>
                <button class="ui icon disabled button prev-slip-btn" data-tooltip="Previous Slip" data-position="top center"><i class="chevron left green icon"></i></button>
                <button class="ui icon disabled button next-slip-btn" data-tooltip="Next Slip" data-position="top center"><i class="chevron right green icon"></i></button>  
                <button class="ui icon disabled button last-slip-btn" data-tooltip="Last Slip" data-position="top center"><i class="arrow right green icon"></i></button>
                <button class="ui icon button delete-slip-btn" data-tooltip="Delete Slip" data-position="top center"><i class="remove red icon"></i></button>  
                <button class="ui icon button reset-slip-btn" data-tooltip="Reset Transaction" data-position="top center"><i class="recycle orange icon"></i></button>  
            </div>

            <div style="margin-top: 10px;">
                <button class="ui small blue button complete-next-btn" data-tooltip="Complete Order and process another" data-position="top center">Comp/Next</button>                 
                <button class="ui small blue button complete-exit-btn" data-tooltip="Complete Order and exit to Home Page" data-position="top center">Comp/Exit</button>                                                  
                <button class="ui small green button save-next-btn" data-tooltip="Save changes and process another" data-position="top center">Save/Next</button>
                <button class="ui small green button save-exit-btn" data-tooltip="Save changes and exit to Home Page" data-position="top center">Save/Exit</button>
                
            </div>
        </div>
    </div>
    <div class="twelve wide column">                                
        <div id="viewer" style="width: 100%; height: 98vh; overflow: scroll; background-color: lightgrey;" class="ui raised segment"></div>
<div class="ui large label filename"></div>
<div class="command">           
    <div class="ui small basic icon buttons">
        <button id="prevBtn" class="ui disabled button" data-tooltip="Previous" data-position="bottom center"><i class="chevron left icon"></i></button>
        <div class="ui large label">Page <span id="currentPage">1</span> of <span id="lastPage">...</span></div>
        <button id="nextBtn" class="ui disabled button" data-tooltip="Next" data-position="bottom center"><i class="chevron right icon"></i></button>
        <button id="restoreBtn" class="ui button" data-tooltip="Full View" data-position="bottom center"><i class="maximize icon"></i></button>
        <button id="rotateLeftBtn" class="ui button" data-tooltip="Rotate Left" data-position="bottom center"><i class="undo icon"></i></button>
        <button id="rotateRightBtn" class="ui button" data-tooltip="Rotate Right" data-position="bottom center"><i class="repeat icon"></i></button>
        <button id="zOutBtn" class="ui button" data-tooltip="Zoom Out" data-position="bottom center"><i class="zoom out icon"></i></button>
        <button id="zoomBtn" class="ui button" data-tooltip="Zoom In" data-position="bottom center"><i class="zoom icon"></i></button>
    </div>
</div> 

<?= $this->tag->stylesheetLink('css/viewer.css') ?>
<?= $this->tag->javascriptInclude('js/viewer.js') ?>    
    </div>
</div>

<div id="dialog" title="Basic dialog"  class="ui segment>
  <p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
</div>

<?= $this->modals->getConfirmation('delete', 'Transaction') ?>

<div class="ui active loader"></div>

<?= $this->tag->javascriptInclude('js/de.js') ?>
<?= $this->tag->javascriptInclude('js/de_data_retrieval.js') ?>
<?= $this->tag->javascriptInclude('js/de_data_recording.js') ?>
<?= $this->tag->javascriptInclude('js/de_data_navigation.js') ?>
<?= $this->tag->javascriptInclude('js/de_form_events.js') ?>