import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", () => {
	const columns = ref([
		{
			id: "in-progress",
			title: "В работе",
			tasks: [
				{ id: "t1", title: "Спроектировать структуру проекта" },
				{ id: "t2", title: "Подключить роутер и Pinia" },
			],
		},
		{
			id: "sent-for-clarification",
			title: "Отправлены на уточнение",
			tasks: [
				{ id: "t1", title: "Спроектировать структуру проекта" },
				{ id: "t2", title: "Подключить роутер и Pinia" },
			],
		},
		{
			id: "waiting-for-clarification",
			title: "Ожидают уточнения",
			tasks: [{ id: "t3", title: "Сделать первую доску канбан" }],
		},
		{
			id: "sent-for-review",
			title: "Отправлены на проверку",
			tasks: [{ id: "t4", title: "Инициализировать Vue 3 + SCSS" }],
		},
		{
			id: "waiting-for-review",
			title: "Ожидают проверки",
			tasks: [{ id: "t4", title: "Инициализировать Vue 3 + SCSS" }],
		},
		{
			id: "completed",
			title: "Выполненные",
			tasks: [{ id: "t4", title: "Инициализировать Vue 3 + SCSS" }],
		},
		{
			id: "paused",
			title: "Приостановленные",
			tasks: [{ id: "t4", title: "Инициализировать Vue 3 + SCSS" }],
		},
	]);

	const totalTasks = computed(() =>
		columns.value.reduce((sum, column) => sum + column.tasks.length, 0),
	);

	return {
		columns,
		totalTasks,
	};
});
