import { describe, it, expect } from "vitest";
import {
  State,
  StateMachineError,
  StateMachine,
  Transition
} from "../index.js";

describe("test states", function () {

  it("should throw an error when starting a machine with no states", function () {
    const stateMachine = new StateMachine();
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should throw an error when starting a machine has already started", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", 0, true);
    const entryAction = {};
    entryAction.execute = function (state) {
      expect(state).toBeInstanceOf(State);
    };
    state1.entryAction = entryAction;
    stateMachine.start();
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should create and add a state manually", function () {
    const stateMachine = new StateMachine();
    const state1 = new State(stateMachine, 0, "my first state", true);
    stateMachine.addState(state1);
    expect(stateMachine.states.length).toBe(1);
    expect(stateMachine.states[0]._stateMachine).toEqual(stateMachine);
    expect(stateMachine.states[0].id).toBe(0);
    expect(stateMachine.states[0].name).toBe("my first state");
    expect(stateMachine.states[0].isAccept).toBe(true);
  });

  it("should create and add a state automatically", function () {
    const stateMachine = new StateMachine();
    stateMachine.createState("my first state", true);
    expect(stateMachine.states.length).toBe(1);
    expect(stateMachine.states[0]._stateMachine).toEqual(stateMachine);
    expect(stateMachine.states[0].name).toBe("my first state");
    expect(stateMachine.states[0].isAccept).toBe(true);
  });

  it("should throw a state exists error", function () {
    const stateMachine = new StateMachine();
    const state1 = new State(stateMachine, 1, "my first state", false);
    const state2 = new State(stateMachine, 1, "my second state", false);
    stateMachine.addState(state1);
    expect(() => {
      stateMachine.addState(state2);
    }).toThrow(StateMachineError);
  });

  it("should have a default start state", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", false);
    stateMachine.start();
    expect(state1).toEqual(stateMachine.currentState);
  });

  it("should start with an explicit start state", function () {
    const stateMachine = new StateMachine();
    stateMachine.createState("my first state", false);
    const state2 = stateMachine.createState("my second state", false);
    stateMachine.start(state2);
    expect(state2).toEqual(stateMachine.currentState);
  });

  it("should transition from previous state to current state", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", false);
    const entryAction = {};
    entryAction.execute = function (state) {
      state.trigger("next");
    };
    state1.entryAction = entryAction;
    const state2 = stateMachine.createState("my second state", false);
    state1.addTransition("next", state2);
    stateMachine.start(state1);
    expect(stateMachine.currentState).toEqual(state2);
    expect(stateMachine.previousState).toEqual(state1);
  });

  it("should start with the first state", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", false);
    stateMachine.start(state1);
    expect(stateMachine.started).toBe(true);
    expect(stateMachine.currentState).toEqual(state1);
  });

  it("Should reset the state", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", false);
    const entryAction = {};
    entryAction.execute = function (state) {
      state.trigger("next");
    };
    state1.entryAction = entryAction;
    const state2 = stateMachine.createState("my second state", false);
    state1.addTransition("next", state2);
    stateMachine.start(state1);
    stateMachine.reset(false);
    expect(stateMachine.currentState).toBe(null);
    expect(stateMachine.previousState).toBe(null);
  });

  it("should have a transition", function () {
    const stateMachine = new StateMachine();
    const state1 = new State(stateMachine, 0, "my first state");
    const state2 = new State(stateMachine, 1, "my second state", true);
    state1.addTransition("next", state2);
    expect(state1.hasTransition("next")).toBe(true);
    expect(state1.hasTransition("previous")).toBe(false);
  });

});

describe("test global state transition", function () {

  it("should transition to a global state", function () {
    const stateMachine = new StateMachine();
    stateMachine.createState("my first state", false);
    stateMachine.createState("my second state", false);
    const state3 = stateMachine.createState("my third state", false);
    stateMachine.addTransition("goto3", state3);
    stateMachine.start();
    stateMachine.trigger("goto3", true);
    expect(stateMachine.started).toBe(true);
    expect(stateMachine.currentState).toEqual(state3);
  });

});

describe("test transition", function () {

  it("should create a new transition", function () {
    const stateMachine = new StateMachine();
    const state1 = stateMachine.createState("my first state", false);
    const transition = new Transition("next", state1);
    expect(transition).toBeDefined();
    expect(transition.triggerId).toBe("next");
    expect(transition.targetState).toEqual(state1);
  });

});

