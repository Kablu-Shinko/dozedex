interface MenuOption {
    Title: string,
    Function: Function
}

interface CardOption{
    Title: string,
    Description: string,
    Function: Function
}

interface DialogData {
    Title: string;
    Description: string;
    Inputs: DialogFormInput[];
    FunctionDescription: string;
    Function: Function;
}

interface DialogFormInput{
    Label: string,
    Input: string,
    Type: string
}

export {
    MenuOption,
    CardOption,
    DialogData,
    DialogFormInput
}