import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import './globalStyles.css'

const store = createStore({
    state: {
        rerender: 0,
    },
    mutations: {
        setRerender(state) {
            state.rerender = state.rerender + 1;
        },
    },
})

createApp(App).use(store).mount('#app')
