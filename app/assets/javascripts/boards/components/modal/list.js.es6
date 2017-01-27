/* global Vue */
/* global ListIssue */
/* global Masonry */
(() => {
  let listMasonry;
  const ModalStore = gl.issueBoards.ModalStore;

  gl.issueBoards.ModalList = Vue.extend({
    data() {
      return ModalStore.store;
    },
    watch: {
      activeTab() {
        this.initMasonry();
      },
      issues: {
        handler(issues, oldIssues) {
          if (this.activeTab === 'selected' || issues.length !== oldIssues.length) {
            this.initMasonry();
          }
        },
        deep: true,
      },
    },
    computed: {
      loopIssues() {
        if (this.activeTab === 'all') {
          return this.issues;
        }

        return this.selectedIssues;
      },
    },
    methods: {
      toggleIssue: ModalStore.toggleIssue.bind(ModalStore),
      showIssue(issue) {
        if (this.activeTab === 'all') return true;

        return issue.selected;
      },
      initMasonry() {
        const listScrollTop = this.$refs.list.scrollTop;

        this.$nextTick(() => {
          this.destroyMasonry();
          listMasonry = new Masonry(this.$refs.list, {
            transitionDuration: 0,
          });

          this.$refs.list.scrollTop = listScrollTop;
        });
      },
      destroyMasonry() {
        if (listMasonry) {
          listMasonry.destroy();
          listMasonry = undefined;
        }
      },
    },
    mounted() {
      this.initMasonry();
    },
    destroyed() {
      this.destroyMasonry();
    },
    components: {
      'issue-card-inner': gl.issueBoards.IssueCardInner,
    },
    template: `
      <div
        class="add-issues-list add-issues-list-columns"
        ref="list">
        <div
          v-for="issue in loopIssues"
          v-if="showIssue(issue)"
          class="card-parent">
          <div
            class="card"
            :class="{ 'is-active': issue.selected }"
            @click="toggleIssue(issue)">
            <issue-card-inner
              :issue="issue"
              :issue-link-base="'/'">
            </issue-card-inner>
            <span
              v-if="issue.selected"
              class="issue-card-selected text-center">
              <i class="fa fa-check"></i>
            </span>
          </div>
        </div>
      </div>
    `,
  });
})();
