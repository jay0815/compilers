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


## Atom

## Expression

## Statement

if|switch
for|while
Declaration
ExpressionStatement ::= Expression ";"

## Block

### ASI

auto semi insertion

1. \n\r
2. }
3. EOF

当前 symbol 不被当前状态接受，当symbol 前有回车 或者 symbol 后有特定 symbol, 此时可以插入 ;