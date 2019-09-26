const payload = function() {
  // URL restrictions:
  if (window.location.hostname.toLowerCase() !== 'stats.lineageos.org') return
  if (window.location.pathname.toLowerCase().indexOf('/model/') !== 0)  return

  const get_date_regex = /^[^-]+-(\d+)[^-]*-.*$/

  const get_date_from_link = (anchor) => {
    const title = anchor.innerText.trim()
    const sdate = title.replace(get_date_regex, "$1")  // YYYMMDD
    const ndate = Number(sdate)
    return isNaN(ndate) ? 0 : ndate
  }

  const compare_links_asc = (a, b) => {
    const ad = get_date_from_link(a)
    const bd = get_date_from_link(b)
    return (ad < bd) ? -1 : (ad === bd) ? 0 : 1
  }

  const compare_links_desc = (a, b) => {
    const ad = get_date_from_link(a)
    const bd = get_date_from_link(b)
    return (ad < bd) ? 1 : (ad === bd) ? 0 : -1
  }

  const update_DOM = (links) => {
    document.body.innerHTML = '<div id="top-devices"></div>'

    const container = document.getElementById('top-devices')

    links.forEach((link, index) => {
      const div = document.createElement('div')
      div.className = 'leaderboard-row leaderboard-row-' + ((index % 2 === 0) ? 'a' : 'b')
      div.appendChild(link)
      container.appendChild(div)
    })
  }

  const init = () => {
    const links = [...document.querySelectorAll('#top-devices span.leaderboard-left a')]
    links.sort(compare_links_desc)
    update_DOM(links)
  }

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
