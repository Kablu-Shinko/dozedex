// const API_URL: string = "https://dozedex-api.herokuapp.com";
const API_URL: string = "https://dozedex-api.onrender.com";
const LOCAL_URL: string = "http://localhost:3333";
const IMG_FROM_GOOGLEDRIVE_BASE_URL: string = "https://drive.google.com/uc?export=view&id="

//altere aqui para dinamicamente pegar url local ou hospedada
const isLocal = false;

function useLocal(use: Boolean): string{
    if(!use){
        return API_URL;
    }
    else{
        return LOCAL_URL;
    }
}

export const environment = {
    API_URL: useLocal(isLocal),
    GOOGLEDRIVE_URL: IMG_FROM_GOOGLEDRIVE_BASE_URL
}