(() => {

class Token {
	static get LPAREN() { return "LPAREN"; }
	static get RPAREN() { return "RPAREN"; }
	static get DIV() { return "DIV"; }
	static get MULT() { return "MULT"; }
	static get MINUS() { return "MINUS"; }
	static get PLUS() { return "PLUS"; }
	static get INTLITERAL() { return "INTLITERAL"; }
	static get EOF() { return "EOF"; }

	constructor (type, lexeme) {
		this.type = type;
		this.lexeme = lexeme;
	}
}

module.exports = Token;

})();


