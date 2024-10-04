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