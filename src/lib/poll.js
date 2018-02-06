class Poll {
  constructor({ question, results, id }) {
    this.question = question;
    this.results = results;
    this.id = id;
  }
  // Anthony - return a new poll rather than mutate the state
  castVote(number) {
    this.results[number]++;
  }
}

export default Poll;
