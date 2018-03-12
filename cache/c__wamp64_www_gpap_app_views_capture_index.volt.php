<div class="ui stackable grid">
    <div class="four wide column">
        <div class="ui raised segment" style="height: 100%;">
        
            <?= $this->tag->form(['boards/save', 'role' => 'form', 'id' => 'dataForm', 'class' => 'ui form', 'autocomplete' => 'off']) ?>

                <h4 class="ui dividing header" style="color: darkblue;"><i class="shopping cart icon"></i>Merchant Header (Deposit Slip)</h4>

                <div class="required field">
                    <label>Merchant ID</label>
                    <?= $this->tag->textField(['']) ?>
                </div>    
                <div class="required field">
                    <label>Transaction Currency Code</label>
                    <?= $this->tag->textField(['']) ?>
                </div> 
                <div class="required field">
                    <label>Deposit Control Number</label>
                    <?= $this->tag->textField(['']) ?>
                </div>    
                <div class="required field">
                    <label>Deposit Date</label>
                    <?= $this->tag->textField(['']) ?>
                </div>   
                <div class="required field">
                    <label>Total Deposit Amount</label>
                    <?= $this->tag->textField(['']) ?>
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
                    <?= $this->tag->textField(['']) ?>
                </div> 
                <div class="required field">
                    <label>Transaction Date</label>
                    <?= $this->tag->textField(['']) ?>
                </div> 
                <div class="required field">
                    <label>Authorization Code</label>
                    <?= $this->tag->textField(['']) ?>
                </div>  
                <div class="required field">
                    <label>Transaction Amount</label>
                    <?= $this->tag->textField(['']) ?>
                </div>
                <div class="required field">
                    <label>Installment Month</label>
                    <?= $this->tag->textField(['']) ?>
                </div>

                <div class="ui error message"></div>

                <?= $this->tag->submitButton(['Save', 'class' => 'ui primary button', 'onclick' => 'return Form.validate(false, false);']) ?>
                <?= $this->tag->submitButton(['Save & Next', 'class' => 'ui primary button', 'onclick' => 'return Form.validate(false, false);']) ?>
                <a href="../../boards" class="ui button">Exit</a>

            </form>    

        </div>
    </div>
    <div class="twelve wide column">
        
            
            <iframe src = "/ViewerJS/#../sampleimg/doc.pdf" width='100%' height='100%' allowfullscreen webkitallowfullscreen></iframe>
        
    </div>
</div>