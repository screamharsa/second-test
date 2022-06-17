/*
# CREATED BY: BPWEBS.COM
# URL: https://www.bpwebs.com
*/

function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

function getData() {

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheets = ss.getSheets()

  const transactions = sheets.reduce((acc, sheet) => {
    const sheetTransactions = sheet.getDataRange().getDisplayValues().slice(1);
    return [...acc, ...sheetTransactions];
  }, []);
  // console.log(transactions)
  const customers = {};
  for (const transaction of transactions) {
    const name = transaction[2];
    const customerTransactions = customers[name]?.transactions || [];
    const updatedCustomerTransactions = [transaction, ...customerTransactions]
    customers[name] = { transactions: updatedCustomerTransactions };
  }

  for (const customerName in customers) {
    const total = customers[customerName].transactions.reduce((acc, transaction) => {
      const transactionTotal = Number(transaction[8].replaceAll('.', ''))
      return acc + transactionTotal;
    }, 0)
    customers[customerName].total = total;
  }

  const sortedCustomerNames = Object.keys(customers);
  sortedCustomerNames.sort((a, b) => {
    const aTotal = customers[a].total;
    const bTotal = customers[b].total;
    return bTotal - aTotal
  })

  const sortedTransactions = sortedCustomerNames.reduce((acc, customerName) => {
    const customerTransactions = customers[customerName].transactions;
    return [...acc, ...customerTransactions];
  }, []);

  console.log('sorted transactions: ', sortedTransactions.length);
  console.log(sortedCustomerNames.map(name => {
    return [customers[name].total, customers[name].transactions.length]
  }))
  return sortedTransactions
}






//INCLUDE JAVASCRIPT AND CSS FILES
//REF: https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

//Ref: https://datatables.net/forums/discussion/comment/145428/#Comment_145428
//Ref: https://datatables.net/examples/styling/bootstrap4function myFunction()
