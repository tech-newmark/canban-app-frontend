<template>
  <section class="board-view">
    <div v-if="authStore.isAuthenticated" class="board-view__meta">
      <button class="board-view__create-btn" type="button" @click="openCreateTaskModal">
        Новая задача
      </button>

      <p>Всего задач: {{ visibleTasksCount }}</p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="board-auth">
      <h2>Войдите в систему</h2>
      <p>Чтобы увидеть канбан, авторизуйтесь по логину и паролю.</p>

      <form class="board-auth__form" @submit.prevent="submitLogin">
        <label>
          <span>Логин</span>
          <input v-model="loginForm.login" type="text" placeholder="Имя Фамилия" />
        </label>

        <label>
          <span>Пароль</span>
          <input v-model="loginForm.password" type="password" placeholder="123456" />
        </label>

        <p v-if="loginError" class="board-auth__error">{{ loginError }}</p>
        <button type="submit">Войти</button>
      </form>

      <div class="board-auth__users">
        <h3>Доступные пользователи</h3>
        <ul>
          <li v-for="user in authStore.users" :key="user.id">{{ user.fullName }}</li>
        </ul>
      </div>
    </div>

    <template v-else>
      <div class="board-filters">
        <label class="board-filters__field">
          <span>Проект</span>
          <select v-model="filters.projectName">
            <option value="">Все проекты</option>
            <option v-for="project in projectOptions" :key="project" :value="project">
              {{ project }}
            </option>
          </select>
        </label>

        <label class="board-filters__field">
          <span>Исполнитель</span>
          <select v-model="filters.assignee">
            <option value="">Все исполнители</option>
            <option v-for="user in assigneeOptions" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </label>

        <label class="board-filters__field">
          <span>Срочность</span>
          <select v-model="filters.taskStatus">
            <option value="">Любая</option>
            <option value="срочная">Срочная</option>
            <option value="несрочная">Несрочная</option>
          </select>
        </label>

        <label class="board-filters__field">
          <span>Постановщик</span>
          <select v-model="filters.creator">
            <option value="">Все постановщики</option>
            <option v-for="creator in creatorOptions" :key="creator" :value="creator">
              {{ creator }}
            </option>
          </select>
        </label>

        <label class="board-filters__field">
          <span>Дедлайн от</span>
          <input v-model="filters.deadlineFrom" type="date" />
        </label>

        <label class="board-filters__field">
          <span>Дедлайн до</span>
          <input v-model="filters.deadlineTo" type="date" />
        </label>

        <button class="board-filters__reset" type="button" @click="resetFilters">
          Сбросить фильтры
        </button>
      </div>

      <KanbanBoard :columns="visibleColumns" />
    </template>

    <Teleport to="body">
      <div
        v-if="authStore.isAuthenticated && isCreateTaskOpen"
        class="task-create-modal"
        @click.self="closeCreateTaskModal"
      >
        <div class="task-create-modal__dialog">
          <header class="task-create-modal__header">
            <h3>Создание задачи</h3>
            <button type="button" class="task-create-modal__close" @click="closeCreateTaskModal">×</button>
          </header>

          <form class="task-create" @submit.prevent="submitCreateTask">
            <label class="task-create__field">
              <span>Название</span>
              <input v-model="createTaskForm.title" type="text" placeholder="Введите название задачи" />
            </label>

            <label class="task-create__field">
              <span>Описание</span>
              <textarea
                v-model="createTaskForm.description"
                rows="3"
                placeholder="Описание задачи"
              ></textarea>
            </label>

            <label class="task-create__field">
              <span>Проект</span>
              <select v-model="createTaskForm.selectedProject">
                <option value="">Выберите проект</option>
                <option v-for="project in projectOptions" :key="project" :value="project">
                  {{ project }}
                </option>
                <option value="__new__">+ Новый проект</option>
              </select>
            </label>

            <label v-if="createTaskForm.selectedProject === '__new__'" class="task-create__field">
              <span>Новый проект</span>
              <input
                v-model="createTaskForm.newProjectName"
                type="text"
                placeholder="Введите название нового проекта"
              />
            </label>

            <label class="task-create__field">
              <span>Срочность</span>
              <select v-model="createTaskForm.taskStatus">
                <option value="срочная">Срочная</option>
                <option value="несрочная">Несрочная</option>
              </select>
            </label>

            <label class="task-create__field">
              <span>Дедлайн</span>
              <input v-model="createTaskForm.deadline" type="date" />
            </label>

            <fieldset class="task-create__assignees">
              <legend>Исполнители</legend>
              <label v-for="user in authStore.users" :key="user.id" class="task-create__assignee-item">
                <input v-model="createTaskForm.assignees" type="checkbox" :value="user.fullName" />
                <span>{{ user.fullName }}</span>
              </label>
            </fieldset>

            <p v-if="createTaskError" class="task-create__error">{{ createTaskError }}</p>

            <div class="task-create__actions">
              <button class="task-create__submit" type="submit">Добавить задачу</button>
              <button class="task-create__cancel" type="button" @click="closeCreateTaskModal">
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import KanbanBoard from '../components/KanbanBoard.vue';
import { useBoardStore } from '../stores/board';
import { useAuthStore } from '../stores/auth';

