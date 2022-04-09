const { SlashCommandBuilder } = require('@discordjs/builders')

class CustomCommand {
  #slashCommand

  constructor(CustomBuilder) {
    if (!CustomBuilder) throw 'Do not exists Custom Builder parameter.';
    this.#slashCommand = CustomBuilder;
  }

  get command() {
    return this.#slashCommand.toJSON();
  }
}


module.exports = CustomCommand;