interface MenuOption {
    Title: string,
    Function: Function
}

interface Card{
    Title: string,
    Options: CardOption[]
}

interface CardOption{
    Title: string,
    Hover?: string,
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
    Card,
    CardOption,
    DialogData,
    DialogFormInput
}