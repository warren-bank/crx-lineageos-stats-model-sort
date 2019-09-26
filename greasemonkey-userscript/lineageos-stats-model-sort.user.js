// ==UserScript==
// @name         LineageOS Statistics Model Sort
// @description  Automatically resort release versions of hardware models by date of release on 'LineageOS Statistics' website
// @version      2.0.0
// @match        *://stats.lineageos.org/model/*
// @run-at       document-idle
// @icon         https://lineageos.org/images/logo.png
// @homepage     https://github.com/warren-bank/crx-lineageos-stats-model-sort
// @supportURL   https://github.com/warren-bank/crx-lineageos-stats-model-sort/issues
// @downloadURL  https://github.com/warren-bank/crx-lineageos-stats-model-sort/raw/greasemonkey-userscript/greasemonkey-userscript/lineageos-stats-model-sort.user.js
// @updateURL    https://github.com/warren-bank/crx-lineageos-stats-model-sort/raw/greasemonkey-userscript/greasemonkey-userscript/lineageos-stats-model-sort.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// ===================================================================
// https://www.chromium.org/developers/design-documents/user-scripts
// https://www.tampermonkey.net/documentation.php
// ===================================================================

(function() {'use strict';

// ===================================================================
// begin
// ===================================================================

const payload = function() {
  // URL restrictions:
  if (window.location.hostname.toLowerCase() !== 'stats.lineageos.org') return
  if (window.location.pathname.toLowerCase().indexOf('/model/') !== 0)  return

  const enable_debugger = true

  const rows = []

  const get_date_regex = /^[^-]+-(\d+)[^-]*-.*$/

  const get_date_from_link = (link) => {
    const title = link.innerText.trim()
    const sdate = title.replace(get_date_regex, "$1")  // YYYMMDD
    const ndate = Number(sdate)
    return isNaN(ndate) ? 0 : ndate
  }

  const get_date_from_row = (row) => {
    const link = row.querySelector(':scope > span.leaderboard-left > a')
    return get_date_from_link(link)
  }

  const compare_rows_date_asc = (a, b) => {
    const ad = get_date_from_row(a)
    const bd = get_date_from_row(b)
    return (ad < bd) ? -1 : (ad === bd) ? 0 : 1
  }

  const compare_rows_date_desc = (a, b) => {
    const ad = get_date_from_row(a)
    const bd = get_date_from_row(b)
    return (ad < bd) ? 1 : (ad === bd) ? 0 : -1
  }

  const get_rank_from_row = (row) => {
    const srank = row.querySelector(':scope > span.leaderboard-right').innerText.trim()
    const nrank = Number(srank)
    return isNaN(nrank) ? 0 : nrank
  }

  const compare_rows_rank_asc = (a, b) => {
    const ad = get_rank_from_row(a)
    const bd = get_rank_from_row(b)
    return (ad < bd) ? -1 : (ad === bd) ? 0 : 1
  }

  const compare_rows_rank_desc = (a, b) => {
    const ad = get_rank_from_row(a)
    const bd = get_rank_from_row(b)
    return (ad < bd) ? 1 : (ad === bd) ? 0 : -1
  }

  const get_user_count_from_row = (row) => {
    const susers = row.querySelector(':scope > span.leaderboard-right:last-child').innerText.trim()
    const nusers = Number(susers)
    return isNaN(nusers) ? 0 : nusers
  }

  const compare_rows_user_count_asc = (a, b) => {
    const ad = get_user_count_from_row(a)
    const bd = get_user_count_from_row(b)
    return (ad < bd) ? -1 : (ad === bd) ? 0 : 1
  }

  const compare_rows_user_count_desc = (a, b) => {
    const ad = get_user_count_from_row(a)
    const bd = get_user_count_from_row(b)
    return (ad < bd) ? 1 : (ad === bd) ? 0 : -1
  }

  const sort_by_date_onclick = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (enable_debugger) debugger;

    const sort_by_date_button = document.getElementById('sort_by_date')
    const sort_by_ucnt_button = document.getElementById('sort_by_ucnt')
    const sort_by_rank_button = document.getElementById('sort_by_rank')

    const def_direction = sort_by_date_button.getAttribute('x-default-direction') || 'desc'
    const old_direction = sort_by_date_button.className
    const new_direction = (!old_direction)           ? def_direction :
                          (old_direction === 'asc')  ? 'desc' : 'asc'

    sort_by_date_button.className = new_direction
    sort_by_ucnt_button.className = ''
    sort_by_rank_button.className = ''

    if (new_direction === 'desc')
      rows.sort(compare_rows_date_desc)
    else
      rows.sort(compare_rows_date_asc)

    const is_init = (event === undefined)
    update_DOM(is_init)
  }

  const sort_by_ucnt_onclick = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (enable_debugger) debugger;

    const sort_by_date_button = document.getElementById('sort_by_date')
    const sort_by_ucnt_button = document.getElementById('sort_by_ucnt')
    const sort_by_rank_button = document.getElementById('sort_by_rank')

    const def_direction = sort_by_ucnt_button.getAttribute('x-default-direction') || 'asc'
    const old_direction = sort_by_ucnt_button.className
    const new_direction = (!old_direction)           ? def_direction :
                          (old_direction === 'asc')  ? 'desc' : 'asc'

    sort_by_date_button.className = ''
    sort_by_ucnt_button.className = new_direction
    sort_by_rank_button.className = ''

    if (new_direction === 'desc')
      rows.sort(compare_rows_user_count_desc)
    else
      rows.sort(compare_rows_user_count_asc)

    const is_init = (event === undefined)
    update_DOM(is_init)
  }

  const sort_by_rank_onclick = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (enable_debugger) debugger;

    const sort_by_date_button = document.getElementById('sort_by_date')
    const sort_by_ucnt_button = document.getElementById('sort_by_ucnt')
    const sort_by_rank_button = document.getElementById('sort_by_rank')

    const def_direction = sort_by_rank_button.getAttribute('x-default-direction') || 'desc'
    const old_direction = sort_by_rank_button.className
    const new_direction = (!old_direction)           ? def_direction :
                          (old_direction === 'asc')  ? 'desc' : 'asc'

    sort_by_date_button.className = ''
    sort_by_ucnt_button.className = ''
    sort_by_rank_button.className = new_direction

    if (new_direction === 'desc')
      rows.sort(compare_rows_rank_desc)
    else
      rows.sort(compare_rows_rank_asc)

    const is_init = (event === undefined)
    update_DOM(is_init)
  }

  const sanitize_rows = () => {
    rows.forEach(row => {
      const left = row.querySelector(':scope > span.leaderboard-left')
      const link = left.querySelector(':scope > a')
      left.removeChild(link)
      const rank = left.innerText.replace(/[^0-9]/g, '')
      left.innerHTML = ''
      left.appendChild(link)

      const right = row.querySelector(':scope > span.leaderboard-right')

      const middle = document.createElement('span')
      middle.className = 'leaderboard-right'
      middle.innerText = rank
      row.insertBefore(middle, right)
    })
  }

  const initialize_CSS = () => {
    const css = `
      #top-devices span.leaderboard-right {
        min-width: 5em;
      }
      #top-devices span.leaderboard-right:last-child {
        min-width: 10em;
      }
    `
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.appendChild(
      document.createTextNode(css)
    )
    document.head.appendChild(style)
  }

  const initialize_DOM = () => {
    const css = {
      "container": "padding:1em;",
      "header":    "text-align:left !important; padding-bottom:0.5em;",
      "button":    "border-radius:5px; padding:5px; color:black;"
    }

    document.body.innerHTML = `
      <div id="top-devices" style="${css.container}">
        <div class="leaderboard-header" style="${css.header}">
          <span class="leaderboard-left">
            Sort By:
            <button id="sort_by_date" style="${css.button}" x-default-direction="desc">Date</button>
          </span>
          <span class="leaderboard-right">
            <button id="sort_by_rank" style="${css.button}" x-default-direction="asc">Rank</button>
          </span>
          <span class="leaderboard-right">
            <button id="sort_by_ucnt" style="${css.button}" x-default-direction="desc">Active User Count</button>
          </span>
        </div>
      </div>
    `

    const sort_by_date_button = document.getElementById('sort_by_date')
    const sort_by_ucnt_button = document.getElementById('sort_by_ucnt')
    const sort_by_rank_button = document.getElementById('sort_by_rank')

    sort_by_date_button.addEventListener('click', sort_by_date_onclick)
    sort_by_ucnt_button.addEventListener('click', sort_by_ucnt_onclick)
    sort_by_rank_button.addEventListener('click', sort_by_rank_onclick)
  }

  const update_DOM = (is_init) => {
    const container = document.getElementById('top-devices')

    // 1st pass: empty container
    if (!is_init) {
      rows.forEach(row => {
        try {
          container.removeChild(row)
        }
        catch(e){}
      })
    }

    // 2nd pass: repopulate container
    rows.forEach((row, index) => {
      row.className = 'leaderboard-row leaderboard-row-' + ((index % 2 === 0) ? 'a' : 'b')
      container.appendChild(row)
    })
  }

  const init = () => {
    rows.push(...document.querySelectorAll('#top-devices > .leaderboard-row'))
    sanitize_rows()
    initialize_CSS()
    initialize_DOM()
    sort_by_date_onclick()
  }

  if (enable_debugger) debugger;

  init()
}

const get_hash_code = function(str) {
  let hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

const inject_function = function(_function) {
  let inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

inject_function(payload)

// ===================================================================
// end
// ===================================================================

})()
