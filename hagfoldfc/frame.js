window.addEventListener('beforeunload', function(event){
  window.parent.postMessage('user_navigation_intent', window.location.href)
})