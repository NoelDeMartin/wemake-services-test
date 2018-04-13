<template>
    <div class="flex relative items-center justify-center w-screen min-h-screen bg-background pb-8">
        <template v-if="user">
            <UserProfile :user="user"/>
        </template>

        <h1 v-else-if="loggedIn">Loading...</h1>

        <GithubButton
            v-else
            @click="login"
        />

        <footer class="absolute pin-b mb-4 flex items-center px-2">
            <i class="text-sm">
                Created by <a href="https://github.com/NoelDeMartin">Noel De Martin</a>,
                source code: <a href="https://github.com/NoelDeMartin/wemake-services-test">https://github.com/NoelDeMartin/wemake-services-test</a>
            </i>
        </footer>
    </div>
</template>

<script>
import * as Auth from './lib/Auth';

import UserProfile from './components/UserProfile.vue';
import GithubButton from './components/GithubButton.vue';

export default {
    components: {
        UserProfile,
        GithubButton,
    },
    data() {
        return {
            user: null,
        };
    },
    computed: {
        loggedIn() {
            return Auth.isLoggedIn();
        },
    },
    created() {
        Auth.init();
        if (Auth.isLoggedIn()) {
            fetch('https://api.github.com/user?access_token=' + Auth.getAccessToken())
                .then(response => response.json())
                .then(user => {
                    this.user = user;
                });
        }
    },
    methods: {
        login() {
            // Process github oauth authentication with a FaaS running on webtask.io (implementation found in webtask.js)
            window.location.replace('https://wt-890d8373aaab58aea4364f81b1b5d212-0.run.webtask.io/wemake-services-test');
        },
    },
};
</script>
