document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("lastChecksum", (data) => {
    document.getElementById("checksum").textContent = data.lastChecksum || "No checksum available";
  });

  document.getElementById("compare").addEventListener("click", () => {
    const knownChecksum = document.getElementById("knownChecksum").value.trim();
    const lastChecksum = document.getElementById("checksum").textContent;

    if (knownChecksum === lastChecksum) {
      document.getElementById("result").textContent = "Checksums match!";
    } else {
      document.getElementById("result").textContent = "Checksums do not match!";
    }
  });
});
