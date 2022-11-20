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

interface Attachment{
    Key?: number,
    Title?: string,
    SubAttachment?: Array<SubAttachment>,
    Status?: boolean 
}

interface SubAttachment{
    Key?:number,
    Name: string,
    Description: string,
    Status?: boolean
}

interface MultiSelect{
    Title: string,
    List: MultiSelectOption[]
}

interface MultiSelectOption{
    Title: string,
    Key: number
}

interface AppVersion {
    ActualVersion: string,
    ServerVersion: string,
    IsUpdated: boolean
}

export {
    MultiSelect,
    MultiSelectOption,
    Attachment,
    SubAttachment,
    MenuOption,
    Card,
    CardOption,
    DialogData,
    DialogFormInput,
    AppVersion
}