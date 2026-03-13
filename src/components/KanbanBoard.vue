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
					{{ task.title }}
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
	display: grid;
	gap: 16px;
}

.task-card {
	display: flex;
	align-items: center;
	height: fit-content;
	min-height: 40px;
	padding-left: 12px;
	border-left: 2px solid var(--primary);
}
</style>
