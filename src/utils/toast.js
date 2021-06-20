/*
 * @Description: toast 提示框
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2021-06-10 15:30:19
 * @LastEditTime: 2021-06-20 20:32:11
 */
(function (win) {
    win.toast = function toast (arg) {
        let msg = '', delay = 1000, type = 'succ'

        if (typeof arg == 'string') {
            msg = arg
        } else {
            msg = arg.msg || ''
            delay = arg.delay || 1000
            type = arg.type || 'succ'
        }

        //遮罩层
        let popupBackdrop = document.createElement("div")
        popupBackdrop.setAttribute("class", "popup-backdrop")
        popupBackdrop.setAttribute("id", "popup-backdrop")
        popupBackdrop.style.background = "transparent"

        //弹窗层
        let promptPopup = document.createElement("div")
        promptPopup.setAttribute("id", "toastPopup")
        promptPopup.setAttribute("class", "own-popup")

        let appendDom = '<div id="popup-toast" class="toast-import">' + (type == "succ" ? '<svg t="1622882982996" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5988" width="28" height="28"><path d="M510.567403 63.852903c-246.304387 0-446.663336 200.358949-446.663336 446.663336 0 246.304387 200.358949 446.663336 446.663336 446.663336 246.304387 0 446.765664-200.358949 446.765664-446.663336C957.230738 264.211852 756.87179 63.852903 510.567403 63.852903L510.567403 63.852903zM787.979614 386.084941 454.593784 719.573099c-7.981613 7.981613-20.977316 7.981613-28.958929 0l-43.694214-43.694214c0 0 0 0 0 0L237.145998 531.084241c-7.981613-7.981613-7.981613-20.977316 0-28.958929l43.694214-43.694214c7.981613-7.981613 20.977316-7.981613 28.958929 0L440.063156 588.592785 715.326471 313.329469c7.981613-7.981613 20.977316-7.981613 29.061257 0L787.979614 357.126012C796.063556 365.107625 796.063556 378.103328 787.979614 386.084941L787.979614 386.084941z" p-id="5989" data-spm-anchor-id="a313x.7781069.0.i30" class="selected" fill="#ffffff"></path></svg>' : type == "err" ? '<svg t="1622883398958" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19692" width="28" height="28"><path d="M511.4 63.6c-247.4 0-448 200.6-448 448s200.6 448 448 448 448-200.6 448-448c-0.1-247.5-200.6-448-448-448z m196.2 583.8c16.7 16.7 16.7 43.7 0 60.4-16.7 16.7-43.7 16.6-60.4-0.1L511.4 571.9 375.5 707.8c-16.7 16.6-43.7 16.6-60.4 0-16.7-16.7-16.7-43.7 0-60.4L451 511.5 315.1 375.7c-16.7-16.7-16.7-43.7 0-60.4 16.7-16.6 43.7-16.6 60.4 0l135.9 135.9 135.9-135.9c16.6-16.6 43.7-16.6 60.4 0 16.7 16.7 16.7 43.7 0 60.4L571.8 511.6l135.8 135.8z" p-id="19693" data-spm-anchor-id="a313x.7781069.0.i60" class="selected" fill="#ffffff"></path></svg>' : '<svg t="1622883574779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28196" width="24" height="24"><path d="M512 0C229.254842 0 0.010628 229.244214 0.010628 511.989372c0 282.766414 229.244214 512.010628 511.989372 512.010628 282.766414 0 511.989372-229.244214 511.989372-512.010628C1024.010628 229.244214 794.78767 0 512 0zM580.146217 804.23589l-136.271178 0L443.875039 687.626362l136.271178 0L580.146217 804.23589zM580.146217 591.443695l-136.271178 0L443.875039 219.76411l136.271178 0L580.146217 591.443695z" p-id="28197" data-spm-anchor-id="a313x.7781069.0.i66" class="selected" fill="#ffffff"></path></svg>') +
            '<span>' + msg + '</span></div>'

        promptPopup.innerHTML = appendDom

        document.body.appendChild(popupBackdrop)
        document.body.appendChild(promptPopup)

        let timer = setTimeout(function () {
            document.querySelector(".toast-import").setAttribute("class", "toast-import fadeOut")
            let timer2 = setTimeout(function () {
                document.body.removeChild(document.getElementById("popup-backdrop"))
                document.body.removeChild(document.querySelector(".own-popup"))
                clearTimeout(timer2)
            }, 500)
            clearTimeout(timer)
        }, delay)

        //插入样式
        let _style = document.createElement("style")
        _style.innerHTML = '#popup-toast,.own-popup,.popup-backdrop{box-sizing:border-box;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.own-popup{border:0 red solid;position:fixed;z-index:99999;top:0;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center}#popup-toast{line-height:1;text-align:center;position:fixed;max-width:200px;z-index:9999;padding:14px;color:#fff;background:#000;border-radius:5px;left:50%;top:50%;font-size:14px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.toast-import{background:rgba(0,0,0,.8)!important;display:flex;align-items:center;animation-duration:.5s;animation-fill-mode:both;-webkit-animation-name:bgFadeIn;animation-name:bgFadeIn}.toast-import.fadeOut{-webkit-animation-name:bgFadeOut;animation-name:bgFadeOut}.toast-import>span{margin-left:8px}.popup-backdrop{position:fixed;z-index:99998;top:0;right:0;bottom:0;left:0;opacity:1;background:rgba(0,0,0,.4);-webkit-animation-duration:.5s;animation-duration:.5s}.popup-backdrop.fadeIn{-webkit-animation-name:bgFadeIn;animation-name:bgFadeIn}@-webkit-keyframes bgFadeIn{0%{opacity:0}100%{opacity:1}}@keyframes bgFadeIn{0%{opacity:0}100%{opacity:1}}@-webkit-keyframes bgFadeOut{0%{opacity:1}100%{opacity:0}}@keyframes bgFadeOut{0%{opacity:1}100%{opacity:0}}'
        document.querySelector("head").appendChild(_style)
    }
})(window)