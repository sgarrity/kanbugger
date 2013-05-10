var self = require("sdk/self");
var system = require("sdk/system");
var pageMod = require("sdk/page-mod");
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
    include: /^http.+?zilla\.org.+?show_bug.+/,
    onAttach: function(worker){
        worker.port.on('kbPost', function(data) {
            data.onComplete = function(resp){
                //TODO: post card number (resp.json.id?) to whiteboard
                console.log('Kanban card created: ' + resp.text);
            };
            Request(data).post();
        });
        worker.port.on('kbGet', function(data) {
            data.onComplete = function(resp){
                //TODO: wrap resp.json in a div and show it
                console.log('Kanban card retrieved: ' + resp.text);
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
