setTimeout(() => {
    let tifyScreen = document.querySelector('#tify');

    let addFullscreenButton = () => {
        let buttons = document.querySelector('.tify-scan_buttons');
        let fullscreenButton = document.createElement('Button');

        buttons.appendChild(fullscreenButton);
        fullscreenButton.setAttribute('title', 'Full screen');
        fullscreenButton.setAttribute('class', 'tify-scan_button');

        fullscreenButton.addEventListener('click', (e) => {
            if (tifyScreen.requestFullscreen) {
                tifyScreen.requestFullscreen();
            } else if (tifyScreen.mozRequestFullScreen) { // Firefox
                tifyScreen.mozRequestFullScreen();
            } else if (tifyScreen.webkitRequestFullscreen) { // Chrome, Safari and Opera
                tifyScreen.webkitRequestFullscreen();
            } else if (tifyScreen.msRequestFullscreen) { // IE/Edge
                tifyScreen.msRequestFullscreen();
            }
        });
    };

    if(tifyScreen !== null){
        addFullscreenButton();
    }
}, 100);