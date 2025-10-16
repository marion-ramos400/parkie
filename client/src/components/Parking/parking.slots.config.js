
const width = 26
const height = 54
const spacing = 3.8

const rowMaker = (startX, startY, numRows) => {
  let row=[]
  for (let i=0; i<numRows; i++)  {
    const posX = i === 0 ? startX + i*width 
      : startX + i*width + i*spacing
    
    const tempIsBooked = true ? i % 2 == 0 : false
    row.push(
      {
        floor: 1,
        name: 'A' + (i+1).toString(),
        dateBooked: '',
        datePark: '',
        start: '',
        end: '',
        ticketNum: '',
        reservedTo: 'tester',
        qrCode: {},
        isBooked: tempIsBooked,
        uiRect: 
          {
            x: posX,
            y: startY,
            w: width,
            h: height,
          }
      }
    )
  }
  return row
}

let row1 = rowMaker(144, 4, 15)
let row2 = rowMaker(24, 138, 4)
let row3 = rowMaker(232, 138, 14)
//let row4 = rowMaker(608, 414, 4)
//let row5 = rowMaker(817, 414, 14)

const tempParkingSlots = row1.concat(row2).concat(row3)
let i = 0
const parkingSlots = tempParkingSlots.map(
  item => {
    item.id = "slot" + i
    i++
    return item
  })

export default parkingSlots
