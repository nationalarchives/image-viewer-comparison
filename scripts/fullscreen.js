let addFullscreenButton = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            let createFullscreenButton = () => {
                let buttons = document.querySelector(".tify-scan_buttons");
                let fullscreenBtn = document.createElement("Button");
                let fullscreenBtnImage = document.createElement('img');
                let span = document.createElement('span');

                buttons.appendChild(fullscreenBtn);
                fullscreenBtn.setAttribute("class", "tify-scan_button");
                fullscreenBtn.setAttribute("title", "Full screen");
                fullscreenBtnImage.setAttribute('src',"../tify/img/baseline_fullscreen_white_small.png");
                fullscreenBtn.appendChild(fullscreenBtnImage);
                span.setAttribute('class', 'tify-sr-only');
                fullscreenBtn.appendChild(span);

                fullscreenBtn.addEventListener("click", (e) => {
                    setTimeout(() => {
                        toggleFullscreen(document.fullscreenElement, fullscreenBtn);
                    }, 100);
                });
            };
            createFullscreenButton();
        }, 100);
    });
};

async function asyncCall() {
    await addFullscreenButton();
}

asyncCall();

let toggleFullscreen = (isFullScreen, fullscreenBtn) => {
    let tifyScreen = document.getElementById("tify");
    if(isFullScreen !== null){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
    else {
        fullscreenBtn.setAttribute("title", "Exit full screen");
        fullscreenBtn.firstChild.setAttribute('src',"../tify/img/baseline_fullscreen_exit_white_small.png");
        if (tifyScreen.requestFullscreen) {
            tifyScreen.requestFullscreen();
        } else if (tifyScreen.mozRequestFullScreen) { // Firefox
            tifyScreen.mozRequestFullScreen();
        } else if (tifyScreen.webkitRequestFullscreen) { // Chrome, Safari and Opera
            tifyScreen.webkitRequestFullscreen();
        } else if (tifyScreen.msRequestFullscreen) { // IE/Edge
            tifyScreen.msRequestFullscreen();
        }
    }
};