{% for zip in zips %}
    <div class="item" data-value="{{ zip.zip.id }}">{{ str_replace('-', '', zip.zip.rec_date) }}-{{ zip.zip.operator_id }}-{{ zip.zip.getSequence() }}</div>
{% endfor %}