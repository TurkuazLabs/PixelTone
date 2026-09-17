// # 📄 Dosya Yolu: pixeltone/frontend/tools/file_transfer_tool.js
// # 📌 Amac: Export icerigini dosya olarak indirmek ve import dosyasini metin olarak okumak
// # 📌 Tool - JavaScript
// # Version: 0.3.0
// # Aciklama: Browser Blob ve File API detaylarini service/controller katmanindan ayirir
//
// Bagimli Oldugu Katman: Tool

export const fileTransferTool = Object.freeze({
  downloadText(exportFile) {
    const blob = new Blob([exportFile.content], { type: exportFile.mime_type });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = exportFile.file_name;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  },

  async readTextFile(file) {
    if (!file) {
      return "";
    }

    return file.text();
  },
});
