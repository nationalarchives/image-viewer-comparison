function addFullscreenButton() {
    return new Promise(resolve => {
        setTimeout(() => {
            let tifyScreen = document.getElementById("tify");
            let createFullscreenButton = () => {
                let buttons = document.querySelector(".tify-scan_buttons");
                let fullscreenBtn = document.createElement("Button");
                let fullscreenBtnImage = document.createElement('img');
                let span = document.createElement('span');

                buttons.appendChild(fullscreenBtn);
                fullscreenBtn.setAttribute("title", "Full screen");
                fullscreenBtn.setAttribute("class", "tify-scan_button");

                fullscreenBtnImage.setAttribute('src',"../tify/img/sharp_fullscreen_white_18dp.png");
                fullscreenBtn.appendChild(fullscreenBtnImage);

                span.setAttribute('class', 'tify-sr-only');
                fullscreenBtn.appendChild(span);

                fullscreenBtn.addEventListener("click", (e) => {
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

            createFullscreenButton();
        }, 100);
    });
}

async function asyncCall() {
    let result = await addFullscreenButton();
}

asyncCall();