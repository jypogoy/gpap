{{ hidden_field('batchId', 'value': batch.id) }}

<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
        
            {{ form('', 'role': 'form', 'id' : 'dataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

                <h4 class="ui dividing header" style="color: darkblue;"><i class="shopping cart icon"></i>Merchant Header (Deposit Slip)</h4>

                <div class="required small field">
                    <label>Merchant Number </label>
                    {{ text_field('merchant_number', 'class': 'header-field', 'maxlength': '16', 'placeholder': 'Type in the Merchant Number and press <Enter> to validate') }}
                </div>  
                <div class="required small field">
                    <label>Merchant Name</label>
                    {{ text_field('merchant_name', 'class': 'header-field', 'disabled' : true) }}
                </div>  
                <div class="equal width small fields">
                    <div class="required field">
                        <label>Currency Code</label>                        
                        <div id="currency_code_dropdown" class="ui selection dropdown header-dropdown">
                            <input id="currency_code" type="hidden" class="header-field">
                            <div class="default text">Choose a code</div>
                            <i class="dropdown icon"></i>
                            <div class="menu"></div>
                        </div>
                    </div>                        
                    <div class="required field">
                        <label>DCN</label>
                        {{ text_field('dcn', 'class': 'header-field', 'maxlength': 7) }}
                    </div>                       
                </div>    
                <div class="two small fields">
                    <div class="required field">
                        <label>Deposit Date</label>
                        <div class="ui calendar" id="deposit_date_cal">
                            <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            {{ text_field('deposit_date', 'class': 'header-field', 'placeholder': 'Date') }}
                            </div>
                        </div>
                    </div>    
                    <div class="required field">
                        <label>Deposit Amount</label>
                        {{ text_field('deposit_amount', 'maxlength': '13') }}
                    </div>                                         
                </div>    
                <div id="merchant_pull_reason_field" class="required small field">
                    <label>Merchant Pull Reason</label>
                    <div id="merchant_pull_reason_dropdown" class="ui selection dropdown header-dropdown">
                        <input id="merchant_pull_reason" type="hidden" class="header-field">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>                    
                </div> 

                <h4 class="ui dividing header" style="color: darkblue;">Sales Slip (<span id="currentSlipPage">1</span> of <span id="totalSlips">...</span>)</h4>
                
                <div class="equal width small fields">
                    <div class="required field">
                        <label>Transaction Type</label>
                        <div id="transaction_type_dropdown" class="ui selection dropdown slip-dropdown">
                            <input type="hidden" id="transaction_type" class="slip-field">
                            <div class="default text">Choose a type</div>
                            <i class="dropdown icon"></i>
                            <div class="menu"></div>
                        </div>
                    </div>   
                    <div class="required field">
                        <label>Region</label>
                        {{ text_field('region_code', 'class': 'slip-field', 'maxlength': 2) }}
                    </div> 
                </div>
                <div class="two small fields"> 
                    <div id="credit_card_number_div" class="required field">
                        <label>Cardholder Number (PAN)</label>
                        <div class="ui right labeled input">
                            {{ text_field('credit_card_number', 'maxlength': '19', 'placeholder': 'Credit Card Number', 'class': 'slip-field') }}
                            <div class="ui basic label"><img id="cardLogo" src="../public/img/card/private.png" style="height: 12px !important;"></div>
                        </div>
                        <div class="ui basic red pointing prompt label transition hidden" id="credit_card_number_alert">
                            <i class="warning icon"></i><span id="credit_card_number_msg"></span>
                        </div>
                    </div> 
                    <div class="required field">
                        <label>Transaction Date</label>
                        <div class="ui calendar" id="transaction_date_cal">
                            <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            {{ text_field('transaction_date', 'placeholder': 'Date', 'class': 'slip-field') }}
                            </div>
                        </div>
                    </div>  
                </div>    
                <div class="equal width small fields">                        
                    <div class="required field">
                        <label>Authorization Code</label>
                        {{ text_field('authorization_code', 'maxlength': 6, 'class': 'slip-field') }}
                    </div>  
                    <div class="required field">
                        <label>Transaction Amount</label>
                        {{ text_field('transaction_amount', 'maxlength': '9', 'class': 'slip-field') }}
                    </div>    
                    <div class="required field">    
                        <label>Installment Months</label>
                        <div id="installment_months_dropdown" class="ui selection dropdown slip-dropdown">
                            <input type="hidden" id="installment_months" class="slip-field">
                            <div class="default text">Choose a plan</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="2">2 Months</div>
                                <div class="item" data-value="3">3 Months</div>
                                <div class="item" data-value="4">4 Months</div>
                                <div class="item" data-value="6">6 Months</div>
                                <div class="item" data-value="8">8 Months</div>
                                <div class="item" data-value="9">9 Months</div>
                                <div class="item" data-value="10">10 Months</div>
                                <div class="item" data-value="11">11 Months</div>
                                <div class="item" data-value="12">12 Months</div>
                                <div class="item" data-value="13">13 Months</div>
                                <div class="item" data-value="14">14 Months</div>
                                <div class="item" data-value="15">15 Months</div>
                                <div class="item" data-value="17">17 Months</div>
                                <div class="item" data-value="18">18 Months</div>
                                <div class="item" data-value="19">19 Months</div>
                                <div class="item" data-value="21">21 Months</div>
                                <div class="item" data-value="22">22 Months</div>
                                <div class="item" data-value="23">23 Months</div>
                                <div class="item" data-value="24">24 Months</div>
                                <div class="item" data-value="25">25 Months</div>
                                <div class="item" data-value="30">30 Months</div>
                                <div class="item" data-value="33">33 Months</div>
                                <div class="item" data-value="36">36 Months</div>
                                <div class="item" data-value="48">48 Months</div>
                                <div class="item" data-value="60">60 Months</div>
                                <div class="item" data-value="0">- None -</div>
                            </div>
                        </div>
                    </div> 
                </div>    
                <div id="other_fields_div" class="equal width small hidden fields">                    
                    <div class="hidden field">    
                        <label>Airline Ticket Number</label> 
                        {{ text_field('ticket_number', 'maxlength': '13', 'class': 'airline-field slip-field') }} 
                    </div>
                    <div class="hidden field">    
                        <label>Merchant Order Number</label> 
                        {{ text_field('merchant_order_number', 'maxlength': '25', 'class': 'vi-field slip-field') }}
                    </div>
                    <div class="hidden field">    
                        <label>Customer Reference</label> 
                        {{ text_field('customer_reference', 'maxlength': '17', 'class': 'vi-field slip-field') }}
                    </div>
                    <div class="hidden field">    
                        <label>Commodity Code</label> 
                        {{ text_field('commodity_code', 'maxlength': '4', 'class': 'vi-field slip-field') }}
                    </div>
                </div>      
                <div class="equal width small fields"> 
                    <div class="field">    
                        <label>Total Trans Amount</label> 
                        {{ text_field('total_transaction_amount', 'disabled': true, 'value': '0.00') }}
                    </div>
                    <div class="field">    
                        <label>Variance</label> 
                        {{ text_field('variance', 'disabled': true, 'value': '0.00') }}
                    </div>
                    <div class="field"> 
                        <div class="ui checkbox">
                            <input type="checkbox" id="variance_exception" class="slip-field">
                            <label><strong><small>Variance Exception</small></strong></label>
                        </div>
                    </div>    
                </div>          
                <div class="required small field">
                    <label>Sales Slip Pull Reason</label>
                    <div id="slip_pull_reason_dropdown" class="ui selection dropdown slip-dropdown">
                        <input type="hidden" id="slip_pull_reason" class="slip-field">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>
                </div>                 
                <div class="small field">    
                    <label>Other Exceptions</label>
                    <div id="other_exception_dropdown" class="ui selection dropdown slip-dropdown">
                        <input type="hidden" id="other_exception" class="slip-field">
                        <div class="default text">Choose an exception</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="Merchant Number">Merchant Number</div>
                            <div class="item" data-value="Currency Code">Currency Code</div>
                            <div class="item" data-value="DCN">DCN</div>
                            <div class="item" data-value="Trailer Batch Amount">Trailer Batch Amount</div>
                            <div class="item" data-value="Transaction Type">Transaction Type</div>
                            <div class="item" data-value="Region">Region</div>
                            <div class="item" data-value="Card Number">Card Number</div>
                            <div class="item" data-value="Transaction Date">Transaction Date</div>
                            <div class="item" data-value="Authorization Code">Authorization Code</div>
                            <div class="item" data-value="Transaction Amount">Transaction Amount</div>
                            <div class="item" data-value="Installment Months">Installment Months</div>
                            <div class="item" data-value="Airline Ticket Number">Airline Ticket Number</div>
                            <div class="item" data-value="Customer Reference Identifier">Customer Reference Identifier</div>
                            <div class="item" data-value="Merchant Order Number">Merchant Order Number</div>
                            <div class="item" data-value="Commodity Code">Commodity Code</div>
                            <div class="item" data-value="Others">Others</div>
                            <div class="item" data-value="0">- None -</div>
                        </div>
                    </div>
                </div>     
                <div class="small hidden field">    
                    <label>Other Exception Detail</label>
                    {{ text_field('other_exception_detail', 'maxlength': '30', 'class': 'slip-field') }} 
                </div>    

                <div class="ui error message"></div>

                
                {#<button class="ui small blue button" style="float: right;" data-tooltip="Complete Order and exit to Home Page" data-position="top center">Comp/Exit</button>                                  
                <button class="ui small blue button" style="float: right;" data-tooltip="Complete Order and process another" data-position="top center">Comp/Next</button>                 
                <div style="margin: 5px 0 20px 0; float: right;">    
                    <button class="ui small green button" data-tooltip="Save changes and process another" data-position="top center">Save/Next</button>
                    <button class="ui small green button" data-tooltip="Save changes and exit to Home Page" data-position="top center">Save/Exit</button>
                    <a href="/gpap" class="ui small button">Exit</a>
                </div>#}        

                <button class="ui small blue button" data-tooltip="Complete Order and process another" data-position="top center">Comp/Next</button>                 
                <button class="ui small blue button" data-tooltip="Complete Order and exit to Home Page" data-position="top center">Comp/Exit</button>                                  
                <div class="ui small basic icon buttons" style="float: right;">
                    <button class="ui icon button more-btn" data-tooltip="Add a new Slip" data-position="top center"><i class="plus blue icon"></i></button>
                    <button class="ui icon disabled button prev-slip-btn" data-tooltip="Previous Slip" data-position="top center"><i class="chevron left green icon"></i></button>
                    <button class="ui icon disabled button next-slip-btn" data-tooltip="Next Slip" data-position="top center"><i class="chevron right green icon"></i></button>  
                    <button class="ui icon disabled button delete-slip-btn" data-tooltip="Delete Slip" data-position="top center"><i class="remove red icon"></i></button>  
                    <button class="ui icon button reset-slip-btn" data-tooltip="Clear All" data-position="top center"><i class="recycle orange icon"></i></button>  
                </div>
                <div style="margin: 5px 0 0 0;">    
                    <button class="ui small green button" data-tooltip="Save changes and process another" data-position="top center">Save/Next</button>
                    <button class="ui small green button" data-tooltip="Save changes and exit to Home Page" data-position="top center">Save/Exit</button>
                    <a href="/gpap" class="ui small button">Exit</a>
                </div>                                                                                    

            </form>    

        </div>
    </div>
    <div class="twelve wide column">                                
        <div id="viewer" style="width: 100%; height: 900px; overflow: scroll; background-color: lightgrey;" class="ui raised segment"></div>
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
    </div>
</div>

{{ modals.getConfirmation('delete', 'Sales Slip') }}

<div class="ui active loader"></div>

{{ stylesheet_link('css/viewer.css') }}
{{ javascript_include('js/viewer.js') }}
{{ javascript_include('js/de.js') }}
{{ javascript_include('js/de_form_actions.js') }}