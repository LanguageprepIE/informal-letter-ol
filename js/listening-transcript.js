/* Optional post-listening review. Native details stays closed by default. */
(function initListeningTranscript(doc) {
  var panel=doc.getElementById("listening-transcript");
  if(!panel)return;
  var button=doc.getElementById("transcript-highlight");
  var body=doc.getElementById("transcript-text");
  function highlight(on){
    body.classList.toggle("show-evidence",on);
    button.setAttribute("aria-pressed",String(on));
    button.textContent=on?"Hide answer evidence / Ocultar las respuestas":"Highlight answer evidence / Resaltar las respuestas";
  }
  button.addEventListener("click",function(){highlight(button.getAttribute("aria-pressed")!=="true");});
  panel.addEventListener("toggle",function(){if(!panel.open)highlight(false);});
  function reset(){panel.open=false;highlight(false);}
  ["guided","independent","reset"].forEach(function(id){var control=doc.getElementById(id);if(control)control.addEventListener("click",reset);});
  highlight(false);
})(document);
