
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
        password: '123asdzxc',
        company: 'Peakaboo Industries',
      },
      createUserAdmin: {
        email: 'emailTest123456@email.com',
        password: '123asdzxc',
        company: 'Peakaboo Industries',
        isAdmin: true,
      },
      fakeTokenObj: {
        email: 'emailFromToken@ffmail.com',
        id: 'asdfjio12312312ad'
      },
      nonExistentUser: {
        email: 'nonexistent@pmail.com',
        password: 'yi(012)123p**',
        company: 'Test Company'
      },
      shortPassword: {
        email: 'emailTest123456@email.com',
        password: '123asdzxc',
        company: 'Test Company'
      },
      longPassword: {
        email: 'emailTest123456@email.com',
        password: 'thisALong@**paSZWErdRoightHer',
        company: 'Test Company'
      },
      validateUser: {
        email: 'createDelete@email.com',
        password: 'validateCreateDelete',
        company: 'Test Company'
      }
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
  constructor(name, company, isBooked, uiRect, type) {
    super()
    this.name = name
    this.company = company
    this.isBooked = isBooked
    this.uiRect = uiRect
    this.type = type
  }
  json() {
    return JSON.parse(JSON.stringify(this))
  }
  payload() {
    return {
      slotExist: {
        name: 'A1'
      },
      slotNotExist: {
        name: 'BediBadoo'
      }
    }
  }
}

class MockBooking extends MockTestObject{
  dtPlus30min() {
    const old = new Date()
    const diff = 30
    return new Date(old.getTime() + diff*60000)
  }
  payload() {
    return {
      tower1Flr1SlotA2: {
        reservedTo: 'testUser@bbmail.com',
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
      },
      expiredtower1Flr1SlotA2: {
        reservedTo: 'testUser@bbmail.com',
        dtFrom: new Date(),
        dtTo: new Date('2025-10-24T08:00:00Z'),
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
      },
      notExpiredtower1Flr1SlotA2: {
        reservedTo: 'testUser@bbmail.com',
        dtFrom: new Date(),
        dtTo: this.dtPlus30min(),
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
      new MockSlot('A1', 'Peakaboo Industries', false, { x:startx*1, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A2', 'Peakaboo Industries', false, { x:startx*2, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A3', 'Peakaboo Industries', false, { x:startx*3, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A4', 'Peakaboo Industries', false, { x:startx*4, y:starty, w, h }, "PARKING").json(),
      new MockSlot('A5', 'Peakaboo Industries', false, { x:startx*5, y:starty, w, h }, "PARKING").json(),
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
        'Test Inc', 
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
