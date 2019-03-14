
window.addEventListener('load', function(event){
  window.parent.postMessage('LOAD|' + window.location.href, '*', window)
})

window.addEventListener('beforeunload', function(event){
  window.parent.postMessage('LEAVE|' + window.location.href, '*')
})