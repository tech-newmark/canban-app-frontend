<template>
	<section class="board">
		<article
			v-for="column in columns"
			:key="column.id"
			class="column animate-border"
		>
			<header class="column__header">
				<h2>{{ column.title }}</h2>
				<span>{{ column.tasks.length }}</span>
			</header>

			<ul class="tasks">
				<li v-for="task in column.tasks" :key="task.id" class="task-card">
					<div class="task-card__top">
						<span
							class="task-card__status"
							:class="{
								'task-card__status--urgent': task.taskStatus === 'срочная',
								'task-card__status--normal': task.taskStatus === 'несрочная',
							}"
						>
							{{ task.taskStatus }}
						</span>
						<h3>{{ task.title }}</h3>
					</div>

					<p><strong>Постановщик:</strong> {{ task.creator }}</p>
					<p><strong>Исполнители:</strong> {{ task.assignees.join(", ") }}</p>
					<p><strong>Проект:</strong> {{ task.projectName }}</p>
					<p>
						<strong>Дата постановки:</strong> {{ formatDate(task.createdAt) }}
					</p>

					<button type="button" class="task-card__comment-btn">
						Добавить комментарий
					</button>
				</li>
			</ul>
		</article>
	</section>
</template>

<script setup>
defineProps({
	columns: {
		type: Array,
		required: true,
	},
});

const formatDate = (date) =>
	new Intl.DateTimeFormat("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(date));
</script>

<style scoped lang="scss">
.board {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	grid-template-rows: auto 1fr;
}

.column {
	display: grid;
	grid-template-rows: subgrid;
	grid-row: span 2;
	gap: 0;
	border-radius: 30px;
	background: linear-gradient(155deg, #ffffff 0%, #f1f5f9 52%, #dbeafe 100%);

	&__header {
		grid-row: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 24px;
		// border-bottom: 1px solid var(--primary);
		background-color: var(--accent);
		gap: 0.75rem;

		h2 {
			margin: 0;
			font-size: 16px;
			font-weight: 400;
			color: var(--dark);
		}

		span {
			border-radius: 4px;
			background: #d1d5db;
			padding: 0.15rem 0.55rem;
			font-size: 12px;
			line-height: 1;
			padding: 4px;
			display: flex;
			min-width: 30px;
			align-items: center;
			justify-content: center;
		}
	}
}

.tasks {
	grid-row: 2;
	margin: 0;
	padding: 24px;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.task-card {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px;
	border: 1px solid var(--primary);
	// background: rgb(255 255 255 / 80%);
	border-radius: 8px;

	&__top {
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

	&__status {
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

	&__comment-btn {
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
