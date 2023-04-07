document.addEventListener('DOMContentLoaded', speechToEmotion, false)


function myFunction() {
  console.log("CLICK");
  // speechToEmotion();
  recognition.start();
}

var testbutton = document.getElementById("testbutton");
testbutton.addEventListener("click", myFunction)


function speechToEmotion() {
  console.log("[debug] speechToEmotion new")
  const recognition = new webkitSpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = true

  recognition.onresult = function(event) {
    const results = event.results
    const transcript = results[results.length-1][0].transcript

    console.log("[debug ] transcript: ", transcript);
    setEmoji('searching')

    fetch(`/emotion?text=${transcript}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("This is respones: ", result);
        console.log(result.score);

        var saveOrNot = document.getElementById("saveOrNot");

        if (result.score > 0) {
          setEmoji('positive');
          saveOrNot.innerHTML = "SO INTERESTING!" + result.score;
        } else if (result.score < 0) {
          setEmoji('negative');
          saveOrNot.innerHTML = "Brutal, SAFE!";
        } else {
          setEmoji('neutral')
          saveOrNot.innerHTML = "throw away..." + result.score;
        }
      })
      .catch((e) => {
        console.error('Request error -> ', e)
        recognition.abort()
      })
  }

  recognition.onerror = function(event) {
    console.error('Recognition error -> ', event.error)
    setEmoji('error')
  }

  recognition.onaudiostart = function() {
    setEmoji('listening');
    console.log("[debug] onaudiostart Listening")
  }

  recognition.onend = function() {
    setEmoji('idle');
    console.log("[debug] onEnd idle")
    recognition.start();
  }

  recognition.start();

  function setEmoji(type) {
    const emojiElem = document.querySelector('.emoji img')
    emojiElem.classList = type
  }
}