import { shallowMount, mount } from '@vue/test-utils'
import Greeting from '@/components/myTest/Greeting.vue'
import Parent from '@/components/myTest/Parent.vue'
import Child from '@/components/myTest/Child.vue'

describe('Greeting.vue', () => {
  it('отрисовывает приветствие', () => {
    const wrapper = mount(Greeting)
    expect(wrapper.text()).toMatch("Vue и TDD")
    // console.log(wrapper.html())
  })
})

describe('Parent.vue', () => {
  it('Проверка Parent', () => {
    const shallowWrapper = shallowMount(Parent)
    const mountWrapper = mount(Parent)

    // console.log(shallowWrapper.html())
    // console.log(mountWrapper.html())
  })
})

const msg = "Войти"
const factory = (propsData) => {
  return shallowMount(Child, {
    propsData: {
      msg,
      ...propsData
    }
  })
}

describe("Child.vue", () => {
  describe("Нет привилегий администратора", ()=> {
    it("Выводит верное сообщение", () => {
      const wrapper = factory()

      expect(wrapper.find("span").text()).toBe("Не авторизован")
      expect(wrapper.find("button").text()).toBe("Войти")
    })
  })

  describe("Есть привилегии администратора", ()=> {
    it("Выводит верное сообщение", () => {
      const wrapper = factory({ isAdmin: true })

      expect(wrapper.find("span").text()).toBe("Привилегии администратора")
      expect(wrapper.find("button").text()).toBe("Войти")
    })
  })
})