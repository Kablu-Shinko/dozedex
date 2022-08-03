const API_URL: string = "https://dozedex-api.herokuapp.com";
const LOCAL_URL: string = "localhost:3333";

//altere aqui para dinamicamente pegar url local ou hospedada
const isLocal = true;

function useLocal(use: Boolean): string{
    if(!use){
        return API_URL;
    }
    else{
        return LOCAL_URL;
    }
}

export const environment = {
    API_URL: useLocal(isLocal)
};