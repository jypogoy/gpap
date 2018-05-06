<table id="batchTable" class="ui selectable celled striped table">
    <thead>
        <tr>
            <th>Region</th>
            <th>Type</th>
            <th>Recording Date</th>                    
            <th>Operator</th>
            <th>Sequence</th>
            <th>Batch</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {% for batch in batches %}
        <tr>
            <td>{{ batch.Zip.region_code }}</td>
            <td>{{ batch.TransactionType.type }}</td>
            <td>{{ batch.Zip.rec_date }}</td>
            <td>{{ batch.Zip.operator_id }}</td>
            <td>{{ batch.Zip.getSequence() }}</td>
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