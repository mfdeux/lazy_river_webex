
URL_RETRIEVAL_LIMIT = 1

var bookISBN10
var bookISBN13
var bookAuthor
var bookTitle

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    let newElem = document.createElement('div')
    let newElem2 = document.createElement('div')
    let rootElem
    if (document.querySelector('div#combinedBuyBox')) {
      rootElem = document.querySelector('div#combinedBuyBox')
    } else {
      rootElem = document.querySelector('div#mediaTabsGroup')
    }
    newElem.setAttribute('id', 'lazyRiverBox')
    newElem2.setAttribute('class', 'lazyRiverTitle')
    newElem2.innerText = 'Lazy River'
    newElem.insertAdjacentElement('afterbegin', newElem2)
    rootElem.insertAdjacentElement('afterbegin', newElem)
    for (let index = 0; index < request.length; index++) {
      let item = request[index]
      let innerHTML = `<span class="a-text-bold"> ${item.lang} | ${item.ext} | ${item.pages}pp. | ${item.size} | <a href="${item.dlPageUrl}" target="_blank">DL</a></span>`
      let newElemItem = document.createElement('div')
      newElemItem.setAttribute('class', 'lazyRiverItem')
      newElemItem.innerHTML = innerHTML
      newElem2.insertAdjacentElement('afterend', newElemItem)
    }
    return true
  })

const retrieveISBN10 = async () => {
  [...document.querySelectorAll("#productDetailsTable > tbody > tr > td > div > ul > li")].map(div => div.innerHTML)               // get their contents
    .filter(txt => txt.includes('ISBN-10'))
    .forEach(txt => { bookISBN10 = txt.split(' ')[1] })
}

const retrieveISBN13 = async () => {
  [...document.querySelectorAll("#productDetailsTable > tbody > tr > td > div > ul > li")].map(div => div.innerHTML)               // get their contents
    .filter(txt => txt.includes('ISBN-13'))
    .forEach(txt => { bookISBN13 = txt.split(' ')[1] })
}



(async () => {
  retrieveISBN10()
  retrieveISBN13()
  try {
    bookTitle = document.querySelector("#productTitle").textContent.trim()
  } catch (e) {
    if (e instanceof TypeError) {
      bookTitle = document.querySelector("#ebooksProductTitle").textContent.trim()
    }
  }

  try {
    bookAuthor = document.querySelector(".author > a").textContent.trim()
  } catch (e) {
    if (e instanceof TypeError) {
      bookAuthor = document.querySelector(".contributorNameID").textContent.trim()
    }
  }
  let bookCombinedTerm = `${bookTitle} ${bookAuthor}`.trim()
  let bookMetaData = {
    url: document.location.href,
    ISBN10: bookISBN10,
    ISBN13: bookISBN13,
    author: bookAuthor,
    title: bookTitle,
    combinedTerm: bookCombinedTerm
  }
  let resp = chrome.runtime.sendMessage(bookMetaData)
})()

