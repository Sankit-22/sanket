const firebaseConfig = {
  apiKey: "AIzaSyBiKMAtstlv7R9DD5bDJ_ju2KXy0Oz91uY",
  authDomain: "quiz-34ac3.firebaseapp.com",
  databaseURL: "https://quiz-34ac3-default-rtdb.firebaseio.com",
  projectId: "quiz-34ac3",
  storageBucket: "quiz-34ac3.appspot.com",
  messagingSenderId: "33579432678",
  appId: "1:33579432678:web:585465a1afc56d5bb35927",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const databse = firebase.database();

var userId = sessionStorage.getItem("userId");
console.log(userId);
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const waitTxt = document.querySelector(".result_box .wait_text");

start_btn.onclick = () => {
  info_box.classList.add("activeInfo");
};

exit_btn.onclick = () => {
  location.replace("./index.html");
};

continue_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); 
  quiz_box.classList.add("activeQuiz"); 
  showQuetions(0); 
  queCounter(1); 
  startTimer(15); 
  startTimerLine(0); 
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const quit_quiz = result_box.querySelector(".buttons .quit");
const leaderBoard = result_box.querySelector(".buttons .leaderboard");
const matchingData = document.querySelector(".matching-data");

quit_quiz.onclick = () => {
  location.replace("./start.html"); 
};

