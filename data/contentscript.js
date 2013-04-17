
var kbAPIKeyName = 'kbAPIKey';
var kbWorkspace = 'mozilla';
var kbProjectId = '33256';
var addon_self = self;

function getProduct() {
    var bzProduct = $('#product option:selected').val();
    // maybe not logged in
    if ( ! bzProduct ) {
        bzProduct = $('#field_container_product').text();
    }
    return bzProduct;
}

if ( getProduct() === "www.mozilla.org" ) {
    var $button = $('<a id="kanbutton" href="#"><span></span></a>');
    $button.insertAfter('#summary_alias_container');

    $button.on('click', function(e){
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
    })
}
