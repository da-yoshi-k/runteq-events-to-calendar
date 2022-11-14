const eventUrlPattern = new RegExp(
  /^https:\/\/school\.runteq\.jp\/v[0-9]\/runteq_events\/[0-9]{3,6}/
);

const consultationUrlPattern = new RegExp(
  /^https:\/\/school\.runteq\.jp\/v[0-9]\/mypage\/consultation_reservations\/[0-9]{2,10}/
);

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  if (eventUrlPattern.test(tabs[0].url)) {
    showEventInfo(tabs);
  } else if (consultationUrlPattern.test(tabs[0].url)) {
    showConsultationsInfo(tabs);
  } else {
    document.getElementById("results").innerText = "無効なURLです";
    document.getElementById("addBtn").setAttribute("disabled", true);
    return;
  }
});

document.getElementById("addBtn").addEventListener("click", async () => {
  await chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (eventUrlPattern.test(tabs[0].url)) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: addEventToCalendar,
      });
    } else if (consultationUrlPattern.test(tabs[0].url)) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: addConsultationToCalendar,
      });
    }
  });
});

function showEventInfo(tabs) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: getEventImage,
    },
    (result) => {
      let imgHTML = "";
      result[0].result
        ? (imgHTML = `<img src=${result[0].result} width="280">`)
        : (imgHTML = `<div>イベント画像なし</div>`);
      document.getElementById("results").innerHTML = imgHTML;
    }
  );
}

function getEventImage() {
  try {
    const imgSrc = document
      .querySelector(".userEventDetail_image > img")
      .getAttribute("src");
    return imgSrc;
  } catch {
    return "";
  }
}

function showConsultationsInfo(tabs) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: getConsultationsInfo,
    },
    (result) => {
      let textHTML = "";
      result[0].result
        ? (textHTML = `<div>日時：${result[0].result.date}</div><br><div>種別：${result[0].result.category}</div>`)
        : (textHTML = `<div>面談情報なし</div>`);
      document.getElementById("results").innerHTML = textHTML;
    }
  );
}

function getConsultationsInfo() {
  try {
    let consultation = {
      date: "",
      category: "",
    };
    const reservationTable = document.querySelector(".card-body > table");
    consultation.date = reservationTable.rows[0].cells[1].innerText;
    consultation.category = reservationTable.rows[1].cells[1].innerText;
    return consultation;
  } catch {
    return "";
  }
}

function addEventToCalendar() {
  const title = document.querySelector(".userEventDetail_sideTitle").innerText;
  const eventURL = window.location.href.split("?")[0];
  // 'YYYY年MM月DD日(X) hh:mm〜hh:mm'の形式を想定
  const dates = document
    .querySelector(".userEventDetail_date")
    .innerText.split(" ");
  const date = dates[0].replace(/\D/g, "");
  const startTime = dates[1].split("〜")[0].replace(":", "");
  const endTime = dates[1].split("〜")[1].replace(":", "");
  const startDate = `${date}T${startTime}00`;
  const endDate = `${date}T${endTime}00`;
  const linkUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${eventURL}&location=オンライン&trp=false`;
  window.open(linkUrl, "_blank");
}

function addConsultationToCalendar() {
  const reservationTable = document.querySelector(".card-body > table");
  // 'YYYY/MM/DD hh:mm〜hh:mm'の形式を想定
  const dates = reservationTable.rows[0].cells[1].innerText.split(" ");
  const date = dates[0].replace(/\D/g, "");
  const startTime = dates[1].split("〜")[0].replace(":", "");
  const endTime = dates[1].split("〜")[1].replace(":", "");
  const startDate = `${date}T${startTime}00`;
  const endDate = `${date}T${endTime}00`;
  const title = reservationTable.rows[1].cells[1].innerText;
  const reservationURL = window.location.href.split("?")[0];
  const url = reservationTable.rows[2].cells[1].innerText;
  const linkUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=予約詳細ページ%0D%0A${reservationURL}%0D%0A面談URL%0D%0A${url}&location=オンライン&trp=false`;
  window.open(linkUrl, "_blank");
}
