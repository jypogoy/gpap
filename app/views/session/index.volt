<div class="ui middle aligned center aligned grid">

    <div class="eight wide column">
        {{ content() }}
        <h2 class="ui teal image header">
            <img src="/gpap/public/img/gpap_logo.jpeg" class="image"/>
            <div class="content">Log-in to your account</div>
        </h2>
        {{ form('session/start', 'role': 'form', 'class' : 'ui large form') }}
            <div class="ui piled segment">
                <div class="field">
                <div class="ui left icon input">
                    <i class="user icon"></i>
                    <input type="text" name="username" placeholder="Username">
                </div>
                </div>
                <div class="field">
                <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input type="password" name="password" placeholder="Password">
                </div>
                </div>
                {{ submit_button('Login', 'class': 'ui fluid large teal submit button') }}
            </div>

            <div class="ui error message"></div>

        </form>
        <div class="footer text-muted"><p>&copy; ADEC Innovations, Copyright 2018, All rights reserved.</p></div>
    </div>

</div>
