var self = require("sdk/self");
var system = require("sdk/system");
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;

var config = JSON.parse(self.data.load("config.json"));

// get a local config if it exists
var config_local;
try {
  if (self.data.url("config_local.json")) {
    config_local = JSON.parse(self.data.load("config_local.json"));
  }
}
catch (e) {
  console.error("Error with local config file: " + e.message);
}

page = pageMod.PageMod({
    contentScriptWhen: 'ready',
    // Include landfill.bugzilla.org (test) and bugzilla.mozilla.org (prod)
    include: /^http.+?zilla\.org.+?(show|process|post)_bug.+/,
    onAttach: function(worker){
        worker.port.on('kbPost', function(data) {
            data.onComplete = function(resp){
                console.log('Kanban card created: ' + resp.text);
                // add the whiteboard tag and save the bug
                worker.port.emit('updateBug', resp.json);
                // open a tab showing this card
                tabs.open(resp.json.global_in_context_url);
            };
            Request(data).post();
        });
        worker.port.on('kbGet', function(data) {
            data.onComplete = function(resp){
                console.log('Kanban card retrieved: ' + resp.text);
                // open a tab showing this card
                tabs.open(resp.json.global_in_context_url);
            };
            Request(data).get();
        });
    },
    contentScriptFile: [
        self.data.url("jquery-1.9.1.min.js"),
        self.data.url("contentscript.js")
    ],
    contentScriptOptions: {
        "config" : config,
        "config_local" : config_local
    },
    contentStyleFile: self.data.url("kanbugger.css"),
    // Can't put this in the file because we need self.data.url
    contentStyle: "#kanbutton span{ padding-left: 35px; background: url(" +
                  self.data.url("kanbanlogo.png") + ") no-repeat 0 -4px}"
});
