<nav class="ui fixed menu" id="menu">
    <a href="#" class="header item">
        <img class="logo" src="/gpap/public/img/cc2.png" style="width: 32px; height: 32px;"> GPAP DE
    </a>
    <?= $this->elements->getMenu() ?>
</nav>

<div class="ui main stackable container">
    <?= $this->flash->output() ?>
    <?= $this->getContent() ?>    
    <div class="footer text-muted"><p>&copy; ADEC Innovations, Copyright 2018, All rights reserved.</p></div>
</div>