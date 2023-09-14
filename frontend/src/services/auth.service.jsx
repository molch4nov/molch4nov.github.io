import axios from "axios";

axios.defaults.withCredentials = true;

export async function updateUser(
    initials, organization, phone, email, newEmail, password, newPassword
)  {
    return await axios.post(
        'http://84.201.163.76:8000/api/update',
        {
            username: initials,
            organization: organization,
            phone: phone,
            email: email,
            newEmail: newEmail,
            password: password,
            newPassword: newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${document.cookie.split('token=')[1]}`
            }
        }
    )
}

export async function getUser() {
    return await axios.get(
        'http://84.201.163.76:8000/api/getuser',
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
}
export async function registerUser(fullName, company, phone, email, password) {
    return await axios.post(
        'http://84.201.163.76:8000/api/register',
        {
            "fullName": fullName,
            "company": company,
            "phone": phone,
            "email": email,
            "password": password
        },
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    )
}

export async function loginUser(email, password) {
    return await axios.post(
        'http://84.201.163.76:8000/api/login',
        {
            username: email,
            password: password
        },
        {
            headers: {
                'content-type': 'application/json'
            },
        },

    )
}

export async function getDataMap() {
    return await axios.get(
        'http://84.201.163.76:8000/api/files',
        {
            headers: {
                Authorization: `Bearer ${document.cookie.split('token=')[1]}`
            }
        }
    )
}


export async function logoutUser() {
    localStorage.removeItem('token')
    return await axios.post(
        'http://84.201.163.76:8000/api/logout'

    )

}

export function setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
}

export function getToken() {
    return localStorage.getItem('token').replace(`"`, '').replace(`"`, '')
}

export function checkToken() {
    return !!localStorage?.getItem('token')
}
