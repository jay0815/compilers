class Completion {
    type: string;
    value: any;

    constructor(type = "normal", value?: any) {
      this.type = type;
      this.value = value;
    }
}

export default Completion;