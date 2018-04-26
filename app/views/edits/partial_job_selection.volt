<label>Job</label>
<div id="region_id_dropdown" class="ui selection dropdown" style="margin-left: 10px;">
    <input type="hidden" name="task_id">
    <i class="dropdown icon"></i>
    <div class="default text"></div>
    <div class="menu task_menu">
        {% for zip in zips %}
            <div class="item" data-value="{{ zip.id }}">{{ zip.rec_date }}-{{ zip.operator_id }}-{{ zip.sequence }}</div>
        {% endfor %}
    </div>
</div>