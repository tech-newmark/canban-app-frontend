<script setup>
import TaskCardPreview from "./TaskCardPreview.vue";

defineProps({
	columns: {
		type: Array,
		required: true,
	},
});
</script>

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

			<ul class="task-list">
				<li v-for="task in column.tasks" :key="task.id" class="task-list-item">
					<TaskCardPreview :task="task" :column-id="column.id" />
				</li>
			</ul>
		</article>
	</section>
</template>

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

.task-list {
	grid-row: 2;
	margin: 0;
	padding: 24px;
	padding-right: 18px;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
	max-height: 480px;
	overflow: hidden;
	overflow-y: auto;
	scrollbar-gutter: stable;

	&::-webkit-scrollbar {
		background-color: transparent;
		width: 6px;
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: var(--warning);
	}
}
</style>
