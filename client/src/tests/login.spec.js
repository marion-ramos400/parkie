
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { 
  describe, 
  expect, 
  test, 
  beforeEach, 
  afterEach,
  it} from 'vitest'
import Login from '../components/Login/Login.vue'

const wrapper = mount(Login)

it('form exists', () => {
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

it('shows error username required if username field is empty', async () => {
  wrapper.find('[placeholder="USERNAME"]').setValue('')
  wrapper.find('[placeholder="PASSWORD"]').setValue('pwd')
  wrapper.find('form').trigger('submit')
  await nextTick()
  expect(wrapper.html()).toContain('Username is required')
})

it('shows error password required if password field is empty', async () => {
  wrapper.find('[placeholder="USERNAME"]').setValue('username')
  wrapper.find('[placeholder="PASSWORD"]').setValue('')
  wrapper.find('form').trigger('submit')
  await nextTick()
  expect(wrapper.html()).toContain('Password is required')
})


it('shows error username and password empty', async () => {
  wrapper.find('[placeholder="USERNAME"]').setValue('')
  wrapper.find('[placeholder="PASSWORD"]').setValue('')
  wrapper.find('form').trigger('submit')
  await nextTick()
  expect(wrapper.html()).toContain('Please fill-up the fields')
})

