const submissionComponent = {
    template: `
        <div style="display: flex; width: 100%">
            <figure class="media-left">
              <img class="image is-64x64" v-bind:src="submission.avatar" alt="img1">
            </figure>
            
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>
                    <a v-bind:href="submission.url" class="has-text-info">{{ submissions[0].title }}</a>
                    <span class="tag is-small">#{{ submission.id }}</span>
                  </strong>
                  <br> {{ submission.description }}
                  <br>
                  <small class="is-size-7">
                    Submitted by:
                    <img class="image is-24x24" v-bind:src="submission.submissionImage" alt="img2">
                  </small>
                </p>
              </div>
            </div>
            
            <div class="media-right">
              <span class="icon is-small" v-on:click="upvote(submission)">
                <i class="fa fa-chevron-up"></i>
                <strong class="has-text-info">{{ submission.votes }}</strong>
              </span>
            </div>
        </div>
    `,
    props: ['submission','submissions'],
    methods: {
        upvote(submission) {
            submission.set(submission.votes++)
        }
    }
};