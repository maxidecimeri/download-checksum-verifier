chrome.downloads.onChanged.addListener(async (downloadDelta) => {
  if (downloadDelta.state && downloadDelta.state.current === "complete") {
    const downloadId = downloadDelta.id;
    const downloadItem = await getDownloadItem(downloadId);
    const filePath = downloadItem.filename;

    const fileContent = await readFile(filePath);
    const checksum = await calculateSHA256(fileContent);

    chrome.storage.local.set({ lastChecksum: checksum });
    alert(`SHA-256 Checksum: ${checksum}`);
  }
});

function getDownloadItem(downloadId) {
  return new Promise((resolve) => {
    chrome.downloads.search({ id: downloadId }, (items) => {
      resolve(items[0]);
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error("Failed to load file"));
      }
    };
    xhr.send();
  });
}

async function calculateSHA256(fileContent) {
  const buffer = await crypto.subtle.digest("SHA-256", fileContent);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
