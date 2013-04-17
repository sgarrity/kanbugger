var kbAPIKeyName = 'kbAPIKey';

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

if ( getSelectedText('product') == "www.mozilla.org" ) {
    var apiKey = localStorage.getItem(kbAPIKeyName);
    var $button = $('<a id="kanbutton" href="#"><span></span></a>');
    $('#commit').after($button);
    if ( ! apiKey ) {
        apiKey = prompt('Kanbanery API Key Please');
        localStorage.setItem(kbAPIKeyName, apiKey);
    }
    if (apiKey) {
        // DO THE THINGS o/
    }
}
