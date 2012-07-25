<div class="fd-header">
	<div class="fd-path" id="fd-path">
		<a data="" href="javascript:void(0)" class="home fd-folder-link">Home</a>
		<%
			var path = info.current_path.replace("\\", "/").replace(/\/+/g, "/").replace(/^$\s+|\s+$|\/+$/g, '');
			if (path !== "") {
				var parts = path.split("/");
				var cpath = "";
				_.each(parts, function(part) {
					cpath = cpath === "" ? part : cpath + "/" + part;
		%>
		<span>&gt;</span>
		<a data="<%= cpath %>" href="javascript:void(0)" class="normal fd-folder-link"><%= part %></a>
				<% }) %>
			<% } %>
	</div>
</div>
<div class="fd-browser-view">
	<ul class="fd-icon-list clearfix" id="fd-icon-list">
	</ul>
</div>
<div class="fd-tool-bar aui_buttons">
	<input type="checkbox" id="fd-list-check-all" class="fd-list-check-all" />
	<button id="fd-btn-delete" class="aui_state_highlight">delete</button>
	<button id="fd-btn-new-folder" class="aui_state_highlight">new folder</button>
	<button id="fd-btn-move" class="aui_state_highlight">move</button>
	<button id="fd-btn-rename" class="aui_state_highlight">rename</button>
	<% if (has_select_btn) { %>
	<button id="fd-btn-select" class="aui_state_highlight">select</button>
	<% } %>
</div>

