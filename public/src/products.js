export let container = document.querySelector('.cards-container');
export const API = 'http://localhost:3000/api/v1/products';

export function fetchData(url){
    return fetch(url);
}