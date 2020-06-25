import { shallowMount } from "@vue/test-utils"
import NumberRenderer from "@/components/myTest/NumberRenderer.vue"

describe("NumberRenderer", () => {
  it("выводит чётные числа", () => {
    const wrapper = shallowMount(NumberRenderer, {
      propsData: {
        even: true
      }
    })

    expect(wrapper.text()).toBe("2, 4, 6, 8")
  })
  it("выводит нечётные числа", () => {
    const localThis = { even: false }
  
    expect(NumberRenderer.computed.numbers.call(localThis)).toBe("1, 3, 5, 7, 9")
  })
})