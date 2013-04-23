var self = require("sdk/self");
var system = require("sdk/system");
var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;

page = pageMod.PageMod({
    contentScriptWhen: 'ready',
    // Include landfill.bugzilla.org (test) and bugzilla.mozilla.org (prod)
    include: /^http.+?zilla\.org.+?show_bug.+/,
    onAttach: function(worker){
        worker.port.on('kbPost', function(data) {
            data.onComplete = function(resp){
                //TODO: post card number to whiteboard
                console.log('Kanban card created.' + resp.text);
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
    contentStyleFile: self.data.url("kanbugger.css"),
    // Can't put this in the file because we need self.data.url
    contentStyle: "#kanbutton span{ padding-left: 35px; background: url(" +
                  self.data.url("kanbanlogo.png") + ") no-repeat 0 -4px}",
    // pass on any mapping provided at command line via --static-args
    contentScriptOptions: {
        mapping: system.staticArgs.mapping
    }
});
