  function doGet(e) {
    var template = HtmlService.createTemplateFromFile('WebAppPage');
    var pageData= template.evaluate()
    .setTitle('Scoutmaster 5001') // Set Title 
     return pageData;
}