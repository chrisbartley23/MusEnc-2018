function showScore(id, path) {
  /* Setup and send the request */
  var xhr = new XMLHttpRequest()
  xhr.open('GET', path)
  xhr.send(null)

  /* Deal with the response */
  xhr.onreadystatechange = function () {
    var DONE = 4
    var OK = 200
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        /* Pass the MEI data to Verovio */
        //var svg = vrvToolkit.renderData(xhr.responseText, {})
        vrvToolkit.loadData(xhr.responseText)
        var svg = vrvToolkit.renderPage(1,{})

        /* Place Verovio's output on the page */
        document.getElementById(id).innerHTML = svg
        document.querySelector('#d414233e38').style.fill = "Blue"
      } else {
        /* Tell us an error happened */
        console.log('Error: ' + xhr.status)
      }
    }
  }
}
