<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
        
            {{ form('boards/save', 'role': 'form', 'id' : 'dataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

                <h4 class="ui dividing header" style="color: darkblue;"><i class="shopping cart icon"></i>Merchant Header (Deposit Slip)</h4>

                <div class="required small field">
                    <label>Merchant ID</label>
                    {{ text_field('') }}
                </div>  
                <div class="required small field">
                    <label>Merchant Name</label>
                    {{ text_field('') }}
                </div>  
                <div class="equal width small fields">
                    <div class="required field">
                        <label>Currency Code</label>                        
                        <div class="ui selection dropdown">
                            <input type="hidden" name="card[type]">
                            <div class="default text">Choose a code</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="Normal">
                                    036 (AUD)
                                </div>
                                <div class="item" data-value="Airline">
                                    050 (BDT)
                                </div>
                                <div class="item" data-value="Credit">
                                    096 (BND)
                                </div>
                                <div class="item" data-value="Cash Advance">
                                    124 (CAD)
                                </div>        
                                <div class="item" data-value="Airline Credit">
                                    156 (CNY)
                                </div>            
                            </div>
                        </div>
                    </div>                        
                    <div class="required field">
                        <label>DCN</label>
                        {{ text_field('') }}
                    </div>                       
                </div>    
                <div class="two small fields">
                    {#<div class="required field">
                        <label>Deposit Date</label>
                        {{ text_field('') }}
                    </div>   #}
                    <div class="required field">
                        <label>Deposit Date</label>
                        <div class="ui calendar" id="depositDate">
                            <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <input type="text" placeholder="Date">
                            </div>
                        </div>
                    </div>    
                    <div class="required field">
                        <label>Deposit Amount</label>
                        {{ text_field('') }}
                    </div>                                         
                </div>    
                <div class="required field">
                    <label>Merchant Pull Reason</label>
                    <div class="ui search selection dropdown">
                        <input type="hidden" name="reason">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="1">Invalid Merchant: Not in demographic file</div>
                            <div class="item" data-value="2">Invalid Merchant: Status neither ‘O’pen nor ‘R’eopened</div>
                            <div class="item" data-value="3">Invalid Currency: Transaction currency is invalid in the region</div>
                            <div class="item" data-value="4">Invalid Merchant: Transaction currency is not accepted for the merchant account</div>
                            <div class="item" data-value="5">Invalid Merchant: Currency marked on deposit summary slip and sales slip is unmatched</div>
                            <div class="item" data-value="6">Invalid Batch CDN: Same DCN within the same Region on the same day</div>
                            <div class="item" data-value="7">Invalid Batch CDN: Same DCN, same MID, same total amount within the same Region in the historical record</div>
                            <div class="item" data-value="8">Invalid Batch CDN: DCN is less or more than 7 digits</div>
                            {#<div class="item" data-value="Currencies marked on deposit summary slip and transaction slip are unmatched">CNY Dep & crdt/sales unmatch</div>
                            <div class="item" data-value="Currency invalid in this Region">CNY invalid in this Region</div>
                            <div class="item" data-value="Currency None">CNY None</div>
                            <div class="item" data-value="Currency is not accepted by the merchant">CNY not accepted by merc</div>    
                            <div class="item" data-value="DCN less than 7 chars">DCN less than 7 chars</div> 
                            <div class="item" data-value="DCN more than 7 chars">DCN more than 7 chars</div> 
                            <div class="item" data-value="DCN None">DCN None</div> 
                            <div class="item" data-value="Deleted Batch - No transaction attached">Del batch No transaction</div> 
                            <div class="item" data-value="Deleted Batch per client request">Del batch per client request</div> 
                            <div class="item" data-value="Deleted Batch">Deleted Batch</div> 
                            <div class="item" data-value="Duplicate DCN found in the historical record">Dup DCN found in historical</div> 
                            <div class="item" data-value="Duplicate DCN found within a batch">Dup DCN found within batch</div> 
                            <div class="item" data-value="Illegible Currency">Illegible Currency</div> 
                            <div class="item" data-value="Illegible DCN">Illegible DCN</div>
                            <div class="item" data-value="Illegible Scan Issue">Illegible Scan Issue</div>
                            <div class="item" data-value="Illegible Trailer Batch Amount">Illegible Trailer Batch Amt</div>
                            <div class="item" data-value="MID does not Exist">MID does not Exist</div>
                            <div class="item" data-value="MID None">MID None</div>
                            <div class="item" data-value="MID on deposit slip/header is not identical with the slip(s)">MID header not same on slip</div>
                            <div class="item" data-value="MID out of region">MID out of region</div>
                            <div class="item" data-value="MID Status Closed">MID Status Closed</div>
                            <div class="item" data-value="MID Status Deactivated">MID Status Deactivated</div>
                            <div class="item" data-value="MID Status Frozen">MID Status Frozen</div>
                            <div class="item" data-value="Trailer Batch Amount is unmatched with total amount of transactions">Trailer Amount unmatch total trans</div>
                            <div class="item" data-value="Trailer Batch Amount None">Trailer Batch Amount None</div>
                            <div class="item" data-value="Deleted Batch - Identical Auth Codes found in a batch">Del batch same Auth Codes</div>#}                                
                        </div>
                    </div>
                </div> 

                <h4 class="ui dividing header" style="color: darkblue;"><i class="credit card icon"></i>Sales Slip</h4>

                <div class="two small fields">
                    <div class="required field">
                        <label>Transaction Type</label>
                        <div class="ui selection dropdown">
                            <input type="hidden" name="card[type]">
                            <div class="default text">Choose a type</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="Normal">
                                    Normal
                                </div>
                                <div class="item" data-value="Airline">
                                    Airline
                                </div>
                                <div class="item" data-value="Credit">
                                    Credit
                                </div>
                                <div class="item" data-value="Cash Advance">
                                    Cash Advance
                                </div>        
                                <div class="item" data-value="Airline Credit">
                                    Airline Credit
                                </div>    
                                <div class="item" data-value="VI">
                                    VI (HK Only)
                                </div>                 
                            </div>
                        </div>
                    </div>   
                    <div class="required field">
                        <label>Region</label>
                        {{ text_field('', 'disabled' : true) }}
                    </div> 
                </div>
                {#<div class="two small fields">
                    <div class="required field">
                        <label>Card Type</label>
                        <div class="ui selection dropdown">
                            <input type="hidden" name="card[type]">
                            <div class="default text">Choose a type</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                                <div class="item" data-value="visa">
                                    <i class="visa icon"></i>Visa
                                </div>
                                <div class="item" data-value="master">
                                    <i class="mastercard icon"></i>MasterCard
                                </div>
                                <div class="item" data-value="jcb">
                                    <i class="jcb icon"></i>JCB
                                </div>
                                <div class="item" data-value="private">
                                    <i class="credit card icon"></i>Private Label Card
                                </div>                            
                            </div>
                        </div>
                    </div>   
                    <div class="required field">
                        <label>Cardholder Number (PAN)</label>
                        {{ text_field('') }}
                    </div> 
                </div>#}
                <div class="required small field">
                    <label>Cardholder Number (PAN)</label>
                    <div class="ui right labeled input">
                        {{ text_field('') }}
                        <div class="ui basic label"><img src="public/img/card/visa.png" style="height: 12px !important;"></div>
                    </div>
                </div> 
                <div class="three small fields">    
                    <div class="required field">
                        <label>Transaction Date</label>
                        {{ text_field('') }}
                    </div> 
                    <div class="required field">
                        <label>Authorization Code</label>
                        {{ text_field('') }}
                    </div>  
                    <div class="required field">
                        <label>Transaction Amount</label>
                        {{ text_field('') }}
                    </div>     
                </div>    
                <div class="two small fields">
                    <div class="required field">    
                        <label>Installment Months</label>
                        <div class="ui search selection dropdown">
                            <input type="hidden" name="reason">
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
                            </div>
                        </div>
                    </div>
                    <div class="field">    
                        <label>Airline Ticket Number</label> 
                        {{ text_field('') }} 
                    </div>
                </div>
                {#<h4 class="ui dividing header" style="color: darkblue;"><i class="random icon"></i>VI Transaction</h4>
                
                <div class="field">    
                    <label>Merchant Order Number</label> 
                    {{ text_field('') }}
                </div>
                <div class="field">    
                    <label>Customer Reference</label> 
                    {{ text_field('') }}
                </div>
                <div class="field">    
                    <label>Commodity Code</label> 
                    {{ text_field('') }}
                </div>#}
                <div class="required small field">
                    <label>Sales Slip Pull Reason</label>
                    <div class="ui search selection dropdown">
                        <input type="hidden" name="reason">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="Auth Code is less than 3 chars">Auth Code less than 3 chars</div>
                            <div class="item" data-value="Auth Code is more than 6 chars">Auth Code is more than 6 chars</div>
                            <div class="item" data-value="Auth Code None">Auth Code None</div>
                            <div class="item" data-value="Deleted Slip">Deleted Slip</div>
                            <div class="item" data-value="Deleted Slip per client request">Del Slip client request</div>
                            <div class="item" data-value="Deleted Slip due to excess slip">Del Slip Excess</div>
                            <div class="item" data-value="Illegible Airline Ticket Number">Illegible Airline Ticket Num</div>
                            <div class="item" data-value="Illegible Auth Code">Illegible Auth Code</div>
                            <div class="item" data-value="Illegible IPP Terms">Illegible IPP Terms</div>
                            <div class="item" data-value="Illegible PAN">Illegible PAN</div>
                            <div class="item" data-value="Illegible Scan Issue">Illegible Scan Issue</div>
                            <div class="item" data-value="Illegible Transac Amt">Illegible Transac Amt</div>
                            <div class="item" data-value="Illegible Transac Date">Illegible Transac Date</div>
                            <div class="item" data-value="IPP MID does not support IPP">IPP MID doesn't support IPP</div>
                            <div class="item" data-value="IPP Terms Missing">IPP Terms Missing</div>
                            <div class="item" data-value="IPP terms on Merchant Name is not identical with the terms on the slip">IPP MID not identical on slip</div>
                            <div class="item" data-value="PAN did not pass the Mod10 validation">PAN Mod10 validation failed</div>
                            <div class="item" data-value="PAN None">PAN None</div>
                            <div class="item" data-value="PAN Issuer Identification Number is invalid">PAN starting numbers invalid</div>
                            <div class="item" data-value="PAN Issuer Identification Number is not supported - 5018 Maestro Card Type">PAN starting numbers-5018</div>
                            <div class="item" data-value="PAN card type not supported by merchant">PAN type not supported merc</div>
                            <div class="item" data-value="Supporting Document">Supporting Document</div>
                            <div class="item" data-value="Transac Date Future date">Transac Date Future date</div>
                            <div class="item" data-value="Transac Date Invalid date">Transac Date Invalid date</div>
                            <div class="item" data-value="Transac Type DCC">Transac Type DCC</div>
                            <div class="item" data-value="Transac Type Invalid">Transac Type Invalid</div>
                            <div class="item" data-value="Transac Amount None">Trans Amt None</div>
                            <div class="item" data-value="Transac Date None">Trans Date None</div>
                            <div class="item" data-value="Transac Date Older than 11 months">Trans date older than 11mns</div>
                            <div class="item" data-value="Transac Type CUP">Trans Type CUP</div>
                            <div class="item" data-value="Transaction Amounts confusion - 2 (or more) different amounts in one transaction">Trans amts more than 2 amts</div>
                            <div class="item" data-value="Auth Code provided are 2 (or more) which are unidentical">Multi Authcodes not same</div>
                            <div class="item" data-value="Auth Code with duplicate">Authcode with duplicate</div>
                            <div class="item" data-value="Transac Date Format Invalid for this region">Trans date format invalid</div>
                        </div>
                    </div>
                </div>    
                {#<div class="required field">    
                    <label>Filename</label> 
                    {{ text_field('') }}
                </div>   
                <div class="field"> 
                    <div class="ui checkbox">
                        {{ check_field('') }}
                        <label>Exception</label>
                    </div> 
                </div>
                <div class="field">     
                    <div class="ui checkbox">
                        {{ check_field('') }}
                        <label>With Inquiry</label>
                    </div> 
                </div>#}

                <div class="ui error message"></div>

                <button class="ui small orange button" data-tooltip="Add a new Slip" data-position="bottom center"><i class="plus icon"></i>Add Slip</button>
                <button class="ui small orange icon button" data-tooltip="Previous Slip" data-position="bottom center"><i class="chevron up icon"></i></button>
                <button class="ui small orange icon button" data-tooltip="Next Slip" data-position="bottom center"><i class="chevron down icon"></i></button>                
                <div style="margin-top: 5px;">                    
                    <button class="ui small primary button" data-tooltip="Complete Order and process another" data-position="right center">Complete & Next</button> 
                    <button class="ui small primary button" data-tooltip="Complete Order and exit to Home Page" data-position="bottom center">Complete & Exit</button>                    
                </div>         
                <div style="margin-top: 5px;">    
                    <button class="ui small green button" data-tooltip="Save changes and process another" data-position="right center">Save & Next</button>
                    <button class="ui small green button" data-tooltip="Save changes and exit to Home Page" data-position="bottom center">Save & Exit</button>
                    <a href="../gpap" class="ui small button" style="float: right;">Exit</a>
                </div>       
                
                {#<a href="../gpap" class="ui small button" style="float:right;">Exit</a>#}
                {#<div class="ui small primary buttons" style="float:right; padding-right: 10px;">
                    <button class="ui button"><i class="save icon"></i>Save and Next</button>
                    <div class="ui floating dropdown icon button">
                        <i class="dropdown icon"></i>
                        <div class="menu">                              
                            <div class="item">Complete and Next</div>
                            <div class="item">Complete and Exit</div>
                            <div class="item">Save and Exit</div>
                        </div>
                    </div>       
                </div>#}                                                            

            </form>    

        </div>
    </div>
    <div class="twelve wide column">
        
            {#<div class="ui compact menu">
                <a class="active item" title="Pointer"><i class="mouse pointer icon"></i></a>
                <a class="item" title="Zoom In"><i class="zoom in icon"></i></a>
                <a class="item" title="Zoom Out"><i class="zoom out icon"></i></a>
                <a class="item" title="Magnify"><i class="eye icon"></i></a>
                <a class="item" title="Pan"><i class="hand pointer icon"></i></a>
            </div>#}
            {#<iframe src = "/ViewerJS/#../ftp/0.pdf" width='100%' height='100%' allowfullscreen webkitallowfullscreen></iframe>#}
            
            {#<iframe src = "http://localhost:82/imageviewer/" width='100%' height='800px' allowfullscreen webkitallowfullscreen frameBorder="0"></iframe>#}
            
            <div id="viewer" style="width: 100%; height: 900px; overflow: scroll; background-color: lightgrey;" class="ui raised segment"></div>
            <div class="ui large label filename">Scan0001.tif</div>
            <div class="command">           
                <div class="ui small basic icon buttons">
                    <button id="preBtn" class="ui disabled button" data-tooltip="Previous" data-position="bottom center"><i class="chevron left icon"></i></button>
                    <div class="ui large label">Page 1 of 1</div>
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

<div class="ui active loader"></div>

{{ stylesheet_link('css/viewer.css') }}
{{ javascript_include('js/de.js') }}