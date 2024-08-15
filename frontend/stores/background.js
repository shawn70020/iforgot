// stores/background.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBackgroundStore = defineStore('background', () => {
    const bgImage = ref(localStorage.getItem('backgroundImage') || '/mountain.jpg');

    const setBackground = (imageUrl) => {
        bgImage.value = imageUrl;
        localStorage.setItem('backgroundImage', imageUrl);
    }

    return { bgImage, setBackground };
});
