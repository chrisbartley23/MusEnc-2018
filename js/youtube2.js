// Some of this code is adapted from YouTube IFram Player API examples.

function calcSeconds(time) {
  var secs = 0
  var parts = time.split(':')
  secs += parseInt(parts[0]) * 3600
  secs += parseInt(parts[1]) * 60
  secs += parseFloat(parts[2])
  return secs
}

var curClip = false

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script')

tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  // Get performance data from MEI file
  /* Setup and send the request */
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'data/GoTMainThemev6NoPercMEI.mei') // <-- change this to the right file
  xhr.send(null)

  /* Deal with the response */
  xhr.onreadystatechange = function () {
    var DONE = 4
    var OK = 200
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        // Get performance data
        var parser = new DOMParser()
        var meiDoc = parser.parseFromString(xhr.responseText,"text/xml")

        var recordings = meiDoc.querySelectorAll('performance > recording')
        var recording = recordings[0]
        var recording2 = recordings[1]
        var avFile = recording.querySelector('avFile[targettype="youtube"]').getAttribute('target')
        var avFile2 = recording2.querySelector('avFile[targettype="youtube"]').getAttribute('target')
        var ytId = avFile.split('?v=')[1]
        var ytId2 = avFile2.split('?v=')[1]
        var clipEls = recording.querySelectorAll('clip')
        var clipEls2 = recording2.querySelectorAll('clip')
        var clips = []
        for (i = 0; i < clipEls.length; i++) {
          clips.push({
            begin: calcSeconds(clipEls[i].getAttribute('begin')),
            end: calcSeconds(clipEls[i].getAttribute('end')),
            startid: clipEls[i].getAttribute('startid'),
            ytId: avFile
          })
        }
        for (i = 0; i < clipEls2.length; i++) {
          clips.push({
            begin: calcSeconds(clipEls[i].getAttribute('begin')),
            end: calcSeconds(clipEls[i].getAttribute('end')),
            startid: clipEls[i].getAttribute('startid'),
            ytId: avFile2
          })
        }

        /* Set up YouTube player */
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: ytId,
          events: {
            'onReady': function(e) {onPlayerReady(e, clips)},
            'onStateChange': function(e) {onPlayerStateChange(e, clips)}
          }
        });

        player2 = new YT.Player('player2', {
          height: '390',
          width: '640',
          videoId: ytId2,
          events: {
            'onReady': function(e) {onPlayerReady(e, clips)},
            'onStateChange': function(e) {onPlayerStateChange(e, clips)}
          }
        });
      } else {
        /* Tell us an error happened */
        console.log('Error: ' + xhr.status)
      }

    }
  }
}

// The API will call this function when the video player is ready.
function onPlayerReady(event, clips) {
  for (i = 0; i < clips.length; i++) {
    var clickHandler = function(event, clip) {
      var hl = document.querySelectorAll('.highlighted')
      for (var i = 0; i < hl.length; i++) {
        hl[i].classList.remove('highlighted')
      }
      curClip = clip
      console.log(clip.ytId, event.target.getVideoUrl())
      if (clip.ytId === event.target.getVideoUrl()) {
        document.querySelector(clip.startid).classList.add('highlighted')
        event.target.seekTo(clip.begin)
        event.target.playVideo();
      }
    }
    document.querySelector(clips[i].startid).addEventListener('click', clickHandler.bind(this, event, clips[i]))
  }
}

//    The API calls this function when the player's state changes.
function onPlayerStateChange(event, clips) {
  if (event.data == YT.PlayerState.ENDED ||
      event.data == YT.PlayerState.PAUSED) {
        stopVideo()
    // var secs = (curClip.end - curClip.begin) * 1000
    // setTimeout(function () {
    //   if (curClip) {
    //     stopVideo()
    //     document.querySelector(curClip.startid).style.fill = 'black'
    //     curClip = false
    //   }
    // }, secs); // This is the end seconds (difference)
  }
}
function stopVideo() {
  var hl = document.querySelectorAll('.highlighted')
  for (var i = 0; i < hl.length; i++) {
    hl[i].classList.remove('highlighted')
  }
  player.stopVideo();
}
