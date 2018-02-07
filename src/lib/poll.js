class Poll {
  constructor(question) {
    this.question = question;
    this.results = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
  }
  // Anthony - return a new poll rather than mutate the state
  castVote(number) {
    this.results[number]++;
  }

  removeVote(number) {
    this.results[number]--;
  }
}

export default Poll;
