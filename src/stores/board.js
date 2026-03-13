import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", () => {
	const columns = ref([
		{
			id: "in-progress",
			title: "В работе",
			tasks: [
				{
					id: "t1",
					title: "Спроектировать структуру проекта",
					taskStatus: "срочная",
					creator: "Иванов Иван Иванович",
					assignees: ["Петров Петр Сергеевич", "Смирнова Анна Олеговна"],
					projectName: "Kanban Frontend",
					createdAt: "2026-03-12",
				},
				{
					id: "t2",
					title: "Подключить роутер и Pinia",
					taskStatus: "несрочная",
					creator: "Сидоров Алексей Николаевич",
					assignees: ["Кузнецова Мария Андреевна"],
					projectName: "Kanban Frontend",
					createdAt: "2026-03-11",
				},
			],
		},
		{
			id: "sent-for-clarification",
			title: "Отправлены на уточнение",
			tasks: [
				{
					id: "t3",
					title: "Уточнить требования по ролям пользователей",
					taskStatus: "срочная",
					creator: "Васильев Дмитрий Павлович",
					assignees: ["Орлова Елена Игоревна"],
					projectName: "Portal Core",
					createdAt: "2026-03-10",
				},
				{
					id: "t4",
					title: "Согласовать макет карточки задачи",
					taskStatus: "несрочная",
					creator: "Зайцева Ольга Максимовна",
					assignees: ["Федоров Илья Викторович", "Громова Нина Юрьевна"],
					projectName: "UI Redesign",
					createdAt: "2026-03-09",
				},
			],
		},
		{
			id: "waiting-for-clarification",
			title: "Ожидают уточнения",
			tasks: [
				{
					id: "t5",
					title: "Сделать первую доску канбан",
					taskStatus: "несрочная",
					creator: "Попов Роман Евгеньевич",
					assignees: ["Никитина Алиса Артемовна"],
					projectName: "Kanban Frontend",
					createdAt: "2026-03-08",
				},
			],
		},
		{
			id: "sent-for-review",
			title: "Отправлены на проверку",
			tasks: [
				{
					id: "t6",
					title: "Инициализировать Vue 3 + SCSS",
					taskStatus: "срочная",
					creator: "Егоров Павел Константинович",
					assignees: ["Лебедева Дарья Ильинична"],
					projectName: "Kanban Frontend",
					createdAt: "2026-03-07",
				},
			],
		},
		{
			id: "waiting-for-review",
			title: "Ожидают проверки",
			tasks: [
				{
					id: "t7",
					title: "Подготовить документацию по роутам",
					taskStatus: "несрочная",
					creator: "Крылов Артем Игоревич",
					assignees: ["Соколова Ирина Валерьевна"],
					projectName: "Docs Hub",
					createdAt: "2026-03-06",
				},
			],
		},
		{
			id: "completed",
			title: "Выполненные",
			tasks: [
				{
					id: "t8",
					title: "Создать базовую структуру проекта",
					taskStatus: "несрочная",
					creator: "Морозов Николай Петрович",
					assignees: ["Калинина Алина Сергеевна"],
					projectName: "Kanban Frontend",
					createdAt: "2026-03-05",
				},
			],
		},
		{
			id: "paused",
			title: "Приостановленные",
			tasks: [
				{
					id: "t9",
					title: "Интеграция API уведомлений",
					taskStatus: "срочная",
					creator: "Семенов Андрей Владиславович",
					assignees: ["Ершова Виктория Дмитриевна", "Макаров Денис Павлович"],
					projectName: "Notifications",
					createdAt: "2026-03-04",
				},
			],
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
