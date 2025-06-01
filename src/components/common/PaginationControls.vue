<template>
  <div class="pagination-controls" v-if="totalPages > 1">
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage <= 1"
      class="pagination-button prev-btn"
    >
      &laquo; Previous
    </button>

    <span class="page-info">
      Page {{ currentPage }} of {{ totalPages }}
    </span>

    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage >= totalPages"
      class="pagination-button next-btn"
    >
      Next &raquo;
    </button>
  </div>
</template>

<script>
export default {
  name: 'PaginationControls',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('page-changed', page);
      }
    },
  },
};
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0; /* Matches EmployeeTable style */
}

.pagination-button {
  background-color: #6c757d; /* Grey for pagination buttons */
  color: white;
  border: none;
  padding: 8px 15px; /* Slightly more padding for better click area */
  border-radius: 5px; /* Consistent border-radius */
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s ease, box-shadow 0.15s ease;
  font-weight: 500;
}

.pagination-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.pagination-button:not(:disabled):hover {
  background-color: #5a6268;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.page-info {
  margin: 0 15px; /* More spacing around page info */
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
}
</style>
