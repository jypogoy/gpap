<div class="ui middle aligned center aligned grid">

    <div class="eight wide column">
        <h2><i class="key icon"></i>Change Password</h2>
        <form class="ui segment form" autocomplete="off">            
            <div class="field">
                <div class="ui left icon input">
                    <i class="lock icon"></i>
                    {{ password_field('current_password', 'placeholder': 'Current Password', 'tabIndex': 2, 'autofocus': true) }}  
                </div>
            </div>
            <div class="field">
                <div class="ui left icon input">
                    <i class="lock icon"></i>
                    {{ password_field('new_password', 'placeholder': 'New Password', 'tabIndex': 2) }}  
                </div>
            </div>
            <div class="field">
                <div class="ui left icon input">
                    <i class="lock icon"></i>
                    {{ password_field('confirm_password', 'placeholder': 'Confirm Password', 'tabIndex': 3) }}  
                </div>
            </div>
            {{ submit_button('Update Password', 'class': 'ui fluid large teal submit button', 'tabindex': 4) }}                
                      
            <div class="ui error message" style="text-align: left;"></div>

        </form>
        <div class="footer text-muted"><p>&copy; ADEC Innovations, Copyright 2018, All rights reserved.</p></div>
    </div>

</div>

{{ javascript_include('js/change_password.js') }}