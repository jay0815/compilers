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
			["ObjectLiteral"],
		],
	],
	// todo 补充 Object key 使用 [] 的语法
	[
		"Property",
		[
			["StringLiteral", ":", "Expression"],
			["Identifier", ":", "Expression"],
		],
	],
	["PropertyList", [["Property"], ["PropertyList", ",", "Property"]]],
	[
		"ObjectLiteral",
		[
			["{", "}"],
			["{", "PropertyList", "}"],
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
			["MemberExpression", "(", "Arguments", ")"],
			["new", "MemberExpression", "(", ")"],
			["MemberExpression", ".", "Identifier"],
			["MemberExpression", "[", "Expression", "]"],
		],
	],
	[
		"Arguments",
		[["AssignmentExpression"], ["Arguments", ",", "AssignmentExpression"]],
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
			["BlockStatement"],
			["BreakStatement"],
			["ContinueStatement"],
		],
	],
	["ExpressionStatement", [["Expression", ";"]]],
	["Parameters", [["Identifier"], ["Parameters", ",", "Identifier"]]],
	[
		"FunctionDeclaration",
		[
			["function", "Identifier", "(", "Parameters", ")", "StatementList"],
			["function", "Identifier", "(",")", "StatementList"],
			[
				"function",
				"StringLiteral",
				"(",
				"Parameters",
				")",
				"StatementList",
			],
			[
				"function",
				"StringLiteral",
				"(",
				")",
				"StatementList",
			],
		],
	],
	[
		"LexicalDeclaration",
		[
			["let", "Identifier", "=", "Expression", ";"],
			["const", "Identifier", "=", "Expression", ";"],
			['var', "Identifier", "=", "Expression", ";"],
		]
	],
	[
		"Declaration",
		[
			["LexicalDeclaration"],
			["FunctionDeclaration"],
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
	["BreakStatement", [["break", ";"], ["break"]]],
	["ContinueStatement", [["continue", ";"], ["continue"]]],
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
	[
		"ConditionalExpression",
		[
			["LogicalORExpression"],
			[
				"LogicalORExpression",
				"?",
				"AssignmentExpression",
				":",
				"AssignmentExpression",
			],
		],
	],
	[
		"LogicalORExpression",
		[
			["LogicalANDExpression"],
			["LogicalORExpression", "||", "LogicalANDExpression"],
		],
	],
	[
		"LogicalANDExpression",
		[
			["BitwiseORExpression"],
			["LogicalANDExpression", "&&", "BitwiseORExpression"],
		],
	],
	[
		"BitwiseORExpression",
		[
			["BitwiseXORExpression"],
			["BitwiseORExpression", "|", "BitwiseXORExpression"],
		],
	],
	[
		"BitwiseXORExpression",
		[
			["BitwiseANDExpression"],
			["BitwiseXORExpression", "^", "BitwiseANDExpression"],
		],
	],
	[
		"BitwiseANDExpression",
		[
			["EqualityExpression"],
			["BitwiseANDExpression", "&", "EqualityExpression"],
		],
	],
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
			["ShiftExpression"],
			["RelationalExpression", "<", "ShiftExpression"],
			["RelationalExpression", "<=", "ShiftExpression"],
			["RelationalExpression", ">", "ShiftExpression"],
			["RelationalExpression", ">=", "ShiftExpression"],
		],
	],
	[
		"ShiftExpression",
		[
			["AdditiveExpression"],
			["ShiftExpression", "<<", "AdditiveExpression"],
			["ShiftExpression", ">>", "AdditiveExpression"],
			["ShiftExpression", ">>>", "AdditiveExpression"],
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
