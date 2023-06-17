/**
 * [[Type]] [[Value]] [[Target]]
 * Table 8: Completion Record 
 * Fields                     Value                         Meaning
 * type      normal\break\continue\return\throw   type of completion that occurred.
 * value any ECMAScript language value or empty   value that was produced.
 * target   any ECMAScript string or empty        target label for directed control transfers.
 */
type CompletionType = "normal" | "break" | "continue" | "return" | "throw";
type ESLangValue = string | number | boolean | null | undefined | object | symbol | Map<string, any> | Set<string>;
class Completion {
	type: CompletionType;
	value: ESLangValue;
	target: string | undefined;

	constructor(
		type: CompletionType = "normal",
		value?: ESLangValue,
		target?: string
	) {
		this.type = type;
		this.value = value;
	}
}

export default Completion;