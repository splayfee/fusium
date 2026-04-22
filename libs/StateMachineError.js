/**
 * @fileOverview This file holds the StateMachineError class definition.
 * @author <a href="mailto:david@edium.com">David LaTour</a>
 * @version 1.0.0
 */

export default class StateMachineError extends Error {

  /**
   * Create a StateMachineError.
   * @param {String} name The error name.
   * @param {String} message The error message.
   */
  constructor(name, message) {
    super(message);
    this.name = "ERROR_SM_" + name;
    this.id = "ERROR_SM_" + name;
    this.message = message;
  }
}