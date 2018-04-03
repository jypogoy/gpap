{% for entry in entries %}
    <tr>
        <td>{{ entry.Batch.Zip.Region.code }}</td>    
        <td>{{ entry.Batch.Zip.rec_date }}</td>
        <td>{{ entry.Batch.TransactionType.type }}</td> 
        <td>{{ entry.Batch.Zip.sequence }}</td>
        <td>{{ entry.Batch.id }}</td>
        <td class="data-process-btn" width="20%">
            <a href="de/1" data-tooltip="Review" data-position="bottom center">
                <i class="pencil alternate orange icon"></i>Edit
            </a>
            <i class="ellipsis vertical icon"></i>
            <a href onclick="complete({{ entry.id }}, {{ entry.Batch.id }}); return false;" data-tooltip="Mark as Complete" data-position="bottom center">
                <i class="check green icon"></i>Complete
            </a>             
        </td>
    </tr>
{% endfor %}