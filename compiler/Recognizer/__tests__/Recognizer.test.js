
const Scanner = require('../sol/Scanner');
const Token = require('../Token');

describe('Scanner', () => {

	it("should handle the empty program", () => {
		const program = "";
		const scanner = Scanner(program);
		expect(() => {
			const itr = scanner.next();
			expect(itr.done).toEqual(false);
			expect(itr.value).toEqual(new Token(Token.EOF, "$"));
		}).not.toThrow();
	});

	it('should handle whitespace', () => {
		const programs = [" ", "  ", "	", "		", `	`];
		programs.forEach(program => {
			const scanner = Scanner(program);
			expect(() => {
				const itr = scanner.next();
				expect(itr.done).toEqual(false);
				expect(itr.value).toEqual(new Token(Token.EOF, "$"));
			}).not.toThrow();
		});
	});

	describe("single character tokens", () => {

		it("should recognise +", () => {
			const program = "+";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.PLUS, "+")
			});
		});

		it("should recognise -", () => {
			const program = "-";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.MINUS, "-")
			});
		});

		it("should recognise /", () => {
			const program = "/";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.DIV, "/")
			});
		});

		it("should recognise *", () => {
			const program = "*";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.MULT, "*")
			});
		});

		it("should recognise (", () => {
			const program = "(";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.LPAREN, "(")
			});
		});

		it("should recognise )", () => {
			const program = ")";
			const scanner = Scanner(program);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.RPAREN, ")")
			});
		});

	});

	describe("int literals", () => {
		it("should recognise an integer", () => {
			const literals = ["2", "38", "694"];
			literals.forEach(literal => {
				const scanner = Scanner(literal);
				expect(scanner.next()).toEqual({
					done: false,
					value: new Token(Token.INTLITERAL, literal)
				});
			});
		});

		it("should recognise integers", () => {
			const program = "2 38 694";
			const scanner = Scanner(program);

			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.INTLITERAL, "2"),
			});

			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.INTLITERAL, "38"),
			});

			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.INTLITERAL, "694"),
			});
		});

		it("should recognise negatively signed integers as two tokens", () => {
			const literal = "-14";
			const scanner = Scanner(literal);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.MINUS, "-"),
			});

			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.INTLITERAL, "14"),
			});
		});

		it("should recognise positively signed integers as two tokens", () => {
			const literal = "+14";
			const scanner = Scanner(literal);
			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.PLUS, "+"),
			});

			expect(scanner.next()).toEqual({
				done: false,
				value: new Token(Token.INTLITERAL, "14"),
			});
		});

	});


	describe("programs", () => {

		it("test program 1", () => {
			const program = "2 + 2";
			const scanner = Scanner(program);
			const tokens = [
				new Token(Token.INTLITERAL, "2"),
				new Token(Token.PLUS, "+"),
				new Token(Token.INTLITERAL, "2"),
				new Token(Token.EOF, "$"),
			];
			tokens.forEach((token, idx) => {
				expect(scanner.next().value)
				.toEqual(tokens[idx]);
			});
		});

		it("test program 2", () => {
			const program = "3 / 4 + 5 * 6 (7 * 8)";
			const scanner = Scanner(program);
			const tokens = [
				new Token(Token.INTLITERAL, "3"),
				new Token(Token.DIV, "/"),
				new Token(Token.INTLITERAL, "4"),
				new Token(Token.PLUS, "+"),
				new Token(Token.INTLITERAL, "5"),
				new Token(Token.MULT, "*"),
				new Token(Token.INTLITERAL, "6"),
				new Token(Token.LPAREN, "("),
				new Token(Token.INTLITERAL, "7"),
				new Token(Token.MULT, "*"),
				new Token(Token.INTLITERAL, "8"),
				new Token(Token.RPAREN, ")"),
				new Token(Token.EOF, "$"),
			];
			tokens.forEach((token, idx) => {
				expect(scanner.next().value)
				.toEqual(tokens[idx]);
			});
		});

		it("test program 3", () => {
			const program = "((8+32))";
			const scanner = Scanner(program);
			const tokens = [
				new Token(Token.LPAREN, "("),
				new Token(Token.LPAREN, "("),
				new Token(Token.INTLITERAL, "8"),
				new Token(Token.PLUS, "+"),
				new Token(Token.INTLITERAL, "32"),
				new Token(Token.RPAREN, ")"),
				new Token(Token.RPAREN, ")"),
				new Token(Token.EOF, "$"),
			];
			tokens.forEach((token, idx) => {
				expect(scanner.next().value)
				.toEqual(tokens[idx]);
			});
		});
	
	});

});
