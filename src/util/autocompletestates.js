export let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
}


export function matchStateToTerm (state, value) {
  return (
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
}

export function sortStates (a, b, value) {
  return (
    a.name.toLowerCase().indexOf(value.toLowerCase()) >
    b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
  )
}

export function fakeRequest (value, cb) {
  if (value === '')
    return getPlayers()
  var items = getPlayers().filter((state) => {
    return matchStateToTerm(state, value)
  })
  setTimeout(() => {
    cb(items)
  }, 500)
}

export function getPlayers() {
  return [
    { abbr: "2030", name: "Kenyon Martin"},
    { abbr: "201575", name: "Brandon Rush"},
    { abbr: "204038", name: "Langston Galloway"},
    { abbr: "203098", name: "John Jenkins"},
    { abbr: "202693", name: "Markieff Morris"}
  ]
}