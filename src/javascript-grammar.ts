import type { ClosureState } from "./closure";
export const initState = {
	Literal: {
		EOF: {
			$finish: true,
		},
	},
} as unknown as ClosureState;

const Grammar = [
	[
		"Literal",
		[
			["BooleanLiteral"],
			["NullLiteral"],
			["StringLiteral"],
			["NumberLiteral"],
		],
	],
	[
		"PrimaryExpression",
		[["(", "Expression", ")"], ["Identifier"], ["Literal"]],
	],
	[
		"MemberExpression",
		[
			["PrimaryExpression"],
			// ["new", "MemberExpression"],
			["MemberExpression", "(", ")"],
			["new", "MemberExpression", "(", ")"],
			["MemberExpression", ".", "Identifier"],
			["MemberExpression", "[", "Expression", "]"],
		],
	],
	["NewExpression", [["new", "NewExpression"], ["MemberExpression"]]],
	[
		"MultiplicativeExpression",
		[
			["UnaryExpression"],
			["MultiplicativeExpression", "*", "UnaryExpression"],
			["MultiplicativeExpression", "/", "UnaryExpression"],
			["MultiplicativeExpression", "%", "UnaryExpression"],
		],
	],
	[
		"AdditiveExpression",
		[
			["MultiplicativeExpression"],
			["AdditiveExpression", "+", "MultiplicativeExpression"],
			["AdditiveExpression", "-", "MultiplicativeExpression"],
		],
	],
	["LeftHandSideExpression", [["NewExpression"]]],
	[
		"AssignmentExpression",
		[
			["ConditionalExpression"],
			["LeftHandSideExpression", "=", "AssignmentExpression"],
			["LeftHandSideExpression", "+=", "AssignmentExpression"],
			["LeftHandSideExpression", "-=", "AssignmentExpression"],
			["LeftHandSideExpression", "*=", "AssignmentExpression"],
			["LeftHandSideExpression", "/=", "AssignmentExpression"],
		],
	],
	[
		"Expression",
		[["AssignmentExpression"], ["Expression", ",", "AssignmentExpression"]],
	],
	[
		"Statement",
		[
			["ExpressionStatement"],
			["IfStatement"],
			["ForStatement"],
			["WhileStatement"],
			["Declaration"],
			["BlockStatement"],
			["BreakStatement"],
		],
	],
	["ExpressionStatement", [["Expression", ";"]]],
	[
		"Declaration",
		[
			["var", "Identifier", "=", "Expression", ";"],
			["let", "Identifier", "=", "Expression", ";"],
			["const", "Identifier", "=", "Expression", ";"],
		],
	],
	[
		"IfStatement",
		[
			["if", "(", "Expression", ")", "StatementList"],
			[
				"if",
				"(",
				"Expression",
				")",
				"StatementList",
				"else",
				"StatementList",
			],
		],
	],
	[
		"ForStatement",
		[
			[
				"for",
				"(",
				"Expression",
				";",
				"Expression",
				";",
				"Expression",
				")",
				"StatementList",
			],
		],
	],
	["BreakStatement", [["break"], ["break", ";"]]],
	["WhileStatement", [["while", "(", "Expression", ")", "StatementList"]]],
	["UnaryExpression", [["UpdateExpression"]]],
	[
		"UpdateExpression",
		[
			["LeftHandSideExpression"],
			["LeftHandSideExpression", "++"],
			["LeftHandSideExpression", "--"],
			["--", "UnaryExpression"],
			["++", "UnaryExpression"],
		],
	],
	["ConditionalExpression", [["EqualityExpression"]]],
	[
		"EqualityExpression",
		[
			["RelationalExpression"],
			["EqualityExpression", "==", "RelationalExpression"],
			["EqualityExpression", "!=", "RelationalExpression"],
			["EqualityExpression", "===", "RelationalExpression"],
			["EqualityExpression", "!==", "RelationalExpression"],
		],
	],
	[
		"RelationalExpression",
		[
			["AdditiveExpression"],
			["RelationalExpression", "<", "AdditiveExpression"],
			["RelationalExpression", "<=", "AdditiveExpression"],
			["RelationalExpression", ">", "AdditiveExpression"],
			["RelationalExpression", ">=", "AdditiveExpression"],
		],
	],
	[
		"BlockStatement",
		[
			["{", "}"],
			["{", "StatementList", "}"],
		],
	],
	[
		"StatementList",
		[["StatementListItem"], ["StatementList", "StatementListItem"]],
	],
	["StatementListItem", [["Statement"], ["Declaration"]]],
	["Program", [["StatementList"]]],
] as [string, string[][]][];

export default Grammar;
