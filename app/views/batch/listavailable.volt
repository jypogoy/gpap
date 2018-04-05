<table id="batchTable" class="ui selectable celled striped table">
    <thead>
        <tr>
            <th>REGION</th>
            <th>RECODING DATE</th>                    
            <th>TRANSACTION TYPE</th>
            <th>SEQUENCE</th>
            <th>BATCH</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {% for batch in batches %}
        <tr>
            <td>{{ batch.Zip.region_code }}</td>
            <td>{{ batch.Zip.rec_date }}</td>
            <td>{{ batch.TransactionType.type }}</td>
            <td>{{ batch.Zip.sequence }}</td>
            <td>{{ batch.id }}</td>
            <td>
                <a onclick="begin({{ batch.id }}); return false;" class="ui icon" data-tooltip="Start" data-position="bottom center">
                    <i class="large play circle green icon"></i>Start
                </a>
            </td>
        </tr>
        {% else %}
        <tr><td colspan="6">No records found.</td></tr> 
        {% endfor %}
    </tbody>    
</table>