const boardStore = useBoardStore();
const authStore = useAuthStore();

const filters = reactive({
  projectName: '',
  assignee: '',
  taskStatus: '',
  creator: '',
  deadlineFrom: '',
  deadlineTo: '',
});

const loginForm = reactive({
  login: '',
  password: '',
});

const loginError = ref('');
const createTaskError = ref('');
const isCreateTaskOpen = ref(false);

const createTaskForm = reactive({
  title: '',
  description: '',
  selectedProject: '',
  newProjectName: '',
  taskStatus: 'несрочная',
  deadline: '',
  assignees: [],
});

const isRelatedTask = (task, fullName) =>
  task.creator === fullName || task.assignees.includes(fullName);

const urgencyOrder = {
  срочная: 0,
  несрочная: 1,
};

const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const urgencyA = urgencyOrder[a.taskStatus] ?? 99;
    const urgencyB = urgencyOrder[b.taskStatus] ?? 99;

    if (urgencyA !== urgencyB) {
      return urgencyA - urgencyB;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const allTasks = computed(() => boardStore.columns.flatMap((column) => column.tasks));

const projectOptions = computed(() =>
  [...new Set(allTasks.value.map((task) => task.projectName))].sort(),
);

const creatorOptions = computed(() =>
  [...new Set(allTasks.value.map((task) => task.creator))].sort(),
);

const assigneeOptions = computed(() =>
  [...new Set(allTasks.value.flatMap((task) => task.assignees))].sort(),
);

const isTaskMatchedByFilters = (task) => {
  if (filters.projectName && task.projectName !== filters.projectName) return false;
  if (filters.assignee && !task.assignees.includes(filters.assignee)) return false;
  if (filters.taskStatus && task.taskStatus !== filters.taskStatus) return false;
  if (filters.creator && task.creator !== filters.creator) return false;

  if (filters.deadlineFrom && task.deadline < filters.deadlineFrom) return false;
  if (filters.deadlineTo && task.deadline > filters.deadlineTo) return false;

  return true;
};

const visibleColumns = computed(() => {
  if (!authStore.activeUser) {
    return boardStore.columns.map((column) => ({
      ...column,
      tasks: [],
    }));
  }

  const fullName = authStore.activeUser.fullName;

  return boardStore.columns.map((column) => ({
    ...column,
    tasks: sortTasks(
      column.tasks
        .filter((task) => isRelatedTask(task, fullName))
        .filter((task) => isTaskMatchedByFilters(task)),
    ),
  }));
});

const visibleTasksCount = computed(() =>
  visibleColumns.value.reduce((sum, column) => sum + column.tasks.length, 0),
);

const resetFilters = () => {
  filters.projectName = '';
  filters.assignee = '';
  filters.taskStatus = '';
  filters.creator = '';
  filters.deadlineFrom = '';
  filters.deadlineTo = '';
};

const submitLogin = () => {
  loginError.value = '';

  const result = authStore.login({
    login: loginForm.login,
    password: loginForm.password,
  });

  if (!result.ok) {
    loginError.value = result.error;
    return;
  }

  loginForm.password = '';
};

const resetCreateTaskForm = () => {
  createTaskForm.title = '';
  createTaskForm.description = '';
  createTaskForm.selectedProject = '';
  createTaskForm.newProjectName = '';
  createTaskForm.taskStatus = 'несрочная';
  createTaskForm.deadline = '';
  createTaskForm.assignees = [];
};

const openCreateTaskModal = () => {
  createTaskError.value = '';
  isCreateTaskOpen.value = true;
};

const closeCreateTaskModal = () => {
  isCreateTaskOpen.value = false;
};

const submitCreateTask = () => {
  createTaskError.value = '';

  if (!createTaskForm.title.trim()) {
    createTaskError.value = 'Укажите название задачи.';
    return;
  }

  if (!createTaskForm.description.trim()) {
    createTaskError.value = 'Укажите описание задачи.';
    return;
  }

  if (!createTaskForm.selectedProject) {
    createTaskError.value = 'Выберите проект или добавьте новый.';
    return;
  }

  const projectName =
    createTaskForm.selectedProject === '__new__'
      ? createTaskForm.newProjectName.trim()
      : createTaskForm.selectedProject;

  if (!projectName) {
    createTaskError.value = 'Укажите название нового проекта.';
    return;
  }

  const result = boardStore.addTask({
    title: createTaskForm.title,
    description: createTaskForm.description,
    projectName,
    taskStatus: createTaskForm.taskStatus,
    columnId: 'in-progress',
    deadline: createTaskForm.deadline,
    creator: authStore.activeUserName,
    assignees: createTaskForm.assignees,
  });

  if (!result) {
    createTaskError.value = 'Не удалось создать задачу.';
    return;
  }

  resetCreateTaskForm();
  closeCreateTaskModal();
};
</script>

<style scoped lang="scss">
.board-view__meta {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  p {
    margin: 0;
    font-weight: 600;
  }
}

.board-view__create-btn {
  border: 0;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}

.board-auth {
  max-width: 520px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: grid;
  gap: 0.8rem;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #0f172a;
  }

  p {
    margin: 0;
    color: #475569;
    font-size: 0.9rem;
  }

  &__form {
    display: grid;
    gap: 0.7rem;

    label {
      display: grid;
      gap: 0.3rem;
    }

    span {
      font-size: 0.82rem;
      color: #334155;
      font-weight: 600;
    }

    input {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.9rem;
      padding: 0.5rem 0.65rem;
      background: #fff;
    }

    button {
      justify-self: start;
      border: 0;
      border-radius: 8px;
      background: var(--primary);
      color: #fff;
      font-size: 0.9rem;
      padding: 0.5rem 0.8rem;
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
    padding-top: 0.7rem;

    h3 {
      margin: 0 0 0.35rem;
      font-size: 0.95rem;
      color: #1e293b;
    }

    ul {
      margin: 0;
      padding-left: 1.1rem;
      display: grid;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #334155;
    }
  }
}

.task-create-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(15 23 42 / 60%);

  &__dialog {
    width: min(860px, 100%);
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 20px 56px rgb(0 0 0 / 26%);
    max-height: 90vh;
    overflow: auto;
  }

  &__header {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 1rem;
      color: #0f172a;
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
}

.task-create {
  padding: 0.85rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.75rem;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    span {
      font-size: 0.8rem;
      color: #334155;
      font-weight: 600;
    }
  }

  &__field input,
  &__field select,
  &__field textarea {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    padding: 0.45rem 0.6rem;
    background: #fff;
  }

  &__field textarea {
    resize: vertical;
    font-family: inherit;
  }

  &__assignees {
    margin: 0;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    padding: 0.55rem 0.65rem;
    display: grid;
    gap: 0.35rem;

    legend {
      font-size: 0.8rem;
      font-weight: 600;
      color: #334155;
      padding: 0 0.2rem;
    }
  }

  &__assignee-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.86rem;
    color: #334155;
  }

  &__error {
    grid-column: 1 / -1;
    margin: 0;
    color: #b91c1c;
    font-size: 0.85rem;
  }

  &__actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }

  &__submit,
  &__cancel {
    border: 0;
    border-radius: 8px;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.5rem 0.85rem;
    cursor: pointer;
  }

  &__submit {
    background: #0f766e;
  }

  &__cancel {
    background: #64748b;
  }
}

.board-filters {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    span {
      font-size: 0.8rem;
      color: #334155;
      font-weight: 600;
    }
  }

  &__field select,
  &__field input {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    padding: 0.45rem 0.6rem;
    background: #fff;
  }

  &__reset {
    align-self: end;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #334155;
    font-size: 0.88rem;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
  }
}
</style>
