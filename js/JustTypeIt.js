function justTypeIt(elementsArray){
    if(elementsArray.length>0){
        var zerothElement = elementsArray[0];
        typeWriter($(zerothElement.elementId).data('text'), zerothElement.elementId, zerothElement.typingSpeed, 0, function(){
            var newArray = $.grep( elementsArray, function(value, index) {
                                return index > 0;
                            });
            setTimeout(function() {
                justTypeIt(newArray);
            }, zerothElement.delayAfter);
            
        });
    }      
};

function typingElement(id, speed, delay){
    return {elementId: id, delayAfter: delay, typingSpeed: speed};
};

function typeWriter(text, id, speed, n, callback) {
    if (n < (text.length)) {
        $(id).html(text.substring(0, n+1));
            n++;
            setTimeout(function() {
                typeWriter(text, id, speed, n, callback);
            }, speed);
    }
    else{
        callback();
    }
};

/*
Concept and base code taken from http://codepen.io/voronianski/pen/aicwk

Original code :

 * http://pixelhunter.me/
 * 
 * text {String} - printing text
 * n {Number} - from what letter to start
 
function typeWriter(text, n) {
  if (n < (text.length)) {
    $('.test').html(text.substring(0, n+1));
    n++;
    setTimeout(function() {
      typeWriter(text, n)
    }, 100);
  }
}

$('.start').click(function(e) {
  e.stopPropagation();
  
  var text = $('.test').data('text');
  
  typeWriter(text, 0);
});

*/
