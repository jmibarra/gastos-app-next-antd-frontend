import { IIncome } from "../models/income.model";

export const getIncomesByPeriod = async (period: string, authToken: string): Promise<IIncome[]> => {
    const url = "http://localhost:8080/incomes/all/";
    const urlWithPeriod = url + period;

    const response = await fetch(urlWithPeriod, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.incomes);
    else return [];
};

export const createIncome = async (income: IIncome, authToken: string) => {
    const url = "http://localhost:8080/incomes";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(income),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    //Obtengo la respuesta del response y devuelvo el data
    return response.json().then((data) => data);
}

export const deleteIncomeById = async (id: string, authToken: string) => {
    const url = `http://localhost:8080/incomes/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });
}

export const updateIncomeById = async (id: string, income: IIncome, authToken: string) => {
    const url = `http://localhost:8080/incomes/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(income),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    return response.json().then((data) => data);
}