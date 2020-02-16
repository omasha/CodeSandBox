import "./styles.css";
/*
go to https://www.mocky.io/ to generate a test link and add delay option
*/
const FETCH_TIMEOUT = 500;
const URL_T =
  "https://www.mocky.io/v2/5e49640c30000079008c2d70?mocky-delay=1000ms";
const URL_B = "https://www.mocky.io/v2/5e49640c30000079008c2ddsdf";
const WAIT = 20000;
const RETRY = 2;
//const pause = duration => new Promise(res => setTimeout(res, duration));
async function sleep(ms) {
  console.log("waiting", ms);
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeout) {
  console.log("calling ", url);
  console.log("timeout ", timeout);
  return new Promise((resolve, reject) => {
    // Set timeout timer
    let timer = setTimeout(
      () => reject(new Error("Request timed out in timer")),
      timeout
    );
    fetch(url)
      //.then(response => resolve(response), err => reject(err))
      .then(response =>
        response.ok ? resolve(response) : reject(new Error("Fetch failed"))
      )
      .finally(() => clearTimeout(timer));
  }); // promise end
}

async function runFetch(retries) {
  try {
    let result = await fetchWithTimeout(URL_B, FETCH_TIMEOUT);
    if (result.status === 200) {
      let data = await result.json();
      console.log(data);
      return result;
    } else {
      throw new Error("server unreachable");
    }
  } catch (err) {
    // retries only happen on error
    if (err && !err.message) {
      console.log("no err message", err);
    }
    console.log("err message", err.message);

    console.log("requests left:", retries - 1);
    if (retries <= 1) {
      throw new Error("no tries left");
    }
    // interval between tries
    await sleep(WAIT).then(() => runFetch(retries - 1));
  }
}

async function runFetchAgain(n) {
  return await runFetch(n).catch(err => {
    console.log("final error:", err.message);
  });
}

// run on load
(async () => {
  await runFetchAgain(RETRY); // retries
})();

document.getElementById("app").innerHTML = `
<h1>Hello there!</h1>
<div>
  See console
</div>
`;
