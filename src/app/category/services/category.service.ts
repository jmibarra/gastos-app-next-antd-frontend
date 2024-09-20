import { ICategory } from "../models";

export const getCategories = async (authToken: string) => {
    const url = "http://localhost:8080/category";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.categories);
    else return [];
    
}

export const createCategory = async (category: ICategory, authToken: string) => {
    const url = "http://localhost:8080/category";

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(category),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    //Obtengo la respuesta del response y devuelvo el data
    return response.json().then((data) => data);
}

export const updateCategoryById = async (id: string, category: ICategory, authToken: string) => {
    const url = `http://localhost:8080/category/${id}`;

    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(category),
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })

    return response.json().then((data) => data);
}

export const deleteCategoryById = async (id: string, authToken: string) => {
    const url = `http://localhost:8080/category/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
        },
    })
}