leaderBoard.onclick = async () => {
  const resultCard = document.querySelector(".result_box"); 
  const resultText = `I scored ${userScore} out of ${
    questions.length - 20
  } on the quiz! Can you beat my score?`;

  
  try {
    const canvas = await html2canvas(resultCard, { useCORS: true }); 
    const dataUrl = canvas.toDataURL("image/png"); 
    const blob = await (await fetch(dataUrl)).blob(); 

    if (navigator.share && navigator.canShare({ files: [new File([blob], "quiz-score.png", { type: "image/png" })] })) {
      navigator
        .share({
          title: "Quiz Result",
          text: `${resultText} Take the quiz yourself: ${window.location.href.replace('result.html', 'start.html')}`,
          files: [new File([blob], "quiz-score.png", { type: "image/png" })],
        })
        .then(() => console.log("Scorecard shared successfully!"))
        .catch((error) => console.error("Error sharing scorecard:", error));
    } else {
      const encodedImage = encodeURIComponent(dataUrl);
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedImage}&quote=${encodeURIComponent(
        `${resultText} Take the quiz yourself: ${window.location.href.replace('result.html', 'start.html')}`
      )}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${resultText} Take the quiz yourself: ${window.location.href.replace('result.html', 'start.html')}`
      )}&url=${encodedImage}`;
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedImage}&title=${encodeURIComponent(
        `Quiz Result: ${resultText} Take the quiz yourself: ${window.location.href.replace('result.html', 'start.html')}`
      )}`;

      const shareMessage = `
        <p>Share your results on:</p>
        <a href="${facebookUrl}" target="_blank">Facebook</a> |
        <a href="${twitterUrl}" target="_blank">Twitter</a> |
        <a href="${linkedinUrl}" target="_blank">LinkedIn</a>
        <br/>
        <img src="${dataUrl}" alt="Quiz Scorecard" style="max-width: 100%; height: auto;"/>
      `;
      document.querySelector(".social-share").innerHTML = shareMessage; 
    }
  } catch (error) {
    console.error("Error generating scorecard image:", error);
  }

  


  databse.ref("Users/").on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var user_name, final_score;
      var childData = childSnapshot.val();
      if (childSnapshot.hasChild("Basic_info/user_name")) {
        user_name = childData.Basic_info.user_name;
      }
      if (childSnapshot.hasChild("Score")) {
        final_score = childData.Score.final_score;
      }
      data.push({ Score: final_score, name: user_name });
    });
  });
  matchingData.innerHTML = "";
  setTimeout(() => {
    console.log(data);
    var sortedData = data.sort((d1, d2) =>
      d1.Score < d2.Score ? 1 : d1.Score > d2.Score ? -1 : 0
    );
    console.log(sortedData);
    var count = 1,
      score = 0;
    sortedData.forEach((d) => {
      console.log(d);
      console.log(score, d.Score, count);
      if (score > d.Score) {
        count++;
      }
      score = d.Score;
      const html = `
      <tr class="d">
        <td class="name">${count}</td>
        <td class="age">${d.name}</td>
        <td class="religion">${d.Score}</td>
      </tr>`;
      matchingData.insertAdjacentHTML("beforeend", html);
    });
  }, 1000);
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

next_btn.onclick = () => {
  if (que_count < questions.length - 21) {
    que_count++; 
    que_numb++; 
    showQuetions(que_count); 
    queCounter(que_numb); 
    clearInterval(counter); 
    clearInterval(counterLine); 
    startTimer(timeValue); 
    startTimerLine(widthValue); 
    timeText.textContent = "Time Left"; 
    next_btn.classList.remove("show"); 
  } else {
    clearInterval(counter); 
    clearInterval(counterLine); 
    showResult(); 
  }
};

function showQuetions(index) {
  const que_text = document.querySelector(".que_text");

  let que_tag =
    "<span>" +
    (index+1) +
    ". " +
    questions[index].question +
    "</span>";
  let option_tag =
    '<div class="option"><span>' +
    questions[index].options[0] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[1] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[2] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[3] +
    "</span></div>";
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");

  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';


function optionSelected(answer) {
  clearInterval(counter); // clear counter
  clearInterval(counterLine); // clear counterLine
  let userAns = answer.textContent; // getting user selected option
  let correcAns = questions[que_count].answer; // getting correct answer from array
  const allOptions = option_list.children.length; // getting all option items

  const feedbackMessage = document.createElement("p"); // Create a paragraph tag
  feedbackMessage.style.marginTop = "10px"; // Add some margin for spacing
  feedbackMessage.style.fontWeight = "bold"; // Make it bold for emphasis

  if (userAns == correcAns) {
    userScore += 1; // upgrading score value with 1
    answer.classList.add("correct"); // adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); // adding tick icon to correct selected option

    feedbackMessage.textContent = "You are close to your goal!";
    feedbackMessage.style.color = "green"; // Add green color to indicate success
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
  } else {
    answer.classList.add("incorrect"); // adding red color to incorrect selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); // adding cross icon to incorrect selected option

    feedbackMessage.textContent = "You are far away.";
    feedbackMessage.style.color = "red"; // Add red color to indicate failure
    console.log("Wrong Answer");

    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correcAns) {
        option_list.children[i].setAttribute("class", "option correct"); // adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); // adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }

   
    const courseLink = document.createElement("a");
    courseLink.href = `https://www.coursera.org/learn/doping${encodeURIComponent(
      questions[que_count].topic
    )}`; 
    courseLink.textContent = `Learn more about this topic with this free course!`;
    courseLink.target = "_blank"; // Open the link in a new tab
    courseLink.style.display = "block"; // Ensure the link appears as a block element
    courseLink.style.marginTop = "10px"; // Add some margin for spacing
    courseLink.style.textDecoration="none";
    courseLink.style.color = "black"; // Style the link color
    

    option_list.appendChild(courseLink); // Append the course link after all options
  }

  option_list.appendChild(feedbackMessage); // Append the feedback message after all options

  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); // once user selects an option, disable all options
  }
  next_btn.classList.add("show"); // show the next button if user selected any option
}




function showResult() {
  info_box.classList.remove("activeInfo"); //hide info box
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); 
  const scoreText = result_box.querySelector(".score_text");

  // write score to database
  console.log(userId);
  databse
    .ref("/Users/" + userId + "/Score")
    .set({
      final_score: userScore,
    })
    .then((res) => {
      console.log("Data added to database.");
      waitTxt.classList.add("hidden");
      leaderBoard.classList.remove("hidden");
      quit_quiz.classList.remove("hidden");
    })
    .catch((error) => console.log(error));

  if (userScore >= 8) {
   
    let scoreTag =
      "<span>Congrats!, You got <p>" +
      userScore +
      "</p> out of <p>" +
      (questions.length-20) +
      "</p></span>";
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
    let second=document.getElementById("second");
    let third=document.getElementById("third");
    third.remove();
    second.remove();

  } else if (userScore > 3 && userScore<8) {
    // if user scored more than 1
    let scoreTag =
      "<span>Nice, You got <p>" +
      userScore +
      "</p> out of <p>" +
      (questions.length-20) +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
    let first=document.getElementById("first");
    let third=document.getElementById("third");
    third.remove();
    first.remove();
  } else {
    let scoreTag =
      "<span>Sorry, You got only <p>" +
      userScore +
      "</p> out of <p>" +
      (questions.length-20) +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
    let second=document.getElementById("second");
    let first=document.getElementById("first");
    first.remove();
    second.remove();
  }
}


function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "Time Off"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = questions[que_count].answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function queCounter(index) {
  let totalQueCounTag =
    "<span><p>" +
    index +
    "</p> of <p>" +
    (questions.length-20) +
    "</p> Questions</span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");

const btnOpenModal = document.querySelector(".show-modal");

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
