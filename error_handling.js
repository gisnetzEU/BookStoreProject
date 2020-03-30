// Gracefully handle errors:
window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error(url + " " + lineNo + ":" + columnNo, msg, error);
    return false;
}

if (!('content' in document.createElement('template'))) {
    alert("Please, use a newer version of the browser with support for HTML5 templates");
}
