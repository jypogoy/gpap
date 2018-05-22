
{% for zip in zips %}
    <div class="item" data-value="{{ zip.id }}">{{ str_replace('-', '', zip.rec_date) }}-{{ zip.operator_id }}-{{ zip.getSequence() }}</div>
{% endfor %}