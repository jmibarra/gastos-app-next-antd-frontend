import { IStatus } from "../models";

export const getStatus = async (authToken: string) => {
    const url = "http://localhost:8080/status";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    }); 

    if (response.ok) return response.json().then((data) => data.statuses);
    else return [];
}

export const createStatus = async (status: IStatus, authToken: string) => {
    const url = "http://localhost:8080/status";
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(status),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    return response.json().then((data) => data);
}

export const updateStatusById = async (id: string, status: IStatus, authToken: string) => {
    const url = `http://localhost:8080/status/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(status),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    return response.json().then((data) => data);
}

export const deleteStatusById = async (id: string, authToken: string) => {
    const url = `http://localhost:8080/status/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })
}