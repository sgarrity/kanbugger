var Request = require("sdk/request").Request;

var kbAPIKeyName = 'kbAPIKey';
var kbWorkspace = 'mozilla';
var kbProjectId = '33256';

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

if ( getSelectedText('product') == "www.mozilla.org" ) {
    var $button = $('<a id="kanbutton" href="#"><span></span></a>');
    $('#commit').after($button);

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
                task_type_id: 'Story',
                title: document.getElementById('short_desc_nonedit_display').text,
                description: document.location.href
            }
            Request({
                url: reqURL,
                headers: {'X-Kanbanery-ApiToken': apiKey},
                content: cardData,
                onComplete: function(){
                    alert('I HAVE CREATED CARD!');
                }
            }).post();
        }
    })
}
