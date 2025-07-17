/**
 * LIKHAI_ROW(range, prompt, useHeader, model, ...columnsToUse)
 * 
 * Runs an LLM over each row using a prompt and returns answers.
 * Batches rows 5 at a time. Returns one answer per row.
 */
function LIKHAI_ROW(inputRange, prompt, useHeader, model, ...columnsToUse) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = inputRange;
  const batchSize = 5;
  const total = rows.length;
  const results = new Array(total).fill(["[Missing response]"]); // default fallback

  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(".likhai-do-not-remove");
  const apiKey = configSheet.getRange("B1").getValue().trim();
  const baseUrl = configSheet.getRange("B2").getValue().trim();
  const modelToUse = model || configSheet.getRange("B3").getValue().trim();

  const headerRow = useHeader ? inputRange[0] : columnsToUse;
  const dataRows = useHeader ? rows.slice(1) : rows;

  for (let start = 0; start < total; start += batchSize) {
    const batch = rows.slice(start, start + batchSize);

    // Format each row like --- Row 2 ---\nColumn1: Value\nColumn2: Value...
    const indexedText = batch.map((row, idx) => {
      const absIdx = start + idx + 2; // +2 accounts for 1-based index + header
      return `--- Row ${absIdx} ---\n` + headerRow.map((h, j) => `${h}: ${row[j] || ""}`).join("\n");
    }).join("\n\n");

    const finalPrompt = typeof prompt === 'string' ? prompt : prompt.getValue();
    const fullPrompt = `${finalPrompt}\n\n${indexedText}`;

    let responseText = "";
    try {
      responseText = callLiteLLM(fullPrompt, modelToUse, apiKey, baseUrl);
    } catch (err) {
      Logger.log("API Error: " + err);
      responseText = "";
    }

    // ✅ Extract answers using split (assuming answers start with 1. 2. 3. ...)
    const chunks = responseText.split(/\n\d+\.\s/).filter(c => c.trim());

    for (let i = 0; i < chunks.length; i++) {
      const cleaned = chunks[i].trim();
      if (cleaned) {
        results[start + i] = [`${i + 1}. ${cleaned}`];
      }
    }
  }

  return results;
}
















//LIKHAI_SUMMARY



function likhaiSummaryHandler(inputRange, prompt, tryActual, model) {
  Logger.log(typeof inputRange)
  const values = inputRange;
  Logger.log(JSON.stringify(values))
  if (!inputRange || typeof inputRange !== 'object') {

    throw new Error("⚠️ LIKHAI_ROW: First argument must be a valid range like A2:C20");
  }

  
  const config = loadLikhAIConfig();
  const apiKey = config.apiKey;
  const modelToUse = model || config.model;

  if (!apiKey) throw new Error("❌ Missing LiteLLM API key");

  // 🧠 Handle prompt: direct string or cell reference
  let finalPrompt = prompt;
  try {
    const maybePromptRange = SpreadsheetApp.getActiveSpreadsheet().getRange(prompt);
    finalPrompt = maybePromptRange.getValue();
  } catch (_) {
    // Keep it as plain text
  }

  const rowLimit = tryActual === false || tryActual === "FALSE"
    ? values.length
    : Math.min(parseInt(tryActual), values.length);

  const batchSize = 5;
  const output = [];

  for (let i = 0; i < rowLimit; i += batchSize) {
    const batch = values.slice(i, i + batchSize);

    const inputText = batch.map((row, idx) => `${idx + 1}. ${row.join(" | ")}`).join("\n");
    const fullPrompt = `Summarize each row below individually:\n${inputText}\n\n${finalPrompt}`;

    let response, status;
    try {
      response = callLiteLLM(fullPrompt, modelToUse, apiKey);
      status = "✅ Success";
    } catch (err) {
      response = batch.map(() => "❌ LLM Error");
      status = "❌ Error";
    }

    const parsed = Array.isArray(response) ? response : [response];
    output.push(...parsed.map(text => [text]));

    logLikhaiRun({
      rangeSize: batch.length,
      modelUsed: modelToUse,
      promptHash: Utilities.base64Encode(finalPrompt),
      output: JSON.stringify(parsed),
      status
    });
  }

  return output;
}

