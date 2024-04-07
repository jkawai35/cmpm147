// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    protag: ["Lover's", "His", "Her", "Their"],
    relationship: ["relationship", "situationship", "friendship"],
    ending: ["good", "bad"],
    adjective: ["caring", "understanding", "generous", "patient", "sweet", "thoughtful", "kind"],
    noun: ["Cry", "Song", "Heartbreak", "Happiness", "Joy", "Sadness"],
    message: ["call", "txt"],
    certainty: ["sure", "unsure"],
    
  };
  
  const template = `Your song title is: $protag $noun.
  Your $relationship with that special someone in your life turned into something $ending.
  That special person in your life was/is $adjective.
  You wish that you could $message them all the time about your life and everything good that happens to you.
  You are $certainty that this will work out.
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);

  generate();
  
}

// let's get this party started - uncomment me
main();