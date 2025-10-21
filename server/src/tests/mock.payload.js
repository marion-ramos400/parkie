
class MockTestObject {
  payload() {
    throw new Error('payload method not implemented')
  }
  query() {
    throw new Error('query method not implemented')
  }
  params() {
    throw new Error('params method not implemented')
  }
}

class MockUser extends MockTestObject {
  payload() {
    return {
      createUserNonAdmin: {
        email: 'emailTest123456@email.com',
        password: '123asdzxc'
      },
      createUserAdmin: {
        email: 'emailTest123456@email.com',
        password: '123asdzxc',
        isAdmin: true,
      },
    }
  }
}

class MockFloorPlan extends MockTestObject {
  payload() {
    return {
      towerOneFlr1: {
        name: 'TowerOneFlr1',
        floor: '1',
        building: 'Tower One',
        slots: new MockSlotTestObjects().slots5Unbooked()
      },
      floorPlanNoName: {
        floor: '1',
        building: 'Shimmy Tower',
        slots: new MockSlotTestObjects().slots5Unbooked()
      },
      overwriteSlots: {
        name: 'TowerOneFlr1',
        slots: new MockSlotTestObjects().replaceSlots()
      }
    }
  }
  query() {
    return {
      bldgTowerOneFlr1: "building=Tower%20One&floor=1"
    }
  }
}

class MockSlot extends MockTestObject {
  constructor(name, floor, company, building, isBooked, uiRect, type) {
    super()
    this.name = name
    this.floor = floor
    this.company = company
    this.building =  building
    this.isBooked = isBooked
    this.uiRect = uiRect
    this.type = type
  }
  json() {
    return JSON.parse(JSON.stringify(this))
  }
}

class MockBooking extends MockTestObject{
  payload() {
    return {
      tower1Flr1SlotA2: {
        ticketnum: 'ticketnum1samplesample',
        reservedTo: 'testUser@bbmail.com',
        dtBooked: new Date(),
        dtFrom: new Date(),
        dtTo: new Date(),
        slot: {
          name: 'A2',
          type: 'PARKING',
          company: 'Test Inc' //get this from User
        },
        floorplan: {
          name: 'TowerOneFlr1',
          floor: '1',
          building: 'Tower One',
        }
      }
    }
  }
}

class MockSlotTestObjects {
  slots5Unbooked() {
    const w = 26
    const h = 46
    const startx = 23
    const starty = 23
    return [
      new MockSlot('A1', '1', 'Peakaboo Industries', 'Tower One', false, { x:startx*1, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A2', '1', 'Peakaboo Industries', 'Tower One', false, { x:startx*2, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A3', '1', 'Peakaboo Industries', 'Tower One', false, { x:startx*3, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A4', '1', 'Peakaboo Industries', 'Tower One', false, { x:startx*4, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A5', '1', 'Peakaboo Industries', 'Tower One', false, { x:startx*5, y:starty, w, h }, "PARKING").json(),
    ]
  }
  replaceSlots() {
    const w = 32
    const h = 64
    const startx = 56
    const starty = 102
    let out = []
    for (let i=0; i<3; i++) {
      const isBooked = i % 2 == 0 ? true : false
      out.push(new MockSlot(
        `B${i+1}`, 
        '1', 'Test Inc', 'Tower One', 
        isBooked,
        { x: startx + i*w, y: starty, w, h },
        'PARKING'
      ).json()) 
    }
    return out
  }
}

export {
  MockUser,
  MockFloorPlan,
  MockSlot,
  MockBooking,
}
