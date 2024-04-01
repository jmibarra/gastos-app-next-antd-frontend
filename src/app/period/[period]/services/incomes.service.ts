import { IIncome } from "../models/income.model";

const userData = JSON.parse(localStorage.getItem("user") as string);

export const getIncomesByPeriod = async (period: string): Promise<IIncome[]> => {
    const url = "http://localhost:8080/incomes/all/";
    const urlWithPeriod = url + period;

    const response = await fetch(urlWithPeriod, {
        method: "GET",
        headers: {
            Authorization: `${userData?.token}`,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.incomes);
    else return [];
};

export const createIncome = async (income: IIncome) => {
    const url = "http://localhost:8080/incomes";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(income),
        headers: {
            Authorization: `${userData?.token}`,
            "Content-Type": "application/json",
        },
    })

    //Obtengo la respuesta del response y devuelvo el data
    return response.json().then((data) => data);
}