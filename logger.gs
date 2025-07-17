function logLikhaiRun(log) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LikhAI_Log")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("LikhAI_Log");

  sheet.appendRow([new Date(), JSON.stringify(log)]);
}
