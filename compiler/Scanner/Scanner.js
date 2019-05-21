const Token = require('./Token');

(() => {
/*
 * Lexical Analysis (1) 
 * ===============================================================================
 * Hi there! Welcome to the first phase of the complication process. The good news
 * is that a coworker has helped get you started with tokenzing. The bad news is
 * that they've gone home sick. From what I can see, the scanner handles whitespace
 * and the language currently only recognises two tokens, "+" and "-".
 * It's your job to pick it up from here!
 */

/*
 * The Scanner, given a string (list of chars) will return an iterator that
 * will emit Token objects until the end of the string has been reached.
 */
function * Scanner (chars) {
	let index = 0;
	let currChar = chars[0];
	let lexeme = "";

	/* helper method that returns whether the given string or regexp
 	 * matches the current char (currChar)
 	 */
	const equals = (re) => {
		if (currChar == null) return false;
		if (typeof re === "string") return re === currChar;
		return currChar.match(re);
	}

	/* helper method that increments the index of the current char
 	 * and then points currChar to the next char in the list
 	 */
	const accept = () => {
		index++;
		currChar = chars[index];
	}

	/* helper method that first appends to the lexeme
 	 * and then accepts the token
 	 */
	const match = () => {
		lexeme += currChar;
		accept();
	}

	while (index < chars.length) {
		/* "lexeme" is the spelling of the token.
 		 * For example: imagine the list of chars are:
 		 * "123 45"
 		 * In this case, the scanner would create two tokens:
 		 * 1. { type: INTLITERAL, lexem: "123" }
 		 * 2. { type: INTLITERAL, lexem: "45" }
 		 * Notice how they are both the same type of token but each
 		 * is spelled differently, that is has a different lexeme.
 		 */
		lexeme = "";

		// handle whitespace
		if (equals(/\s/)) {
			do { accept(); }
			while (equals(/\s/));
		}

		// handle minus operator
		else if (equals("-")) {
			match();
			/* refer to Token.js which defines all the supported
  			 * tokens in the language as static fields
 			 */
			yield new Token(Token.MINUS, lexeme);
		}
		// handle plus operator
		else if (equals("+")) {
			match();
			yield new Token(Token.PLUS, lexeme);
		}
		// handle open (left) parenthesis
		else if (false) { }
		// handle closed (right) parenthesis
		else if (false) { }
		// handle division operator
		else if (false) { }
		// handle multiplication operator
		else if (false) { }
		// handle integer literals
		else if (false) { }
		else {
			throw new Error(`Uncaught SyntaxError: Unexpected token ${lexeme}`);
		}
	}

	return new Token(Token.EOF, "$");
}

module.exports = Scanner;

})();
