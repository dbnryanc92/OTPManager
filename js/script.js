// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      });
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      window.location.reload();
    });
  });
}

// Helper functions
$ = function (sel) {
  return document.querySelector(sel);
};

// Initialization
var otp = new jsOTP.totp();
var keys = JSON.parse(localStorage.getItem("keys")) || [];
var showSecret = JSON.parse(localStorage.getItem("showSecret")) || false;
if (showSecret) {
  $("#showSecret").checked = true;
  $("#secretCol").classList += "expand";
}
var showModify = JSON.parse(localStorage.getItem("showModify")) || false;
if (showModify) {
  $("#showModify").checked = true;
  $("#modifyCol").classList += "show";
}

// Options
function toggleOptions() {
  if ($("#options").classList.contains("show")) {
    $("#options").classList.remove("show");
    $("#showOptions").innerText = "顯示選項";
  } else {
    $("#options").classList += "show";
    $("#showOptions").innerText = "隱藏選項";
  }
}

function importOTP() {
  var files = document.getElementById("importOTPFile").files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }
  var fr = new FileReader();
  fr.onload = function (e) {
    keys = JSON.parse(e.target.result);
    updateKeys();
  };
  fr.readAsText(files.item(0));
}

function exportOTP() {
  const exportName = "export-otp.json";
  const jsonStr = JSON.stringify(keys);
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
  );
  element.setAttribute("download", exportName);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function updateKeys() {
  localStorage.setItem("keys", JSON.stringify(keys));
  updateOtpDisplay();
}

function toggleShowSecret() {
  showSecret = $("#showSecret").checked;
  localStorage.setItem("showSecret", JSON.stringify(showSecret));
  if (showSecret) {
    $("#secretCol").classList += "expand";
  } else {
    $("#secretCol").classList.remove("expand");
  }
  updateOtpDisplay();
}

function toggleShowModify() {
  showModify = $("#showModify").checked;
  localStorage.setItem("showModify", JSON.stringify(showModify));
  if (showModify) {
    $("#modifyCol").classList += "show";
  } else {
    $("#modifyCol").classList.remove("show");
  }
  updateOtpDisplay();
}

function addOTPItem() {
  var otpObj = {};
  otpObj.name = $("#addLabel").value;
  otpObj.secret = $("#addSecret").value;
  // Check if secret already exist
  // Replace with new name if exist
  if (
    keys.find((o, i) => {
      if (o.secret == otpObj.secret) {
        keys[i].name = otpObj.name;
        return true;
      }
    }) == undefined
  ) {
    keys.push(otpObj);
  }
  updateKeys();
}

function removeOTPItem(secret) {
  keys = keys.filter(function (key) {
    return key.secret !== secret;
  });
  updateKeys();
}

// OTP display methods
var updateOtpDisplay = function () {
  var tableBody = "";
  var timeNext = new Date().getTime() + 30000;
  // Key rows
  keys.forEach((key) => {
    var secret = key.secret;
    tableBody += "<tr>";
    if (showModify) {
      tableBody +=
        "<td><input type='submit' value='刪除' onclick='removeOTPItem(\"" +
        secret +
        "\")'></td>";
    }
    tableBody += "<td>" + key.name + "</td>";
    tableBody += "<td class='otpText'>" + otp.getOtp(secret) + "</td>";
    tableBody +=
      "<td class='otpText'>" + otp.getOtp(secret, timeNext) + "</td>";
    if (showSecret) {
      tableBody += "<td>" + secret + "</td>";
    } else {
      tableBody += "<td>***</td>";
    }
    tableBody += "</tr>";
  });
  // Add key row
  if (showModify) {
    tableBody +=
      "<tr><td><input type='submit' value='新增' onclick='addOTPItem()'></td><td><input type='text' id='addLabel' name='addLabel' placeholder='標籤'></td><td>-</td><td>-</td><td><input type='text' id='addSecret' name='addSecret' placeholder='金鑰'></td></tr>";
  }
  $("#otpDisplayBody").innerHTML = tableBody;

  // Copy OTP value on click
  const otpTextBox = document.querySelectorAll("td.otpText");
  otpTextBox.forEach((e) => {
    e.onclick = function () {
      document.execCommand("copy");
    };
    e.addEventListener("copy", function (event) {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", e.textContent);
      }
    });
  });
  //console.log("Updated OTP display table");
};
updateOtpDisplay();

// Calculate time tick & Auto update
var timeLoop = function () {
  var epoch = Math.round(new Date().getTime() / 1000.0);
  var countDown = 30 - (epoch % 30);
  $("#updateTimer").innerText = countDown;
  if (epoch % 30 == 0) updateOtpDisplay();
};
setInterval(timeLoop, 1000);

// Update OTP display on refocus
var blurred = false;
window.onblur = function () {
  blurred = true;
};
window.onfocus = function () {
  blurred && updateOtpDisplay();
};
