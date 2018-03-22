<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
        
            <?= $this->tag->form(['', 'role' => 'form', 'id' => 'dataForm', 'class' => 'ui form', 'autocomplete' => 'off']) ?>

                <h4 class="ui dividing header" style="color: darkblue;"><i class="shopping cart icon"></i>Merchant Header (Deposit Slip)</h4>

                <div class="required small field">
                    <label>Merchant ID</label>
                    <?= $this->tag->textField(['merchantId', 'maxlength' => '16', 'placeholder' => 'Type in the Merchant ID and press <Enter> to validate']) ?>
                </div>  
                <div class="required small field">
                    <label>Merchant Name</label>
                    <?= $this->tag->textField(['merchantName', 'disabled' => true]) ?>
                </div>  
                <div class="equal width small fields">
                    <div class="required field">
                        <label>Currency Code</label>                        
                        <div id="currencyDropdown" class="ui selection dropdown">
                            <input id="currencyCode" type="hidden">
                            <div class="default text">Choose a code</div>
                            <i class="dropdown icon"></i>
                            <div class="menu"></div>
                        </div>
                    </div>                        
                    <div class="required field">
                        <label>DCN</label>
                        <?= $this->tag->textField(['dcn', 'maxlength' => 7]) ?>
                    </div>                       
                </div>    
                <div class="two small fields">
                    
                    <div class="required field">
                        <label>Deposit Date</label>
                        <div class="ui calendar" id="depositDate">
                            <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <?= $this->tag->textField(['', 'placeholder' => 'Date']) ?>
                            </div>
                        </div>
                    </div>    
                    <div class="required field">
                        <label>Deposit Amount</label>
                        <?= $this->tag->textField(['depositAmount']) ?>
                    </div>                                         
                </div>    
                <div class="required field">
                    <label>Merchant Pull Reason</label>
                    <div id="merchantPullDropdown" class="ui selection dropdown">
                        <input id="merchantPullReason" type="hidden">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>                    
                </div> 

                <h4 class="ui dividing header" style="color: darkblue;"><i class="credit card icon"></i>Sales Slip (1 of 1)</h4>

                <div class="equal width small fields">
                    <div class="required field">
                        <label>Transaction Type</label>
                        <div id="transTypeDropdown" class="ui selection dropdown">
                            <input id="transactionType" type="hidden">
                            <div class="default text">Choose a type</div>
                            <i class="dropdown icon"></i>
                            <div class="menu"></div>
                        </div>
                    </div>   
                    <div class="required field">
                        <label>Region</label>
                        <?= $this->tag->textField(['regionCode', 'disabled' => true]) ?>
                    </div> 
                </div>
                <div id="pan_div" class="required small field">
                    <label>Cardholder Number (PAN)</label>
                    <div class="ui right labeled input">
                        <?= $this->tag->textField(['pan', 'placeholder' => 'Credit Card Number']) ?>
                        <div class="ui basic label"><img id="cardLogo" src="public/img/card/private.png" style="height: 12px !important;"></div>
                    </div>
                    <div class="ui basic red pointing prompt label transition hidden" id="pan_alert">
                        <i class="warning icon"></i><span id="pan_msg"></span>
                    </div>
                </div> 
                <div class="three small fields">    
                    <div class="required field">
                        <label>Transaction Date</label>
                        <div class="ui calendar" id="transactionDate">
                            <div class="ui input left icon">
                            <i class="calendar icon"></i>
                            <?= $this->tag->textField(['', 'placeholder' => 'Date']) ?>
                            </div>
                        </div>
                    </div>  
                    <div class="required field">
                        <label>Authorization Code</label>
                        <?= $this->tag->textField(['authCode', 'maxlength' => 6]) ?>
                    </div>  
                    <div class="required field">
                        <label>Transaction Amount</label>
                        <?= $this->tag->textField(['transactionAmount']) ?>
                    </div>     
                </div>    
                <div class="equal width small fields">
                    <div class="required field">    
                        <label>Installment Months</label>
                        <div id="installmentDropdown" class="ui selection dropdown">
                            <input id="installmentMonth" type="hidden">
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
                                <div class="item" data-value="0">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                    <div class="field">    
                        <label>Airline Ticket Number</label> 
                        <?= $this->tag->textField(['']) ?> 
                    </div>
                </div>
                
                <div class="required small field">
                    <label>Sales Slip Pull Reason</label>
                    <div id="slipPullDropdown" class="ui selection dropdown">
                        <input id="slipPullReason" type="hidden">
                        <div class="default text">Choose a reason</div>
                        <i class="dropdown icon"></i>
                        <div class="menu"></div>
                    </div>
                </div>    
                
                <div class="ui error message"></div>

                <button class="ui small orange button" data-tooltip="Add a new Slip" data-position="bottom center"><i class="plus icon"></i>More</button>
                <button class="ui small orange icon button" data-tooltip="Previous Slip" data-position="bottom center"><i class="chevron up icon"></i></button>
                <button class="ui small orange icon button" data-tooltip="Next Slip" data-position="bottom center"><i class="chevron down icon"></i></button>  
                <button class="ui small blue button" style="float: right;" data-tooltip="Complete Order and exit to Home Page" data-position="bottom center">Comp/Exit</button>                                  
                <button class="ui small blue button" style="float: right;" data-tooltip="Complete Order and process another" data-position="bottom center">Comp/Next</button>                 
                <div style="margin: 5px 0 20px 0; float: right;">    
                    <button class="ui small green button" data-tooltip="Save changes and process another" data-position="top center">Save/Next</button>
                    <button class="ui small green button" data-tooltip="Save changes and exit to Home Page" data-position="top center">Save/Exit</button>
                    <a href="../gpap" class="ui small button">Exit</a>
                </div>                                                                                            

            </form>    

        </div>
    </div>
    <div class="twelve wide column">                                
        <div id="viewer" style="width: 100%; height: 850px; overflow: scroll; background-color: lightgrey;" class="ui raised segment"></div>
        <div class="ui large label filename"></div>
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

<?= $this->tag->stylesheetLink('css/viewer.css') ?>
<?= $this->tag->javascriptInclude('js/viewer.js') ?>
<?= $this->tag->javascriptInclude('js/de_form.js') ?>