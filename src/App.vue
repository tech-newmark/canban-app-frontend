<script setup>
import { reactive, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

const isLoginModalOpen = ref(false);
const errorMessage = ref("");

const form = reactive({
	login: "",
	password: "",
});

const openLoginModal = () => {
	errorMessage.value = "";
	form.login = "";
	form.password = "";
	isLoginModalOpen.value = true;
};

const closeLoginModal = () => {
	isLoginModalOpen.value = false;
};

const submitLogin = () => {
	const result = authStore.login({
		login: form.login,
		password: form.password,
	});

	if (!result.ok) {
		errorMessage.value = result.error;
		return;
	}

	closeLoginModal();
};

const onAuthButtonClick = () => {
	if (authStore.isAuthenticated) {
		authStore.logout();
		return;
	}

	openLoginModal();
};
</script>

<template>
	<div class="app-layout">
		<header class="app-header">
			<div class="app-header__left">
				<h1>Canban App</h1>
				<nav class="nav">
					<RouterLink to="/">Главная страница</RouterLink>
					<RouterLink to="/docs">Документация</RouterLink>
				</nav>
			</div>

			<div class="app-header__auth">
				<p class="app-header__user">
					Пользователь: {{ authStore.activeUserName }}
				</p>
				<button class="app-header__auth-btn" @click="onAuthButtonClick">
					{{ authStore.isAuthenticated ? "Выйти" : "Войти" }}
				</button>
			</div>
		</header>

		<main class="app-content">
			<RouterView />
		</main>

		<Teleport to="body">
			<div
				v-if="isLoginModalOpen"
				class="auth-modal"
				@click.self="closeLoginModal"
			>
				<div class="auth-modal__dialog">
					<header class="auth-modal__header">
						<h2>Авторизация</h2>
						<button class="auth-modal__close" @click="closeLoginModal">
							×
						</button>
					</header>

					<div class="auth-modal__body">
						<p class="auth-modal__hint">Логин: имя и фамилия. Пароль: 123456</p>

						<form class="auth-modal__form" @submit.prevent="submitLogin">
							<label>
								<span>Логин</span>
								<input
									v-model="form.login"
									type="text"
									placeholder="Например: Иван Иванов"
								/>
							</label>

							<label>
								<span>Пароль</span>
								<input
									v-model="form.password"
									type="password"
									placeholder="Введите пароль"
								/>
							</label>

							<p v-if="errorMessage" class="auth-modal__error">
								{{ errorMessage }}
							</p>

							<button type="submit">Войти</button>
						</form>

						<div class="auth-modal__users">
							<h3>Список пользователей</h3>
							<ul>
								<li v-for="user in authStore.users" :key="user.id">
									{{ user.fullName }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<style scoped lang="scss">
.app-layout {
	min-height: 100vh;
}

.app-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 3rem;
	padding: 1rem 1.5rem;
	background: #111827;
	color: #fff;

	&__left {
		display: flex;
		align-items: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	&__auth {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	&__user {
		margin: 0;
		font-size: 0.9rem;
		color: #e2e8f0;
	}

	&__auth-btn {
		border: 1px solid #60a5fa;
		border-radius: 8px;
		padding: 0.45rem 0.8rem;
		background: transparent;
		color: #dbeafe;
		cursor: pointer;
		font-size: 0.9rem;
	}

	h1 {
		margin: 0;
		font-size: 1.25rem;
	}

	a {
		color: #ffffff;
		text-decoration: none;
		font-weight: 400;
	}
}

.nav {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.app-content {
	padding: 1.25rem;
}

.auth-modal {
	position: fixed;
	inset: 0;
	z-index: 1200;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background: rgb(15 23 42 / 60%);

	&__dialog {
		width: min(560px, 100%);
		border-radius: 14px;
		background: #fff;
		box-shadow: 0 20px 56px rgb(0 0 0 / 26%);
	}

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e2e8f0;
		padding: 0.9rem 1.1rem;

		h2 {
			margin: 0;
			font-size: 1rem;
			color: #1e293b;
		}
	}

	&__close {
		border: 0;
		background: transparent;
		font-size: 1.5rem;
		line-height: 1;
		color: #64748b;
		cursor: pointer;
	}

	&__body {
		padding: 1rem 1.1rem 1.2rem;
		display: grid;
		gap: 1rem;
	}

	&__hint {
		margin: 0;
		font-size: 0.85rem;
		color: #475569;
	}

	&__form {
		display: grid;
		gap: 0.75rem;

		label {
			display: grid;
			gap: 0.35rem;

			span {
				font-size: 0.85rem;
				font-weight: 600;
				color: #334155;
			}
		}

		input {
			border: 1px solid #cbd5e1;
			border-radius: 8px;
			padding: 0.55rem 0.7rem;
			font-size: 0.9rem;
		}

		button {
			justify-self: start;
			border: 0;
			border-radius: 8px;
			background: var(--primary);
			color: #fff;
			padding: 0.55rem 0.95rem;
			cursor: pointer;
		}
	}

	&__error {
		margin: 0;
		color: #b91c1c;
		font-size: 0.85rem;
	}

	&__users {
		border-top: 1px solid #e2e8f0;
		padding-top: 0.8rem;

		h3 {
			margin: 0 0 0.45rem;
			font-size: 0.95rem;
			color: #1e293b;
		}

		ul {
			margin: 0;
			padding-left: 1.1rem;
			display: grid;
			gap: 0.3rem;
			color: #334155;
			font-size: 0.9rem;
		}
	}
}

@media (max-width: 720px) {
	.app-header {
		flex-direction: column;
		align-items: flex-start;

		&__auth {
			width: 100%;
			justify-content: space-between;
		}
	}
}
</style>
