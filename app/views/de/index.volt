<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
        
            {{ form('boards/save', 'role': 'form', 'id' : 'dataForm', 'class' : 'ui form', 'autocomplete' : 'off') }}

                <h4 class="ui dividing header" style="color: darkblue;"><i class="shopping cart icon"></i>Merchant Header (Deposit Slip)</h4>

                <div class="required field">
                    <label>Merchant ID</label>
                    {{ text_field('', 'maxlength' : '2') }}
                </div>  
                <div class="required field">
                    <label>Merchant Name</label>
                    {{ text_field('') }}
                </div>   
                <div class="field">
                    <div class="ui checkbox">
                        {{ check_field('') }}
                        <label>Accepts other currencies</label>
                    </div>
                </div>
                <div class="required field">
                    <label>Transaction Currency Code</label>
                    {{ text_field('', 'maxlength' : '3') }}
                </div> 
                <div class="required field">
                    <label>Deposit Control Number</label>
                    {{ text_field('', 'maxlength' : '10') }}
                </div>    
                <div class="required field">
                    <label>Deposit Date</label>
                    {{ text_field('') }}
                </div>   
                <div class="required field">
                    <label>Total Deposit Amount</label>
                    {{ text_field('') }}
                </div>    
                <div class="required field">
                    <label>Merchant Pull Reason</label>
                    <div class="ui search selection dropdown">
                        <input type="hidden" name="reason">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div class="item" data-value="Currencies marked on deposit summary slip and transaction slip are unmatched">CNY Dep & crdt/sales unmatch</div>
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
                            <div class="item" data-value="Deleted Batch - Identical Auth Codes found in a batch">Del batch same Auth Codes</div>
                        </div>
                    </div>
                </div> 

                <h4 class="ui dividing header" style="color: darkblue;"><i class="credit card icon"></i>Sales Slip</h4>

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
                    <div class="ui right labeled input">
                        {{ text_field('') }}
                        <div class="ui label">USD</div>
                    </div>
                </div>       
                <div class="required field">    
                    <label>Installment Months</label> 
                    <div class="ui right labeled input">
                        {{ text_field('') }}
                        <div class="ui label">Months</div>
                    </div>
                </div>

                <h4 class="ui dividing header" style="color: darkblue;"><i class="plane icon"></i>Airline Transaction</h4>
                
                <div class="field">    
                    <label>Ticket Number</label> 
                    {{ text_field('') }} 
                </div>

                <h4 class="ui dividing header" style="color: darkblue;"><i class="random icon"></i>VI Transaction</h4>
                
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
                </div>
                <div class="required field">
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
                <div class="required field">    
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
                </div>

                <div class="ui error message"></div>

                {{ submit_button('Save', 'class': 'ui primary button', 'onclick': 'return Form.validate(false, false);') }}
                {{ submit_button('Save & Next', 'class': 'ui primary button', 'onclick': 'return Form.validate(false, false);') }}
                <a href="../gpap" class="ui button">Exit</a>

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
            {#<iframe src = "/ViewerJS/#../ftp/sample.pdf" width='100%' height='100%' allowfullscreen webkitallowfullscreen></iframe>#}
            <div id="viewer"></div>          
    </div>
</div>

{{ javascript_include('js/de.js') }}