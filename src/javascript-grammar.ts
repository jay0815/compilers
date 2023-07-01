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
		"FunctionExpression",
		[["function", "Identifier", "(", "Parameters", ")", "Statement"]],
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
		[
			["Identifier"],
			["Literal"],
			["ObjectLiteral"],
			["FunctionExpression"],
		],
	],
	[
		"MemberExpression",
		[
			["PrimaryExpression"],
			["new", "MemberExpression", "(", ")"],
			["new", "MemberExpression", "(", "Arguments", ")"],
			["MemberExpression", "(", ")"],
			["MemberExpression", "(", "Arguments", ")"],
			["MemberExpression", ".", "Identifier"],
			["MemberExpression", "[", "Expression", "]"],
		],
	],
	[
		"Arguments",
		[["AssignmentExpression"], ["Arguments", ",", "AssignmentExpression"]],
	],
	["NewExpression", [["MemberExpression"], ["new", "NewExpression"]]],
	// [
	// 	"CoverCallExpressionAndAsyncArrowHead",
	// 	[
	// 		["MemberExpression", "(", "Arguments", ")"],
	// 		["MemberExpression", "(", ")"],
	// 	],
	// ],
	[
		"CallExpression",
		[
			["MemberExpression"],
			// ["CallExpression", "(", "Arguments", ")"],
			// ["CallExpression", "[", "Expression", "]"],
			// ["CallExpression", ".", "Identifier"],
		],
	],
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
	["LeftHandSideExpression", [["NewExpression"], ["CallExpression"]]],
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
			["function", "Identifier", "(", "Parameters", ")", "Statement"],
			["function", "Identifier", "(", ")", "Statement"],
			["function", "StringLiteral", "(", "Parameters", ")", "Statement"],
			["function", "StringLiteral", "(", ")", "Statement"],
		],
	],
	[
		"LexicalDeclaration",
		[
			["let", "Identifier", "=", "Expression", ";"],
			["const", "Identifier", "=", "Expression", ";"],
			["var", "Identifier", "=", "Expression", ";"],
		],
	],
	["Declaration", [["LexicalDeclaration"], ["FunctionDeclaration"]]],
	[
		"IfStatement",
		[
			["if", "(", "Expression", ")", "Statement"],
			["if", "(", "Expression", ")", "Statement", "else", "Statement"],
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
				"Statement",
			],
		],
	],
	["BreakStatement", [["break", ";"], ["break"]]],
	["ContinueStatement", [["continue", ";"], ["continue"]]],
	["WhileStatement", [["while", "(", "Expression", ")", "Statement"]]],
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
