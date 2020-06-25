import { shallowMount, createLocalVue } from "@vue/test-utils"
import FormSubmitter from "@/components/myTest/FormSubmitter.vue"

describe("FormSubmitter", () => {
	it("Показывает сообщение после отправки", () => {
		const wrapper = shallowMount(FormSubmitter)

		wrapper.find("[data-username]").setValue("Алиса")
		wrapper.find("form").trigger("submit.prevent") //keydown.enter

		expect(wrapper.find(".message").text())
			.toBe("Спасибо за ваше сообщение, Алиса.")
	})
})

describe('FormSubmitter', () => {
	it('should call doSomething() when created', () => {
		const localVue = createLocalVue();

		const doSomething = jest.fn()
		let test = shallowMount(FormSubmitter, {
			// localvue,
			methods: { doSomething }
		});
		expect(test.vm.doSomething).toHaveBeenCalled();
	});
}); 