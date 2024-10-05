"use client";
import { IInvestment } from "../models";

/**
 * Gets all investments from the database.
 * @param authToken the authorization token for the request
 * @returns a promise that resolves to an array of IInvestment objects
 */
export const getInvestments = async (authToken: string): Promise<IInvestment[]> => {
    const url = "http://localhost:8080/investments";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.investments);
    else return [];
};

/**
 * Creates a new investment in the database.
 * @param investment the object with the investment data to be created
 * @param authToken the authorization token for the request
 * @returns a promise that resolves to the newly created investment
 */
export const createInvestment = async (investment: IInvestment, authToken: string) => {
    const url = "http://localhost:8080/investments";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(investment),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    //Obtengo la respuesta del response y devuelvo el data
    return response.json().then((data) => data);
}

/**
 * Updates an investment in the database with the given id.
 * @param id the id of the investment to be updated
 * @param investment the object with the investment data to be updated
 * @param authToken the authorization token for the request
 * @returns a promise that resolves to the updated investment
 */
export const updateInvestmentById = async (id: string, investment: IInvestment, authToken: string) => {
    const url = `http://localhost:8080/investments/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(investment),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    return response.json().then((data) => data);
}

/**
 * Deletes an investment from the database with the given id.
 * @param id the id of the investment to be deleted
 * @param authToken the authorization token for the request
 */
export const deleteInvestmentById = async (id: string, authToken: string) => {
    const url = `http://localhost:8080/investments/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });
}