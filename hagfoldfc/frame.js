window.addEventListener('beforeunload', function(event){
  window.parent.postMessage(window.location.href, '*')
})