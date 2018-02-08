class Poll {
  constructor(question) {
    this.question = question;
    this.results = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
    this.voteMap = {};
  }

  packagePollForVoter(pollId) {
    const { question, results } = this;
    return { question, results, pollId };
  }

  castVote(number) {
    this.results[number]++;
  }

  removeVote(number) {
    this.results[number]--;
  }
}

export default Poll;
