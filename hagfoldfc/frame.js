window.addEventListener('beforeunload', function(event){
  window.parent.postMessage('UNLOAD'+window.location.href, '*')
})
window.addEventListener('load', function(event){
  window.parent.postMessage('LOAD'+window.location.href, '*')
})