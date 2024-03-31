import { IExpense } from "../models/expense.model";

const userData = JSON.parse(localStorage.getItem("user") as string);

export const getExpensesByPeriod = async (period: string): Promise<IExpense[]> => {
    const url = "http://localhost:8080/expenses/all/";
    const urlWithPeriod = url + period;

    const response = await fetch(urlWithPeriod, {
        method: "GET",
        headers: {
            Authorization: `${userData?.token}`,
            "Content-Type": "application/json",
        },
    });

    if (response.ok) return response.json().then((data) => data.expenses);
    else return [];
};

export const deleteExpenseById = async (id: string) => {
    const url = `http://localhost:8080/expenses/${id}`;


    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `${userData?.token}`,
            "Content-Type": "application/json",
        },
    });
}
/*

import axios from "axios";
import { DataProvider, HttpError, useGetIdentity } from "@refinedev/core";
import { stringify } from "query-string";

// Error handling with axios interceptors
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  },
);

const userData = JSON.parse(localStorage.getItem("user") as string);

export const expensesDataProvider = (apiUrl: string): DataProvider => ({
    
  
    getList: async ({ resource }) => {
        const url = `${apiUrl}/${resource}/all/122023`;
    
        const { data } = await axiosInstance.get(url,
            {
                headers: {
                    Authorization: `${userData?.token}`
                }
            }
        );
    
        const total = data.count;

        const dataResponse = data.expenses;
        return {
            data: dataResponse,
            total,
        };
      },
    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/${resource}`;
    
        const { data } = await axiosInstance.post(url, variables,{
            headers: {
                Authorization: `${userData.token}`
            }
        });
    
        return {
          data,
        };
      },
    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;
    
        const { data } = await axiosInstance.patch(url, variables, {
            headers: {
                Authorization: `${userData.token}`
            }
        });
    
        return {
          data,
        };
      },
      deleteOne: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;
    
        const { data } = await axiosInstance.delete(url, {
            headers: {
                Authorization: `${userData.token}`
            },
            data: variables,
        });
    
        return {
          data,
        };
      },

      getOne: async ({ resource, id }) => {
        const url = `${apiUrl}/${resource}/${id}`;
    
        const { data } = await axiosInstance.get(url, {
            headers: {
                Authorization: `${userData.token}`
            }
            });
    
        return {
          data,
        };
      },

      getApiUrl: () => {
        return apiUrl;
        },

});

*/