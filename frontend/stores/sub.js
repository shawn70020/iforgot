import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSubStore = defineStore('sub', () => {
    const subItems = ref([]);

    const fetchSubItems = async (taskId) => {
        try {
            const result = await $fetch('/api/sub/get-task', {
                method: 'POST',
                body: { taskId },
            });
            subItems.value = result;
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const checkedItem = async (taskId) => {
        try {
            await $fetch('/api/tasks/check-task', {
                method: 'POST',
                body: taskId,
            });
            // 新增成功後重新獲取列表
            await fetchSubItems();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const deleteItem = async (params) => {
        try {
            await $fetch('/api/sub/delete-task', {
                method: 'DELETE',
                body: params,
            });
            // 新增成功後重新獲取列表
            await fetchSubItems(params.taskId);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const checkItem = async (params) => {
        try {
            await $fetch('/api/sub/check-sub', {
                method: 'POST',
                body: params,
            });
            // 新增成功後重新獲取列表
            await fetchSubItems(params.taskId);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const addSubItem = async (params) => {
        try {
            await $fetch('/api/tasks/add-subtask', {
                method: 'POST',
                body: params,
            });
            // 新增成功後重新獲取列表
            await fetchSubItems(params.taskId);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    const editSubItem = async (params) => {
        try {
            await $fetch('/api/sub/edit-sub', {
                method: 'POST',
                body: params,
            });
            console.log(33344444)
            // 新增成功後重新獲取列表
            await fetchSubItems(params.taskId);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    return {
        subItems,
        fetchSubItems,
        checkedItem,
        deleteItem,
        addSubItem,
        checkItem,
        editSubItem
    };
});
