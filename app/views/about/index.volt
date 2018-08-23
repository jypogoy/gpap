<input type="hidden" id="session_lifetime" value="<?php echo $this->config->get('session_lifetime'); ?>"/>
<input type="hidden" id="until_timeout" value="<?php echo $this->config->get('until_timeout'); ?>"/>

<div class="page-header">
    <h2>About GPAP DE</h2>
</div>

<div class="ui segment">
    <p>A system primarily used for data encoding of manually imprinted credit card transactions.</p>
    <p>Information being recorded includes the credit card number, owner’s name, expiration date, authorization code, purchase amount and merchant details.</p>
    <p>The main client for this project is Global Payments Asia Pacific.</p>
</div>

{{ javascript_include('js/heartbeat.js') }}
{{ javascript_include('js/session_listener.js') }}