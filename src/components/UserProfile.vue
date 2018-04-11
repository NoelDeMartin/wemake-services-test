<template>
    <div class="flex flex-col items-center my-8">

        <img
            :src="user.avatar_url"
            class="h-32 w-32 rounded-full"
        >

        <h1 class="mt-4 text-3xl">{{ user.name }} ({{ repositories.length }} repos)</h1>

        <h2
            v-if="loading"
            class="mt-4 text-2xl"
        >
            Loading...
        </h2>

        <UserRepository
            v-for="repository in repositories"
            v-else
            :key="repository.id"
            :repository="repository"
        />

    </div>
</template>

<script>
import * as Auth from '../lib/Auth';

import UserRepository from './UserRepository.vue';

export default {
    components: {
        UserRepository,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            loading: true,
            repositories: [],
        };
    },
    created() {
        fetch(this.user.repos_url + '?access_token=' + Auth.getAccessToken())
            .then(response => response.json())
            .then(repositories => {
                this.repositories = repositories;
                this.loading = false;
            });
    },
};
</script>
