
// document.documentElement.innerHTML = window.template;

let dataSource = {
  data: [],
  total: 0,
};

function copy(content, type) {
  $('#clipBoard').value = content;
  $('#clipBoard').focus();
  $('#clipBoard').select();
  const msg = {
    excel: '请手动复制后粘贴到excel中'
  }
  notify(msg[type] || '请手动复制粘贴');
}

function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}
function zeroPad(val) {
  return val.toString().padStart(2, '0');
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return year + '-' + zeroPad(month) + '-' + zeroPad(day) + 'T' + zeroPad(hour) + ':' + zeroPad(minute);
}
function beginDate(date) {
  return formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
}
function endDate(date) {
  return formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
}

$('#fromDate').value = beginDate(new Date());
$('#toDate').value = endDate(new Date());
$('#toDate').onfocus = function () {
  console.log('onfocus', 'toDate');
}
$('#toDate').onblur = function () {
  console.log('onblur', 'toDate');
}
$('#today').onclick = function () {
  $('#fromDate').value = beginDate(new Date());
  $('#toDate').value = endDate(new Date());
}
$('#yesterday').onclick = function () {
  const yesterday = new Date(Date.now() - 86400000);
  $('#fromDate').value = beginDate(yesterday);
  $('#toDate').value = endDate(yesterday);
}
$('#last2day').onclick = function () {
  $('#fromDate').value = beginDate(new Date(Date.now() - 86400000));
  $('#toDate').value = endDate(new Date());
}
$('#last7day').onclick = function () {
  const now = new Date();
  $('#fromDate').value = beginDate(new Date(Date.now() - 6 * 86400000));
  $('#toDate').value = endDate(new Date());
}

$('#search').onclick = fetchTable;
$('#filter').onclick = renderTable;

$('#export').onclick = () => {
  copy($('tbody').innerText, 'excel');
};

$('#copyDataSource').onclick = () => {
  copy(JSON.stringify(dataSource));
};

$('#main').onclick = (e) => {
  const tagName = e.target.tagName.toUpperCase();
  switch (tagName) {
    case 'TD':
      e.target.parentNode.style.backgroundColor = e.target.parentNode.style.backgroundColor ? '' : '#ccc';
      break;
    case 'TH':
      sortColumn(e.target.getAttribute('k'));
      break;
  }
};

$('.fields').onclick = (e) => {
  renderTable();
};

function setFields(row) {
  const hideFields = ['client_time', 'gid', 'entry_key', 'entry_detail'];
  const checkedFields = ['client_time', 'gid', 'entry_key', 'entry_detail'];
  const fields = Object.keys(row).filter(k => !hideFields.includes(k));
  if (row.package_info) {
    Object.keys(row.package_info).forEach((k) => {
      fields.unshift(`package_info.${k}`);
    });
  }
  fields.sort((left, right) => (left === right ? 0 : (left > right ? 1 : -1)));
  if (row.wmonitor && row.wmonitor.tags) {
    Object.keys(row.wmonitor.tags).forEach((k) => {
      fields.unshift(`wmonitor.tags.${k}`);
    });
  }
  if (row.entry_detail) {
    Object.keys(row.entry_detail).forEach((k) => {
      fields.unshift(`entry_detail.${k}`);
    });
  }
  fields.unshift('entry_detail');
  fields.unshift('entry_key');
  fields.unshift('gid');
  fields.unshift('client_time');
  $('.fields').innerHTML = fields.map(k =>
    `<label>
      <input name="fields" type="checkbox" value="${k}"
        ${checkedFields.includes(k) ? 'checked="checked"' : ''}
        ${k === 'client_time' ? 'disabled="disabled"' : ''}
      />${k}</label>`
  ).join('');
}

function getFields() {
  const fieldsInput = [...document.getElementsByName('fields')];
  return fieldsInput.filter(node => node.checked).map(node => node.value);
}

