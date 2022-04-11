class User {
  #lifePoint;
  #userName;
  #userId

  constructor(userName, userId) {
    if(!userName) throw 'userName not exists';
    if(typeof userName !== 'string') throw 'userName must be String';
    this.#userName = userName;
    this.#userId = userId;
    this.#lifePoint = 8000;
  }

  minusLifePoint(lifePoint) {
    if(typeof lifePoint !== 'number') throw 'lifePoint must be Number';
    if(lifePoint < 0) return false;

    if(this.#lifePoint - lifePoint <= 0) {
      this.#lifePoint = 0;
    } else {
      this.#lifePoint = this.#lifePoint - lifePoint;
    }
  }

  plusLifePoint(lifePoint) {
    if(typeof lifePoint !== 'number') throw 'lifePoint must be Number';
    if(lifePoint < 0) return false;

    this.#lifePoint = this.#lifePoint + lifePoint;
  }

  divisionLifePoint(lifePoint) {
    if(typeof lifePoint !== 'number') throw 'lifePoint must be Number';
    if(lifePoint < 0) return false;

    this.#lifePoint = Math.ceil(this.#lifePoint / lifePoint);
  }

  get lifePoint() {
    return Number(this.#lifePoint);
  }

  get userName() {
    return this.#userName;
  }

  get userId() {
    return this.#userId;
  }
}

module.exports = User;