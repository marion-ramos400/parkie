
import { mount } from '@vue/test-utils'
import { 
  describe, 
  expect, 
  test, 
  beforeEach, 
  afterEach,
  it} from 'vitest'
import Login from '../components/Login/Login.vue'


test('has form', () => {
  const wrapper = mount(Login)
  const form = wrapper.find('form')
  expect(form.exists()).toBe(true)
  expect(form.find('input').exists()).toBe(true)
//  expect(wrapper.html()).toContain('<form>');
})

//test('form has username and pwd input', () => {
//  const elem = wrapper.find('form')
//  console.log(typeof(elem))
//})

