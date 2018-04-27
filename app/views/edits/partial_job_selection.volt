
{% for zip in zips %}
    <div class="item" data-value="{{ zip.id }}">{{ zip.rec_date }}_{{ zip.operator_id }}_{{ zip.sequence }}</div>
{% endfor %}