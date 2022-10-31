const eventUrlPattern = new RegExp(
  /^https:\/\/school\.runteq\.jp\/v[0-9]\/runteq_events\/[0-9]{3,6}/
);

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const url = tabs[0].url;
  if (!eventUrlPattern.test(url)) {
    document.getElementById("results").innerText = "無効なURLです";
    document.getElementById("addBtn").setAttribute("disabled", true);
    return;
  }
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
});

document.getElementById("addBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("test");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: onRun,
  });
});

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

function onRun() {
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
