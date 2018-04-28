{% for row in rows %}
    <tr>
        <td>{{ row.region_code }}</td>    
        <td>{{ row.rec_date }}</td>
        <td>{{ row.type }}</td> 
        <td>{{ row.sequence }}</td>
        <td>{{ row.id }}</td>
        <td>
            <a onclick="edit({{ row.id }}); return false;" data-tooltip="Edit" data-position="bottom center">
                <i class="pencil alternate orange icon"></i>Edit
            </a>        
        </td>
    </tr>
{% endfor %}