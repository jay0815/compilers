# LR

## BNF

Expression               ::=  AdditiveExpression

AdditiveExpression       ::=  MultiplicativeExpression | 
                              AdditiveExpression "+" MultiplicativeExpression |
                              AdditiveExpression "-" MultiplicativeExpression

MultiplicativeExpression ::=  PrimaryExpression |
                              MultiplicativeExpression "*" PrimaryExpression |
                              MultiplicativeExpression "/" PrimaryExpression

PrimaryExpression        ::=  Number |
                                "(" Expression ")"

Number                   ::=  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

## terminal symbol 终结符

Number
"("
")"
"+"
"-"
"*"
"/"

## non-terminal symbol 非终结符

Expression
PrimaryExpression
AdditiveExpression
MultiplicativeExpression

## 求 closure 过程