//Author : vidya vepoori
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const outputElement = document.getElementById('output');

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

function takeCommand() {
  return new Promise((resolve, reject) => {
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    outputElement.innerHTML += '<br>Listening...';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      resolve(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition:', event.error);
      reject(event.error);
    };

    recognition.start();
  });
}

function messageProbability(userMessage, recognizedWords, singleResponse = false, requiredWords = []) {
  let messageCertainty = 0;
  let hasRequiredWords = true;

  // Counts how many words are present in each predefined message
  for (const word of userMessage) {
    if (recognizedWords.includes(word)) {
      messageCertainty += 1;
    }
  }

  // Calculates the percent of recognized words in a user message
  const percentage = messageCertainty / recognizedWords.length;

  // Checks that the required words are in the string
  for (const word of requiredWords) {
    if (!userMessage.includes(word)) {
      hasRequiredWords = false;
      break;
    }
  }

  // Must either have the required words, or be a single response
  if (hasRequiredWords || singleResponse) {
    return Math.floor(percentage * 100);
  } else {
    return 0;
  }
}

function checkAllMessages(message) {
  let highestProbList = {};

  // Simplifies response creation / adds it to the dict
  function response(botResponse, listOfWords, singleResponse = false, requiredWords = []) {
    highestProbList[botResponse] = messageProbability(
      message,
      listOfWords,
      singleResponse,
      requiredWords
    );
  }

  if (message.includes('fever')) {
    speak('What\'s your age');
    console.log('Bot: What\'s your age');
    const ip = prompt('You (age in numbers):');
    console.log('You:', ip);

    if (ip <= 5) {
      return 'Kindly take the prescribed medicine once in the morning after breakfast and once at night after dinner: Medicine is PARACETAMOL 120MG/5ML';
    } else if (ip > 5 && ip <= 9) {
      return 'Kindly take the prescribed medicine once in the morning after breakfast and once at night after dinner: Medicine is PARACETAMOL/ACETAMINOPHEN 250MG/5ML';
    } else if (ip > 9 && ip <= 15) {
      return 'Kindly take the prescribed medicine once in the morning after breakfast and once at night after dinner: Medicine is PARACETAMOL 500MG';
    } else if (ip >= 16) {
      return 'Kindly take the prescribed medicine once in the morning after breakfast and once at night after dinner: Medicine is PARACETAMOL 600MG';
    }
  }

  if (message.includes('cough')) {
    speak('What\'s your age');
    console.log('Bot: What\'s your age');
    const ip = prompt('You (age in numbers):');
    if (ip < 9) {
      return 'Data not present';
    }

    if (ip > 9 && ip < 12) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is AMBROXOL-15MG + GUAIPHENESIN-50MG + LEVOSALBUTAMOL-0.5MG';
    } else if (ip > 12) {
      const ag = prompt('Bot: 1. Dry cough\n      2. Flum cough: ');
      if (ag == 1) {
        return 'Kindly take the prescribed medicine from the chemist: Medicine is TERBUTALINE SULPHATE-1.25MG/5ML + BROMHEXINE HYDROCHLORIDE-2MG/5ML + GUAIPHENESIN-50MG/5ML + MENTHOL-0.5MG/5ML';
      }
      else if (ag == 2) {
        return 'Kindly take the prescribed medicine from the chemist: Medicine is AMBROXOL-30MG + GUAIPHENESIN-50MG + LEVOSALBUTAMOL-1MG';
      }
    }
  }

  if (message.includes('stomach') && message.includes('pain')) {
    speak('What\'s your age');
    console.log('Bot: What\'s your age');
    const ip = prompt('You (age in numbers):');
    speak(ip);
    if (ip <= 10) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is DICYCLOMINE-10MG + SIMETHICONE-40MG';
    }
    if (ip > 10) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is DICYCLOMINE-10MG + MEFENAMIC ACID-250MG';
    }
  }

  if (message.includes('headache')) {
    speak('What\'s your age');
    console.log('Bot: What\'s your age');
    const ip = prompt('You (enter age in numbers):');
    speak(ip);
    if (ip > 2 && ip <= 10) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is Aceclofenac(50.0 Mg) + Paracetamol / Acetaminophen(125.0 Mg)';
    }
    if (ip > 10) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is CAFFEINE-50MG + PARACETAMOL-300MG + PROPYPHENAZONE-150MG';
    }
  }

  if (message.includes('cold')) {
    speak('What\'s your age');
    console.log('Bot: What\'s your age');
    const ip = prompt('You (age in numbers):');
    if (ip > 3 && ip <= 16) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is CHLORPHENIRAMINE-1MG + PARACETAMOL-125MG + PHENYLEPHRINE-5MG + SODIUM CITRATE-60MG';
    }
    if (ip > 16) {
      return 'Kindly take the prescribed medicine from the chemist: Medicine is CHLORPHENIRAMINE-8MG + PHENYLEPHRINE-20MG';
    }
  }

  // Responses -------------------------------------------------------------------------------------------------------
  response('Hello! How may I help you?', ['hello', 'hi', 'hey', 'sup', 'heyo'], true);
  response('See you!', ['bye', 'goodbye'], true);
  response('I\'m doing fine, and you?', ['how', 'are', 'you', 'doing'], false, ['how']);
  response('You\'re welcome!', ['thank', 'thanks'], true);
  response('Thank you!', ['i', 'love', 'code', 'palace'], false, ['code', 'palace']);

  const bestMatch = Object.keys(highestProbList).reduce((a, b) => (highestProbList[a] > highestProbList[b] ? a : b));
  return highestProbList[bestMatch] < 1 ? ls : bestMatch;
}
outputElement.innerHTML += 'CLICK ON \'START\' TO BEGIN :) ';

let listeningDisplayed = false; // Variable to track if "Listening..." has been displayed

const speakButton = document.getElementById('speakButton');
speakButton.addEventListener('click', function () {
  (async function () {
    if (!listeningDisplayed) {
      outputElement.innerHTML += '<br>Bot:Hello welcome to e-HealthConnect. pleased to meet you here you may tell us your medical issue so we can prescribe suitable medicine. Please click Start to continue.';
      speak('Hello welcome to e-HealthConnect. pleased to meet you here you may tell us your medical issue so we can prescribe suitable medicine. Please click Start to continue.');
      listeningDisplayed = true;
    }

    while (true) {
      const query = await takeCommand();
      const splitMessage = query.split(/\s+|[,;?!.-]\s*/);
      outputElement.innerHTML += '<br>You:' + query;

      const res = checkAllMessages(splitMessage);
      outputElement.innerHTML += '<br>Bot:' + res;
      speak(res);

      if (!listeningDisplayed) {
        outputElement.innerHTML += '<br>Listening...';
        listeningDisplayed = true;
      }
    }
  })();
});


