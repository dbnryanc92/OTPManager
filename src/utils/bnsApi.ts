const api = "https://archive.bnshive.com/api/checkOnline";

const bnsCheckOnline = async function (chars: Array<string>) {
  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chars),
  });
  const json = await res.json();
  return json;
};

export { bnsCheckOnline };
