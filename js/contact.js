
function changeColor() {
    var textbox = document.getElementsByClassName('name').item(0);

    if (textbox.value.length >= 4) {
        textbox.style.animation = 'brighten 0.75s forwards';
        document.getElementsByClassName('form').item(0).style = 'grid-row-end: 6';
        document.getElementById('bottom').style.display = 'block';
        
    } else {
        textbox.style.animation = 'none'
        textbox.style.color = '#828282';        
    }
};

function sendMessage() {
    var button = document.getElementsByClassName('btn').item(0);
    button.style = 'background-color: #C95360';
    button.style.color = '#ffffff';
}






