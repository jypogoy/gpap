<nav class="ui fixed menu">
    <a href="#" class="header item">
        <img class="logo" src="/gpap/public/img/cc2.png"> GPAP DC
    </a>
    <?= $this->elements->getMenu() ?>
</nav>

<div class="ui main wide">
    <?= $this->flash->output() ?>
    <?= $this->getContent() ?>
</div>