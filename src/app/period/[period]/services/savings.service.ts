import { ISaving } from "../models";

export const getSavingsByPeriod = async (period: string, authToken: string): Promise<ISaving[]> => {
    const url = "http://localhost:8080/savings/";
    const urlWithPeriod = url + period;

    const response = await fetch(urlWithPeriod, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.savings);
    else return [];
}

export const createSaving = async (saving: ISaving, authToken: string) => {
    const url = "http://localhost:8080/savings";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(saving),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    //Obtengo la respuesta del response y devuelvo el data
    return response.json().then((data) => data);
}

export const updateSavingById = async (id: string, saving: ISaving, authToken: string) => {
    const url = `http://localhost:8080/savings/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(saving),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    return response.json().then((data) => data);
}

export const deleteSavingById = async (id: string, authToken: string) => {
    const url = `http://localhost:8080/savings/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });
}

export const getAllSavings = async (authToken: string) => {
    const url = "http://localhost:8080/savings/all";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.savings);
    else return [];
}
