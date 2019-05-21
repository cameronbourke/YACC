
const Scanner = require('../../Scanner/sol/Scanner');
const Recognizer = require('../sol/Recognizer');

function testRecognizer (program) {
	return () => new Recognizer(Scanner(program));
}

describe('Recognizer', () => {

	describe("INTLITERAL", () => {
		describe("valid programs", () => {
			it("recognises int literal: 1", () => {
				const program = "1";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects space seperated list: 1 3", () => {
				const program = "1 3";
				expect(testRecognizer(program)).toThrow();
			});
		});
	});

	describe("Parens ( )", () => {
		describe("valid programs", () => {
			it("recognises grouped int literal: (1)", () => {
				const program = "(1)";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises nested grouped int literal: ((1))", () => {
				const program = "((1))";
				expect(testRecognizer(program)).not.toThrow();
			});

		});

		describe("invalid programs", () => {
			it("rejects empty group: ()", () => {
				const program = "()";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects unclosed paren: (23", () => {
				const program = "(23";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects trailing paren: 54)", () => {
				const program = "54)";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects unbalanced parens: ((56)", () => {
				const program = "((56)";
				expect(testRecognizer(program)).toThrow();
			});
		});
	});

	describe("Addition +", () => {
		describe("valid programs", () => {
			it("recognises single binary expr: 1 + 2", () => {
				const program = "1 + 2";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises seq of additions: 1 + 2 + 3", () => {
				const program = "1 + 2 + 3";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects plus without operands: +", () => {
				const program = "+";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support postive unary prefix operator: +1", () => {
				const program = "+1";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support positive unary postfix operator: 1+", () => {
				const program = "1+";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support ++ unary prefix operator: ++1", () => {
				const program = "++1";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support ++ unary postfix operator: 1++", () => {
				const program = "1++";
				expect(testRecognizer(program)).toThrow();
			});

			describe("when there is one operand", () => {
				it("rejects: 1 +", () => {
					const program = "1 +";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: + 1", () => {
					const program = "+ 1";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: + 1 +", () => {
					const program = "+ 1 +";
					expect(testRecognizer(program)).toThrow();
				});
			});
		});
	});

	describe("Subtraction -", () => {
		describe("valid programs", () => {
			it("recognises single binary expr: 5 - 6", () => {
				const program = "5 - 6";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises seq of additions: 5 - 6 - 7", () => {
				const program = "5 - 6 - 7";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects minus without operands: -", () => {
				const program = "-";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support postive unary prefix operator: -5", () => {
				const program = "-5";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support positive unary postfix operator: 5-", () => {
				const program = "5-";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support -- unary prefix operator: --5", () => {
				const program = "--5";
				expect(testRecognizer(program)).toThrow();
			});

			it("does not support -- unary postfix operator: 5--", () => {
				const program = "5--";
				expect(testRecognizer(program)).toThrow();
			});

			describe("when there is one operand", () => {
				it("rejects: 5 -", () => {
					const program = "5 -";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: - 5", () => {
					const program = "- 5";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: - 5 -", () => {
					const program = "- 5 -";
					expect(testRecognizer(program)).toThrow();
				});
			});
		});
	});

	describe("Multiplication *", () => {
		describe("valid programs", () => {
			it("recognises single binary expr: 12 * 13", () => {
				const program = "12 * 13";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises seq of multiplications: 12 * 13 * 14", () => {
				const program = "12 * 13 * 14";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects multiplication without operands: *", () => {
				const program = "*";
				expect(testRecognizer(program)).toThrow();
			});

			describe("when there is one operand", () => {
				it("rejects: 12 *", () => {
					const program = "12 *";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: * 12", () => {
					const program = "* 12";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: * 12 *", () => {
					const program = "* 12 *";
					expect(testRecognizer(program)).toThrow();
				});
			});
		});
	});

	describe("Division /", () => {
		describe("valid programs", () => {
			it("recognises single binary expr: 25 / 29", () => {
				const program = "25 / 29";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises seq of divisions: 25 / 29 / 35", () => {
				const program = "25 / 29 / 35";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects division without operands: /", () => {
				const program = "/";
				expect(testRecognizer(program)).toThrow();
			});

			describe("when there is one operand", () => {
				it("rejects: 25 /", () => {
					const program = "25 /";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: / 25", () => {
					const program = "/ 25";
					expect(testRecognizer(program)).toThrow();
				});

				it("rejects: / 25 /", () => {
					const program = "/ 25 /";
					expect(testRecognizer(program)).toThrow();
				});
			});
		});
	});

	describe("Test programs", () => {
		describe("valid programs", () => {
			it("recognises: (1 + 2 * 3)", () => {
				const program = "(1 + 2 * 3)";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises: (1 + (2 * 3))", () => {
				const program = "(1 + (2 * 3))";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises: ((1) + (2 * 3))", () => {
				const program = "((1) + (2 * 3))";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises: (1 / 2) * 385 - 4 + 22", () => {
				const program = "(1 / 2) * 385 - 4 + 22";
				expect(testRecognizer(program)).not.toThrow();
			});

			it("recognises: 1 * 2 + 3 / 4 - 5 + (582 * (220) + (1 / 49) - 53)", () => {
				const program = "1 * 2 + 3 / 4 - 5 + (582 * (220) + (1 / 49) - 53)";
				expect(testRecognizer(program)).not.toThrow();
			});
		});

		describe("invalid programs", () => {
			it("rejects: + 1 2 * 33", () => {
				const program = "+ 1 2 * 33";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects: 13 --- 39", () => {
				const program = "13 --- 39";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects: 5 (( * 17 / --- (", () => {
				const program = "5 (( * 17 / --- (";
				expect(testRecognizer(program)).toThrow();
			});

			it("rejects: 438 * -234", () => {
				const program = "438 * -234";
				expect(testRecognizer(program)).toThrow();
			});
		});
	});
});
