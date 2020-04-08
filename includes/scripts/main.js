window.ga = window.ga || function() {
    (ga.q = ga.q || []).push(arguments)
};
ga.l = +new Date;
ga('create', 'UA-XXXXX-Y', 'auto')
ga('send', 'pageview')

window.addEventListener('load', function() {
    var reveals = document.getElementsByClassName('reveals')
    for (i = 0; i < reveals.length; i++) {
        reveals[i].addEventListener('click', function(e) {
            e.target.scrollTop = 0
            e.target.classList.toggle('open')
        })
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.min.js')
        })
    }
})