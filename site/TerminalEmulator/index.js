'use strict';

((window) => {

function Prompt (symbol) {
	const div = document.createElement('div');
	div.classList.add('prompt', 'flx', 'p-lg');
	div.innerHTML = `
		<div class="prompt-symbol">${symbol}</div>
		<input id='prompt-input' class="p-lg prompt-input" type="text" />
	`;
	return div;
}

function TerminalLine (children) {
	console.log('children', children);
	const li = document.createElement('li');
	li.classList.add('line');
	if (typeof children === 'string' || typeof children === "number")
		li.innerHTML = `<p class="p-lg">${children}<p>`;
	else
		li.appendChild(children);
	return li;
}

class TerminalEmulator {

	constructor ({ $root }) {
		this.handleKeystroke = this.handleKeystroke.bind(this);

		this.$root = $root;
		this.mount();

		this.$lines = $root.querySelector('ul');
		console.log('this.$lines', this.lines);
		this.program = null;
		this.promptSymbol = "$";

		this.printPrompt();
	}

	mount () {
		this.$root.innerHTML = `
			<div
				id='terminal-emulator'
				class="terminal br10 flx1 wh100 pb10">
				<ul class="terminal-lines"></ul>
			<div>
		`;
	}

	printPrompt () {
		this.$prompt = TerminalLine(Prompt(this.promptSymbol));
		this.$lines.append(this.$prompt);
		this.$input = this.$prompt.querySelector('#prompt-input');
		console.log('$input', this.$input);
		this.$input.addEventListener('keyup', this.handleKeystroke);
	}

	printLine (stdout) {
		this.$lines.insertBefore(
			TerminalLine(stdout), this.$prompt);
	}

	clearDisplay () {
		[...this.$lines.children].forEach((c) => {
			if (c !== this.$prompt) this.$lines.removeChild(c);
		});
		this.clearPrompt();
	}

	clearPrompt () {
		this.$input.value = "";
	}

	setPrompt (symbol) {
		this.promptSymbol = symbol;
		this.$prompt.querySelector('.prompt-symbol').innerHTML = symbol;
	}

	date () {
		return 'Mon Dec 13 14:46:13 EST 1973';
	}

	handleKeystroke (e) {
		switch (e.key) {
			case 'Enter': {
				const stdin = this.$input.value;
				if (stdin === "clear") {
					this.clearDisplay();
					this.clearPrompt();
					return;
				}

				this.printLine(this.promptSymbol + " " + stdin);

				if (!this.program) {
					if (stdin.startsWith("echo")) {
						this.printLine(stdin.replace('echo', ""));
					}
					else if (stdin.startsWith("whoami")) {
						this.printLine("some-cool-cat");
					}
					else if (stdin.startsWith("ls")) {
						this.printLine("I'm hiding all the files");
					}
					else if (stdin.startsWith("cat")) {
						this.printLine("I prefer dogs");
					}
					else if (stdin.startsWith("date")) {
						const stdout = this.date();
						this.printLine(stdout);
					}
					else if (stdin.startsWith("bc")) {
						this.program = new BCInterpreter();
						this.program.prologue().forEach((l) => this.printLine(l));
						this.setPrompt('>');
					}
					else {
						this.printLine(stdin + ": command not recognised");
					}
				}

				else {
					if (stdin === "quit" || stdin === "exit") {
						this.program = null;
						this.setPrompt('$');
					}
					else if (stdin == "warranty") {
						this.printLine("did I say warranty?");
					}
					else {
						const stdout = this.program.eval(stdin);
						this.printLine(stdout);
					}
				}

				this.clearPrompt();
				this.$root.scrollTop = this.$root.scrollHeight;
			}
		}

	}
}

window.TerminalEmulator = TerminalEmulator;

})(window);