describe("test the state machine", function () {

  it("should get a state by name", function () {
    const stateMachine = new StateMachine();
    stateMachine.createState("my first state", false);
    const s2 = stateMachine.createState("my second state", false);
    stateMachine.createState("my third state", false);
    expect(stateMachine.getStateByName("my second state")).toEqual(s2);
  });

  it("should be in accepted state", function () {
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    const s2 = stateMachine.createState("my second state", true);
    s1.addTransition("next", s2);
    stateMachine.start();
    stateMachine.trigger("next");
    expect(stateMachine.isAccept).toBe(true);
  });

  it("should get a state by its id", function () {
    const stateMachine = new StateMachine();
    stateMachine.createState("my first state", false);
    stateMachine.createState("my second state", true);
    const s3 = stateMachine.createState("my third state", true);
    stateMachine.createState("my fourth state", true);
    expect(stateMachine.getStateById(2)).toEqual(s3);
  });

  it("should throw an error if the entry action is missing 'execute' method", function () {
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    s1.entryAction = {};
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should throw an error if the exit action is missing 'execute' method", function () {
    const entryAction = { execute: function (state) {
      state.trigger("next");
    } };
    const exitAction = {};
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    const s2 = stateMachine.createState("my second state", false);
    s1.entryAction = entryAction;
    s1.exitAction = exitAction;
    s2.entryAction = { execute: function () { } };
    s1.addTransition("next", s2);
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should throw an error if the state machine is already in the requested state", function () {
    const entryAction = { execute: function (state) {
      state.trigger("next");
    } };
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    s1.entryAction = entryAction;
    s1.addTransition("next", s1);
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should go to the previous state", function () {
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    const s2 = stateMachine.createState("my second state", false);
    s1.addTransition("next", s2);
    stateMachine.start();
    stateMachine.trigger("next");
    expect(stateMachine.currentState).toEqual(s2);
    expect(stateMachine.previousState).toEqual(s1);
    stateMachine.gotoPrevious();
    expect(stateMachine.currentState).toEqual(s1);
    expect(stateMachine.previousState).toEqual(s2);
  });

  it("should throw an error on an invalid transition", function () {
    const entryAction = { execute: function (state) {
      state.trigger("next");
    } };
    const stateMachine = new StateMachine();
    const s1 = stateMachine.createState("my first state", false);
    stateMachine.createState("my second state", false);
    s1.entryAction = entryAction;
    expect(() => {
      stateMachine.start();
    }).toThrow(StateMachineError);
  });

  it("should run a simple state machine", function () {
    return new Promise((resolve, reject) => {
      let entryCount = 0;
      let exitCount = 0;

      const entryAction = {};
      entryAction.execute = function (state) {
        entryCount++;
        expect(state).toBeInstanceOf(State);
        state.trigger("next");
      };

      const exitAction = {};
      exitAction.execute = function (state) {
        exitCount++;
        expect(state).toBeInstanceOf(State);
        return true;
      };

      const decideAction = {};
      decideAction.execute = function (state) {
        entryCount++;
        expect(state).toBeInstanceOf(State);
        const index = Math.floor(Math.random() * 2);
        if (index === 0) {
          state.trigger("goto3");

        } else if (index === 1) {
          state.trigger("goto4");
        }
      };

      const finalAction = {};
      finalAction.execute = function (state) {
        try {
          entryCount++;
          expect(entryCount).toBe(4);
          expect(exitCount).toBe(3);
          expect(state).toBeInstanceOf(State);
          resolve();
        } catch (e) {
          reject(e);
        }
      };

      const stateMachine = new StateMachine();
      const s1 = stateMachine.createState("my first state", false);
      const s2 = stateMachine.createState("my second state", false);
      const s3 = stateMachine.createState("my third state", false);
      const s4 = stateMachine.createState("my fourth state", false);
      const s5 = stateMachine.createState("my final state", true);

      s1.entryAction = entryAction;
      s1.exitAction = exitAction;
      s2.entryAction = decideAction;
      s2.exitAction = exitAction;
      s3.entryAction = entryAction;
      s3.exitAction = exitAction;
      s4.entryAction = entryAction;
      s4.exitAction = exitAction;
      s5.entryAction = finalAction;

      s1.addTransition("next", s2);
      s2.addTransition("goto3", s3);
      s2.addTransition("goto4", s4);
      s3.addTransition("next", s5);
      s4.addTransition("next", s5);

      stateMachine.start(s1);
    });
  });
});
