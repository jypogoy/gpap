<nav class="ui fixed menu">
    <a href="#" class="header item">
        <img class="logo" src="/gpap/public/img/cc2.png"> GPAP DE
    </a>
    {{ elements.getMenu() }}
</nav>

<div class="ui main wide">
    {{ flash.output() }}
    {{ content() }}
</div>