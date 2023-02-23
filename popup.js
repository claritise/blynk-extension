chrome.tabs.query({ active: true }).then((tabs) => getProfile(tabs));

const getProfile = (tabs) => {
  const div = document.getElementById('value');
  const url = tabs[0].url;
  getProfileData(url).then((profile) => {
    if (profile != '') {
      div.innerHTML = `${profile.value}`;
      document.getElementById('header').addEventListener('click', () => {redirect(profile.name)});
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