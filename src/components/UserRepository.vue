<template>
    <div class="flex flex-col w-screen-90 rounded shadow-md mt-8 p-4 bg-white md:w-screen-50">
        <h2 class="text-lg flex justify-between">
            <a href="">{{ repository.name }}</a>
            <span
                v-if="repository.fork"
                class="bg-grey-light text-grey-darker p-1 rounded text-sm"
            >
                forked
            </span>
        </h2>
        <p
            v-if="repository.description"
            class="mt-2 text-base"
        >
            {{ repository.description }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        repository: {
            type: Object,
            required: true,
        },
    },
};
</script>
