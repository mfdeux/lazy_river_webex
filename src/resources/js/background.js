var bookISBN10 = '9963616062';
var bookCombinedTerm = "Beyond Brawn: The Insider's Encyclopedia on How to Build Muscle & Might Stuart McRobert";

const extractUrls = async (request, sender) => {
  if (request.ISBN10) {
    let ISBN10Urls = await retrieveLibGenISBN10(request.ISBN10)
    if (ISBN10Urls.length > 0) {
      console.log(ISBN10Urls)
      return ISBN10Urls
    } else {
      let combinedTermUrls = await retrieveLibGenSearchTerm(request.combinedTerm)
      console.log(combinedTermUrls)
      return combinedTermUrls
    }
  } else {
    console.info('No ISBN10 was found on the page, unable to fetch ebook URLs.')
    return []
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(`Received message from ${sender.tab.url}`)
    console.log(request)
    extractUrls(request).then(async (resp) => await chrome.tabs.sendMessage(sender.tab.id, resp))
    return true;
    // sendResponse({ id: "119441", pages: "505", lang: "English", size: "4 MB", ext: "pdf" })
  })


// var dlUrls = [];

// (async () => {
//   if (bookISBN10) {
//     let ISBN10Urls = await retrieveLibGenISBN10(bookISBN10)
//     if (ISBN10Urls.length > 0) {
//       console.log(ISBN10Urls)
//       let dlUrls = ISBN10Urls.slice(0, 5).map(async (entry) => {
//         entry.dlUrl = await retrieveDLUrl(entry.dlPageUrl)
//         return entry
//       })
//       Promise.all(dlUrls).then((completed) => console.log(completed));
//     } else {
//       let combinedTermUrls = await retrieveLibGenSearchTerm(bookCombinedTerm)
//       console.log(combinedTermUrls)
//       let dlUrls = combinedTermUrls.slice(0, 5).map(async (url) => {
//         entry.dlUrl = await retrieveDLUrl(entry.dlPageUrl)
//         return entry
//       })
//       Promise.all(dlUrls).then((completed) => console.log(completed));
//     }
//   } else {
//     console.info('No ISBN10 was found on the page, unable to fetch ebook URLs.')
//   }
// })()

