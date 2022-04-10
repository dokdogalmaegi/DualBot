function getDice(max) {
  return Math.floor(Math.random() * max) + 1
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getMentionFromUser(userId) {
  return `<@${userId}>`
}

const Utils = { getDice, sleep, getMentionFromUser }

module.exports = Utils;