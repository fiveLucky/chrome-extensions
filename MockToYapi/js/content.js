
function read(blob, callback) {
  var reader = new FileReader();
  reader.readAsText(blob);
  reader.onload = function (res) {
    console.log(JSON.parse(res.target.result));
    callback(res.target.result)
  }
}
function save(json, name) {
  var newFile = new File([JSON.stringify(json)], "yapi-" + name + ".json", { type: "application/json" })
  saveAs(newFile);
}
function getResBody(arr) {
  var resBody = {
    properties: {},
    required: []
  };
  resBody.$schema = "http://json-schema.org/draft-04/schema#";
  resBody.type = "object";
  arr.forEach(function (item) {
    resBody.properties[item.name] = {
      type: item.type,
      description: item.description,
    }
    // 默认全部required
    resBody.required.push(item.name)
    // 递归
    if (item.children.length !== 0) {
      resBody.properties[item.name].properties = getResBody(item.children).properties;
      resBody.properties[item.name].required = getResBody(item.children).required;
      resBody.properties[item.name].type = item.type;
    }
  })
  return resBody;
}
function getReqBody(arr) {
  var reqBody = {
    properties: {},
    required: []
  };
  reqBody.type = "object";
  reqBody.title = '';
  arr.forEach(function (item) {
    reqBody.properties[item.name] = {
      type: item.type,
      description: item.description,
    }
    // 默认全部required
    reqBody.required.push(item.name)
    // 递归
    if (item.children.length !== 0) {
      reqBody.properties[item.name].properties = getReqBody(item.children).properties;
      reqBody.properties[item.name].required = getReqBody(item.children).required;
      reqBody.properties[item.name].type = item.type;
      reqBody.properties[item.name].title = '';
    }
  })
  return reqBody;
}
function getProperties(arr) {
  var require = [];
  arr.forEach(function (item) {
    require.push(item.name);
    if (item.children.length !== 0) {
      properties[item.name].properties = getProperties(item.children);
    }
  })
  return properties;
}

function format(mockJson) {
  var systemName = mockJson.name;
  var yapiArr = [];
  var project_id = window.location.pathname.split('/')[2]
  mockJson.docs.forEach(function (group) {
    group.children.forEach(function (item, index) {
      var yapiJson = {
        list: []
      };
      yapiJson.name = group.name + "-" + item.name;
      yapiJson.desc = yapiJson.name;
      yapiJson.add_time = Date.now();
      yapiJson.up_time = Date.now();
      yapiJson.index = index;
      item.children.forEach(function (apiData, index) {
        var apiJson = {};
        var parseJson = {};
        // TODO 这里有坑，数据有瑕疵，导致输出数据丢失
        try {
          parseJson = JSON.parse(apiData.content);
        } catch (error) {
          return;
        }
        apiJson._id = apiData.id;
        apiJson.method = parseJson.requestMethod;
        apiJson.catid = 0;
        apiJson.title = apiData.name;
        apiJson.path = apiData.mockPath;
        apiJson.project_id = project_id;
        apiJson.res_body_type = "json";
        apiJson.desc = apiData.name;
        apiJson.res_body = JSON.stringify(getResBody(parseJson.responseArgs));
        apiJson.__v = 0;
        apiJson.req_body_type = "json";
        apiJson.req_body_other = JSON.stringify(getReqBody(parseJson.requestArgs));
        apiJson.api_opened = false;
        apiJson.res_body_is_json_schema = true;
        apiJson.req_body_is_json_schema = true;
        apiJson.req_body_form = [];
        apiJson.req_params = [];
        apiJson.req_headers = [];
        apiJson.type = "static";
        apiJson.protocol_type = "HTTP";
        apiJson.status = "undone";
        apiJson.edit_uid = 0;
        apiJson.query_path = {
          "path": apiData.mockPath,
          "params": []
        };
        yapiJson.list.push(apiJson);
      })
      yapiArr.push(yapiJson)
    })

  });

  return yapiArr;
}
document.getElementById('mockFile').onchange = function (e) {
  document.getElementById('tip').innerHTML = '转换中...';
  var file = e.target.files[0];
  read(file, function (data) {
    var yapiData = format(JSON.parse(data))
    document.getElementById('tip').innerHTML = '转换完成，去导入吧！';
    save(yapiData, file.name.split('.').slice(0, -1).join('.'));
  })
}


