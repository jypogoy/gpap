<label>Task</label>
<div id="task_id_dropdown" class="ui selection dropdown" style="margin-left: 10px;">
    <input type="hidden" name="task_id">
    <i class="dropdown icon"></i>
    <div class="default text"></div>
    <div class="menu task_menu">
        {% for userTask in userTasks %}
            <div class="item" data-value="{{ userTask.Task.id }}">{{ userTask.Task.name }}</div>
        {% endfor %}
    </div>
</div>