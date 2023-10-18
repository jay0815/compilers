const Grammar = [
	["Program", [["StatementList"]]],
	[
		"StatementList",
		[["StatementListItem"], ["StatementList", "StatementListItem"]],
	],
	["StatementListItem", [["Statement"], ["Declaration"]]],
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
	["Declaration", [["LexicalDeclaration"], ["FunctionDeclaration"]]],
	[
		"Literal",
		[
			["BooleanLiteral"],
			["NullLiteral"],
			["StringLiteral"],
			["NumberLiteral"],
		],
	],
	// [
	// 	"FunctionExpression",
	// 	[["function", "Identifier", "(", "Parameters", ")", "Statement"]],
	// ],
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
			// ["FunctionExpression"],
		],
	],
	[
		"MemberExpression",
		[
			["PrimaryExpression"],
			["MemberExpression", ".", "Identifier"],
			["MemberExpression", "[", "Expression", "]"],
		],
	],
	[
		"Arguments",
		[["AssignmentExpression"], ["Arguments", ",", "AssignmentExpression"]],
	],
	["NewExpression", [["MemberExpression"], ["new", "NewExpression"]]],
	[
		"CallExpression",
		[
			["MemberExpression", "(", ")"],
			["MemberExpression", "(", "Arguments", ")"],
			["new", "MemberExpression", "(", ")"],
			["new", "MemberExpression", "(", "Arguments", ")"],
			["CallExpression", "(", ")"],
			["CallExpression", "(", "Arguments", ")"],
			["CallExpression", "[", "Expression", "]"],
			["CallExpression", ".", "Identifier"],
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
] as [string, string[][]][];

export default Grammar;
