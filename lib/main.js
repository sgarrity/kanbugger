var self = require("sdk/self");
var pageMod = require("sdk/page-mod");


pageMod.PageMod({
  contentScriptWhen: 'ready',
  include: "https://bugzilla.mozilla.org*",
  contentScriptFile: [self.data.url("jquery-1.9.1.min.js"),
                      self.data.url("contentscript.js")],
  contentStyleFile: self.data.url("kanbugger.css"),
  // Can't put this in the file because we need self.data.url
  contentStyle: "#kanbutton span{ padding-left: 35px; background: url(" + self.data.url("kanbanlogo.png") + ") no-repeat 0 -4px}"
});
