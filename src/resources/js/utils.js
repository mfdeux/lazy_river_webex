/**
 * Parse html text into a DOM
 * @param {string} textResp
 */
const textToDOM = (textResp) => {
  const parser = new DOMParser();
  return parser.parseFromString(textResp, "text/html");
}

const extractDLUrls = (htmlDocument) => {
  let dlUrls = htmlDocument.querySelectorAll("a[href*='http://libgen.io/ads.php']")
  let urls = []
  for (let index = 0; index < dlUrls.length; index++) {
    let entry = {}
    entry.id = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[11 + 15 * index].textContent // id
    entry.pages = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[16 + 15 * index].textContent // pages
    entry.lang = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[17 + 15 * index].textContent // language
    entry.size = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[18 + 15 * index].textContent // size
    entry.ext = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[19 + 15 * index].textContent // extension
    let s = htmlDocument.querySelectorAll('table[rules="rows"] tr td')[21 + 15 * index] // dl link
    entry.dlPageUrl = s.querySelector('a').href
    entry.dlUrl = null
    urls.push(entry)
  }
  return urls
}

/**
 *
 * @param {string} ISBN10
 */
const retrieveLibGenISBN10 = async (ISBN10) => {
  let isbnSearch = await fetch("http://libgen.io/search.php?req=" + ISBN10 + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def")
  let isbnSearchBody = await isbnSearch.text()
  let parsedIsbnSearchBody = textToDOM(isbnSearchBody)
  return extractDLUrls(parsedIsbnSearchBody)
}

/**
 *
 * @param {string} searchTerm
 */
const retrieveLibGenSearchTerm = async (searchTerm) => {
  let metaDataSearch = await fetch("http://libgen.io/search.php?req=" + searchTerm + "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def")
  let metaDataSearchBody = await metaDataSearch.text()
  let parsedMetaDataSearchBody = textToDOM(metaDataSearchBody)
  return extractDLUrls(parsedMetaDataSearchBody)
}

/**
 *
 * @param {string} url
 */
const retrieveDLUrl = async (url) => {
  let dlPage = await fetch(url)
  let dlPageBody = await dlPage.text()
  let parseddlPageBody = textToDOM(dlPageBody)
  let dlUrl = parseddlPageBody.querySelector("a[href*='key']")
  return dlUrl.href
}
