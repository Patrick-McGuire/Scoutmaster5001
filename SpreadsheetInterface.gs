function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Dialog')
      .addItem('Open', 'openDialog')
      .addToUi();
}

function openDialog() {
  // var html = HtmlService.createHtmlOutputFromFile('Dialog').evaluate();
  var template = HtmlService.createTemplateFromFile('Dialog');
  var html = template.evaluate()
  html.setWidth(8000000)
  html.setHeight(8000000);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Gui Bulder');
}