const ratingColor = (value) => {

  if (value > 66) {
    return "#8BDCFF";
  } else if (value > 33) {
    return "#FFD18B";
  } else {
    return "#FF6C6C";
  }
}

chrome.tabs.query({ active: true }).then((tabs) => getProfile(tabs));

function Insight({ icon, text }) {
  const container = document.createElement('div');
  container.classList.add("insightContainer");

  const image = new Image(40, 40);
  image.src = icon;
  image.alt = "Picture of the author";

  const paragraph = document.createElement('p');
  paragraph.innerText = text;

  container.appendChild(image);
  container.appendChild(paragraph);
  return container;
}

function Insights({ profile }) {
  const insights = [];

  if (profile && profile.verified) {
    insights.push(Insight({ icon: "images/tick.svg", text: "Manually Verified" }));
  }

  return insights;
}

const getProfile = (tabs) => {
  const div = document.getElementById('value');
  const url = tabs[0].url;
  getProfileData(url).then((profile) => {
    if (profile != '') {
      div.style.color = ratingColor(profile.value);
      div.innerHTML = profile.ratings && profile.ratings.length ? `${profile.value}` : "—";

      const noInsights = document.createElement('div');
      noInsights.classList.add("noInsights");
      const p = document.createElement('p');
      p.innerText = 'Insights available with more data';
      noInsights.appendChild(p);

      const insights = Insights({ profile });
      const withInsights = document.createElement('div');
      withInsights.classList.add("insightsContainer");

      for (let i = 0; i < insights.length; i++) {
        withInsights.appendChild(insights[i]);
      }

      document.getElementById('container').appendChild(insights.length > 0 ? withInsights : noInsights)      

      document.getElementById('header').addEventListener('click', () => { redirect(profile.name) });
    } else {
      div.innerHTML = `failed`
    }
  });
}

const redirect = (url) => {
  chrome.tabs.create(
    {
      active: true,
      url: "https://www.blynk.info/profile/" + url,
    }
  )
}

const getProfileData = async (url) => {
  const name = b64EncodeUnicode(url);
  const res = await fetch("https://www.blynk.info/api/profile/" + name);
  return await res.json();
}

const b64EncodeUnicode = (str) => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
}