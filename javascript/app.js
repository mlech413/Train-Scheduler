var config = {
    apiKey: "AIzaSyDNzka2dcW9d-f1EZ2uasE882ZSYyHsFpA",
    authDomain: "schedule-50d23.firebaseapp.com",
    databaseURL: "https://schedule-50d23.firebaseio.com",
    projectId: "schedule-50d23",
    storageBucket: "",
    messagingSenderId: "987415977033"
  };
  firebase.initializeApp(config);
  
var database = firebase.database();
  
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency-input").val().trim();

    // variables for text input validations
    var firstTrainTimeEval = moment.unix(firstTrainTime).format("HH:mm");
    var firstTrainTimeEvalStr = String(firstTrainTimeEval);
    var hours = firstTrainTimeEvalStr.charAt(0) + firstTrainTimeEvalStr.charAt(1);
    var mins = firstTrainTimeEvalStr.charAt(3) + firstTrainTimeEvalStr.charAt(4);

    // validations for input box entries
    if (!trainName) {
    alert("Please enter a valid 'Train Name'");
    }
    else if (!destination) {
        alert("Please enter a valid 'Destination'");
    }
    else if (!firstTrainTimeEvalStr) {
        alert("Please enter a valid 'First Train Time'");
    }
    else if (hours < 01 || hours > 23 ) {
        alert("Please enter 'First Train Time' in military time format (HH:mm)");
    }
    else if (firstTrainTimeEvalStr.charAt(2) != ":") {
        alert("Please enter 'First Train Time' in military time format (HH:mm)");
    }
    else if (mins < 00 || mins > 59 ) {
        alert("Please enter 'First Train Time' in military time format (HH:mm)");
    }
    else if (!frequency) {
        alert("Please enter a valid 'Frequency'");
    }
    else if (frequency < 0 || frequency > 999) {
        alert("Please enter a valid 'Frequency'");
    }
    else {
    // push to firebase
    var newEmp = {
        name: trainName,
        dest: destination,
        firstTrain: firstTrainTime,
        freq: frequency
        };
    
        database.ref().push(newEmp);
    
        console.log(trainName.name);
        console.log(destination.dest);
        console.log(firstTrainTime.firstTrain);
        console.log(frequency.freq);
    
        alert("New train added!");
    
        // clear out the input boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");
    }
});
  
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var firstTrainTime = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().freq;
  
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);
  
    var firstTrainTimeConverted1 = moment.unix(firstTrainTime).format("HH:mm");
    console.log("firstTrainTimeConverted1=" + firstTrainTimeConverted1);

    console.log("TIME NOW=" + moment().format("HH:mm"));

    // subtract a year so same day calculations work even regardless of earlier or later
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Difference between the times
    var diffTime = -(moment().diff(moment.unix(firstTimeConverted), "minutes"));
    console.log("diffTime=" + diffTime);

    // get remainder of frequency
    var remainder = diffTime % frequency;
    console.log("remainder=" + remainder);

    // remiander determines time until next train, and negative remainder here still valid but needs to be flipped so becomes positive
    if (remainder < 0) {
    var minutesUntilNext = remainder + frequency;
    console.log("minutesUntilNext=" + minutesUntilNext);
    }
    else {
      var minutesUntilNext = remainder - frequency;
      console.log("minutesUntilNext=" + minutesUntilNext);
    }

    // if negative, it's earlier than current time, so add a full day of minutes to make it in the future
    if (diffTime<0){
      diffTime = diffTime += 1440;
    }

    // the remainder +1 becomes becomes the time reamining untuil the next train
    var minutesAway = (remainder+=1);

    // minutes until next train is determined already, so use it by adding to the next arrival, to get the next arrival time 
    var nextArrival = "00:00";
    nextArrival = moment().format("HH:mm");
    nextArrival = moment(nextArrival, "HH:mm").add(minutesAway, "minutes");
 
    nextArrival = moment(nextArrival, "HH:mm").format("HH:mm");
    console.log("nextArrival=" + nextArrival);
    
    console.log("write to table");

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + firstTrainTimeConverted1 + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});

  