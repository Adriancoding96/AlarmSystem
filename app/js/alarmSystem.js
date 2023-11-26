"use strict";
class AlarmSystem {
  constructor() {
    this.code = 1337;
    this.tries = 0;
    this.isAwaitingResponse = false;
    this.h1Input = document.querySelector(".input-box h1");
    this.h2Output = document.querySelector(".output-container h2");
    this.buttons = document.querySelectorAll(".button-grid-button");

    this.attachButtonHandlers();
    this.attachResetHandler();
    this.iteration = 0;
  }

  authenticate(input) {
    if (input == this.code && this.tries < 3) {
      this.isAwaitingResponse = false;
      this.h2Output.textContent = "Authenticated";
      this.h1Input.textContent = "";
    } else {
      this.h1Input.textContent = "";
      this.tries++;
      if (this.tries === 3) {
        this.isAwaitingResponse = false;
        this.h2Output.textContent = "Locked";
        this.h1Input.textContent = "";
      }
    }
  }

  handleButtonClick(button) {
    if (button.value == "#" && this.tries < 3) {
      this.authenticate(this.h1Input.textContent);
      return 0;
    }
    const h1Value = this.h1Input.textContent;
    if (h1Value.length < 8 && this.tries < 3) {
      const newValue = button.value;
      const updatedValue = h1Value + newValue;
      this.h1Input.textContent = updatedValue;

      if (!this.isAwaitingResponse) {
        this.isAwaitingResponse = true;
        this.awaitingResponse();
      }
    } else {
      console.log("String to long");
    }
  }

  attachButtonHandlers() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => this.handleButtonClick(button));
    });
  }

  handleResetClick() {
    this.tries = 0;
    this.h1Input.textContent = "";
    this.h2Output.textContent = "";
  }

  attachResetHandler() {
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", () => this.handleResetClick());
  }

  async awaitingResponse() {
    while (this.isAwaitingResponse) {
      if (this.iteration < 3) {
        this.h2Output.textContent += ".";
        this.iteration++;
      } else if (this.iteration === 3) {
        this.h2Output.textContent = this.h2Output.textContent.slice(0, -3);
        this.iteration = 0;
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  handleKeyPress(e) {
    const key = e.key;
    this.buttons.forEach((button) => {
      if (button.value === key) {
        button.click();
      } else if (key === "Backspace") {
        this.h1Input.textContent = this.h1Input.textContent.slice(0, -1);
      }
    });

    if (key === "Enter") {
      this.buttons.forEach((button) => {
        if (button.value === "#") {
          if (this.tries < 3) this.authenticate(this.h1Input.textContent);
          return 0;
        }
      });
    }
  }

  start() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }
}

export default AlarmSystem;
