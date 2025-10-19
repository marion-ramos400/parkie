
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
      floorPlan1Shimmy: {
        name: 'ShimmyTowerFlr1',
        floor: 1,
        building: 'Shimmy Tower',
        slots: new MockSlotTestObjects().slots5Unbooked()
      }
    }
  }
}

class MockSlot extends MockTestObject {
  constructor(name, floor, company, building, isBooked, uiRect) {
    super()
    this.name = name
    this.floor = floor
    this.company = company
    this.building =  building
    this.isBooked = isBooked
    this.uiRect = uiRect
  }
  json() {
    return JSON.parse(JSON.stringify(this))
  }
}

class MockBooking extends MockTestObject{

}

class MockSlotTestObjects {
  slots5Unbooked() {
    const w = 26
    const h = 46
    const startx = 23
    const starty = 23
    return [
      new MockSlot('A1', 1, 'Peakaboo Industries', 'Shimmy Tower', false, { x:startx*1, y:starty, w, h }).json(),
      new MockSlot('A2', 1, 'Peakaboo Industries', 'Shimmy Tower', false, { x:startx*2, y:starty, w, h }).json(),
      new MockSlot('A3', 1, 'Peakaboo Industries', 'Shimmy Tower', false, { x:startx*3, y:starty, w, h }).json(),
      new MockSlot('A4', 1, 'Peakaboo Industries', 'Shimmy Tower', false, { x:startx*4, y:starty, w, h }).json(),
      new MockSlot('A5', 1, 'Peakaboo Industries', 'Shimmy Tower', false, { x:startx*5, y:starty, w, h }).json(),
    ]
  }
}

export {
  MockUser,
  MockFloorPlan,
  MockSlot,
  MockBooking,
}
