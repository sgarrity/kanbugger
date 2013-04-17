function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

if ( getSelectedText('product') == "www.mozilla.org" ) {
    $('#commit').after('<a id="kanbutton" href="#"><span></span></a>');
}