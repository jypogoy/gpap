<label>Region</label>
<div id="region_id_dropdown" class="ui selection dropdown" style="margin-left: 10px;">
    <input type="hidden" name="task_id">
    <i class="dropdown icon"></i>
    <div class="default text"></div>
    <div class="menu task_menu">
        {% for region in regions %}
            <div class="item" data-value="{{ region.id }}">{{ region.name }}</div>
        {% endfor %}
    </div>
</div>