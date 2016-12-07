module.exports = class {{ model }} {
  {% for k,v in attr %}
    {{k}}: {{v}},
  {% else %}
    error
  {% endfor %}
}