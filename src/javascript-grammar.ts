import type { ClosureState } from "./closure";
export const initState = {
  'Literal': {
      EOF: {
        $finish: true
      }
    }
} as unknown as ClosureState;


const Grammar = [
	[
		"Literal",
		[
			["BooleanLiteral"],
			["NullLiteral"],
			["StringLiteral"],
			["NumericLiteral"],
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
			["new", "MemberExpression", "(", ")"],
			["MemberExpression", ".", "Identifier"],
			["MemberExpression", "[", "Identifier", "]"],
			["MemberExpression", "(", ")"],
		],
	],
	[
		"MultiplicativeExpression",
		[
			["LeftHandSideExpression"],
			["MultiplicativeExpression", "*", "LeftHandSideExpression"],
			["MultiplicativeExpression", "/", "LeftHandSideExpression"],
			["MultiplicativeExpression", "%", "LeftHandSideExpression"],
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
	["LeftHandSideExpression", [["MemberExpression"]]],
	[
		"AssignmentExpression",
		[
			["AdditiveExpression"],
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
			["Declaration"],
			["BlockStatement"],
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
] as [string, string[][]][];


export default Grammar