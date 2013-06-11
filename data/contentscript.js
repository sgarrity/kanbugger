var kbAPIKeyName = 'kbAPIKey';
var kbWorkspace = 'mozilla';
var addon_self = self;

var config = self.options.config;
if (self.options.config_local) {
  // this will clobber (not concat) default mapping
  $.extend(config, self.options.config_local);
}

function getProduct() {
    var product = $('#product option:selected').val();
    // maybe not logged in
    if ( ! product ) {
        product = $('#field_container_product').text();
    }
    return product;
}

function getComponent() {
    var component = $('#component option:selected').val();
    // maybe not logged in
    if ( ! component ) {
        component = $('#field_container_component').text();
    }
    return component;
}

function getCardId() {
    var cardId;
    var whiteboard = $('#status_whiteboard').val();
    // maybe not logged in
    if ( ! whiteboard ) {
        whiteboard = $('label[for="status_whiteboard"]').parent().next().text();
    }
    var m = whiteboard.match(/\[kb=(\d+)\]/);
    if (m) { cardId = m[1] }
    return cardId;
}

function getApiKey() {
    var apiKey = localStorage.getItem(kbAPIKeyName);
    if ( ! apiKey ) {
        apiKey = prompt('Please enter your Kanbanery API Key (https://kanbanery.com/user/api)');
        localStorage.setItem(kbAPIKeyName, apiKey);
    }
    return apiKey;
}

function isLoggedIn() {
    if ($('#login_link_top').length) {
        console.log("Not logged in.")
        $('#bugzilla-body').prepend('<table cellpadding="20">' +
            '<tbody><tr><td id="error_msg" class="throw_error">' +
                'You must login to use Kanbugger' +
            '</td></tr></tbody></table>');
        return false;
    }
    else {
        return true;
    }
}

function makeKanCard(e, kbProjectId) {
    e.preventDefault();
    var apiKey = getApiKey();
    if (apiKey && isLoggedIn()) {
        var reqURL = 'https://' + kbWorkspace +
                     '.kanbanery.com/api/v1/projects/' +
                     kbProjectId + '/icebox/tasks.json';
        var cardData = {
            'task[task_type_name]': 'Story',
            'task[title]': $('#short_desc_nonedit_display').text(),
            'task[description]': document.location.href
        };
        var reqData = {
            url: reqURL,
            headers: {'X-Kanbanery-ApiToken': apiKey},
            content: cardData
        };
        addon_self.port.emit('kbPost', reqData);
    }
}

function getKanCard(e, cardId) {
    e.preventDefault();
    var apiKey = getApiKey();
    if (apiKey) {
        var reqURL = 'https://' + kbWorkspace +
                     '.kanbanery.com/api/v1/tasks/' +
                     cardId + '.json';
        var reqData = {
            url: reqURL,
            headers: {'X-Kanbanery-ApiToken': apiKey}
        };
        addon_self.port.emit('kbGet', reqData);
    }
}

// Register a listener that will update bugzilla with a new card id
addon_self.port.on('updateBug', function(id) {
    var $wb = $('#status_whiteboard');
    $wb.val('[kb=' + id + '] ' + $wb.val());
    $('#commit').click();
});

for (let i of config.mapping) {
    if ( getProduct() === i.bzProduct ) {
        if (getComponent() === i.bzComponent || i.bzComponent === "") {
            var cardId = getCardId();
            var projectId = i.kanProjectId;
            var $button = $('<a id="kanbutton" href="#"><span></span></a>');
            $button.insertAfter('#summary_alias_container');
            if (cardId) {
              console.log("Kanban card found -- ID: " + cardId);
              $button.on('click', function (e) { getKanCard(e, cardId); })
            }
            else {
              console.log("No Kanban card found.");
              $button.on('click', function (e) { makeKanCard(e, projectId); })
            }
        }
    }
}
