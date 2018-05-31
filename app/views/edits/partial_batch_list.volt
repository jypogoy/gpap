{% for row in rows %}
    <tr>
        {#<td>{{ batch.Zip.Region.code }}</td>    
        <td>{{ batch.Zip.rec_date }}</td>
        <td>{{ batch.TransactionType.type }}</td> 
        <td>{{ batch.Zip.getSequence() }}</td>
        <td>{{ batch.id }}</td>#}
        <td>{{ row.region_code }}</td>            
        <td>{{ str_replace('-', '', row.rec_date) }}-{{ row.operator_id }}-{{ row.sequence }}</td>        
        <td>{{ row.type }}</td> 
        <td>{{ row.file_name }}</td> 
        <td>{{ row.batch_id }}</td>
        <td>
            {#<a onclick="edit({{ row.batch_id }}, {{ row.task_id }}, '{{ row.last_activity }}'); return false;" data-tooltip="Edit" data-position="bottom center">
                {% if row.task_id  %}
                    <i class="pencil alternate orange icon"></i>{{ row.last_activity }}
                {% endif %}  
            </a>#}
            {% if row.last_activity == 'Entry 1' %}
                <a onclick="edit({{ row.batch_id }}, 4, 'Entry 1'); return false;" data-tooltip="Edit Entry 1" data-position="bottom center">Entry 1</a>
            {% elseif row.last_activity == 'Verify' %}
                <a onclick="edit({{ row.batch_id }}, 4, 'Entry 1'); return false;" data-tooltip="Edit Entry 1" data-position="bottom center">Entry 1</a>
                ·
                <a onclick="edit({{ row.batch_id }}, 5, 'Verify'); return false;" data-tooltip="Edit Verify" data-position="bottom center">Verify</a>
            {% elseif row.last_activity == 'Balancing' %}
                <a onclick="edit({{ row.batch_id }}, 4, 'Entry 1'); return false;" data-tooltip="Edit Entry 1" data-position="bottom center">Entry 1</a>
                ·
                <a onclick="edit({{ row.batch_id }}, 5, 'Verify'); return false;" data-tooltip="Edit Verify" data-position="bottom center">Verify</a>
                ·
                <a onclick="edit({{ row.batch_id }}, 6, 'Balancing'); return false;" data-tooltip="Edit Balancing" data-position="bottom center">Balancing</a>
            {% endif %}            
        </td>
    </tr>
{% endfor %}