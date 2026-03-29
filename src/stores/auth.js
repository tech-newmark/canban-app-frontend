import { computed, ref } from "vue";
import { defineStore } from "pinia";

const APP_PASSWORD = "123456";

export const useAuthStore = defineStore("auth", () => {
	const users = ref([
		{ id: "u1", fullName: "Иван Иванов" },
		{ id: "u2", fullName: "Петр Петров" },
		{ id: "u3", fullName: "Анна Смирнова" },
		{ id: "u4", fullName: "Елена Орлова" },
		{ id: "u5", fullName: "Дмитрий Васильев" },
	]);

	const activeUser = ref(null);

	const isAuthenticated = computed(() => Boolean(activeUser.value));
	const activeUserName = computed(() =>
		activeUser.value ? activeUser.value.fullName : "Гость",
	);

	const normalizeLogin = (value) => value.trim().replace(/\s+/g, " ");

	const login = ({ login: rawLogin, password }) => {
		const login = normalizeLogin(rawLogin);

		if (!login) {
			return {
				ok: false,
				error: "Введите логин в формате «Имя Фамилия».",
			};
		}

		const parts = login.split(" ");
		if (parts.length !== 2 || parts.some((item) => !item.trim())) {
			return {
				ok: false,
				error: "Логин должен содержать только имя и фамилию.",
			};
		}

		const matchedUser = users.value.find(
			(user) => user.fullName.toLowerCase() === login.toLowerCase(),
		);

		if (!matchedUser) {
			return {
				ok: false,
				error: "Пользователь с таким логином не найден.",
			};
		}

		if (password !== APP_PASSWORD) {
			return {
				ok: false,
				error: "Неверный пароль. Используйте 123456.",
			};
		}

		activeUser.value = matchedUser;
		return { ok: true };
	};

	const logout = () => {
		activeUser.value = null;
	};

	return {
		users,
		activeUser,
		activeUserName,
		isAuthenticated,
		login,
		logout,
	};
});
