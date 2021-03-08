var navbarIframe = window.frameElement;
resizeIFrame();

function resizeIFrame() {
	navbarIframe.height = navbarIframe.contentWindow.document.body.scrollHeight+4;
	navbarIframe.style.height = navbarIframe.height + "px";
}