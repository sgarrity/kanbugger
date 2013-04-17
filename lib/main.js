// The main module of the sancus Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// In this case, creating a Widget that opens a new tab needs both the
// `widget` and the `tabs` modules.
// Import the page-mod API
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");


pageMod.PageMod({
  contentScriptWhen: 'ready',
  include: "https://bugzilla.mozilla.org*",
  contentScriptFile: [self.data.url("jquery-1.9.1.min.js"),
                      self.data.url("contentscript.js")],
  contentStyleFile: self.data.url("kanbugger.css"),
  contentStyle: "#kanbutton span{ padding-left: 35px; background: url(" + self.data.url("kanbanlogo.png") + ") no-repeat 0 -4px}"
});
