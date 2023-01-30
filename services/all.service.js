import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const allSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const allService = {
    user: allSubject.asObservable(),
    get userValue () { return allSubject.value },
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(params,getUrl) {
    return fetchWrapper.post(`${baseUrl}/${getUrl}`, params);
}

function getAll(getUrl) {
    return fetchWrapper.get(`${baseUrl}/${getUrl}`);
}

function getById(id,getUrl) {
    return fetchWrapper.get(`${baseUrl}/${getUrl}/${id}`);
}

function update(id, params, getUrl) {
    return fetchWrapper.put(`${baseUrl}/${getUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (id === allSubject.value.id) {
                // update local storage
                const user = { ...allSubject.value, ...params };
                // publish updated user to subscribers
                allSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id,getUrl) {
    return fetchWrapper.delete(`${baseUrl}/${getUrl}/${id}`);
}
