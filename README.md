# Fusium Finite State Machine

## Overview
**Fusium** is a simple finite state machine for gaming or workflow systems. It supports local and global triggers, entry and exit actions, and the ability to block state transitions before exit.

## Features
- Unlimited number of states
- Accepted state
- Go to the previous state
- Throws errors on invalid state transitions
- Supports entry actions
- Supports blocking exit actions
- Start on any state
- Reset the state machine

## Installation

```.bash
pnpm install fusium
```

## Examples

Begin by referencing the module:

```javascript
import fusium from 'fusium';
```

Then add in the classes:

```javascript
const State = fusium.classes.State;
const StateMachineError = fusium.classes.StateMachineError;
const StateMachine = fusium.classes.StateMachine;
const Transition = fusium.classes.Transition;
```

Finally, wire up your state machine and start it:

```Javascript
const entryAction = {
    execute: function( state ) {
        state.trigger( "next" );
    };
};

const exitAction = {
    execute: function( state ) {
        // Returning false will cancel the state transition
        return true;
    };
};

const decideAction = {
    execute: function( state ) {
        const index = Math.floor( Math.random() * 2 );
        if ( index === 0 ) {
            state.trigger( "goto3" );
        } else if ( index === 1 ) {
            state.trigger( "goto4" );
        }
    }
};

const finalAction = {
    execute: function( state ) {
        // Can perform some final actions, the state machine is finished running.
    };
};

const stateMachine = new StateMachine();
const s1 = stateMachine.createState( "My first state", false );
const s2 = stateMachine.createState( "My second state", false );
const s3 = stateMachine.createState( "My third state", false );
const s4 = stateMachine.createState( "My fourth state", false );
// Notice true indicates a final accept state.
const s5 = stateMachine.createState( "My final state", true ); 

// Wire up all entry and exit actions
s1.entryAction = entryAction;
s1.exitAction = exitAction;
s2.entryAction = decideAction;
s2.exitAction = exitAction;
s3.entryAction = entryAction;
s3.exitAction = exitAction;
s4.entryAction = entryAction;
s4.exitAction = exitAction;
s5.entryAction = finalAction;

// Define all state transitions
s1.addTransition( "next", s2 );
s2.addTransition( "goto3", s3 );
s2.addTransition( "goto4", s4 );
s3.addTransition( "next", s5 );
s4.addTransition( "next", s5 );

// Start the state machine
stateMachine.start( s1 );
```