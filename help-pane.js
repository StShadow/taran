function fillHelpText() {
    setElementText('help-docs-title', LSTX('helpdocstitle'));
    setElementText('help-inspir-title', LSTX('helpinspirtitle'));
    setElementText('help-thanks-title', LSTX('helpthankstitle'));
    
    document.getElementById('help-docs-content').innerHTML = LSTX('helpdocscontent'); 
} // function fillHelpText()
