
const width = 26
const height = 54
const spacing = 3.8

const rowMaker = (startX, startY, numRows) => {
  let row=[]
  for (let i=0; i<numRows; i++)  {
    const posX = i === 0 ? startX + i*width 
      : startX + i*width + i*spacing
      row.push(
        {
          x: posX,
          y: startY,
          w: width,
          h: height,
          booked: false,
//          id: "slot" + i.toString()
        }
      )
  }
  return row
}

let row1 = rowMaker(730, 20, 15)
let row2 = rowMaker(608, 152, 4)
let row3 = rowMaker(817, 152, 14)
let row4 = rowMaker(608, 212, 4)

const tempParkingSlots = row1.concat(row2).concat(row3).concat(row4)
let i = 0
const parkingSlots = tempParkingSlots.map(
  item => {
    item.id = "slot" + i
    i++
    return item
  })

export default parkingSlots
