<script setup>
import { computed, reactive, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useBoardStore } from "../stores/board";

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true,
	},
	task: {
		type: Object,
		required: true,
	},
	columnId: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["close"]);
const boardStore = useBoardStore();
const authStore = useAuthStore();

const taskStatuses = [
	{ label: "Срочная", value: "срочная" },
	{ label: "Несрочная", value: "несрочная" },
];

const workflowStatuses = computed(() =>
	boardStore.columns.map((column) => ({
		label: column.title,
		value: column.id,
	})),
);

const availableUsers = computed(() => authStore.users);
const canAddComment = computed(() => authStore.isAuthenticated);

const form = reactive({
	taskStatus: "",
	columnId: "",
	deadline: "",
	assignees: [],
});

const commentForm = reactive({
	text: "",
});

watch(
	() => [props.isOpen, props.task, props.columnId],
	([isOpen]) => {
		if (!isOpen) return;

		form.taskStatus = props.task.taskStatus;
		form.columnId = props.columnId;
		form.deadline = props.task.deadline ?? "";
		form.assignees = [...(props.task.assignees ?? [])];
		commentForm.text = "";
	},
	{ immediate: true },
);

const sortedComments = computed(() => props.task.comments ?? []);

const formatDate = (date) =>
	new Intl.DateTimeFormat("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(date));

const formatDateTime = (date) =>
	new Intl.DateTimeFormat("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));

const closeModal = () => emit("close");

const submitTaskChanges = () => {
	boardStore.updateTask(props.task.id, {
		taskStatus: form.taskStatus,
		columnId: form.columnId,
		deadline: form.deadline,
		assignees: [...form.assignees],
	});

	closeModal();
};

const submitComment = () => {
	if (!canAddComment.value || !commentForm.text.trim()) return;

	boardStore.addTaskComment(props.task.id, {
		author: authStore.activeUserName,
		text: commentForm.text,
	});

	commentForm.text = "";
};
</script>

<template>
	<Teleport to="body">
		<div v-if="isOpen" class="task-modal" @click.self="closeModal">
			<div class="task-modal__dialog">
				<header class="task-modal__header">
					<h2>{{ task.title }}</h2>
					<button class="task-modal__close" @click="closeModal">×</button>
				</header>

				<section class="task-modal__description-wrap">
					<h3>Описание</h3>
					<p class="task-modal__description">
						{{ task.description || "Описание не заполнено" }}
					</p>
				</section>

				<div class="task-modal__content">
					<form class="task-modal__form" @submit.prevent="submitTaskChanges">
						<div class="task-modal__meta">
							<p><strong>Постановщик:</strong> {{ task.creator }}</p>
							<p><strong>Проект:</strong> {{ task.projectName }}</p>
							<p><strong>Дата постановки:</strong> {{ formatDate(task.createdAt) }}</p>
						</div>

						<label class="task-modal__field">
							<span>Срочность</span>
							<select v-model="form.taskStatus">
								<option
									v-for="status in taskStatuses"
									:key="status.value"
									:value="status.value"
								>
									{{ status.label }}
								</option>
							</select>
						</label>

						<label class="task-modal__field">
							<span>Статус задачи</span>
							<select v-model="form.columnId">
								<option
									v-for="status in workflowStatuses"
									:key="status.value"
									:value="status.value"
								>
									{{ status.label }}
								</option>
							</select>
						</label>

						<label class="task-modal__field">
							<span>Дедлайн</span>
							<input v-model="form.deadline" type="date" />
						</label>

						<fieldset class="task-modal__assignees">
							<legend>Исполнители</legend>
							<label
								v-for="user in availableUsers"
								:key="user.id"
								class="task-modal__assignee-item"
							>
								<input
									v-model="form.assignees"
									type="checkbox"
									:value="user.fullName"
								/>
								<span>{{ user.fullName }}</span>
							</label>
						</fieldset>

						<div class="task-modal__actions">
							<button type="submit">Сохранить изменения</button>
						</div>
					</form>

					<aside class="task-modal__comments">
						<h3>Комментарии</h3>

						<form class="task-modal__comment-form" @submit.prevent="submitComment">
							<p class="task-modal__comment-author">
								Автор: {{ authStore.activeUserName }}
							</p>
							<textarea
								v-model="commentForm.text"
								rows="4"
								placeholder="Добавьте комментарий"
							></textarea>
							<p v-if="!canAddComment" class="task-modal__comment-hint">
								Для добавления комментария нужно войти в систему.
							</p>
							<button type="submit" :disabled="!canAddComment">
								Добавить комментарий
							</button>
						</form>

						<ul class="task-modal__comment-list">
							<li
								v-for="comment in sortedComments"
								:key="comment.id"
								class="task-modal__comment-item"
							>
								<p>{{ comment.text }}</p>
								<div>
									<strong>{{ comment.author }}</strong>
									<span>{{ formatDateTime(comment.createdAt) }}</span>
								</div>
							</li>
							<li
								v-if="sortedComments.length === 0"
								class="task-modal__comment-empty"
							>
								Комментариев пока нет
							</li>
						</ul>
					</aside>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<style scoped lang="scss">
.task-modal {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background: rgb(15 23 42 / 58%);

	&__dialog {
		width: min(960px, 100%);
		max-height: 90vh;
		overflow: auto;
		border-radius: 14px;
		background: #fff;
		box-shadow: 0 22px 60px rgb(0 0 0 / 24%);
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #e2e8f0;

		h2 {
			margin: 0;
			font-size: 1rem;
		}
	}

	&__close {
		border: 0;
		background: transparent;
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
		color: #64748b;
	}

	&__content {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 1rem;
		padding: 1rem 1.25rem 1.25rem;
	}

	&__description-wrap {
		padding: 0.85rem 1.25rem 0;

		h3 {
			margin: 0 0 0.35rem;
			font-size: 0.88rem;
			color: #334155;
		}
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	&__meta {
		padding: 0.75rem;
		border-radius: 8px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;

		p {
			margin: 0;
			font-size: 0.85rem;
			color: #334155;
		}
	}

	&__field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;

		span {
			font-size: 0.85rem;
			font-weight: 600;
			color: #334155;
		}

		select,
		input {
			border: 1px solid #cbd5e1;
			border-radius: 8px;
			padding: 0.55rem 0.7rem;
			font-size: 0.9rem;
		}
	}

	&__description {
		margin: 0;
		padding: 0.55rem 0.7rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: #f8fafc;
		font-size: 0.9rem;
		color: #334155;
		line-height: 1.4;
		white-space: pre-wrap;
	}

	&__assignees {
		margin: 0;
		padding: 0.65rem 0.75rem;
		border-radius: 8px;
		border: 1px solid #cbd5e1;
		display: grid;
		gap: 0.45rem;

		legend {
			padding: 0 0.2rem;
			font-size: 0.85rem;
			font-weight: 600;
			color: #334155;
		}
	}

	&__assignee-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: #334155;
	}

	&__actions button,
	&__comment-form button {
		border: 0;
		border-radius: 8px;
		background: var(--primary);
		padding: 0.55rem 0.85rem;
		color: #fff;
		font-size: 0.9rem;
		cursor: pointer;
	}

	&__comment-form button:disabled {
		background: #94a3b8;
		cursor: not-allowed;
	}

	&__comments {
		border-left: 1px solid #e2e8f0;
		padding-left: 1rem;

		h3 {
			margin: 0 0 0.75rem;
			font-size: 0.95rem;
		}
	}

	&__comment-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;

		textarea {
			border: 1px solid #cbd5e1;
			border-radius: 8px;
			padding: 0.55rem 0.7rem;
			font-size: 0.85rem;
			font-family: inherit;
			resize: vertical;
		}
	}

	&__comment-author {
		margin: 0;
		font-size: 0.8rem;
		color: #334155;
	}

	&__comment-hint {
		margin: 0;
		font-size: 0.78rem;
		color: #b45309;
	}

	&__comment-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		max-height: 360px;
		overflow: auto;
	}

	&__comment-item {
		padding: 0.6rem;
		border-radius: 8px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;

		p {
			margin: 0 0 0.4rem;
			font-size: 0.85rem;
			line-height: 1.35;
			white-space: pre-wrap;
		}

		div {
			display: flex;
			justify-content: space-between;
			gap: 0.5rem;
			font-size: 0.75rem;
			color: #64748b;
		}

		strong {
			color: #334155;
		}
	}

	&__comment-empty {
		padding: 0.6rem;
		border-radius: 8px;
		background: #f8fafc;
		border: 1px dashed #cbd5e1;
		font-size: 0.8rem;
		color: #64748b;
	}
}

@media (max-width: 900px) {
	.task-modal {
		&__content {
			grid-template-columns: 1fr;
		}

		&__comments {
			border-left: 0;
			border-top: 1px solid #e2e8f0;
			padding-top: 0.75rem;
			padding-left: 0;
		}
	}
}
</style>
