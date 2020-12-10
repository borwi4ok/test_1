const fs = require('fs')

//read file as argument at launch in console
const file = process.argv[2]

function startStateGeneration() {
  //add 2 for create edges for matrix
  const numberOfRows = Math.floor(Math.random() * 100 + 2)
  const numberOfColumns = Math.floor(Math.random() * 100 + 2)

  let table = new Array(numberOfRows)

  for (let i = 0; i < table.length; i++) {
    table[i] = new Array(numberOfColumns)

    for (let j = 0; j < table[i].length; j++) {
      // fill first, last rows and first and last columns by 0
      // for transform table to the next vision
      // 0 0 0 0 0
      // 0 n n n 0
      // 0 n n n 0
      // 0 n n n 0
      // 0 0 0 0 0
      // n - random number

      if (i == 0 || i == table.length - 1) {
        table[i].fill(0)
        continue
      }
      if (j == 0 || j == table[i].length - 1) {
        table[i][j] = 0
        continue
      }

      table[i][j] = Math.round(Math.random())
    }
  }

  return table
}

function transformTable(table, isFile) {
  let tableFromFile
  if (isFile) {
    table = table.split('\n')
    tableFromFile = table.map((elem) => elem.match(/[01]/g))

    //add first and last row filled by 0
    tableFromFile.unshift(new Array(tableFromFile[0].length).fill(0))
    tableFromFile.push(new Array(tableFromFile[0].length).fill(0))

    for (let i = 0; i < tableFromFile.length; i++) {
      for (let j = 0; j < tableFromFile[i].length; j++) {
        // when we start parse row we add zeros to 0 edges of row
        if (j == 0) {
          tableFromFile[i].unshift(0)
          tableFromFile[i].push(0)
        }

        tableFromFile[i][j] = parseInt(tableFromFile[i][j])
      }
    }
    console.log(tableFromFile)
    table = tableFromFile
  }
  setInterval(() => {
    let duplicate = new Array(...table)

    // start from 1 because matrix starts from 1 position
    for (let i = 1; i < table.length - 1; i++) {
      for (let j = 1; j < table[i].length - 1; j++) {
        const topLeft = table[i - 1][j - 1],
          top = table[i - 1][j],
          topRight = table[i - 1][j + 1],
          left = table[i][j - 1],
          right = table[i][j + 1],
          botLeft = table[i + 1][j - 1],
          bot = table[i + 1][j],
          botRight = table[i + 1][j + 1]

        const sumOfNeighbors =
          topLeft + top + topRight + left + right + botLeft + bot + botRight

        if (table[i][j] == 1 && (sumOfNeighbors < 2 || sumOfNeighbors > 3)) {
          duplicate[i][j] = 0
          continue
        }
        if (table[i][j] == 0 && sumOfNeighbors == 3) duplicate[i][j] = 1
      }
    }

    table = duplicate

    //slice first and last row
    let arrForShow = table.slice(1, table.length - 1)

    // slice first and last column
    for (let i = 0; i < arrForShow.length; i++) {
      arrForShow[i] = arrForShow[i].slice(1, arrForShow[i].length - 1)
    }

    console.log(arrForShow)
  }, 1000)
}

if (file) {
  fs.readFile(`./\\${file}`, 'utf-8', (err, data) => {
    if (err) console.log(err)
    transformTable(data, true)
  })
} else {
  transformTable(startStateGeneration())
}
