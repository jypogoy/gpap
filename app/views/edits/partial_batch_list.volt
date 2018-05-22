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
            <a onclick="edit({{ row.batch_id }}, {{ row.task_id }}, '{{ row.last_activity }}'); return false;" data-tooltip="Edit" data-position="bottom center">
                {% if row.task_id  %}
                    <i class="pencil alternate orange icon"></i>{{ row.last_activity }}
                {% endif %}    
            </a>
        </td>
    </tr>
{% endfor %}