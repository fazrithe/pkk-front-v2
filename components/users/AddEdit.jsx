import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService} from 'services';
import { allService } from 'services/all.service';
import { useState, useEffect } from 'react';
import Select from "react-select";
import { useRef } from 'react';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        Name: Yup.string()
            .required('Name is required'),
        Email: Yup.string()
            .required('Email is required'),
        Role: Yup.string(),
        Photo:  Yup.string(),
        Password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : null)
            .min(6, 'Password must be at least 6 characters'),
        passwordConfirm: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Confirm Password is required') : null)
            .min(6, 'Confirm Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(user.ID, data);
    }

    function createUser(data) {
        return userService.create(data)
            .then((response) => {
                if(response.status != false ){
                    alertService.success('User added', { keepAfterRouteChange: true });
                    router.push('.');
                }else{
                    alertService.error(response.message, { keepAfterRouteChange: true });
                    router.push('/users/add');
                }
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        console.log(id);
        return userService.update(id, data, 'users')
            .then((response) => {
                if(response.status != false ){
                    alertService.success('User updated', { keepAfterRouteChange: true });
                    router.push('/users');
                }else{
                    alertService.error(response.message, { keepAfterRouteChange: true });
                    router.push(`/users/ss/${response.id}`);
                }
            })
            .catch(alertService.error);
    }

    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
                <div className="form-group col">
                    <label>Name</label>
                    <input name="name" type="text" {...register('Name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Email</label>
                    <input name="email" type="text" {...register('Email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Role</label>
                    <select className='form-control' {...register('Role')}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>
                        Password
                        {!isAddMode && <em className="ml-1">(Leave blank to keep the same password)</em>}
                    </label>
                    <input name="password" type="password" {...register('Password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group col">
                    <label>
                        Confirm Password
                        {!isAddMode && <em className="ml-1">(Leave blank to keep the same password)</em>}
                    </label>
                    <input name="asswordConfirm" type="password" {...register('passwordConfirm')} className={`form-control ${errors.confPassword ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.PasswordConfirm?.message}</div>
                </div>
            </div>
            <div className="form-group">
                {/* <input type="file" name="photo" className="form-control photo" {...register('photo')} /> */}
                <input type="text" name="photo" className="form-control" {...register('Photo')} />
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}