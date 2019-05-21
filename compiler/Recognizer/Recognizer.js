const Token = require('../Scanner/Token');

(() => {
/*
 * (2) Recognizer
 * ===============================================================================
 * After all that theory, it must feel good to be back in an editor ready to
 * rock n roll! The only thing is, that coworker who helped you get started with
 * the Scanner is nowhere to be seen (I hope they are okay). What if you could
 * find an implementation of a simpler language first? Searching frantically around
 * the office, you spot a grammar filed away under the heading "additions". The
 * grammar that you found was written down as:
 *
 * E -> FT
 * T -> +FT | <eps> // where <eps> is eplison 
 * F -> INTLITERAL | (E)
 *
 * Follow(F) = First(T) U Follow(E)
 *
 * It is still not super clear what type of strings that the grammar produces.
 * Playing around with it, you notice that you are only able to build strings
 * that are either a single int literal, a list of add operations where any
 * number of add operations can be grouped together at arbritary depths. For example:
 * e.g 1
 * e.g 8 + (19)
 * e.g 17 + 2 + 38
 * e.g (98 + 54) + 9
 * e.g ((43 + 82) + 12)
 *
 * Okay, that's cool! You notice the first, follow and select sets are also defined.
 *
 * First
 * ---------------------------------------------
 * 	First(E) = { (, INTLITERAL }
 * 	First(T) = { +, <eps> }
 * 	First(F) = { (, INTLITERAL }
 * 	First(INTLITERAL) = { INTLITERAL }
 * 	First(<eps>) = { <eps> }
 *
 * Follow
 * ---------------------------------------------
 * 	Follow(E) = { ), $ }
 * 	Follow(T) = { ), $ }
 * 	Follow(F) = { +, ), <eps>, $ }
 *
 * Select
 * ---------------------------------------------
 *  Select(E -> FT) = { (, INTLITERAL }
 *  Select(T -> +FT) = { + }
 *  Select(T -> <eps>) = { ), $ }
 *  Select(F -> INTLITERAL) = { INTLITERAL }
 *  Select(F -> (E)) = { ( }
 *
 * Shame the implementation wasn't filed away as well! That would have almost been too amazing.
 * Wasting no time, you go ahead and implement a LL(1) top down parser for the grammar above.
 * The challenge is now working out how to extend/change the current implementation of the
 * this recognizer to accept the language defined by the Grammar 3.0 of the language bc.
 *
 * // Grammar 3.0
 * E  -> TE'
 * E' -> +TE' | -TE' | <eps> // <eps> is eplison
 * T  -> FT'
 * T' -> *FT' | /FT' | <eps>
 * F  -> (E)  | INTLITERAL
 *
 * Note:
 * If you want to play with this current recognizer before getting started,
 * you can do so by running the following from this directory:
 *
 * $ node
 * > const Scanner = require('../Scanner/Scanner');
 * > const Recognizer = require('./Recognizer');
 * > new Recognizer(Scanner(<enter string here>));
 */

/*
 * The Recognizer, given a scanner (which is an iterator) will throw an error
 * if the sequence of tokens forms an invalid program. If the program is valid,
 * that is, the sequence of tokens forms a string which exists in the language,
 * then the Recognizer will simply quietly accept.
 */

class Recognizer {

	constructor (scanner) {
		this.scanner = scanner;
		const { value: token } = scanner.next();
		this.currToken = token;
		this.S();
	}

	/* Helper methods
 	 * ----------------------------------------------- */

	reportError () {
		throw new Error('unexpected token: ' + this.currToken.lexeme);
	}

	equals (...types) {
		return types.some(t => this.currToken.type === t);
	}

	match (type) {
		if (this.equals(type))
			this.accept();
		else
			this.reportError();
	}

	accept () {
		const { value: token } = this.scanner.next();
		this.currToken = token;
	}

	/* Non Terminal methods
 	 * ----------------------------------------------- */

	/*
 	 * The approach to implement a top down parser is to create a method
 	 * for each non terminal (remember the guys to the left of the ->).
	 * Each method is then reponsible for applying the appropriate production.
	 * This is what the Select sets are for! Let's take a look at one in particular:
	 * 
	 * Select(E -> TE') = { (, INTLITERAL }
	 * This means that if the current token equals Token.LPAREN or Token.INTLITERAL
	 * then we need to apply the E -> TE' production. Applying this production would
	 * look like the following:
	 *
	 * this.T()
	 * this.EP() // note EP (E prime) means E'
	 */

	/*
 	 * I don't remember seeing an S non terminal? You'd be correct. The convention
 	 * is to use S as the starting symbol. This will also be useful when we need to
 	 * define a root for our AST. The follow set of the starting symbol has the
 	 * EOF token, namely $, which means $ will also bei n the Follow(S) 
 	 */
	S () {
		// production rule: S -> E
		// Select(S -> E) = First(E)
		this.E();

		// Follow(S) = { $ }
		if (!this.equals(Token.EOF))
			reportError();
		// else program is valid
	}

	E () {
		// Select(E -> FT) = { INTLITERAL }
		if (this.equals(Token.INTLITERAL)) {
			this.F();	// F
			this.T();	// T
		}
		else {
			this.reportError();
		}
	}

	T () {
		// Select(T -> +FT) = { + }
		if (this.equals(Token.PLUS)) {
			this.accept();	// +
			this.F();	   	// F
			this.T();		// T
		}
		// Select(T -> <eps>) = { ), $ }
		else if (this.equals(Token.RPAREN, Token.EOF)) {
			// do nothing on eplison production
		}
		else {
			this.reportError();
		}
	}

	F () {
 		// Select(F -> INTLITERAL) = { INTLITERAL }
 		if (this.equals(Token.INTLITERAL)) {
			this.accept();	// INTLITERAL
		}
 		// Select(F -> (E)) = { ( }
		else if (this.equals(Token.LPAREN)) {
			this.accept();				// (
			this.E();					// E
			this.match(Token.RPAREN); 	// )
		}
		else {
			this.reportError();
		}
	}

	/*
	S () {
		// S -> E
		this.E();

		if (!this.equals(Token.EOF))
			reportError();
	}

	E () {
		// E -> TE'
		if (this.equals(Token.LPAREN, Token.INTLITERAL)) {
			this.T();
			this.EP();
		}
		else {
			this.reportError();
		}
	}

	EP () {
		// E' -> +TE'
		if (this.equals(Token.PLUS)) {
			this.accept();
			this.T();
			this.EP();
		}
		// E' -> -TE'
		else if (this.equals(Token.MINUS)) {
			this.accept();
			this.T();
			this.EP();
		}
		// E' -> eps
		else if (this.equals(Token.EOF, Token.RPAREN)) {
			// epsilon production
		}
		else {
			this.reportError();
		}
	}

	T () {
		// T -> FT'
		if (this.equals(Token.LPAREN, Token.INTLITERAL)) {
			this.F();
			this.TP();
		}
		else {
			this.reportError();
		}
	}

	TP () {
		// T' -> *FT'
		if (this.equals(Token.MULT)) {
			this.accept();
			this.F();
			this.TP();
		}
		// T' -> /FT'
		else if (this.equals(Token.DIV)) {
			this.accept();
			this.F();
			this.TP();
		}
		// T' -> eps
		else if (this.equals(Token.PLUS, Token.MINUS, Token.EOF, Token.RPAREN)) {
			// epsilon production
		}
		else {
			this.reportError();
		}
	}

	F () {
		// F -> (E)
		if (this.equals(Token.LPAREN)) {
			this.accept();
			this.E();
			this.match(Token.RPAREN);
		}
		// F -> INTLITERAL
		else if (this.equals(Token.INTLITERAL)) {
			this.accept();
		}
		else {
			this.reportError();
		}
	}
	*/
}

module.exports = Recognizer;

})();
