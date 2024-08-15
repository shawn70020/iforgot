// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        email: '',
        name: '',
        password: '',
        step: 0,
        userStoreInfo: {

        },
        userTasksCount: {

        }
    }),
    actions: {
        setEmail(email) {
            this.email = email
        },
        setName(name) {
            this.name = name
        },
        setPassword(password) {
            this.password = password
        },
        setStep(idx) {
            this.step = idx
        },
        setUserInfo(info) {
            this.userStoreInfo = info
        },
        setUserTask(count) {
            this.userTasksCount = count
        },
        async getUserCount() {
            try {
                const result = await $fetch('/api/users/user-count', {
                    method: 'GET',
                });
                this.setUserTask(result);
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        },
        async addUserCategory(params) {
            try {
                const result = await $fetch("/api/users/add-category", {
                    method: "POST",
                    body: {
                        category: params,
                    },
                });
                this.setUserInfo(result)
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        },
        async addUserTag(params) {
            try {
                const result = await $fetch("/api/users/add-tag", {
                    method: "POST",
                    body: {
                        tag: params,
                    },
                });
                this.setUserInfo(result)
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        },
    },
    getters: {
        getEmail: state => state.email,
        getName: state => state.name,
        getPassword: state => state.password
    },


})
