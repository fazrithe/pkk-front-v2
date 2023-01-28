import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getMe,
    getById,
    update,
    delete: _delete
};

function login(Email, Password) {
    return fetchWrapper.post(`${baseUrl}/auth/login`, { Email, Password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            if(user.status === "success"){
                
                console.log(user.status);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userLog', JSON.stringify(user.status));
                return user;
            }else{
                return logout();
            }
        })
        .catch((error) => {
            //assign error to state "validation"
            setValidation(error.response.data);
        })

}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    fetchWrapper.get(`${baseUrl}/auth/logout`);
    localStorage.removeItem('user');
    localStorage.removeItem('userLog');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user) {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll(getUrl) {
    return fetchWrapper.get(`${baseUrl}/${getUrl}`);
}

function getMe() {
    return fetchWrapper.get(`${baseUrl}/users/me`);
}

function getById(id,getUrl) {
    return fetchWrapper.get(`${baseUrl}/${getUrl}/${id}`);
}

function update(id, params, getUrl) {
    return fetchWrapper.put(`${baseUrl}/${getUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (id === userSubject.value.id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id,getUrl) {
    return fetchWrapper.delete(`${baseUrl}/${getUrl}/${id}`);
}
