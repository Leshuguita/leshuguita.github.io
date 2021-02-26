var navbarIframe = window.frameElement;

function resizeIFrame() {
	//navbarIframe.width  = navbarIframe.contentWindow.document.body.scrollWidth;
	navbarIframe.height = navbarIframe.contentWindow.document.body.scrollHeight+4;
}