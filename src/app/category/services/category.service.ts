const userData = JSON.parse(localStorage.getItem("user") as string);

export const getCategories = async () => {
    const url = "http://localhost:8080/category";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `${userData?.token}`,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.categories);
    else return [];
    
}