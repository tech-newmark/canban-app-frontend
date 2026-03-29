<script setup>
import { ref } from "vue";
import TaskCardDetail from "./TaskCardDetail.vue";

defineProps({
	task: {
		type: Object,
		required: true,
	},
	columnId: {
		type: String,
		required: true,
	},
});

const isDetailOpen = ref(false);

const formatDate = (date) =>
	new Intl.DateTimeFormat("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(date));
</script>

<template>
	<div class="task-card-preview">
		<div class="task-card-preview-top">
			<span
				class="task-card-preview-status"
				:class="{
					'task-card-preview-status--urgent': task.taskStatus === 'срочная',
					'task-card-preview-status--normal': task.taskStatus === 'несрочная',
				}"
			>
				{{ task.taskStatus }}
			</span>
			<h3>{{ task.title }}</h3>
		</div>

		<p><strong>Постановщик:</strong> {{ task.creator }}</p>
		<p><strong>Исполнители:</strong> {{ task.assignees.join(", ") }}</p>
		<p><strong>Проект:</strong> {{ task.projectName }}</p>
		<p><strong>Дата постановки:</strong> {{ formatDate(task.createdAt) }}</p>
		<p><strong>Дедлайн:</strong> {{ formatDate(task.deadline) }}</p>
		<button
			class="task-card-preview-detail"
			@click="isDetailOpen = !isDetailOpen"
		>
			Подробнее
		</button>

		<TaskCardDetail
			:is-open="isDetailOpen"
			:task="task"
			:column-id="columnId"
			@close="isDetailOpen = !isDetailOpen"
		/>
	</div>
</template>

<style scoped lang="scss">
.task-card-preview {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px;
	border: 1px solid var(--primary);
	border-radius: 8px;

	&-top {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	h3 {
		margin: 0;
		font-size: 14px;
		line-height: 1.35;
	}

	p {
		margin: 0;
		font-size: 12px;
		line-height: 1.4;
		color: var(--dark);
	}

	&-status {
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 11px;
		line-height: 1.3;
		white-space: nowrap;

		&--urgent {
			background: rgb(239 68 68 / 20%);
			color: #b91c1c;
		}

		&--normal {
			background: rgb(100 116 139 / 18%);
			color: #334155;
		}
	}

	&-detail {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 6px;
		border: 1px solid var(--primary);
		border-radius: 6px;
		background: transparent;
		color: var(--primary);
		font-size: 12px;
		padding: 6px 10px;
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover {
			background: rgb(59 130 246 / 12%);
		}
	}
}
</style>
