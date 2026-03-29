import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", () => {
	let taskSequence = 1000;

	const createDefaultDeadline = () => {
		const date = new Date();
		date.setDate(date.getDate() + 7);
		return date.toISOString().split("T")[0];
	};

	const normalizeAssignees = (creator, assignees) => {
		const normalized = Array.isArray(assignees)
			? [...new Set(assignees.filter(Boolean))]
			: [];

		return normalized.length > 0 ? normalized : [creator];
	};

	const ensureTaskFields = (task) => ({
		...task,
		deadline: task.deadline ?? createDefaultDeadline(),
		comments: task.comments ?? [],
		assignees: normalizeAssignees(task.creator, task.assignees),
		description: task.description ?? "",
	});

	const columns = ref([
		{
			id: "in-progress",
			title: "В работе",
			tasks: [
					ensureTaskFields({
						id: "t1",
						title: "Спроектировать структуру проекта",
						taskStatus: "срочная",
						creator: "Иван Иванов",
						assignees: ["Петр Петров", "Анна Смирнова"],
						projectName: "Kanban Frontend",
						createdAt: "2026-03-12",
					}),
					ensureTaskFields({
						id: "t2",
						title: "Подключить роутер и Pinia",
						taskStatus: "несрочная",
						creator: "Петр Петров",
						assignees: ["Анна Смирнова"],
						projectName: "Kanban Frontend",
						createdAt: "2026-03-11",
					}),
			],
		},
		{
			id: "sent-for-clarification",
			title: "Отправлены на уточнение",
			tasks: [
					ensureTaskFields({
						id: "t3",
						title: "Уточнить требования по ролям пользователей",
						taskStatus: "срочная",
						creator: "Дмитрий Васильев",
						assignees: ["Елена Орлова"],
						projectName: "Portal Core",
						createdAt: "2026-03-10",
					}),
					ensureTaskFields({
						id: "t4",
						title: "Согласовать макет карточки задачи",
						taskStatus: "несрочная",
						creator: "Елена Орлова",
						assignees: ["Иван Иванов", "Анна Смирнова"],
						projectName: "UI Redesign",
						createdAt: "2026-03-09",
					}),
			],
		},
		{
			id: "waiting-for-clarification",
			title: "Ожидают уточнения",
			tasks: [
					ensureTaskFields({
						id: "t5",
						title: "Сделать первую доску канбан",
						taskStatus: "несрочная",
						creator: "Иван Иванов",
						assignees: ["Дмитрий Васильев"],
						projectName: "Kanban Frontend",
						createdAt: "2026-03-08",
					}),
			],
		},
		{
			id: "sent-for-review",
			title: "Отправлены на проверку",
			tasks: [
					ensureTaskFields({
						id: "t6",
						title: "Инициализировать Vue 3 + SCSS",
						taskStatus: "срочная",
						creator: "Анна Смирнова",
						assignees: ["Иван Иванов"],
						projectName: "Kanban Frontend",
						createdAt: "2026-03-07",
					}),
			],
		},
		{
			id: "waiting-for-review",
			title: "Ожидают проверки",
			tasks: [
					ensureTaskFields({
						id: "t7",
						title: "Подготовить документацию по роутам",
						taskStatus: "несрочная",
						creator: "Петр Петров",
						assignees: ["Елена Орлова"],
						projectName: "Docs Hub",
						createdAt: "2026-03-06",
					}),
			],
		},
		{
			id: "completed",
			title: "Выполненные",
			tasks: [
					ensureTaskFields({
						id: "t8",
						title: "Создать базовую структуру проекта",
						taskStatus: "несрочная",
						creator: "Дмитрий Васильев",
						assignees: ["Петр Петров"],
						projectName: "Kanban Frontend",
						createdAt: "2026-03-05",
					}),
			],
		},
		{
			id: "paused",
			title: "Приостановленные",
			tasks: [
					ensureTaskFields({
						id: "t9",
						title: "Интеграция API уведомлений",
						taskStatus: "срочная",
						creator: "Елена Орлова",
						assignees: ["Дмитрий Васильев", "Анна Смирнова"],
						projectName: "Notifications",
						createdAt: "2026-03-04",
					}),
			],
		},
	]);

	const findTaskLocation = (taskId) => {
		for (const column of columns.value) {
			const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
			if (taskIndex !== -1) {
				return { column, taskIndex };
			}
		}

		return null;
	};

	const updateTask = (taskId, payload) => {
		const location = findTaskLocation(taskId);
		if (!location) return false;

		const { column, taskIndex } = location;
		const currentTask = column.tasks[taskIndex];
		const targetColumnId = payload.columnId ?? column.id;

		const updatedTask = {
			...currentTask,
			taskStatus: payload.taskStatus ?? currentTask.taskStatus,
			deadline: payload.deadline ?? currentTask.deadline,
			description: payload.description ?? currentTask.description,
			assignees: normalizeAssignees(
				currentTask.creator,
				payload.assignees ?? currentTask.assignees,
			),
		};

		if (targetColumnId === column.id) {
			column.tasks[taskIndex] = updatedTask;
			return true;
		}

		const targetColumn = columns.value.find(
			(item) => item.id === targetColumnId,
		);
		if (!targetColumn) return false;

		column.tasks.splice(taskIndex, 1);
		targetColumn.tasks.unshift(updatedTask);

		return true;
	};

	const addTaskComment = (taskId, commentPayload) => {
		const location = findTaskLocation(taskId);
		if (!location) return false;

		const { column, taskIndex } = location;
		const task = column.tasks[taskIndex];

		const normalizedComment = {
			id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			author: commentPayload.author.trim(),
			text: commentPayload.text.trim(),
			createdAt: new Date().toISOString(),
		};

		task.comments = [normalizedComment, ...(task.comments ?? [])];
		return true;
	};

	const addTask = (payload) => {
		const targetColumn = columns.value.find(
			(column) => column.id === payload.columnId,
		);
		if (!targetColumn) return false;

		taskSequence += 1;

		const task = ensureTaskFields({
			id: `t${taskSequence}`,
			title: payload.title.trim(),
			description: (payload.description ?? "").trim(),
			taskStatus: payload.taskStatus,
			creator: payload.creator.trim(),
			assignees: payload.assignees,
			projectName: payload.projectName.trim(),
			createdAt: new Date().toISOString().split("T")[0],
			deadline: payload.deadline || createDefaultDeadline(),
		});

		targetColumn.tasks.unshift(task);
		return true;
	};

	const totalTasks = computed(() =>
		columns.value.reduce((sum, column) => sum + column.tasks.length, 0),
	);

	return {
		columns,
		totalTasks,
		updateTask,
		addTaskComment,
		addTask,
	};
});
