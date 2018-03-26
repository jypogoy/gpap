<table id="batchTable" class="ui sortable selectable celled striped table">
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
                <a href="de/{{ batch.id }}" class="ui icon" data-tooltip="Start" data-position="bottom center">
                    <i class="large play circle icon"></i>
                </a>
            </td>
        </tr>
        {% endfor %}
    </tbody>    
</table>