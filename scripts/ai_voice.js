document.getElementById("click_record").addEventListener('click', function () {
    handleButtonClick();
});

function handleButtonClick() {
    console.log("voice start");
    var speech = true;

    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ko";
    recognition.continuous = false;
    recognition.interimResults = false;

    const wordToNumber = {
        '일': 1,
        '이': 2,
        '삼': 3,
        '사': 4,
        '오': 5,
        '육': 6,
        '칠': 7,
        '팔': 8,
        '구': 9,
        '십': 10,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
    };

    let transcript = '';
    let words = [];
    var category_count = [];
    var row_collumn = [];

    recognition.addEventListener('result', e => {
        const result = e.results[0];
        transcript = result[0].transcript;
        transcript = transcript.replace(/\.$/, '');
        transcript = transcript.replace(/,/g, '');

        console.log("transcript", transcript);

        words = transcript
            .toLowerCase()
            .split(/\s+|\b(?=\W)/)
            .filter(word => wordToNumber.hasOwnProperty(word));

        // console.log("words", words);

        
        if(category_count.length == 0){
            if(transcript.includes("위험")){
                category_count.push("위험");
            }
            else if(transcript.includes("색깔")){
                category_count.push("색깔");
            }
            document.getElementById("convert_text").innerHTML = category_count[0];
        }
        
        if(words.length > 0 && category_count.length > 0 && category_count.length < 3){
            category_count.push(words[0]);
            document.getElementById("convert_text").innerHTML = words[0];
            console.log(category_count.length);
        }

        if(category_count.length == 3){
            const row = wordToNumber[category_count[1]];
            const col = wordToNumber[category_count[2]];
            if(category_count[0] == "위험"){
                document.getElementById("hazardRowInput").value = row;
                document.getElementById("hazardColumnInput").value = col;
                buttonId = 'hazardPoint';
                handleSubmit(buttonId);
            }else{
                document.getElementById("colorBlobRowInput").value = row;
                document.getElementById("colorBlobColumnInput").value = col;
                buttonId = 'colorBlobPoint';
                handleSubmit(buttonId);
            }
            category_count.splice(0);

        }

        // reinput
        if(transcript.includes("다시")){
            category_count.splice(0);
            document.getElementById("convert_text").innerHTML = "다시";
        }


        // Check for '오케이' and stop recognition
        if (transcript.includes('오케이')) {
            speech = false;
            recognition.stop();
        }
        // console.log("speech", speech);
    });



    recognition.addEventListener('end', () => {
        if (speech) {
            recognition.start();
        }
    });

    if (speech) {
        recognition.start();
    }
}