function fetchTable() {
  const size = parseInt($('#size').value);
  const queryString = $('#queryString').value;
  const fromMilliseconds = new Date($('#fromDate').value).getTime();
  const toMilliseconds = new Date($('#toDate').value).getTime();
  const param1 = {
    index: [
      'fe_app_log*',
    ],
    ignore_unavailable: true,
    preference: 1543335722142, // TODO 这是啥
  };

  const querys = [...document.getElementById('keyForm').elements].filter(
    element => element.hasAttribute('include') && element.value !== ''
  ).map(element => {
    const id = element.id;
    const value = element.value.trim();
    if (id === 'pid' && value) {
      const values = value.split(/\s*,\s*/);
      return {
        "bool": {
          "should": values.map(pid => ({
            match_phrase: { pid }
          })),
          "minimum_should_match": 1
        }
      };
    }
    return {
      match_phrase: {
        [id]: {
          query: value
        }
      }
    };
  });
  if (queryString) {
    querys.push({
      query_string: {
        query: queryString,
        analyze_wildcard: true,
      },
    });
  }

  const param2 = {
    version: true,
    size,
    sort: [
      {
        '@timestamp': {
          order: 'desc',
          unmapped_type: 'boolean',
        },
      },
    ],
    query: {
      bool: {
        must: [
          ...querys,
          {
            range: {
              '@timestamp': {
                gte: fromMilliseconds,
                lte: toMilliseconds,
                format: 'epoch_millis',
              },
            },
          },
        ],
        must_not: [],
      },
    },
    _source: {
      excludes: [],
    },
    aggs: {
      2: {
        date_histogram: {
          field: '@timestamp',
          interval: '30m',
          time_zone: 'Asia/Shanghai',
          min_doc_count: 1,
        },
      },
    },
    stored_fields: [
      '*',
    ],
    script_fields: {},
    docvalue_fields: [
      '@timestamp',
    ],
  };

  fetch('/elasticsearch/_msearch', {
    credentials: 'include',
    headers: {
      accept: 'application/json, text/plain, */*', 'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6', 'content-type': 'application/x-ndjson', 'kbn-version': '5.6.10',
    },
    referrerPolicy: 'no-referrer-when-downgrade',
    body: `${JSON.stringify(param1)}\n${JSON.stringify(param2)}\n`,
    method: 'POST',
    mode: 'cors',
  }).then(res => res.json()).then((res) => {
    dataSource.data = res.responses[0].hits.hits.map((item) => {
      const msg = item._source.message.split('\t');
      return JSON.parse(msg.pop());
    });
    dataSource.total = res.responses[0].hits.total;
    if (dataSource.data.length > 0) { // 初始化可显示的列
      setFields(dataSource.data[0]);
    }
    if (dataSource.total > size) {
      notify(`数据超过 ${size} 条，请调整查询数量`);
    }
    sortColumn.props = '';
    sortColumn('client_time');
  });
}

function getValue(value, props) {
  props = props.split('.');
  for (let i = 0; i < props.length; i++) {
    value = value[props[i]];
    if (!value || typeof value !== 'object') {
      break;
    }
  }
  return typeof value === 'object' ? JSON.stringify(value) : value || '';
}

function sortColumn(props = 'client_time') {
  if (props !== sortColumn.props) { // 默认降序
    sortColumn.increase = false;
  } else { // 再次点击反序
    sortColumn.increase = !sortColumn.increase;
  }
  dataSource.data.sort((left, right) => {
    left = getValue(left, props);
    right = getValue(right, props);
    if (left === right) {
      return 0;
    }
    return sortColumn.increase ? (left > right ? 1 : -1) : (left > right ? -1 : 1);
  });
  sortColumn.props = props; // 记录上一次排序列
  renderTable();
}

function renderTable() {
  try {
    const filter = new Function('item', 'index', 'array', $('#filterCode').value || 'return true;');
    const columns = getFields();
    const rows = dataSource.data.filter(filter);
    const html = ['<table border="1" border-collapse="collapse">'];
    html.push(`<caption>当前显示<strong> ${rows.length} </strong>条 / 总共<strong> ${dataSource.total} </strong>条</caption>`);
    html.push(`<thead><tr>${columns.map(k =>
      `<th k="${k}">${k} ${k === sortColumn.props ? (sortColumn.increase ? '&#9650;' : '&#9660;') : ''}</th>`
    ).join('')}</tr></thead>`);
    html.push('<tbody>');
    if (rows.length > 0) {
      rows.forEach((item) => {
        html.push(`<tr>${columns.map(k => `<td>${getValue(item, k)}</td>`).join('')}</tr>`);
      });
    } else {
      html.push(`<tr><td colspan="${columns.length}" align="center">暂无数据</td></tr>`);
    }
    html.push('</tbody>');
    html.push('</table>');
    $('#main').innerHTML = html.join('');
  } catch (e) {
    alert(e.stack);
  }
}

let notification = $('#notification');
let notificationTimer;
notify('Welcome !!!');
notification.onclick = () => {
  notification.style.display = 'none';
}
function notify(message) {
  notification.innerHTML = '<div>' + message + '</div>';
  notification.style.display = 'block';
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    notification.style.display = 'none';
  }, 4000);
}
