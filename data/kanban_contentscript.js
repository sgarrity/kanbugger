var project_id = window.location.pathname.match(/^.+?projects\/(\d+)\//)[1];
var kb_workspace = 'mozilla';
var columns;

// get column data
function get_columns() {
    var req_url = 'https://' + kb_workspace +
                 '.kanbanery.com/api/v1/projects/' +
                 project_id + '/columns.json';
    var req_data = {
        url: req_url
    };
    console.log('Getting columns: ' + req_url);
    self.port.emit('get_columns', req_data);
}
self.port.on('columns', function(json) {
    columns = json;
    add_buttons();
});

// add column buttons to page
function add_buttons() {

    $('a.bz').remove();

    $(columns).each(function() {
        var column = this;
        var $link = $('<a class="bz" data-cid="'+column.id+'" href="#">Show column in Bugzilla</a>');
        var $col_head = $('span.column-name:contains('+column.name+')').parents('div.column-view-header');
        $link.insertAfter($col_head);

        $link.click(function(e) {
            var anchor = this;

            e.preventDefault();

            // on click, get bugs for cards in this column
            var req_url = 'https://' + kb_workspace +
                         '.kanbanery.com/api/v1/columns/' +
                         $(anchor).attr('data-cid') + '/tasks.json';
            var req_data = {
                url: req_url
            };

            console.log('Getting cards: ' + req_url);

            self.port.emit('get_cards', req_data);

            self.port.once('cards', function(json) {
                var cards = json;
                
                var bug_ids = "";

                $(cards).each(function() {
                    card = this;
                    var m = card.description.match(/show_bug.cgi\?id=(\d+)/);
                    if (m) { 
                        bug_ids = bug_ids + m[1] + '%2C';
                    }
                });

                if ($(cards).length > 0) {
                    // then open up a bugzilla window showing those cards
                    var url = 'https://bugzilla.mozilla.org/buglist.cgi?' + 
                              'bug_id=' + bug_ids + 
                              '&bug_id_type=anyexact&bug_status=ALL';
                    console.log('Opening ' + url);
                    window.open(url);
                }
            });

        });
    });
}

// add column buttons to page now ...
if ($('div.column-view-header').length > 0) {
    get_columns();
}
// ... or when ready
window.addEventListener("ready", function(event) {
    get_columns();
});

// trigger event from kanbanery app on initial load
var script = document.createElement( "script" );
script.innerHTML =  'function ready() {' +
                        'var kbgr_e = new CustomEvent("ready");' +
                        'window.dispatchEvent(kbgr_e);' +
                    '}' +
                    '$(document).on("initial-load-finished", function() {' +
                        'ready();' +
                    '});';
document.body.appendChild(script);

