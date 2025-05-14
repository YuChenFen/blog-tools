<template>
    <div class="tool-card" @click="$router.push(path)">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    path: String
});
</script>

<style scoped>
.tool-card {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
    cursor: pointer;
}

.tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
}

.tool-card h3 {
    color: #1e293b;
    margin-bottom: 8px;
    font-size: 1rem;
    font-weight: 600;
}

.tool-card p {
    color: #64748b;
    font-size: 0.8rem;
    margin-bottom: 0;
    line-height: 1.4;
}

@media (max-width: 768px) {
    .tool-card {
        padding: 12px;
    }

    .tool-card h3 {
        font-size: 0.9rem;
    }

    .tool-card p {
        font-size: 0.75rem;
    }
}
</style>