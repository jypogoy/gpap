{% for entry in entries %}
    <tr>
        <td>{{ entry.Batch.Zip.Region.code }}</td>    
        <td>{{ entry.Batch.Zip.rec_date }}</td>
        <td>{{ entry.Batch.TransactionType.type }}</td> 
        <td>{{ entry.Batch.Zip.sequence }}</td>
        <td>{{ entry.Batch.id }}</td>
        <td class="data-process-btn">
            <a href="de/1" data-tooltip="Review" data-position="bottom center">
                <i class="edit orange icon"></i>
            </a>
            <a data-tooltip="Complete" data-position="bottom center">
                <i class="check green icon"></i>
            </a>             
        </td>
    </tr>
{% endfor %}