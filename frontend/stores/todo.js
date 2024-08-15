import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export const useTodoStore = defineStore('todo', () => {
    const route = useRoute();
    const todoItems = ref([]);
    const categoryItems = ref(['personal'])
    const tagItems = ref([])

    // 路由api
    const apiUrlMap = {
        '/': '/api/tasks/get-task', // 主頁面
        '/week': '/api/tasks/get-week-task',
        '/all': '/api/tasks/get-all-task',
        'category': '/api/tasks/get-category?category=',
        'tag': '/api/tasks/get-tag?tag='
    };

    const getApiUrl = (path) => {
        if (path.includes('category')) {
            return apiUrlMap['category'];
        }

        if (path.includes('tag')) {
            return apiUrlMap['tag'];
        }

        return apiUrlMap[path] || '/api/tasks/get-task';
    };

    const fetchTodoItems = async (params) => {
        let apiUrl = getApiUrl(route.path);
        if (params) {
            apiUrl = `${apiUrl}${params}`
        }
        try {
            const result = await $fetch(apiUrl, {
                method: 'GET',
            });

            categoryItems.value = result?.categories || [];
            tagItems.value = result?.tags || [];
            todoItems.value = result?.tasksGroupedByPosition || result
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };


    const fetchTodoWeekItems = async (params) => {
        try {
            const result = await $fetch('/api/tasks/get-week-task-filter', {
                method: 'POST',
                body: params
            });
            todoItems.value = result.tasksGroupedByPosition;
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTodoItem = async (params) => {
        try {
            const { noReload } = params
            await $fetch('/api/tasks/add-task', {
                method: 'POST',
                body: params,
            });
            if (!noReload) {
                await fetchTodoItems();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const checkedItem = async (taskId, noReload) => {
        try {
            await $fetch('/api/tasks/check-task', {
                method: 'POST',
                body: taskId,
            });
            if (!noReload) {
                await fetchTodoItems();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const pinnedItem = async (taskId) => {
        try {
            await $fetch('/api/tasks/pin-task', {
                method: 'POST',
                body: taskId,
            });
            // 新增成功後重新獲取列表
            await fetchTodoItems();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const deleteItem = async (taskId) => {
        try {
            await $fetch('/api/tasks/delete-task', {
                method: 'DELETE',
                body: taskId,
            });
            // 新增成功後重新獲取列表
            await fetchTodoItems();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const deleteCheckedItem = async () => {
        try {
            await $fetch('/api/tasks/delete-user-checked', {
                method: 'DELETE',
            });
            // 新增成功後重新獲取列表
            await fetchTodoItems();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const addSubItem = async (taskId) => {
        try {
            await $fetch('/api/tasks/add-subtask', {
                method: 'POST',
                body: taskId,
            });
            // 新增成功後重新獲取列表
            await fetchTodoItems();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const addTaskNote = async (params) => {
        try {
            const { noReload } = params
            await $fetch('/api/tasks/add-note', {
                method: 'POST',
                body: params,
            });
            if (!noReload) {
                await fetchTodoItems();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const editTaskCategory = async (params) => {
        try {
            const { noReload } = params
            await $fetch('/api/tasks/edit-category', {
                method: 'POST',
                body: params,
            });
            if (!noReload) {
                await fetchTodoItems();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const editTaskTag = async (params) => {
        try {
            const { noReload } = params
            await $fetch('/api/tasks/edit-tag', {
                method: 'POST',
                body: params,
            });
            if (!noReload) {
                await fetchTodoItems();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const getUserCount = async () => {
        try {
            const result = await $fetch('/api/users/user-count', {
                method: 'GET',
            });
            userStore.setUserTask(result);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    return {
        todoItems,
        categoryItems,
        tagItems,
        fetchTodoItems,
        addTodoItem,
        checkedItem,
        pinnedItem,
        deleteItem,
        addTaskNote,
        addSubItem,
        editTaskCategory,
        editTaskTag,
        fetchTodoWeekItems,
        deleteCheckedItem,
        getUserCount
    };
});
