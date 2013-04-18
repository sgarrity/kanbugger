
var kbAPIKeyName = 'kbAPIKey';
var kbWorkspace = 'mozilla';
var addon_self = self;

var mapping = [{"bzProduct": "www.mozilla.org",
                "bzComponent": "",
                "kanProjectId": 33256}]

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

function kanButton(e, kbProjectId) {
    e.preventDefault();
    var apiKey = localStorage.getItem(kbAPIKeyName);
    if ( ! apiKey ) {
        apiKey = prompt('Kanbanery API Key Please');
        localStorage.setItem(kbAPIKeyName, apiKey);
    }
    if (apiKey) {
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
        addon_self.port.emit('callKB', reqData);
    }  
}
for (let i of mapping) {
    if ( getProduct() === i.bzProduct ) {
        if (i.bzComponent === "") {
            var $button = $('<a id="kanbutton" href="#"><span></span></a>');
            $button.insertAfter('#summary_alias_container');
            $button.on('click', function (e) { kanButton(e, i.kanProjectId); })
        }
    }
}
