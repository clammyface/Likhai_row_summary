function loadLikhAIConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(".likhai-do-not-remove");
  const values = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();
  const config = {};
  for (const [key, value] of values) {
    if (key && value) config[key.trim()] = value.toString().trim();
  }
  return config;
}
