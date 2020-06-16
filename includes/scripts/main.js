window.addEventListener('load', function() {
    var reveals = document.getElementsByClassName('reveals')
    for (i = 0; i < reveals.length; i++) {
        reveals[i].addEventListener('click', function(e) {
            e.target.scrollTop = 0
            e.target.classList.toggle('open')
        })
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
    }

    if (window.localStorage.getItem('cookie-consent')) {
        window.ga = window.ga || function() {
            (ga.q = ga.q || []).push(arguments)
        };
        ga.l = +new Date;
        ga('create', 'UA-XXXXX-Y', 'auto')
        ga('send', 'pageview')
    } else {
        window['ga-disable-UA-XXXXX-Y'] = true;
        let cookie_div = document.getElementById('cookieWarning')
        cookie_div.addEventListener('click', acceptCookies)
        cookie_div.style.display = 'block'
    }
})

function acceptCookies() {
    window.localStorage.setItem('cookie-consent', 1)
}