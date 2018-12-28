window.template = `
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  </head>
  <body>
    <a name="top"></a>
    <form id="keyForm" onsubmit="return false" name="keyForm" autocomplete="on">
      <div class="tools">
        <label>pid:</label><input include id="pid" type="text" value="" placeholder="多个逗号分隔" class="w100" />
        <label>project_id:</label><select include id="package_info.project_id">
          <option value="">无</option>
          <option value="dms-shop-app" selected="selected">dms-shop-app</option>
          <option value="tms-driver-app">tms-driver-app</option>
          <option value="moliere-app">moliere-app</option>
        </select>
        <label>查询数量:</label><input id="size" type="number" value="1000" step="1000" class="w70" />
        <label>from:</label><input id="fromDate" type="datetime-local" />
        <label>end:</label><input id="toDate" type="datetime-local" />
        <button id="today">今天</button>
        <button id="yesterday">昨天</button>
        <button id="last2day">前2天</button>
        <button id="last7day">前7天</button>
      </div>
      <div class="tools">
        <label>ws_user_id:</label><input include id="ws_user_id" type="text" value="" />
        <label>gid:</label><input include id="gid" type="text" value="" class="flex1" />
        <label>entry_key:</label><input include id="entry_key" type="text" class="flex1" autocomplete="on" />
        <label>搜索:</label><input id="queryString" type="text" class="flex3" autocomplete="on" />
        <button id="search">查询</button>
        <button id="export">导出</button>
        <button id="copyDataSource">查看原始数据</button>
      </div>
    </form>
    <div class="tools">
      <label>function filter(item, index, array) { &nbsp; </label>
      <textarea id="filterCode" placeholder="请输入过滤函数，例如：return item.entry_detail.res.status === 403;" class="filter"></textarea> &nbsp; }
      <button id="filter">过滤</button>
    </div>
    <fieldset>
      <legend>搜索结果</legend>
    <div class="content">
      <div class="slide">
        <label>显示列:</label>
        <div class="fields">
          <label><input name="fields" type="checkbox" value="client_time" disabled="disabled" checked="checked" />client_time</label>
          <label><input name="fields" type="checkbox" value="entry_key" checked="checked" />entry_key</label>
          <label><input name="fields" type="checkbox" value="entry_detail" checked="checked" />entry_detail</label>
        </div>
      </div>
      <div class="body" id="main"></div>
    </div>
    </fieldset>
    <div class="footer">
      <textarea id="clipBoard"></textarea>
    </div>
    <a id="anchorTop" href="#top">回到顶部</a>
    <div id="notification"></div>
  </body>
</html>
`;