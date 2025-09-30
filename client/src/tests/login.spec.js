
import { mount } from '@vue/test-utils'
import { 
  describe, 
  expect, 
  test, 
  beforeEach, 
  afterEach,
  it} from 'vitest'
import Login from '../components/Login/Login.vue'

const wrapper = mount(Login)

test('form exists', () => {
  const form = wrapper.find('form')
  expect(form.exists()).toBe(true)
  expect(form.find('input').exists()).toBe(true)
})

it('has 2 inputs', () => {
  const form = wrapper.find('form')
  expect(form.findAll('input').length).toBe(2)
})

it('div container class is login', () => {
  const div = wrapper.find('div')
  expect(div.classes('login')).toBe(true)
})


